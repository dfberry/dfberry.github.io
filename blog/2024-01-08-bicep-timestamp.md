---
slug: /2024-01-08-bicep-timestamp.md
canonical_url: https://dfberry.github.io/blog/2024-01-08-bicep-timestamp.md
custom_edit_url: null
sidebar_label: "2024.01-08 Bicep deployment timestamp"
title: "Add Azure Developer CLI deployment ID and UTC timestamp to Bicep files"
description: "Mark each deployment with a deployment ID and a UTC timestamp in order to track back from the Azure platform to your pipeline logs."
published: false
tags: 
  - Cloud-native
  - Deployment
  - Azure Developer CLI
  - Bicep
updated: 2024-01-08 00:00 PST
---

# Add Azure Developer CLI deployment ID and UTC timestamp to Azure resources during deployment

If you frequently deploy to Azure with Azure Developer CLI, either through your local computer or through an automated pipeline, you need a quick and obvious way to track back from the Azure resource to the pipeline or deployment. 

In order to mark the deployment resource itself, use the Azure Developer CLI's `deployment().name` and the Bicep `utcNow()` function to mark your deployments. The `deployment().name` is the name of your environment and a timestamp (expressed as a unix timestamp). 

To use these in your bicep file, a sample snippet of code is provided:

```bicep
param deploymentDateTimeUtc string = utcNow()
param deploymentName string = deployment().name
```

You can use these variables in your Bicep to add as tags to your resources.

```bicep
var tags = {
  'azd-env-name': environmentName
  'azd-deployment-id': deploymentName
  'azd-deployment-utc': deploymentDateTimeUtc
}
```

You can also export the variables as an environment variable to use in post-processing activities. 

```bicep
output DEPLOYMENT_NAME string = deploymentName
output DEPLOYMENT_DATETIME_UTC string = deploymentDateTimeUtc
```

If you are using Terraform instead of Bicep, with Azure Developer CLI, you still have access to the deployment name but the `utcNow()` is not available. 


