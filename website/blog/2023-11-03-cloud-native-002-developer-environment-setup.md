---
slug: /2023-11-03-cloud-native-002-developer-environment-setup
canonical_url: https://dfberry.github.io/blog/2023-11-03-cloud-native-002-developer-environment-setup
custom_edit_url: null
sidebar_label: "2023.11.03 Dev setup"
title: "Cloud-native journey - developer environment setup"
description: "Set up developer environment with Docker dev containers for Visual Studio Code."
published: false
tags: 
  - Cloud-native
  - Cloud
  - Beginner
  - Concept
  - AI assisted
  - todo
  - devex
  - setup
updated: 2023-11-03 00:00 PST
---
# Setting up environment

While this project is focused on cloud-native, I set up my environment the same way for every project, with GitHub repositories and [dev containers](https://containers.dev/). This allows me to move from my Windows laptop, to my Mac M1, and on to [GitHub Codespaces](https://github.com/features/codespaces) when demo-ing. 

[YouTube video](https://youtu.be/oL-K-x0mp3Y)

How do you ensure a consistent developer setup on your team? [Survey](https://bit.ly/3FL6FZ6)

## Visual Studio Code + dev containers

If you haven't heard of dev containers, let me welcome you to the club. I ❤️  dev containers. 

"A development container (or dev container for short) allows you to use a container as a full-featured development environment."
    
Visual Studio Code has taken this idea, realized how hard Docker can be for newbies, and sorted it out so it is generally painless for beginners. By the time you want to expand beyond the beginner environment, you are ready to ask the right questions. 

## Meet my good friend Docker 

Imagine you want to work in environments other than your current computer, and you don't want to deal with the time and complexity of installations and configurations. A general configuration will do. That's kind of the mentality that eventually (down a long dark road of VirtualBox and Vagrant) led to Docker. 

There are many (many!!!) versions of Docker images on [Docker Hub](https://hub.docker.com/) for you. This generally just means knowing an image's name. Some images are from manufacturers and some are from community contributions, with improvements and opinions about what the image should have. 

Visual Studio Code also has some images, meant specifically for development environments. The base image supports a lot of programming languages and tools so don't feel like you need to research images just yet. The basic image will do. 

1. Make sure Docker is running on your computer.
2. Make sure you have the [Visual Studio Code's Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) added.
3. Pick a [Dev containers quickstart](https://code.visualstudio.com/docs/devcontainers/containers#_picking-your-quick-start) in the Visual Studio Docs. 
4. My favorite is the [Open an existing folder in a container](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-an-existing-folder-in-a-container).
5. The steps ask you questions and you answer. Its straightforward and to the point. No cumbersome CLI with many switches to understand. 
6. It picks an image for you and asks you if you need anything else. So early in the project, you don't. You can always come back later and check a box if you need something. 

## Where's the AI?

This is pretty routine for me - I've been in Dockerland for many years so I haven't necessarily asked Copilot for help. However, you can always ask Copilot for advice or next steps. Make sure you have any relevant code in the main Visual Studio editor so Copilot can find the best answer. 

**Prompt**: I need to set up a Todo microservice. What Visual Studio Code dev container would you suggest? 

**GitHub Copilot**: For a JavaScript project using npm and React, I would suggest using a Node.js based dev container. Visual Studio Code has a predefined Node.js & TypeScript dev container that could be a good starting point.

Here's a basic setup:

1. Install the "Remote - Containers" extension in Visual Studio Code.
2. Open your project folder in VS Code.
3. Press F1 to open the command palette and run the "Remote-Containers: Add Development Container Configuration Files..." command.
4. Choose "Node.js & TypeScript" from the list.

**My perspective**: This isn't the entire response. Copilot immediately went into dense Docker file syntax. Visual Studio Code does a great job of keeping you out of that. 

## My dev container setup for Node.js and TypeScript

Here is how I set up my dev container: 

1. I brought the [dfberry/cloud-native-todo](https://github.com/dfberry/cloud-native-todo) down to my local computer. You should fork then clone it if you want to do the same.
2. Open the local repository in Visual Studio Code.
3. Docker is running and the [Visual Studio Code's Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) is installed. 
4. Reopen the folder in a **New Dev Container**.
5. That pops up a list of container configuration templates. 
6. I selected the one which uses my language of choice: **Node.js & TypeScript** and an appropriate version (18). If you choose a different template, your questions may be different. 
7. Visual Studio Code reopened with a new terminal prompt, which indicated I was in a dev container environment. 
8. I checked the Node.js version just to make sure: `node --version` and got back `v18.18.0`. My dev container works and all I did was answer questions. For a newbie to Docker and containerization, this is a huge time saver. You will eventually know Docker, but you don't need to know it on day 1. 

## Where is the new dev container? 

Visual Studio Code added a file to the repository found in the `.devcontainer` folder, named `devcontainer.json`. Open it up. 

You'll notice some settings are commented out, you'll eventually use them, but not just yet. 

For now, the most important parts are the `image` which is equivalent to your operating system and its additional installations, and the `customizations` property which is probably empty. 

Since I know I want to use Copilot as my pair programmer, I need to add that to the environment. In the Visual Studio extensions, search for `GitHub Copilot Chat` and select `Install in Dev Container`. This adds the appropriate setting to the `customizations` property.

One final setting I use a bit is the `postCreateCommand`. I usually add some npm packages for developer experience here but for now I just want to make sure the correct versions of the tools are in the environment. 

At this point, my `devcontainer.json` looks like: 

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node
{
	"name": "Node.js & TypeScript",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/typescript-node:1-18-bookworm",

	// Features to add to the dev container. More info: https://containers.dev/features.
	"features": {		
	},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	"postCreateCommand": "node -v && npm -v && git -v",
    
	// Configure tool-specific properties.
	"customizations": {
		"vscode": {
			"extensions": [
				"GitHub.copilot-chat"
			]
		}
	},

	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	"remoteUser": "root"
}
```

## Check the dev container into source control

Now that you have a working dev container, check it into source control and ask everyone on the team to try it out. This simple container should work on all hosts (`host` is the term for the machine running the container). More complicated dev containers may not work the first and take some tinkering. 

## Where's the Cloud-Native? 

You may be wondering why there isn't any cloud-native code yet. Don't worry, I'll get to it. Setting up a dev environment that works for every member of your team paves the way to a smooth development experience. Take the time to make sure the dev container is configured correctly and works for everyone. 

## Sample Code Repository

* [cloud-native-todo repo, 002-developer-environment-setup branch](https://github.com/dfberry/cloud-native-todo/tree/002-developer-environment-setup)

## Questions?

This is how I approach a consistent developer experience across a team. How do you do it? Let me know. [Survey](https://bit.ly/3FL6FZ6)