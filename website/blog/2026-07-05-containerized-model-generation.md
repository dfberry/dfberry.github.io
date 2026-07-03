---
title: "From Custom Local Setup to Elastic Cloud: Containerizing SDXL for Azure Container Apps"
date: 2026-07-05
description: "I needed my exact model configs, not a vendor's API. Here's how I went from a local Python CLI to a production Flask API deployed on Azure—no lock-in, full control."
tags: ["AI", "DevOps", "Azure", "Docker", "SDXL", "Cloud Deployment", "Production"]
---

## The Problem: Vendor APIs Weren't Mine

I've been generating blog illustrations with Stable Diffusion XL for a few months now. My local setup works perfectly—custom prompts, specific seeds for reproducibility, precise step counts and guidance scales. I own the entire workflow.

Then came the pressure to "scale." What if I needed 100 images one week and five the next? Running generation on my MacBook Pro works great when I'm home, but what about when I'm traveling? And the electricity cost of a local GPU running 24/7 adds up.

The obvious answer: vendor APIs. Stability AI, Replicate, Amazon Bedrock—they all offer SDXL inference. But here's what I found myself asking:

- Can I use *my exact* inference settings? (Often locked to presets.)
- Can I run this on my own infrastructure if I want to? (Usually locked to their cloud.)
- Will they keep offering SDXL at the same price? (Who knows.)
- Can I add custom LoRAs or refine the pipeline? (Usually no.)

I realized I didn't actually need a vendor API. I needed **my code, in a container, running in elastic cloud infrastructure**. That's cheaper, more flexible, and surprisingly easy.

This is my journey from local Python CLI to production Flask API on Azure Container Apps—and what I learned about containerization, cloud deployment, and cost control along the way.

## Part 1: Understanding What I Already Had

My local image generation pipeline is a Python CLI (`generate.py`) that:
- Loads SDXL base and optional refiner models from Hugging Face
- Takes text prompts and generates 1024×1024 PNG images
- Supports batch processing from JSON configs
- Auto-detects GPU (NVIDIA, Apple Silicon, CPU fallback)
- Handles out-of-memory gracefully by retrying with fewer steps

**Example local usage:**
```bash
python generate.py --prompt "tropical sunset, oil painting" --steps 40 --seed 42
```

Or batch mode:
```bash
python generate.py --batch-file batches/blog-images.json
```

Where `batches/blog-images.json` is:
```json
[
  {
    "prompt": "underwater kingdom with coral castles, fantasy art",
    "output": "outputs/underwater.png",
    "seed": 42
  },
  {
    "prompt": "floating islands in clouds, magical realism",
    "output": "outputs/islands.png",
    "seed": 43
  }
]
```

This works perfectly on my local machine. But it's not:
- **Accessible remotely** — I need to SSH in or run it locally
- **Elastic** — one request at a time, one machine, can't scale
- **Pay-as-you-go** — GPU costs whether I'm using it or not
- **Integrated** — hard to call from other apps or automate

## Part 2: The Bridge—Flask + Docker

The key insight: I don't need to rewrite my CLI. I just need to:
1. Wrap it in a web server (Flask)
2. Put the web server in a container (Docker)
3. Deploy the container to managed infrastructure (Azure Container Apps)

**Step 1: Create a Flask wrapper** (`app.py`)

```python
from flask import Flask, request, jsonify
from src.image_generation.generate import generate_with_retry
from types import SimpleNamespace

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate_endpoint():
    config = request.get_json()
    
    results = []
    for prompt_obj in config.get("prompts", []):
        args = SimpleNamespace(
            prompt=prompt_obj["prompt"],
            output=prompt_obj.get("output", "outputs/image.png"),
            seed=prompt_obj.get("seed"),
            steps=config.get("steps", 40),
            guidance=config.get("guidance", 7.5),
            width=config.get("width", 1024),
            height=config.get("height", 1024),
            refine=config.get("refine", False),
            cpu=False
        )
        
        try:
            output_path = generate_with_retry(args, max_retries=2)
            results.append({
                "prompt": prompt_obj["prompt"],
                "output": output_path,
                "status": "ok"
            })
        except Exception as e:
            results.append({
                "prompt": prompt_obj["prompt"],
                "error": str(e),
                "status": "error"
            })
    
    return jsonify({
        "status": "success",
        "results": results,
        "timestamp": datetime.utcnow().isoformat()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
```

