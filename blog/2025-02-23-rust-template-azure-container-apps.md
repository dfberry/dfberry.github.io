---
slug: /2025-02-23-deploy-rust-to-azure-container-app.md
canonical_url: https://dfberry.github.io/blog/2025-02-23-deploy-rust-to-container-app.md
custom_edit_url: null
sidebar_label: "2025-02-23 Deploy Rust to container app"
title: "Deploy Rust app to Azure Container App"
description: "Deploy a Hello World app written in Rust to Azure Container app"
published: false
tags: 
  - Azure 
  - Azure Container App
  - Rust
  - GitHub Action
updated: 2025-02-23 00:00 PST
---
# Deploying Rust to Azure Container Apps: A Simple, Push-to-Main Workflow

If you're a Rust developer who's just getting started with Azure, this post is for you. In this guide, I'll explore an templated repository you can use that makes deploying your Rust application to Azure Container Apps a breeze. With easy-to-use CLI tools and an automated GitHub Action workflow, deploying your app is as simple as pushing your changes to the main branch!

## What's in the Repo?

This repository contains a simple Rust application built using the Axum web server. It includes:

- A root route that returns HTML.
- An `/api/users` endpoint returning JSON data.
- Example configuration for environment secrets:
  - `PORT=3000`
  - `MY_SECRET=1234`

## Easy, CLI-Powered provisioning and deployment

### 1. Provision Your Azure Environment
The repo ships with a set of bash scripts that take care of provisioning Azure resources. These scripts leverage:

- **Azure CLI** – Use it to interact with and manage your Azure resources.
- **Azure Developer CLI (azd)** – Provision and configure resources using Bicep templates.
- **GitHub CLI** – Configure the deployment secrets necessary for GitHub Actions.

Running these scripts sets up everything from an Azure Container Registry to Application Insights in just a few commands.

### 2. Push-to-Main Deployments
After setting up your environment, subsequent deployments are incredibly simple:

- **Automated Workflow:** Every push to the `main` branch triggers a GitHub Action that builds your Rust application and deploys it to Azure Container Apps.
- **Continuous Deployment:** With the automation in place, you no longer need to manually deploy your app. Just push your changes—and your app is live!

### 3. Real-Time Monitoring and Logs
The repository includes a script (`stream-logs.sh`) that streams live logs from your Rust Axum server directly to your terminal. This makes it easy to:

- Monitor live application activity.
- Debug issues in real time.
- Gain immediate insights into your app’s behavior.

## Simple Rust migration to Azure

For developers new to Azure but familiar with Rust, this repository exemplifies how modern dev tools combine to simplify cloud deployments. Instead of wrestling with complex setups, you get:

- A straightforward CLI-driven process.
- Seamless integration with GitHub Actions.
- An efficient, automated deployment pipeline that gets your app live with minimal hassle.

## Repository template

[https://github.com/dfberry/rust-on-azure-container-apps](https://github.com/dfberry/rust-on-azure-container-apps)