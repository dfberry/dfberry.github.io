---
slug: /2024-08-18-deploy-rust-to-azure-container-app.md
canonical_url: https://dfberry.github.io/blog/2024-08-12-deploy-rust-to-container-app.md
custom_edit_url: null
sidebar_label: "2024-08-18 Deploy Rust to container app"
title: "Deploy Rust app to Azure Container App"
description: "Deploy a Hello World app written in Rust to Azure Container app"
published: false
tags: 
  - Azure 
  - Azure Container App
  - Rust
  - GitHub Action
updated: 2024-08-18 00:00 PST
---
# Deploying a Rust App to Azure Container Apps Quickly

Deploying a Rust application to Azure Container Apps can be done swiftly using Azure CLI scripts and GitHub workflows. This guide will walk you through the process step-by-step.

It is intended as a quick guide to get your code deployed quickly. It isn't intended to be a hardened, secure example of deployments or Rust code. 

## Prerequisites

1. **Azure CLI**: Ensure you have the Azure CLI installed and logged in.
2. **GitHub Repository**: Your Rust project should be in a GitHub repository.
3. **Azure Subscription**: You need an active Azure subscription.
4. **Rust environment**: Rust and Cargo are installed. I use the [Microsoft Rust](https://mcr.microsoft.com/en-us/product/devcontainers/rust) development container. 

## Step 0: Create your GitHub repository

These steps are completed on the [GitHub](https://github.com/) web site. 

1. Create a GitHub repository under your personal account. 
2. Go to your GitHub user settings and create a Personal Access Token (PAT) with permisson to write to packages.
3. Save the token value as a repository secret with the name `GITHUB_PAT`. 

## Step 1: Create your Rust application

1. Create a file, `src/main.rs`, and copy the following Rust code into it:

```rust
//! Run with
//!
//! ```not_rust
//! cargo build
//! cargo run
//! ```

use axum::{response::Html, routing::get, Router};
use std::env;

#[tokio::main]
async fn main() {

    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);

    // build our application with a route
    let app = Router::new().route("/", get(handler));

    // run it
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1><p>")
}
```

2. Create a package file, `./Cargo.toml`, with the following contents:

```toml
name = "rust-axum-server"
version = "0.1.0"
edition = "2021"
publish = false

[dependencies]
axum = { version = "0.7.4" }
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0.159", features = ["derive"] }
serde_json = "1.0.95"
tower-http = { version = "0.5.0", features = ["cors"] }
uuid = { version = "1.3.0", features = ["v4","serde"] }

[[bin]]
name = "rust-axum-server"
path = "src/main.rs"
```

The source repository, at this point, has the following form:

```
- Cargo.toml
- src
    - main.rs
```

## Step 2: Dockerize Your Application

Create a `./Dockerfile` to containerize your Rust application:

```dockerfile
#--------------------------------------------
# Use the official Rust image as the base image
FROM rust:latest as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files to the container
COPY Cargo.toml Cargo.lock ./

# Copy the source code to the container
COPY src ./src

# Build the Rust project
RUN cargo build --release

#--------------------------------------------
# Use a minimal base image for the runtime
FROM gcr.io/distroless/cc AS runtime

# Set the working directory inside the container
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/target/release/rust-axum-server /usr/local/bin/app

# Set the entrypoint to the built binary
ENTRYPOINT ["/usr/local/bin/app"]
```

The source repository, at this point, has the following form:

```
- Dockerfile
- Cargo.toml
- src
    - main.rs
```

## Azure CLI Scripts

Create an Azure CLI script to create and configure your resources. 

```shell
#!/bin/bash

## Prerequisites
## az login --use-device-code
##

# Set variables - only use alphanumeric characters (no dashes or underscores)
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
AZURE_RESOURCE_GROUP="<your-resource-group>"
AZURE_LOCATION="<your-location>"

AZURE_CONTAINER_REGISTRY_NAME="<your-container-registry-name>"
AZURE_CONTAINER_APP_ENV_NAME="<your-container-app-env-name>"
AZURE_CONTAINER_APP_NAME="<your-container-app-name>"

# Create Azure resource group
az group create --subscription $AZURE_SUBSCRIPTION_ID --name $AZURE_RESOURCE_GROUP --location $AZURE_LOCATION

# Create Azure container registry
az acr create --subscription $AZURE_SUBSCRIPTION_ID --resource-group $AZURE_RESOURCE_GROUP --name $AZURE_CONTAINER_REGISTRY_NAME --sku Basic

# Create Azure Container App environment
az containerapp env create --subscription $AZURE_SUBSCRIPTION_ID --resource-group $AZURE_RESOURCE_GROUP --name $AZURE_CONTAINER_APP_ENV_NAME --location $AZURE_LOCATION

# Create Azure container app
az containerapp create --subscription $AZURE_SUBSCRIPTION_ID --resource-group $AZURE_RESOURCE_GROUP --name $AZURE_CONTAINER_APP_NAME --environment ${AZURE_CONTAINER_APP_ENV_NAME}

# Enable ingress for Azure Container App
az containerapp ingress enable \
--subscription $AZURE_SUBSCRIPTION_ID \
--name $AZURE_CONTAINER_APP_NAME \
--resource-group $AZURE_RESOURCE_GROUP \
--target-port $TARGET_PORT \
--transport http \
--type external 
```

## GitHub Workflow

Create a GitHub Actions workflow, `./.github/workflows/deploy.yml`, to build and deploy your container. Edit the environment variables as the top of the file to make your existing resource names. The `IMAGE_NAME` should be representative of your application. 

```yml
name: Deploy to Azure Container App
env:
  AZURE_CONTAINER_APP_NAME: your-container-app-name
  AZURE_GROUP_NAME: your-resource-group
  AZURE_CONTAINER_REGISTRY: your-container-registry
  IMAGE_NAME: your-image-name

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout to the branch
        uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Log in to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.AZURE_CONTAINER_REGISTRY_LOGIN_SERVER }}
          username: ${{ secrets.AZURE_CONTAINER_REGISTRY_USERNAME }}
          password: ${{ secrets.AZURE_CONTAINER_REGISTRY_PASSWORD }}
      - name: Build and push container image to Azure Container Registry
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: |
            ${{ secrets.AZURE_CONTAINER_REGISTRY_LOGIN_SERVER }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ secrets.AZURE_CONTAINER_REGISTRY_LOGIN_SERVER }}/${{ env.IMAGE_NAME }}:latest
          file: ./Dockerfile

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Deploy to containerapp
        uses: azure/CLI@v1
        with:
          inlineScript: |
            az containerapp update -n ${{ env.AZURE_CONTAINER_APP_NAME }} -g ${{ env.AZURE_GROUP_NAME }} --image ${{ secrets.AZURE_CONTAINER_REGISTRY_LOGIN_SERVER }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

## Create Azure service principal

1. Create an Azure service principal to use as a GitHub repository secret. This secret will give you permission to deploy to your container app from the GitHub action. 

```shell
#!/bin/bash

## Prerequisites
## az login --use-device-code
##

# Set variables - only use alphanumeric characters (no dashes or underscores)
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"

az ad sp create-for-rbac \
--name "CICD" \
--role contributor \
--scopes /subscriptions/$AZURE_SUBSCRIPTION_ID \
--sdk-auth
```

2. Copy the JSON object output and save it as a repository secret named `AZURE_CREDENTIALS`. 

## Commit and push files

Use the git CLI to commit and push the files. 

```
git add .
git commit -m "Rust on Azure"
git push origin main
```

## Run the Deployment

On the GitHub repository, under actions, select the **Actions** tab then select the workflow file, then select **Run workflow**.

This will take a few mintues to build and push the container image to your container registry, then deploy that container to your Azure Container app resource. 

## Get the ingress URL

When you deploy to Azure Container app, your URL to access that app may change. To get the correct URL after a successful deployment, use the following Azure CLI script:

```shell
#!/bin/bash

## Prerequisites
## az login --use-device-code
##

# Set variables - only use alphanumeric characters (no dashes or underscores)
AZURE_SUBSCRIPTION_ID="19016922-4bf5-4c41-9553-8eff5da1500e"
AZURE_RESOURCE_GROUP="rust-axum-server"
AZURE_CONTAINER_APP_NAME="dfberrycontainerapp"

az containerapp show \
--subscription $AZURE_SUBSCRIPTION_ID \
--name $AZURE_CONTAINER_APP_NAME \
--resource-group $AZURE_RESOURCE_GROUP \
--query properties.configuration.ingress.fqdn \
--output tsv
```

Copy the URL and past into a web browser to see your RUST application running.

## Conclusion

By following these steps, you can quickly deploy your Rust application to Azure Container Apps using Azure CLI scripts and GitHub workflows. This setup ensures a smooth and automated deployment process. ```