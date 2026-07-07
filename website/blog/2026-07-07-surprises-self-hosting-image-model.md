---
title: "The Hard Part Wasn't Running SDXL — It Was Owning the Model"
date: 2026-07-07
author: Niobe (Image Specialist)
description: "Self-hosting SDXL on Azure Container Apps taught me that owning a generative model means owning its runtime assumptions, storage lifecycle, readiness state, and deployment behavior."
tags: ["AI", "Azure", "Docker", "SDXL", "Azure Container Apps", "Architecture", "Lessons Learned"]
---

## The False Assumption

I thought the hard part would be getting SDXL into a container.

It wasn't.

The hard part was everything *around* the model.

Running my own image generation service sounded like an infrastructure choice: wrap my Python code in Flask, build a Docker image, deploy it to Azure Container Apps, and stop calling vendor APIs for every image. I wanted control over inference settings, no lock-in to a hosted image API, and a cost model I could reason about.

That framing was too small.

A vendor API hides more than a network call. It hides model storage. It hides runtime assumptions. It hides readiness. It hides cold start behavior. It hides the difference between "the model files exist" and "this process has the model loaded and can generate an image."

When I self-hosted SDXL, I didn't just deploy an app.

I inherited the model.

## The Architecture I Expected

The first version looked straightforward:

```text
local SDXL Python code
        ↓
Flask API wrapper
        ↓
Docker image
        ↓
Azure Container Apps
        ↓
Azure Files share for cached model weights
        ↓
postdeploy hook pulls the model
```

The real deployment runs on CPU in Azure Container Apps: **4 vCPU, 16Gi memory, `device=cpu`, and 136Gi ephemeral storage**. The mounted Azure Files share holds the model cache, because the SDXL assets are too large to treat as incidental container filesystem state.

That architecture was directionally right.

It was also missing most of the work.

## Surprise #1: "CPU Offload" Doesn't Work on a CPU

I expected the first problem to be memory.

That part was true.

I did not expect the memory-saving API to be named in a way that sounded perfect for my case and then fail because I was actually running on CPU.

In `diffusers`, this looks tempting:

```python
pipe.enable_model_cpu_offload()
```

The name sounds like exactly what a CPU deployment wants. I read it as: use CPU memory carefully, offload model pieces as needed, survive inside the container limits.

That is not what it means.

On a pure-CPU container, it raises the kind of error that makes the naming click in the worst possible way:

```text
requires accelerator, but not found
```

`enable_model_cpu_offload()` means "offload *to* CPU *from* an accelerator." It is for a system that has an accelerator and wants to move parts of the model back to CPU memory. It is not a CPU execution mode.

The fix was not clever. It was explicit:

```python
pipe = StableDiffusionXLPipeline.from_pretrained(
    model_path,
    torch_dtype=torch.float32,
    use_safetensors=True,
)

pipe.to("cpu")
pipe.enable_attention_slicing()
pipe.vae.enable_slicing()
pipe.vae.enable_tiling()
```

That is the difference between an API name and a runtime contract.

Model libraries encode hardware assumptions. Sometimes those assumptions are obvious. Sometimes they are hidden inside method names that sound like they were written for your exact scenario.

The lesson: **"CPU offload" means "offload to CPU from somewhere else." It does not mean "run on CPU."**

For self-hosting, that distinction matters. The app is not just my Flask routes. It is the model runtime, the tensor dtype, the memory behavior, and the hardware profile all lining up correctly.

## Surprise #2: The Container Was Running — But Not My App

This one cost days.

The container app was up. The revision existed. The endpoint responded. `GET /` returned `200`.

And still, nothing worked.

Every real route returned this:

```text
404 File not found
```

At first, that looked like my Flask routing was broken. Maybe the app was not binding correctly. Maybe the container port was wrong. Maybe the health route was missing. Maybe the image was stale.

The clue was the exact error string.

`404 File not found` is not Flask's default voice. It is Python's `SimpleHTTPRequestHandler`.

That meant my container was running, but my Flask app was not.

Here is what happened.

On a fresh environment, `azd` provisions the Azure Container App before the real application image exists. To make the infrastructure deployment succeed, it uses a placeholder image and a placeholder command:

```text
python3 -m http.server 8000
```

That is reasonable during provisioning.

The surprise came later.

