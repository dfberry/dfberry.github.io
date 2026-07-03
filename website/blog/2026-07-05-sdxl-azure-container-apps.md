---
title: "Running Custom Image Generation at Scale: SDXL on Azure Container Apps"
date: 2026-07-05
author: Niobe
description: "I containerized my local SDXL setup and deployed it to Azure Container Apps. No vendor lock-in, complete control, and you only pay when it runs."
---

# Running Custom Image Generation at Scale: SDXL on Azure Container Apps

I've been doing image generation locally for a while—SDXL with custom LoRAs, specific presets, and precise controls over inference steps and seeds. Everything is reproducible. Everything is mine.

Then I hit a real constraint: I needed to scale beyond what my local GPU could handle, but cloud APIs (DALL-E, Midjourney) wouldn't let me keep that control. They're black boxes. LoRAs don't exist. Seed control doesn't exist. Preset configurations don't exist.

So I did what I should have done from the start: I containerized my setup and ran it on Azure Container Apps. Same configs, same results, same complete control—but now I can generate hundreds of images without buying more hardware.

This is what actually makes sense for this specific problem.

---

## The Setup I Built

My local workflow is a Python CLI with SDXL:

```yaml
images:
  - prompt: "A glowing tropical garden with deep magenta flowers..."
    seed: 42
    output: "outputs/quickstart/garden.png"
    width: 1200
    height: 632
    preset: quick-draft
    style: watercolor
    lora:
      - name: aether-watercolor
        weight: 0.8
    modifiers:
      - more-detailed
      - crisper
```

It runs locally with `python -m image_generation.cli.generate --batch-file-yaml batch.yaml`. I control everything.

None of that exists on a cloud API.

So instead of abandoning my setup, I containerized it:

1. **Dockerfile** — Package my SDXL code + dependencies (torch, diffusers, LoRA weights)
2. **Flask wrapper** — Add a thin HTTP layer so I can submit batches remotely
3. **Azure Container Apps** — Deploy the container to scale to zero when idle

The batch configs don't change. The prompts don't change. The results are identical. I just call it remotely now.

---

## Why This Matters: The Missing Middle Ground

When I first researched this, the framing was always:

- Cloud APIs: instant, hands-off, no control, pay per use
- Rent a GPU: middle ground, but still vendor's environment
- Your own hardware: total control, but finite capacity and high electricity

None of those fit what I actually needed: **total control + elastic scaling + pay only when running**.

Azure Container Apps gave me that. Particularly because of one thing: **minimum scale of zero**. The container shuts down completely when not in use. You don't pay for idle time.

If I have 10 requests a month, I pay $0.50. If I have 10,000 requests a month, I pay maybe $50–100. There's no "always on" baseline cost. There's no infrastructure I'm not using.

---

## How It Works

**Step 1: Wrap the CLI in a web endpoint**

Flask is 30 lines:

```python
from flask import Flask, request
from image_generation.cli.generate import generate_from_batch

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate():
    batch = request.json
    images = generate_from_batch(batch)
    return {"status": "done", "images": images}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
```

**Step 2: Containerize**

```dockerfile
FROM nvidia/cuda:12.1-runtime-ubuntu22.04
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt flask
COPY image-generation/ .
COPY app.py .
EXPOSE 8000
CMD ["python", "app.py"]
```

**Step 3: Deploy with `azd`**

This is where modern Azure Developer CLI makes it simple. You use `azd`—open-source, no vendor lock-in, all your infrastructure is code:

```bash
azd auth login
azd init
azd up
```

The `./infra` directory contains Bicep templates (infrastructure-as-code, human-readable, version-controlled). You get:

- Container Registry (to store your image)
- Container Apps environment
- Your container running with GPU
- Auto-scaling from zero to N replicas
- No manual clicking in the Azure portal

**Step 4: Call it**

```bash
curl -X POST http://<your-container-apps-url>/generate \
  -H "Content-Type: application/json" \
  -d @batch_quickstart.yaml
```

---

## Cost Reality

**Azure Container Apps pricing:**
- Compute: pay per vCPU-second (GPU = ~$0.30/hour)
- Memory: separate line item
- No charge if scaled to zero

**My typical workflow:**
- Submit a batch of 50 images (takes ~20 minutes)
- Container runs: $0.10
- Container idles the rest of the month: $0.00

**If I ran 500 batches a month:**
- 500 × $0.10 = $50/month
- Plus: Docker image storage ($5/month), container environment (~$10/month)
- Total: ~$65/month

**Versus:**
- Cloud API per image: 10¢–50¢ each = $50–250/month for 500 images
- Local GPU: $600 hardware + $30/month electricity

**The tradeoff:** I lose raw speed (images take 30 seconds instead of 3 seconds with cloud APIs) but keep total control and hit a cost sweet spot if I have any reasonable volume.

---

## What Doesn't Lock You In

This matters to me because I wanted to avoid vendor lock-in:

- **Bicep templates** are readable and portable (unlike Azure-specific configuration formats)
- **Container image is vendor-agnostic** (run it on AWS ECS, GCP Cloud Run, or your own Kubernetes cluster tomorrow)
- **Python code stays mine** (not wrapped in framework magic)
- **Infrastructure is version-controlled** (not hidden in portal settings)

If I wake up in a year and hate Azure's pricing, I copy the image to another provider and update the Bicep templates. My actual image generation code doesn't change.

---

## The Decision Framework

Cloud APIs are right if you want instant results and don't care about model control. They're genuinely good for exploration.

Rented GPU time makes sense if you want some flexibility without infrastructure management.

**This approach—containerized local code on serverless compute—is right if:**

- You have custom model configurations (LoRAs, presets, specific prompts) that wouldn't survive an API migration
- You care about consistency and reproducibility
- You run batches, not single on-demand requests
- You want to avoid vendor lock-in
- You have some volume (more than a few images per month) to justify the setup time

---

## What Changed My Thinking

I spent months assuming I had to choose: either abandon my custom setup and use an API, or stay local and stay limited.

I didn't realize there was a legitimate third path: keep the setup, containerize it, and run it elastically. It took pulling the code apart and asking "what if I just... made this callable from HTTP?" to unlock it.

I'm curious whether this resonates with how other people are handling bespoke model work. Are you running custom fine-tuned models? Do you have reproducibility constraints that APIs can't meet? How do you scale past your local hardware?
