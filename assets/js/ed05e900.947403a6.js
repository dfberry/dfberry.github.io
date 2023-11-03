"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[9752],{3905:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>h});var n=o(7294);function a(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function r(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?r(Object(o),!0).forEach((function(t){a(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function s(e,t){if(null==e)return{};var o,n,a=function(e,t){if(null==e)return{};var o,n,a={},r=Object.keys(e);for(n=0;n<r.length;n++)o=r[n],t.indexOf(o)>=0||(a[o]=e[o]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)o=r[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(a[o]=e[o])}return a}var l=n.createContext({}),d=function(e){var t=n.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},u=function(e){var t=d(e.components);return n.createElement(l.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var o=e.components,a=e.mdxType,r=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=d(o),m=a,h=p["".concat(l,".").concat(m)]||p[m]||c[m]||r;return o?n.createElement(h,i(i({ref:t},u),{},{components:o})):n.createElement(h,i({ref:t},u))}));function h(e,t){var o=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=o.length,i=new Array(r);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,i[1]=s;for(var d=2;d<r;d++)i[d]=o[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,o)}m.displayName="MDXCreateElement"},4153:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>c,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var n=o(7462),a=(o(7294),o(3905));const r={slug:"/2023-11-03-cloud-native-002-developer-environment-setup",canonical_url:"https://dfberry.github.io/blog/2023-11-03-cloud-native-002-developer-environment-setup",custom_edit_url:null,sidebar_label:"2023.11.03 Dev setup",title:"Cloud-native journey - developer environment setup",description:"Set up developer environment with Docker dev containers for Visual Studio Code.",published:!1,tags:["Cloud-native","Cloud","Beginner","Concept","AI assisted","todo","devex","setup"],updated:"2023-11-03 00:00 PST"},i="Setting up environment",s={permalink:"/2023-11-03-cloud-native-002-developer-environment-setup",source:"@site/blog/2023-11-03-cloud-native-002-developer-environment-setup.md",title:"Cloud-native journey - developer environment setup",description:"Set up developer environment with Docker dev containers for Visual Studio Code.",date:"2023-11-03T00:00:00.000Z",formattedDate:"November 3, 2023",tags:[{label:"Cloud-native",permalink:"/tags/cloud-native"},{label:"Cloud",permalink:"/tags/cloud"},{label:"Beginner",permalink:"/tags/beginner"},{label:"Concept",permalink:"/tags/concept"},{label:"AI assisted",permalink:"/tags/ai-assisted"},{label:"todo",permalink:"/tags/todo"},{label:"devex",permalink:"/tags/devex"},{label:"setup",permalink:"/tags/setup"}],readingTime:5.835,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"/2023-11-03-cloud-native-002-developer-environment-setup",canonical_url:"https://dfberry.github.io/blog/2023-11-03-cloud-native-002-developer-environment-setup",custom_edit_url:null,sidebar_label:"2023.11.03 Dev setup",title:"Cloud-native journey - developer environment setup",description:"Set up developer environment with Docker dev containers for Visual Studio Code.",published:!1,tags:["Cloud-native","Cloud","Beginner","Concept","AI assisted","todo","devex","setup"],updated:"2023-11-03 00:00 PST"},nextItem:{title:"Cloud-native journey - introduction",permalink:"/2023-10-27-cloud-native-introduction"}},l={authorsImageUrls:[]},d=[{value:"Visual Studio Code + dev containers",id:"visual-studio-code--dev-containers",level:2},{value:"Meet my good friend Docker",id:"meet-my-good-friend-docker",level:2},{value:"Where&#39;s the AI?",id:"wheres-the-ai",level:2},{value:"My dev container setup for Node.js and TypeScript",id:"my-dev-container-setup-for-nodejs-and-typescript",level:2},{value:"Where is the new dev container?",id:"where-is-the-new-dev-container",level:2},{value:"Check the dev container into source control",id:"check-the-dev-container-into-source-control",level:2},{value:"Where&#39;s the Cloud-Native?",id:"wheres-the-cloud-native",level:2},{value:"Sample Code Repository",id:"sample-code-repository",level:2},{value:"Questions?",id:"questions",level:2}],u={toc:d},p="wrapper";function c(e){let{components:t,...o}=e;return(0,a.kt)(p,(0,n.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"While this project is focused on cloud-native, I set up my environment the same way with GitHub repositories and ",(0,a.kt)("a",{parentName:"p",href:"https://containers.dev/"},"dev containers"),". This allows me to move from my Windows laptop, to my Mac M1, and on to ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/features/codespaces"},"GitHub Codespaces")," when demo-ing. "),(0,a.kt)("h2",{id:"visual-studio-code--dev-containers"},"Visual Studio Code + dev containers"),(0,a.kt)("p",null,"If you haven't heard of dev containers, let me welcome you to the club. I \u2764\ufe0f  dev containers. "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"A development container (or dev container for short) allows you to use a container as a full-featured development environment.\n")),(0,a.kt)("p",null,"Visual Studio Code has taken this idea, realized how hard Docker can be for newbies, and sorted it out so it is generally painless for beginners. By the time you want to expand beyond the beginner environment, you are ready to ask the right questions. "),(0,a.kt)("h2",{id:"meet-my-good-friend-docker"},"Meet my good friend Docker"),(0,a.kt)("p",null,"Imagine you want to work in environments other than your current computer, and you don't want to deal with the time and complexity of installations and configurations. A general configuration will do. That's kind of the mentality that eventually (down a long dark road of VirtualBox and Vagrant) led to Docker. "),(0,a.kt)("p",null,"There are many (many!!!) versions of Docker images on ",(0,a.kt)("a",{parentName:"p",href:"https://hub.docker.com/"},"Docker Hub")," for you. This generally just means knowing an image's name. Some images are from manufacturers and some are from community contributions, with improvements and opinions about what the image should have. "),(0,a.kt)("p",null,"Visual Studio Code also has some images, meant specifically for development environments. The base image supports a lot of programming languages and tools so don't feel like you need to research images just yet. The basic image will do. "),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Make sure Docker is running on your computer."),(0,a.kt)("li",{parentName:"ol"},"Make sure you have the ",(0,a.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers"},"Visual Studio Code's Dev Containers extension")," added."),(0,a.kt)("li",{parentName:"ol"},"Pick a ",(0,a.kt)("a",{parentName:"li",href:"https://code.visualstudio.com/docs/devcontainers/containers#_picking-your-quick-start"},"Dev containers quickstart")," in the Visual Studio Docs. "),(0,a.kt)("li",{parentName:"ol"},"My favorite is the ",(0,a.kt)("a",{parentName:"li",href:"https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-an-existing-folder-in-a-container"},"Open an existing folder in a container"),"."),(0,a.kt)("li",{parentName:"ol"},"The steps ask you questions and you answer. Its straightforward and to the point. No cumbersome CLI with many switches to understand. "),(0,a.kt)("li",{parentName:"ol"},"It picks an image for you and asks you if you need anything else. So early in the project, you don't. You can always come back later and check a box if you need something. ")),(0,a.kt)("h2",{id:"wheres-the-ai"},"Where's the AI?"),(0,a.kt)("p",null,"This is pretty routine for me - I've been in Dockerland for many years so I haven't necessarily asked Copilot for help. However, you can always ask Copilot for advice or next steps. Make sure you have any relevant code in the main Visual Studio editor so Copilot can find the best answer. "),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Prompt"),": I need to set up a Todo microservice. What Visual Studio Code dev container would you suggest? "),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"GitHub Copilot"),": For a JavaScript project using npm and React, I would suggest using a Node.js based dev container. Visual Studio Code has a predefined Node.js & TypeScript dev container that could be a good starting point."),(0,a.kt)("p",null,"Here's a basic setup:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},'Install the "Remote - Containers" extension in Visual Studio Code.'),(0,a.kt)("li",{parentName:"ol"},"Open your project folder in VS Code."),(0,a.kt)("li",{parentName:"ol"},'Press F1 to open the command palette and run the "Remote-Containers: Add Development Container Configuration Files..." command.'),(0,a.kt)("li",{parentName:"ol"},'Choose "Node.js & TypeScript" from the list.')),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"My perspective"),": This isn't the entire response. Copilot immediately went into dense Docker file syntax. Visual Studio Code does a great job of keeping you out of that. "),(0,a.kt)("h2",{id:"my-dev-container-setup-for-nodejs-and-typescript"},"My dev container setup for Node.js and TypeScript"),(0,a.kt)("p",null,"Here is how I set up my dev container: "),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"I brought the ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/dfberry/cloud-native-todo"},"dfberry/cloud-native-todo")," down to my local computer. You should fork then clone it if you want to do the same."),(0,a.kt)("li",{parentName:"ol"},"Open the local repository in Visual Studio Code."),(0,a.kt)("li",{parentName:"ol"},"Docker is running and the ",(0,a.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers"},"Visual Studio Code's Dev Containers extension")," is installed. "),(0,a.kt)("li",{parentName:"ol"},"Reopen the folder in a ",(0,a.kt)("strong",{parentName:"li"},"New Dev Container"),"."),(0,a.kt)("li",{parentName:"ol"},"That pops up a list of container configuration templates. "),(0,a.kt)("li",{parentName:"ol"},"I selected the one which uses my language of choice: ",(0,a.kt)("strong",{parentName:"li"},"Node.js & TypeScript")," and an appropriate version (18). If you choose a different template, your questions may be different. "),(0,a.kt)("li",{parentName:"ol"},"Visual Studio Code reopened with a new terminal prompt, which indicated I was in a dev container environment. "),(0,a.kt)("li",{parentName:"ol"},"I checked the Node.js version just to make sure: ",(0,a.kt)("inlineCode",{parentName:"li"},"node --version")," and got back ",(0,a.kt)("inlineCode",{parentName:"li"},"v18.18.0"),". My dev container works and all I did was answer questions. For a newbie to Docker and containerization, this is a huge time saver. You will eventually know Docker, but you don't need to know it on day 1. ")),(0,a.kt)("h2",{id:"where-is-the-new-dev-container"},"Where is the new dev container?"),(0,a.kt)("p",null,"Visual Studio Code added a file to the repository found in the ",(0,a.kt)("inlineCode",{parentName:"p"},".devcontainer")," folder, named ",(0,a.kt)("inlineCode",{parentName:"p"},"devcontainer.json"),". Open it up. "),(0,a.kt)("p",null,"You'll notice some settings are commented out, you'll eventually use them, but not just yet. "),(0,a.kt)("p",null,"For now, the most important parts are the ",(0,a.kt)("inlineCode",{parentName:"p"},"image")," which is equivalent to your operating system and its additional installations, and the ",(0,a.kt)("inlineCode",{parentName:"p"},"customizations")," property which is probably empty. "),(0,a.kt)("p",null,"Since I know I want to use Copilot as my pair programmer, I need to add that to the environment. In the Visual Studio extensions, search for ",(0,a.kt)("inlineCode",{parentName:"p"},"GitHub Copilot Chat")," and select ",(0,a.kt)("inlineCode",{parentName:"p"},"Install in Dev Container"),". This adds the appropriate setting to the ",(0,a.kt)("inlineCode",{parentName:"p"},"customizations")," property."),(0,a.kt)("p",null,"Once final setting I use a bit is the ",(0,a.kt)("inlineCode",{parentName:"p"},"postCreateCommand"),". I usually add some npm packages for developer experience here but for now I just want to make sure the correct versions of the tools are in the environment. "),(0,a.kt)("p",null,"At this point, my ",(0,a.kt)("inlineCode",{parentName:"p"},"devcontainer.json")," looks like: "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'// For format details, see https://aka.ms/devcontainer.json. For config options, see the\n// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node\n{\n    "name": "Node.js & TypeScript",\n    // Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile\n    "image": "mcr.microsoft.com/devcontainers/typescript-node:1-18-bookworm",\n\n    // Features to add to the dev container. More info: https://containers.dev/features.\n    "features": {       \n    },\n\n    // Use \'forwardPorts\' to make a list of ports inside the container available locally.\n    // "forwardPorts": [],\n\n    // Use \'postCreateCommand\' to run commands after the container is created.\n    "postCreateCommand": "node -v && npm -v && git -v",\n    \n    // Configure tool-specific properties.\n    "customizations": {\n        "vscode": {\n            "extensions": [\n                "GitHub.copilot-chat"\n            ]\n        }\n    },\n\n    // Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.\n    "remoteUser": "root"\n}\n')),(0,a.kt)("h2",{id:"check-the-dev-container-into-source-control"},"Check the dev container into source control"),(0,a.kt)("p",null,"Now that you have a working dev container, check it into source control and ask everyone on the team to try it out. This simple container should work on all hosts (",(0,a.kt)("inlineCode",{parentName:"p"},"host")," is the term for the machine running the container). More complicated dev containers may not work. "),(0,a.kt)("h2",{id:"wheres-the-cloud-native"},"Where's the Cloud-Native?"),(0,a.kt)("p",null,"You may be wondering why there isn't any cloud-native code yet. Don't worry, I'll get to it. Setting up a dev environment that works for every member of your team paves the way to a smooth development experience. Take the time to make sure the dev container is configured correctly and works for everyone. "),(0,a.kt)("h2",{id:"sample-code-repository"},"Sample Code Repository"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/dfberry/cloud-native-todo/tree/002-developer-environment-setup"},"cloud-native-todo repo, 002-developer-environment-setup branch"))),(0,a.kt)("h2",{id:"questions"},"Questions?"),(0,a.kt)("p",null,"This is how I approach a consistent developer experience across a team. How do you do it? Let me know."))}c.isMDXComponent=!0}}]);