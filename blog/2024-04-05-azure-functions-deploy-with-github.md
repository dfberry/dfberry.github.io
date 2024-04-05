---
slug: /2024-04-05-azure-functions-deploy-with-github.md
canonical_url: https://dfberry.github.io/blog/2024-04-05-azure-functions-deploy-with-github.md
custom_edit_url: null
sidebar_label: "2024-04-05 Deploy Azure Functions with GitHub Actions"
title: "Deploy an Azure Functions app from a monorepo with a GitHub Action for Node.js"
description: "Monorepos for Node.js are a unique challenge with Azure functions. Learn 2 tricks to successfully deploy."
published: false
tags: 
  - Azure 
  - Azure Functions
  - Developer Experience
  - Deploy
updated: 2024-04-05 00:00 PST
---

# Deploy an Azure Functions app from a monorepo with a GitHub Action for Node.js

Azure Functions apps can be locally deployed from Visual Studio Code using the Azure Functions extension or when you create the resource in the portal, you can configure deployment. These are straightforward when your app is the only thing in the repo but become a little more challenging in monorepos. 

## Single versus monorepo repositories

When you have a single function in a repo, the Azure Functions app is build and run from the root level package.json which is where hosting platforms look for those files. 

```
- package.json
- package-lock.json
- src
    - functions
        - hello-world.js
```

In a monorepos, all these files are pushed down a level or two and there may or may not be a root-level package.json.

```
- package.json
- packages
    - products
        - package.json
        - package-lock.json
        - src
            - functions
                - product.js
    - sales
        - package.json
        - package-lock.json
        - src
            - functions
                - sales.js
```

If there is a root-level package.json, it may control developer tooling across all packages. While you can deploy the entire repo to a hosting platform and configure which package is launched, this isn't necessary and may lead to problems. 

## Monorepo repositories as a single source of truth

Monorepo repositories allow you to collect all source code or at least all source code for a project into a single place. This is ideal for microservices or full-stack apps. There is an extra layer of team education and repository management in order to efficiently operationalize this type of repository. 

When starting the monorepo, you need to select the workspace management. I use npm workspaces but others exist. This requires a root-level package.json with the packages (source code projects) noted.

The syntax for npm workspaces allows you to select what is a package as well as what is not a package. 

```json
...
  "workspaces": [
    "packages/*",           // include all packages under /packages
    "!packages/legacy/*"    // except all packages under /packages/legacy
  ],
...
```

## Azure Functions apps with Visual Studio Code

When you create a Functions app with Visual Studio Code with the Azure Functions extension you can select it to be created at the root, or in a package. As part of that creation process, a `.vscode` folder is created with files to help find and debug the app. 

* extensions.json: all Visual Studio Code extensions
* launch.json: debug
* settings.json: settings for extensions
* tasks.json: tasks for launch.json

The **settings.json** includes `azureFunctions.deploySubpath` and `azureFunctions.projectSubpath` properties which tells Azure Functions where to find the source code. For a monorepo, the value of these settings may depend on the version of the extension you use. 

As of March 2024, setting the exact path has worked for me, such as `packages/sales/`. 

If you don't set the correct path for these values, the correct package may not be used with the extension or the hosting platform won't find the correct package.json to launch the Node.js Functions app. 

* During development: set the `azureFunctions.projectSubpath` to the single package path you are developing.
* During deployment: set the `azureFunctions.deploySubpath` to the single package path so the hosting platform has the correct path to launch the app. 

## GitHub actions workflow file for Azure Functions monorepo app

When you create a Azure Functions app in the Azure portal and configure the deployment, the default (and not editable) workflow file is built for a **monorepo** where the app's package.json is at the root of the repository.

```
# Docs for the Azure Web Apps Deploy action: https://github.com/azure/functions-action
# More GitHub Actions for Azure: https://github.com/Azure/actions

name: Build and deploy Node.js project to Azure Function App - my-functions-app

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AZURE_FUNCTIONAPP_PACKAGE_PATH: '.' # set this to the path to your web app project, defaults to the repository root
  NODE_VERSION: '20.x' # set this to the node version to use (supports 8.x, 10.x, 12.x)

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout GitHub Action'
        uses: actions/checkout@v4

      - name: Setup Node ${{ env.NODE_VERSION }} Environment
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: 'Resolve Project Dependencies Using Npm'
        shell: bash
        run: |
          pushd './${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}'
          npm install
          npm run build --if-present
          npm run test --if-present
          popd

      - name: Zip artifact for deployment
        run: zip release.zip ./* -r

      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v3
        with:
          name: node-app
          path: release.zip

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'production'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}
    permissions:
      id-token: write #This is required for requesting the JWT

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v3
        with:
          name: node-app

      - name: Unzip artifact for deployment
        run: unzip release.zip
      
      - name: Login to Azure
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.__clientidsecretname__ }}
          tenant-id: ${{ secrets.__tenantidsecretname__ }}
          subscription-id: ${{ secrets.__subscriptionidsecretname__ }}

      - name: 'Run Azure Functions Action'
        uses: Azure/functions-action@v1
        id: fa
        with:
          app-name: 'dfberry-functions-single-ap'
          slot-name: 'production'
          package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
```

This worklow sets the `AZURE_FUNCTIONAPP_PACKAGE_PATH` as the root of the project then pushes, `pushd './${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}'`, into that path to build. The zip, `zip release.zip ./* -r`, packages up everything as the root. To use a monorepo, these need to be altered. 

1. Change the name of the workflow to indicate the package and project.

    ```
    name: Build & deploy Azure Function - sales
    ```

1. Create a new global `env` parameter that sets the package location for the subdirectory source code. 

    ```
    # set this to the path to your web app project 
    AZURE_FUNCTIONAPP_PACKAGE_SALES_PATH: 'packages/sales' 
    ```

1. Change the `Resolve Project Dependencies Using Npm` to include the new environment variable.

    ```
    # pushd uses the package subdir as context for commands
    pushd './${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}/${{ AZURE_FUNCTIONAPP_PACKAGE_SALES_PATH }}'
    ```

    The `pushd` commands moves the context into that sales subdirectory.

1. Change the `Zip artifact for deployment` to include the new environment variable. The `popd` command returns the context to the root of the project. 

    ```
    # uses the root as context for the commands
    run: | 
        pushd './${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}/${{ AZURE_FUNCTIONAPP_PACKAGE_SALES_PATH }}'
        zip -r ../../release.zip dist/ package.json
        popd
    ```

    Using the `pushd` command, change the location of the generated zip file to be in root directory. 

    The result is that the zip file's file structure looks like:
    
    ```
    - package.json
    - src
        - functions
            - sales.js

    ```

    If you intend to build TypeScript projects instead of JavaScript, you can alter the build and zip commands to use the generated `dist` folder and the `package.json`.

<!-- https://askubuntu.com/questions/521011/zip-an-archive-without-including-parent-directory -->