That's it. Same CLI code, now exposed as `/generate POST` endpoint.

**Test locally:**
```bash
python app.py
```

Then:
```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [
      {"prompt": "tropical sunset", "seed": 42}
    ],
    "steps": 40,
    "guidance": 7.5
  }'
```

Response:
```json
{
  "status": "success",
  "results": [
    {
      "prompt": "tropical sunset",
      "output": "outputs/image_20260703_092314.png",
      "status": "ok"
    }
  ],
  "timestamp": "2026-07-03T09:23:14Z"
}
```

**Step 2: Containerize with Docker**

```dockerfile
FROM nvidia/cuda:12.1-runtime-ubuntu22.04

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy code
COPY app.py .
COPY src/ ./src/

EXPOSE 8000

CMD ["python3", "app.py"]
```

Build it:
```bash
docker build -t sdxl-api:latest .
```

Run it:
```bash
docker run --gpus all -p 8000:8000 \
  --mount type=bind,source=$(pwd)/outputs,target=/app/outputs \
  sdxl-api:latest
```

Same API, now in a container. I can run it on any machine with Docker and a GPU.

## Part 3: From Container to Cloud

I chose Azure Container Apps because:
- **Managed Kubernetes** — no cluster management
- **GPU support** — up to 1 GPU vCPU per container, at $0.30/hour
- **Elastic scaling** — scales from 0 to N replicas, pay only for active time
- **HTTPS by default** — ingress configured automatically
- **Easy to define** — Bicep templates (IaC in Azure's language)

### Infrastructure as Code (Bicep)

Instead of clicking through the Azure portal, I defined everything in `infra/main.bicep`:

```bicep
param location string = resourceGroup().location
param containerRegistryName string = 'sdxlregistry'
param containerAppName string = 'sdxl-generation-api'
param environmentName string = 'sdxl-env'

// Create Container Registry (for hosting my Docker images)
module acr 'resources/acr.bicep' = {
  name: 'acr-deployment'
  params: {
    location: location
    containerRegistryName: containerRegistryName
  }
}

// Create Container Apps Environment
module caEnvironment 'resources/aca-env.bicep' = {
  name: 'aca-env-deployment'
  params: {
    location: location
    environmentName: environmentName
  }
}

// Create Container App (the actual service)
module containerApp 'resources/aca.bicep' = {
  name: 'container-app-deployment'
  params: {
    location: location
    containerAppName: containerAppName
    containerAppsEnvironmentId: caEnvironment.outputs.environmentId
    imageName: '${acr.outputs.loginServer}/sdxl-api:latest'
  }
}

output containerAppUrl string = containerApp.outputs.fqdn
```

The container app module specifies:
```bicep
scale: {
  minReplicas: 0      # Scale to zero when idle (no cost)
  maxReplicas: 1      # Max 1 replica (can handle 1 request at a time)
}

resources: {
  cpu: json('4')      # 4 vCPU
  memory: '16Gi'      # 16 GB RAM for model loading
}
```

Key decision: **minReplicas: 0** means the container stops entirely when idle. I pay nothing when I'm not generating. First request takes ~10-30 seconds to start (cold start), but that's for the container itself—the models then need to be downloaded from Hugging Face (5-10 minutes total for first inference). Subsequent requests on the same container are fast.

### Deployment with Azure Developer CLI (azd)

Azure's `azd` tool orchestrates the entire deployment:

```bash
# Authenticate
azd auth login

# Initialize (creates resource group, configures subscription)
azd init

# Deploy
azd up
```

What happens:
1. Docker image is built
2. Image is pushed to Azure Container Registry
3. Bicep template is deployed
4. Container App is created and started
5. Public HTTPS URL is generated
6. Health check is configured

Output:
```
✓ Building image 'sdxl-api:latest'
✓ Pushing image to 'sdxlregistry.azurecr.io'
✓ Deploying infrastructure
✓ Service deployed to https://sdxl-generation-api.victoriousforest-12ab.eastus.azurecontainerapps.io
```

That URL is live and accepts requests immediately.

## Part 4: Using the Cloud Service

Now I can call my API from anywhere:

```bash
ENDPOINT="https://sdxl-generation-api.victoriousforest-12ab.eastus.azurecontainerapps.io"

curl -X POST $ENDPOINT/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [
      {"prompt": "a tropical sunset with palm trees, oil painting style", "seed": 42},
      {"prompt": "underwater coral reef, fantasy art", "seed": 43}
    ],
    "steps": 40,
    "guidance": 7.5,
    "width": 1024,
    "height": 1024
  }'
```

The API queues both requests, generates both images (or one at a time if minReplicas: 0 means they're sequential), and returns results in ~60-90 seconds.

If I suddenly needed to handle 10 concurrent requests, I'd edit `infra/resources/aca.bicep`:

```bicep
maxReplicas: 10  # now can handle up to 10 parallel generations
```

Then:
```bash
azd deploy
```

Azure auto-scales to 10 replicas (10 containers × $0.30/hr each). If demand drops, it scales back down. **I only pay for what I use.**

## Part 5: Cost Reality

Here's what I'm actually paying:

| Component | Cost | Notes |
|-----------|------|-------|
| GPU compute (active) | ~$0.30–0.50/hr | Only when generating; varies by region |
| Container Registry | ~$5–10/month | Depends on image size and updates |
| Model cache | Needs persistent storage | Models re-download after scale-to-zero (~$5/mo for Azure Files) |

Without persistent model storage, **each scale-to-zero cycle means re-downloading SDXL (~7GB, 5-10 min latency)**. For budget-conscious deployments, I can:
- Pre-build the Docker image with models included (heavier image, eliminates runtime downloads)
- OR mount Azure Files for persistent `/root/.cache/huggingface` (adds cost but keeps cold start fast)

**Example usage: 10 batches/month, 5 min each (realistic for blog illustrations)**
- Total GPU time: 50 min = 0.83 hours
- Compute cost: 0.83 × $0.30 = ~$0.25/month
- Plus ACR storage: ~$5/month
- Plus persistent model cache (if using Azure Files): ~$5/month
- **Total: ~$10/month for reliable, fast generation**

By contrast:
- **Local GPU:** $3000–5000 hardware ÷ 36 months = $83–139/month amortized + electricity + maintenance
- **Vendor API (Replicate):** $0.025 per image = $0.25–2.50/month for 10–100 images, but limited customization

**If I were running this 24/7**, Azure would cost ~$216–360/month (1 replica × $0.30–0.50/hr × 730 hours), plus persistent storage. But I'm not—I generate when I need images. The benefit: zero cost when idle.

## Part 6: Portability vs Lock-In

I often hear "containers are portable, zero lock-in." That's *partially* true here:

**Portable:**
- The Docker container runs on any cloud (AWS, GCP, DigitalOcean)
- The Python code is framework-agnostic

**Azure-specific:**
- The Bicep templates are Azure's Infrastructure as Code language
- Porting to AWS requires writing CloudFormation or Terraform (~2–4 hours of work)
- You'd need to replicate: Container Registry, Managed Environment, Container App, persistent storage

**Practical take:** This architecture *can* move clouds, but it requires effort. The value isn't "zero lock-in"—it's **not being locked into a specific model vendor's API** (Stability AI, Replicate). I can swap SDXL for Llama, Mistral, or a custom fine-tune without paying a vendor premium.

**Full control:** I can:
- Add custom LoRAs to the model
- Adjust step counts and guidance globally
- Implement persistent model caching to avoid re-downloads
- Add authentication if I expose this to teammates
- Switch models entirely (e.g., Stable Diffusion 3, custom fine-tunes)
- Monitor logs and performance
- Run batch inference efficiently

**Deterministic:** Same seeds produce same images. Batch configuration is versioned. I'm not at the mercy of a vendor changing their API.

**Scalable:** From 0 to N replicas with one parameter change. Batch inference becomes trivial—instead of running 100 prompts one at a time locally, I can send them to my cloud API and let Azure handle concurrency.

## Part 7: What I Learned

1. **Containerization isn't just for production.** It's for portability and reproducibility. Even local development benefits.

2. **Managed services are worth it.** Azure Container Apps handles scaling, networking, and SSL. I focus on my code.

3. **Infrastructure as Code (Bicep) scales better than ClickOps.** I can redeploy in seconds, version control everything, and reproduce environments exactly.

4. **Cold start vs model download are different problems.** Container startup is ~10–30s. Model download is 5–10 minutes. For batch work, I tolerate this. For real-time APIs, I'd use persistent storage or pre-download models.

5. **Model persistence is essential at scale.** With scale-to-zero, containers are destroyed when idle. Models must be either:
   - Pre-built into the Docker image (heavier, but always-fast)
   - Mounted from persistent storage (adds cost, but smaller image)

6. **Monitoring is critical.** I set up health checks (`GET /health`) so Azure can detect failures and restart. Logs go to stdout for Container Apps Log Analytics.

7. **Scaling is a cost decision.** Each replica consumes full GPU resources. With 5 replicas, I'm budgeting $150–250/mo, not $10/mo.

## Part 8: Real-World Complications I Encountered

When I first deployed this, I hit a few snags that taught me a lot.

**OOM on first request:** The model (~7GB) plus working memory can exceed available GPU RAM on startup. I solved this by:
- Implementing automatic retry logic that halves inference steps on OOM (40 → 20 → 10 steps)
- Pre-building the Docker image with models downloaded (heavier image, but eliminates runtime downloads)
- Allocating sufficient GPU memory (4 vCPU + 16GB)

The retry is elegant: if I request 40 steps and hit OOM, the app auto-retries with 20 steps, then 10. The user still gets a result; it's just lower quality.

**Cold start + model download latency:** First request after scaling to zero takes:
- ~10–30 seconds for container startup
- ~5–10 minutes for initial model download (if not pre-cached)
- **Total: 5–10 minutes before generating starts**

For batch work, this is acceptable. For real-time UIs, it's too slow. I'm implementing persistent Azure Files mounts to cache models between scale-to-zero cycles.

**Image persistence:** Generated images live in `/app/outputs/` inside the container. If the container restarts, they're gone. I solve this by:
- Mounting generated images to Azure Blob Storage (future enhancement)
- Or keeping them small (~5MB per 1024×1024 PNG) and accepting that they're ephemeral

**Scaling beyond 1 replica:** If I need 5 replicas, each one is a separate container with its own Python interpreter and model cache. That's 5 × 16GB = 80GB memory. Azure enforces this automatically, so scaling is a conscious cost decision.

**API versioning:** Changing inference parameters (adding new endpoints, changing response format) requires container rebuilds. I version my API in the URL path (`/v1/generate`, `/v2/generate`) to avoid breaking changes.

## Part 9: Beyond SDXL—Generalizing the Approach

This isn't just for SDXL. The architecture works for any model type:

- **LLMs:** Wrap Llama 2, Mistral, or custom fine-tunes in Flask
- **Audio models:** Voice cloning, music generation
- **Computer vision:** Object detection, segmentation, classification
- **Retrieval:** Embed documents and expose vector search
- **Multimodal:** Image → text, text → speech pipelines

The pattern is always:
1. Local Python code that works
2. Flask wrapper for HTTP interface
3. Docker for reproducibility
4. Bicep for infrastructure
5. `azd up` to deploy

The only changes are:
- Adjust container resources (CPU, memory) based on model size
- Modify maxReplicas based on expected concurrency
- Add authentication if sharing with teammates
- Update requirements.txt with model-specific dependencies

## Part 10: Should You Build This?

This approach is ideal if:
- You have **custom model configurations** (specific seeds, steps, guidance values)
- You need **elastic scaling** (bursty usage patterns)
- You want **full control** over the inference pipeline
- You're cost-conscious and need to **pay only for what you use**
- You dislike **vendor lock-in**

It's probably overkill if:
- You're calling a model **once per month**
- You don't care about **reproducibility** (seeds, exact parameters)
- You're okay with **vendor APIs** (simpler integration)
- You need **sub-second latency** (cold starts are slow)
- You need **GPUs 24/7** (local machine is cheaper than always-on cloud)

For everything in between, this pattern is the sweet spot: production-ready, cost-efficient, and fully under your control.

## Part 11: Monitoring and Observability in Production

I quickly realized that deploying to Azure is only half the battle. Knowing what's happening in production is the other half.

I set up:
- **Health checks:** `/health` endpoint that `curl`s back to verify the container is alive
- **Structured logging:** Every generation request logs `{"timestamp": "...", "prompt": "...", "duration_ms": ..., "status": "ok"|"error"}`
- **Alerts:** Azure Monitor can alert on failed requests, slow responses, or container restarts
- **Log aggregation:** Container Apps pipes all stdout/stderr to Log Analytics Workspace (queryable with KQL)

Example query to find slow generations:
```kusto
ContainerAppConsoleLogs
| where Log contains "Generated"
| extend duration = extract(@"duration_ms.(\d+)", 1, Log)
| where duration > 120000
| project TimeGenerated, duration
```

This simple observability caught two issues:
1. **GPU driver was outdated** — inference took 3× longer than expected
2. **Model cache wasn't persistent** — first generation on each new container was 2–3x slower

Both were fixable with infrastructure changes.

## Part 12: The Economics in Detail

Let me break down the actual monthly cost more precisely, because it surprised me.

**Scenario: 500 image generations per month, 40 steps each**

Azure Container Apps pricing (US East):
- GPU vCPU: $0.30/hour
- Memory: included in compute cost
- Data transfer: free within Azure (egress is $0.087/GB, but my PNGs stay in Blob Storage)

Inference time per image: ~1.5 minutes (model already loaded) to ~5 minutes (cold start with model load)

Conservative estimate: average 3 min per image
- 500 images × 3 min = 1500 min = 25 hours/month active
- 25 hours × $0.30/hr = **$7.50/month compute**

Container Registry storage: ~$0.10/day = **$3/month**

**Total: ~$10.50/month**

Compare to alternatives:
- **Replicate API:** $0.025 per image (no setup) = $12.50/month (vs. my $10.50)
- **Local GPU:** $5k GPU ÷ 36 months = $139/month + $20/month electricity = **$159/month**
- **Amazon SageMaker:** $0.50/hour ml.g4dn.xlarge + setup overhead = **$50–100/month**

Azure is cheapest if you have bursty usage. Local GPU wins if you're generating 8+ hours/day. Replicate wins on simplicity, not cost.

## Part 13: What's Next

Future improvements I'm considering:

1. **Persistent model cache:** Store models in Azure Blob Storage so containers don't re-download (~10 min saved per cold start)
2. **API authentication:** Add JWT tokens so only I (and authorized teammates) can call `/generate`
3. **Webhooks:** Make the API async—submit a batch, get a callback when done
4. **Cost optimization:** Use spot instances (Azure Spot VMs) for non-critical batches (70% cheaper, can be preempted)
5. **Multi-model support:** Host SDXL, Stable Diffusion 2, and a custom fine-tune on the same endpoint
6. **Batch job scheduling:** Integrate with Azure Batch or Logic Apps to trigger generation on a schedule

Each of these is a ~2-hour implementation change because the base is solid.

## The Full Setup

If you want to replicate this:

1. **Copy my local generation code** to a new Git repo
2. **Wrap it in Flask** (expose `/generate` endpoint)
3. **Create a Dockerfile** using `nvidia/cuda:12.1-runtime-ubuntu22.04` as base
4. **Write Bicep templates** for Container Registry and Container Apps
5. **Use `azd up`** to deploy everything

It's ~200 lines of Flask, ~100 lines of Bicep, and a Dockerfile. Total time: 2–3 hours if you're new to this; 30 min if you've done it before.

## Closing: The Trade-off

Vendor APIs are faster to integrate. My approach requires more infrastructure knowledge. But the payoff—full control, elastic scaling, cost efficiency, no lock-in—is worth it.

For my use case (generating 100–1000 images/month on demand), this costs ~$10/month and gives me complete ownership over my inference pipeline.

If you're generating images regularly with custom configs, this might be your answer too.

---

**Next steps:**
- Check out the [image-generation-ai repo](https://github.com/dfberry/image-generation-ai) for a complete, ready-to-deploy scaffold
- Read Azure's [Container Apps docs](https://aka.ms/aca-docs) for deeper customization
- Explore [Hugging Face Diffusers](https://huggingface.co/docs/diffusers) for model alternatives

Let me know if you go this route or find a better way. I'm always learning.