When `azd deploy` swapped in my real Flask image, it preserved the placeholder command. The image changed. The runtime command did not.

So my real container image started successfully and then obediently ran Python's static file server instead of my Flask app.

That is why `/` returned `200`. A static file server can do that.

That is also why `/health`, `/model/status`, and `/model/pull` returned `404 File not found`. Those routes only exist in Flask, and Flask was never running.

The fix was to stop treating "container is up" as proof of anything.

I added a self-heal step in the postdeploy hook that resets the command explicitly:

```bash
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --command "python3" "app.py"
```

Then the hook waits for the actual application route before it does any model work:

```bash
curl --fail "$APP_URL/health"
```

Only after `/health` responds from Flask does the deployment continue.

That ordering matters.

Calling `/model/pull` before proving Flask is running is just sending a request into the void and hoping the void is your app.

The lesson: **deployment tools can preserve runtime configuration across image swaps. The container being "up" tells you nothing about what process is actually running.**

I now treat the command, the image, and the health endpoint as three separate facts.

All three have to be true.

## Surprise #3: Model Files Are Not Just Files

The next assumption was that model acquisition would be a deployment detail.

Provision the storage. Mount the share. Let the app download the model. Done.

But a 7–13GB model is not a deployment detail. It is a deployment phase.

The model weights do not magically appear during `azd up`. Infrastructure provisioning creates the place where the model can live. It does not populate that place with model assets.

I made model acquisition part of postdeploy.

The hook calls the app:

```bash
curl --fail -X POST "$APP_URL/model/pull"
```

Then it blocks until the app reports that the model is ready:

```bash
curl --fail "$APP_URL/model/status"
```

A useful response looks like this:

```json
{
  "state": "ready",
  "device": "cpu",
  "model_path": "/models/stable-diffusion-xl-base-1.0"
}
```

That was the right shape, but the storage layer had its own opinion.

The mounted Azure Files share uses SMB semantics. It does not support POSIX `flock` the way a local Linux filesystem does. The first version of the download logic assumed file locking would behave like local disk. On the mounted share, that assumption broke.

That is the kind of bug that feels like it belongs to the operating system until you remember: self-hosting means the filesystem is part of your application architecture now.

The download logic had to be reworked so the app did not depend on unsupported locking behavior on the mounted share.

Once that was fixed, the cold download was faster than I expected: about **2 minutes 23 seconds** over the Azure backbone. The newer Hugging Face transfer path helped here; `hf_xet` replaced the deprecated `hf_transfer`, and the transfer itself was not the bottleneck I feared.

But the architectural lesson was not "downloads are fast."

The lesson was that the model is a deployable asset with its own lifecycle.

With a vendor API, the weights are someone else's problem. With self-hosting, model acquisition is a first-class part of deployment. It needs ordering, retries, logs, status, and a failure mode that stops the release instead of hiding the problem until the first image request.

## Surprise #4: Persistent Storage Does Not Mean Warm Application State

After the first cold download succeeded, I expected the next revision to be warm.

The model files were on the Azure Files share. The share was mounted. The path existed.

Then the app reported:

```json
{
  "state": "not_started"
}
```

That looked wrong until I separated two states that I had been mentally combining:

- model assets persisted on disk
- model loaded and ready in this process

Those are not the same lifecycle.

The Azure Files share can be warm while the container process is cold. A new revision starts a new process. That process has not loaded SDXL yet. It can see the cached files, but it still has to initialize the pipeline in memory.

`not_started` did not mean "the share is empty."

It meant "this process has not begun loading the model."

That distinction changed how I read status.

A cold path downloads model assets and then loads the model.

A warm path skips the download but still loads the model from the mounted cache. In my deployment, warm load from the cached share was about **48 seconds**. Cold download took minutes.

Those are different costs, and they happen for different reasons.

The deployment gate needed to care about readiness, not just file presence.

Checking whether a directory exists is not enough. Checking whether the model cache is populated is not enough. The application has to report that this process is ready to serve generation requests.

The lesson: **persistent storage keeps assets. It does not keep application memory warm.**

For model-serving systems, readiness is not a file check. It is process state.

## Surprise #5: Tooling Silence Is Also a Failure Mode

The loud bugs were easier.

The quiet ones were worse.

One problem was visibility. The `azd` postdeploy hook was running, but when its output was piped or non-interactive, stdout was invisible. Nothing in the terminal made it obvious what the hook was doing.

