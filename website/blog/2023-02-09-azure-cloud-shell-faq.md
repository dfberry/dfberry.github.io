---
slug: /2023-02-09-azure-cloud-shell-faq
canonical_url: https://dfberry.github.io/blog/2023-02-09-azure-cloud-shell-faq
custom_edit_url: null
sidebar_label: "2023.02.09 Azure Cloud Shell FAQ"
title: "Azure Cloud Shell Frequently asked questions"
description: "Things I wish I knew about Azure CLI and Azure Cloud shell"
published: true
tags: 
  - Azure
  - Azure CLI
  - Azure Cloud Shell
  - Tips
updated: 2023-02-09 05:00 PST
---

# Azure Cloud Shell FAQ for developers

1. You don't need to install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/what-is-azure-cli) in your local dev environment. 

    The Cloud Shell (Azure CLI in a browser) is available from the [Azure portal](https://portal.azure.com). 

    ![Screenshot showing Azure Cloud Shell is available from top navigation bar in Azure portal. ](./media/2023-02-09/azure-cloud-shell-button.png)


2. The cloud shell is sticky. Because the Cloud shell uses Azure Storage (File storage), when you end your sessions then return, [your files are still there](https://learn.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage). 

    * Want to quickly work with a GitHub repo? No problem, **git** is available. 


3. Because you use it from the portal, you are already authenticated. No need for [az login](https://learn.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login).
4. Many CLI tools are already installed for you.
    * Azure CLI
    * git, zip, jq
    * code (not exactly Visual Studio Code, but a good IDE)
    * nano, vim
    * Node.js, npm
    * Java and Maven
    * Python
    * .NET Core
    * PowerShell
    * Go (Golang)
    * [Azure Functions CLI](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
    * Docker CLI, Kubectl, Helm, Terraform, Ansible
    * [Office 365 CLI](https://pnp.github.io/cli-microsoft365/)
    * MySQL client
    * PostgreSql client
    * SQL cli

5. Create [bash scripts with Azure CLI commands](https://learn.microsoft.com/azure/cloud-shell/quickstart) to manage your Azure resources.
 