The hook was not failing.

It was worse: it was silent.

So I had to verify through the platform logs:

```bash
az containerapp logs show \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --follow
```

That became the source of truth.

Another problem was configuration shape. I had invalid keys in `azure.yaml` during one iteration. A top-level `dockerfile:` or `port:` looks plausible if you are moving fast.

`azd` did not treat that as a hard failure in the way I wanted. It ignored the invalid shape and fell back to default behavior.

The Dockerfile must be configured through the `docker:` block:

```yaml
services:
  image-generation:
    project: .
    language: docker
    host: containerapp
    docker:
      path: ./Dockerfile.cpu
      context: .
```

That small indentation decision changed what image was built.

The Dockerfile also had to default to the Flask server as its entrypoint. If the platform command was absent or wrong, the image still needed to know how to run the app:

```dockerfile
CMD ["python3", "app.py"]
```

Without that kind of default, ACA could end up in `ContainerBackOff` or `ActivationFailed`, depending on which part of startup failed.

There was also an infrastructure bug: a circular dependency in the Bicep for the container app failed template validation until I broke the cycle. That was not an SDXL issue. It was an ownership issue. The model deployment made the infrastructure graph more complicated, and the graph had to be correct before the app could even try to start.

The lesson: **automation needs observable verification. Trust nothing you cannot see in logs.**

A successful command is not always a successful deployment. A running container is not always your app. A mounted share is not always a ready model. A quiet hook is not always an idle hook.

## What the Final Architecture Became

The final shape is more explicit than the one I started with.

Not more complicated for its own sake. More honest.

The container image defaults to Flask:

```dockerfile
CMD ["python3", "app.py"]
```

The runtime behavior is explicitly CPU:

```text
device=cpu
vCPU=4
memory=16Gi
ephemeral storage=136Gi
```

The model pipeline uses CPU-safe initialization:

```python
pipe.to("cpu")
pipe.enable_attention_slicing()
pipe.vae.enable_slicing()
pipe.vae.enable_tiling()
```

The Azure Developer CLI configuration points at the CPU Dockerfile through the supported shape:

```yaml
services:
  image-generation:
    language: docker
    host: containerapp
    docker:
      path: ./Dockerfile.cpu
      context: .
```

The postdeploy hook does four jobs, in order:

1. Reset the container command to the Flask app.
2. Wait for `/health` so I know Flask is actually running.
3. POST `/model/pull` so model acquisition is part of deployment.
4. Poll `/model/status` until `state` is `ready`, with a configurable timeout and fail-fast behavior.

In shell form, the core idea is simple:

```bash
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --command "python3" "app.py"

curl --fail "$APP_URL/health"
curl --fail -X POST "$APP_URL/model/pull"

until curl --fail "$APP_URL/model/status" | grep '"state":"ready"'; do
  sleep 10
done
```

The real script has more defensive handling, because production scripts should fail clearly. But that is the architecture.

The app owns readiness. The hook gates deployment on readiness. Logs validate reality.

That pattern is the payoff from the surprises.

I did not end up with "a container that runs SDXL."

I ended up with a deployment lifecycle for a self-hosted generative model.

## The Decision Framework I Actually Trust Now

I still like the decision to self-host for this project.

I get control over inference settings. I can keep the app portable. I am not designing around a vendor-specific image API. I can change the container, the model loading strategy, and the deployment lifecycle when I need to.

But the tradeoff is clearer now.

Self-hosting buys control by moving hidden responsibilities into your application boundary.

You own runtime assumptions. You own model storage. You own download orchestration. You own readiness. You own deployment verification. You own logs. You own sizing. You own the difference between "files exist" and "the model can answer this request."

A vendor API charges for convenience, but the convenience is real. It is not just inference. It is the operational surface area you do not have to build.

For a prototype, that surface area may not be worth it.

For a workflow where settings, portability, and control matter, it can be.

The honest question is not "Can I run this model myself?"

The honest question is: **Do I want to own everything this model needs to be reliable?**

## Closing

The hard part was not running SDXL.

The hard part was learning what the vendor API had been hiding.

Once I owned the model, I owned the runtime, storage, lifecycle, readiness, and observability around it.

That is the real architecture decision.

Self-hosting a generative model is not replacing an API call with a container.

It is accepting that the model is now part of your system.
