"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[9450],{6029:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"/2023-11-03-cloud-native-002-developer-environment-setup","metadata":{"permalink":"/2023-11-03-cloud-native-002-developer-environment-setup","source":"@site/blog/2023-11-03-cloud-native-002-developer-environment-setup.md","title":"Cloud-native journey - developer environment setup","description":"Set up developer environment with Docker dev containers for Visual Studio Code.","date":"2023-11-03T00:00:00.000Z","formattedDate":"November 3, 2023","tags":[{"label":"Cloud-native","permalink":"/tags/cloud-native"},{"label":"Cloud","permalink":"/tags/cloud"},{"label":"Beginner","permalink":"/tags/beginner"},{"label":"Concept","permalink":"/tags/concept"},{"label":"AI assisted","permalink":"/tags/ai-assisted"},{"label":"todo","permalink":"/tags/todo"},{"label":"devex","permalink":"/tags/devex"},{"label":"setup","permalink":"/tags/setup"}],"readingTime":5.835,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023-11-03-cloud-native-002-developer-environment-setup","canonical_url":"https://dfberry.github.io/blog/2023-11-03-cloud-native-002-developer-environment-setup","custom_edit_url":null,"sidebar_label":"2023.11.03 Dev setup","title":"Cloud-native journey - developer environment setup","description":"Set up developer environment with Docker dev containers for Visual Studio Code.","published":false,"tags":["Cloud-native","Cloud","Beginner","Concept","AI assisted","todo","devex","setup"],"updated":"2023-11-03 00:00 PST"},"nextItem":{"title":"Cloud-native journey - introduction","permalink":"/2023-10-27-cloud-native-introduction"}},"content":"While this project is focused on cloud-native, I set up my environment the same way with GitHub repositories and [dev containers](https://containers.dev/). This allows me to move from my Windows laptop, to my Mac M1, and on to [GitHub Codespaces](https://github.com/features/codespaces) when demo-ing. \\n\\n## Visual Studio Code + dev containers\\n\\nIf you haven\'t heard of dev containers, let me welcome you to the club. I \u2764\ufe0f  dev containers. \\n\\n    A development container (or dev container for short) allows you to use a container as a full-featured development environment.\\n    \\nVisual Studio Code has taken this idea, realized how hard Docker can be for newbies, and sorted it out so it is generally painless for beginners. By the time you want to expand beyond the beginner environment, you are ready to ask the right questions. \\n\\n## Meet my good friend Docker \\n\\nImagine you want to work in environments other than your current computer, and you don\'t want to deal with the time and complexity of installations and configurations. A general configuration will do. That\'s kind of the mentality that eventually (down a long dark road of VirtualBox and Vagrant) led to Docker. \\n\\nThere are many (many!!!) versions of Docker images on [Docker Hub](https://hub.docker.com/) for you. This generally just means knowing an image\'s name. Some images are from manufacturers and some are from community contributions, with improvements and opinions about what the image should have. \\n\\nVisual Studio Code also has some images, meant specifically for development environments. The base image supports a lot of programming languages and tools so don\'t feel like you need to research images just yet. The basic image will do. \\n\\n1. Make sure Docker is running on your computer.\\n2. Make sure you have the [Visual Studio Code\'s Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) added.\\n3. Pick a [Dev containers quickstart](https://code.visualstudio.com/docs/devcontainers/containers#_picking-your-quick-start) in the Visual Studio Docs. \\n4. My favorite is the [Open an existing folder in a container](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-an-existing-folder-in-a-container).\\n5. The steps ask you questions and you answer. Its straightforward and to the point. No cumbersome CLI with many switches to understand. \\n6. It picks an image for you and asks you if you need anything else. So early in the project, you don\'t. You can always come back later and check a box if you need something. \\n\\n## Where\'s the AI?\\n\\nThis is pretty routine for me - I\'ve been in Dockerland for many years so I haven\'t necessarily asked Copilot for help. However, you can always ask Copilot for advice or next steps. Make sure you have any relevant code in the main Visual Studio editor so Copilot can find the best answer. \\n\\n**Prompt**: I need to set up a Todo microservice. What Visual Studio Code dev container would you suggest? \\n\\n**GitHub Copilot**: For a JavaScript project using npm and React, I would suggest using a Node.js based dev container. Visual Studio Code has a predefined Node.js & TypeScript dev container that could be a good starting point.\\n\\nHere\'s a basic setup:\\n\\n1. Install the \\"Remote - Containers\\" extension in Visual Studio Code.\\n2. Open your project folder in VS Code.\\n3. Press F1 to open the command palette and run the \\"Remote-Containers: Add Development Container Configuration Files...\\" command.\\n4. Choose \\"Node.js & TypeScript\\" from the list.\\n\\n**My perspective**: This isn\'t the entire response. Copilot immediately went into dense Docker file syntax. Visual Studio Code does a great job of keeping you out of that. \\n\\n## My dev container setup for Node.js and TypeScript\\n\\nHere is how I set up my dev container: \\n\\n1. I brought the [dfberry/cloud-native-todo](https://github.com/dfberry/cloud-native-todo) down to my local computer. You should fork then clone it if you want to do the same.\\n2. Open the local repository in Visual Studio Code.\\n3. Docker is running and the [Visual Studio Code\'s Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) is installed. \\n4. Reopen the folder in a **New Dev Container**.\\n5. That pops up a list of container configuration templates. \\n6. I selected the one which uses my language of choice: **Node.js & TypeScript** and an appropriate version (18). If you choose a different template, your questions may be different. \\n7. Visual Studio Code reopened with a new terminal prompt, which indicated I was in a dev container environment. \\n8. I checked the Node.js version just to make sure: `node --version` and got back `v18.18.0`. My dev container works and all I did was answer questions. For a newbie to Docker and containerization, this is a huge time saver. You will eventually know Docker, but you don\'t need to know it on day 1. \\n\\n## Where is the new dev container? \\n\\nVisual Studio Code added a file to the repository found in the `.devcontainer` folder, named `devcontainer.json`. Open it up. \\n\\nYou\'ll notice some settings are commented out, you\'ll eventually use them, but not just yet. \\n\\nFor now, the most important parts are the `image` which is equivalent to your operating system and its additional installations, and the `customizations` property which is probably empty. \\n\\nSince I know I want to use Copilot as my pair programmer, I need to add that to the environment. In the Visual Studio extensions, search for `GitHub Copilot Chat` and select `Install in Dev Container`. This adds the appropriate setting to the `customizations` property.\\n\\nOnce final setting I use a bit is the `postCreateCommand`. I usually add some npm packages for developer experience here but for now I just want to make sure the correct versions of the tools are in the environment. \\n\\nAt this point, my `devcontainer.json` looks like: \\n\\n```json\\n// For format details, see https://aka.ms/devcontainer.json. For config options, see the\\n// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node\\n{\\n\\t\\"name\\": \\"Node.js & TypeScript\\",\\n\\t// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile\\n\\t\\"image\\": \\"mcr.microsoft.com/devcontainers/typescript-node:1-18-bookworm\\",\\n\\n\\t// Features to add to the dev container. More info: https://containers.dev/features.\\n\\t\\"features\\": {\\t\\t\\n\\t},\\n\\n\\t// Use \'forwardPorts\' to make a list of ports inside the container available locally.\\n\\t// \\"forwardPorts\\": [],\\n\\n\\t// Use \'postCreateCommand\' to run commands after the container is created.\\n\\t\\"postCreateCommand\\": \\"node -v && npm -v && git -v\\",\\n    \\n\\t// Configure tool-specific properties.\\n\\t\\"customizations\\": {\\n\\t\\t\\"vscode\\": {\\n\\t\\t\\t\\"extensions\\": [\\n\\t\\t\\t\\t\\"GitHub.copilot-chat\\"\\n\\t\\t\\t]\\n\\t\\t}\\n\\t},\\n\\n\\t// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.\\n\\t\\"remoteUser\\": \\"root\\"\\n}\\n```\\n\\n## Check the dev container into source control\\n\\nNow that you have a working dev container, check it into source control and ask everyone on the team to try it out. This simple container should work on all hosts (`host` is the term for the machine running the container). More complicated dev containers may not work. \\n\\n## Where\'s the Cloud-Native? \\n\\nYou may be wondering why there isn\'t any cloud-native code yet. Don\'t worry, I\'ll get to it. Setting up a dev environment that works for every member of your team paves the way to a smooth development experience. Take the time to make sure the dev container is configured correctly and works for everyone. \\n\\n## Sample Code Repository\\n\\n* [cloud-native-todo repo, 002-developer-environment-setup branch](https://github.com/dfberry/cloud-native-todo/tree/002-developer-environment-setup)\\n\\n## Questions?\\n\\nThis is how I approach a consistent developer experience across a team. How do you do it? Let me know."},{"id":"/2023-10-27-cloud-native-introduction","metadata":{"permalink":"/2023-10-27-cloud-native-introduction","source":"@site/blog/2023-10-27-cloud-native-001.md","title":"Cloud-native journey - introduction","description":"Learn what cloud-native is and build a roadmap to implement an application for cloud-native architectures.","date":"2023-10-27T00:00:00.000Z","formattedDate":"October 27, 2023","tags":[{"label":"Cloud-native","permalink":"/tags/cloud-native"},{"label":"Cloud","permalink":"/tags/cloud"},{"label":"Beginner","permalink":"/tags/beginner"},{"label":"Concept","permalink":"/tags/concept"},{"label":"AI assisted","permalink":"/tags/ai-assisted"},{"label":"todo","permalink":"/tags/todo"}],"readingTime":4.165,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023-10-27-cloud-native-introduction","canonical_url":"https://dfberry.github.io/blog/2023-10-27-cloud-native-introduction","custom_edit_url":null,"sidebar_label":"2023.10.27 Cloud-native journey - introduction","title":"Cloud-native journey - introduction","description":"Learn what cloud-native is and build a roadmap to implement an application for cloud-native architectures.","published":true,"tags":["Cloud-native","Cloud","Beginner","Concept","AI assisted","todo"],"updated":"2023-10-27 00:00 PST"},"prevItem":{"title":"Cloud-native journey - developer environment setup","permalink":"/2023-11-03-cloud-native-002-developer-environment-setup"},"nextItem":{"title":"Azure OpenAI Conversational CLI with TypeScript","permalink":"/2023-06-04-azure-openai-cli-with-typescript"}},"content":"I\'ve been working in the **Azure cloud** for a few years now. The term `cloud-native` gets used a lot. In an effort to bridge the gap between Azure cloud and cloud-native, I\'m investing some time in learning cloud-native approaches to building apps. \\n\\nAlong the way, I\'ll use and _experiment_ with practices and tools to expedite the end result. Join me along the way, and let me know how you would have proceeded. \\n\\nTo start with, my tool set includes:\\n\\n* [Visual Studio Code](https://code.visualstudio.com/).\\n* [GitHub](https://github.com/) & [GitHub Copilot](https://github.com/features/copilot) (AI pair programming and rubber duck). Copilot provides context-aware answers within Visual Studio code. \\n\\nThis blog will capture the highlights. For the complete picture, head over to the GitHub repo: [Cloud native repo](https://bit.ly/40aclp8).\\n\\n## What is cloud-native?\\n\\n**Prompt**: What is cloud-native?\\n\\n**GitHub Copilot**: Cloud-native is an approach to building and running applications that takes full advantage of the cloud computing delivery model. It is characterized by the use of containerized applications, microservices architecture, and dynamic orchestration, all of which are designed to be highly scalable, resilient, and agile. The goal of cloud-native is to enable organizations to build and deploy applications faster, with greater flexibility and reliability, while also reducing costs.\\n  \\n## How do I begin? \\n\\n**Prompt**: Where do I start on a new project for cloud-native?\\n\\n**GitHub Copilot**: When starting a new project for cloud-native, there are several steps you can take to ensure that your application is designed for scalability, resilience, and agility. Here are some general steps you can follow:\\n\\n  1. Choose a cloud platform: Select a cloud platform that meets your needs and provides the services and features you require. Some popular cloud platforms include Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).\\n\\n  2. Define your architecture: Define the architecture of your application, including the components, services, and data stores that you will use. Consider using microservices architecture, which can help you build more scalable and resilient applications.\\n\\n  3. Use containers: Use containers to package your application and its dependencies, making it easier to deploy and manage your application across different environments.\\n\\n  4. Use container orchestration: Use a container orchestration platform like Kubernetes to manage your containers and ensure that your application is highly available and scalable.\\n\\n  5. Use automation: Use automation tools like Ansible, Terraform, or CloudFormation to automate the deployment and management of your application.\\n\\n  6. Use monitoring and logging: Use monitoring and logging tools to track the performance and health of your application, and to identify and troubleshoot issues.\\n\\n  7. Use security best practices: Follow security best practices to ensure that your application is secure and protected from attacks.\\n\\nBy following these steps, you can build a cloud-native application that is designed for scalability, resilience, and agility, and that can provide a better experience for your users.\\n\\n## First cloud-native project? \\n\\n**Prompt**: What is a simple project I can use for my first cloud-native project?\\n\\n**GitHub Copilot**: A simple project that you can use for your first cloud-native project is a web application that allows users to create and manage to-do lists. This project can be built using a microservices architecture, with separate services for user authentication, to-do list management, and data storage.\\n\\n**My perspective** \\n\\nA todo list is perfect, there are plenty of examples: \\n\\n* [Todo backend](https://todobackend.com/)\\n* [TodoMVC](https://todomvc.com/)\\n* [Swagger API spec](https://github.com/nickfun/learning-guardrail/blob/master/server.yaml)\\n* [Postman collection of tests](https://github.com/nickfun/learning-guardrail/blob/master/postman-collection.json)\\n\\n## Architecture\\n\\n**Prompt**: Can you suggest a beginning architecture of a todo app which is cloud-native?\\n\\n**GitHub Copilot**: here\'s a beginning architecture for a cloud-native to-do app:\\n\\n1. Frontend: A web or mobile app that allows users to create and manage to-do lists. The frontend can be built using a framework like React, Angular, or Vue.js.\\n\\n2. API Gateway: An API gateway that serves as the entry point for the application and routes requests to the appropriate microservices. The API gateway can be built using a tool like Kong, Istio, or AWS API Gateway.\\n\\n3. Authentication Service: A microservice that handles user authentication and authorization. This service can be built using a tool like Auth0, Okta, or AWS Cognito.\\n\\n4. To-Do Service: A microservice that handles the creation, retrieval, updating, and deletion of to-do items. This service can be built using a framework like Express.js, Spring Boot, or Flask.\\n\\n5. Database: A database that stores the to-do items and user information. The database can be a SQL or NoSQL database like MySQL, PostgreSQL, MongoDB, or DynamoDB.\\n\\n6. Container Orchestration: A container orchestration platform like Kubernetes that manages the deployment and scaling of the microservices. Kubernetes can be used to deploy the microservices as Docker containers and manage their lifecycle.\\n\\n7. Monitoring and Logging: A monitoring and logging solution like Prometheus, Grafana, or ELK Stack that provides visibility into the performance and health of the application.\\n\\nBy following this architecture, you can build a cloud-native to-do app that is designed for scalability, resilience, and agility, and that can provide a better experience for your users.\\n\\n\\n## More resources\\n\\nRead the full conversation: [Cloud native repo - introduction](https://bit.ly/40aclp8)."},{"id":"/2023-06-04-azure-openai-cli-with-typescript","metadata":{"permalink":"/2023-06-04-azure-openai-cli-with-typescript","source":"@site/blog/2023-06-04-openai-cli-with-typescript.md","title":"Azure OpenAI Conversational CLI with TypeScript","description":"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript","date":"2023-06-04T00:00:00.000Z","formattedDate":"June 4, 2023","tags":[{"label":"Azure","permalink":"/tags/azure"},{"label":"OpenAI","permalink":"/tags/open-ai"},{"label":"TypeScript","permalink":"/tags/type-script"},{"label":"Sample","permalink":"/tags/sample"}],"readingTime":5.84,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023-06-04-azure-openai-cli-with-typescript","canonical_url":"https://dfberry.github.io/blog/2023-06-04-azure-openai-cli-with-typescript","custom_edit_url":null,"sidebar_label":"2023.06.04 Azure OpenAI CLI (TS)","title":"Azure OpenAI Conversational CLI with TypeScript","description":"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript","published":false,"tags":["Azure","OpenAI","TypeScript","Sample"],"updated":"2023-06-04 05:00 PST"},"prevItem":{"title":"Cloud-native journey - introduction","permalink":"/2023-10-27-cloud-native-introduction"},"nextItem":{"title":"Azure Cloud Shell Frequently asked questions","permalink":"/2023-02-09-azure-cloud-shell-faq"}},"content":"[Azure OpenAI Service](https://learn.microsoft.com/azure/cognitive-services/openai) provides access to OpenAI\'s powerful language models including the GPT-3, Codex and Embeddings model series. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. \\n\\n## When to use Azure OpenAI\\n\\nUse this service when you want to use ChapGPT or OpenAI functionality with _your own data and prompts_ which need to remain **private and secure**.\\n\\n## How to use Azure OpenAI programmatically\\n\\nAs with most other Azure services, you can use the REST APIs or language-based SDKs. I wrote my integration code with the REST APIs then converted to the JavaScript/TypeScript SDK, [@azure/openai](https://www.npmjs.com/package/openai), when it released. \\n\\n**Usage tip**: \\n\\n* Use the **REST APIs** when you want to stay on the bleeding edge or use a languages not supported with the SDKs. \\n* Use the SDK when you need the more common integration scenarios and not at the bleeding edge of implementation. \\n\\n## Conversational loops\\n\\nConversational loops like those presented with ChapGPT, OpenAI, and Azure OpenAI are commonly browser-based chats provided by:\\n\\n* [Microsoft Bot Framework](https://github.com/microsoft/botframework-sdk) - .NET and JavaScript/TypeScript\\n* [Power Virtual Agents](https://learn.microsoft.com/en-us/power-virtual-agents/fundamentals-what-is-power-virtual-agents) - Enterprise - No code required\\n\\n## Build a conversational CLI\\n\\nThis conversational CLI interacts with your prompts with a small code-base. This allows you to understand the Azure OpenAI configurations, playing with the knobs and dials, while using the conversational loop and Azure OpenAI SDK to interact with it.\\n\\nRemember to store and pass along the conversation so Azure OpenAI has the context of the full conversation.\\n\\n## Azure OpenAI conversation manager class with TypeScript\\n\\nThis conversation manager class is a starting point to your first Azure OpenAI app. After you [create your Azure OpenAI resource](https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal), you need to pass in your Azure OpenAI endpoint (URL), key, and deployment name to use this class. \\n\\n```typescript\\nimport {\\n  OpenAIClient,\\n  AzureKeyCredential,\\n  GetChatCompletionsOptions\\n} from \'@azure/openai\';\\nimport { DefaultAzureCredential } from \'@azure/identity\';\\n\\nimport {\\n  DebugOptions,\\n  OpenAiAppConfig,\\n  OpenAiConversation,\\n  OpenAiRequest,\\n  OpenAiRequestConfig,\\n  OpenAiResponse,\\n  OpenAiSuccessResponse\\n} from \'./models\';\\nimport { ChatCompletions } from \'@azure/openai\';\\n\\n// export types a client needs\\nexport {\\n  DebugOptions,\\n  OpenAiAppConfig,\\n  OpenAiRequest,\\n  OpenAiRequestConfig,\\n  OpenAiResponse,\\n  OpenAiSuccessResponse\\n} from \'./models\';\\n\\nexport default class OpenAIConversationClient {\\n  #appConfig: OpenAiAppConfig;\\n  #conversationConfig: OpenAiConversation;\\n  #requestConfig: GetChatCompletionsOptions = {\\n    maxTokens: 800,\\n    temperature: 0.9,\\n    topP: 1,\\n    frequencyPenalty: 0,\\n    presencePenalty: 0\\n  };\\n\\n  #openAiClient: OpenAIClient;\\n\\n  constructor(\\n    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,\\n    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,\\n    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string\\n  ) {\\n    this.#appConfig = {\\n      endpoint,\\n      apiKey,\\n      deployment\\n    };\\n\\n    this.#conversationConfig = {\\n      messages: []\\n    };\\n\\n    if (apiKey && endpoint) {\\n      this.#openAiClient = new OpenAIClient(\\n        endpoint,\\n        new AzureKeyCredential(apiKey)\\n      );\\n    } else {\\n      this.#openAiClient = new OpenAIClient(\\n        endpoint,\\n        new DefaultAzureCredential()\\n      );\\n    }\\n  }\\n\\n  async OpenAiConversationStep(\\n    userText: string,\\n    appOptions?: OpenAiAppConfig | undefined,\\n    requestOptions?: OpenAiRequestConfig | undefined,\\n    debugOptions?: DebugOptions | undefined\\n  ): Promise<OpenAiResponse> {\\n    try {\\n      // REQUEST\\n      const request: OpenAiRequest = {\\n        conversation: {\\n          messages: [\\n            // add all previous messages so the conversation\\n            // has context\\n            ...this.#conversationConfig.messages,\\n            // add the latest user message\\n            {\\n              role: \'user\',\\n              content: userText\\n            }\\n          ]\\n        },\\n        appConfig: appOptions ? appOptions : this.#appConfig,\\n        requestConfig: requestOptions ? requestOptions : this.#requestConfig\\n      };\\n      if (debugOptions?.debug) {\\n        debugOptions.logger(`LIB OpenAi request: ${JSON.stringify(request)}`);\\n      }\\n\\n      // RESPONSE\\n      const response = await this.OpenAiRequest(request);\\n      if (debugOptions?.debug) {\\n        debugOptions.logger(`LIB OpenAi response: ${JSON.stringify(response)}`);\\n      }\\n      return response;\\n    } catch (error: unknown) {\\n\\n      if (error instanceof Error) {\\n        return {\\n          status: \'499\',\\n          error: {\\n            message: error.message,\\n            stack: error.stack\\n          },\\n          data: undefined\\n        };\\n      } else {\\n        return {\\n          status: \'498\',\\n          error: {\\n            message: JSON.stringify(error)\\n          },\\n          data: undefined\\n        };\\n      }\\n    }\\n  }\\n  async OpenAiRequest(request: OpenAiRequest): Promise<OpenAiResponse> {\\n    if (\\n      !request.appConfig.apiKey ||\\n      !request.appConfig.deployment ||\\n      !request.appConfig.endpoint\\n    ) {\\n      return {\\n        data: undefined,\\n        status: \'400\',\\n        error: {\\n          message: \'OpenAiRequest: Missing API Key or Deployment\'\\n        }\\n      };\\n    }\\n\\n    const chatCompletions: ChatCompletions =\\n      await this.#openAiClient.getChatCompletions(\\n        request.appConfig.deployment,\\n        request.conversation.messages,\\n        request.requestConfig\\n      );\\n\\n    return {\\n      data: chatCompletions,\\n      status: \'200\',\\n      error: undefined\\n    };\\n  }\\n}\\n```\\n\\n[Full sample code for Azure OpenAI library](https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/lib-openai/src/index.ts)\\n\\n\\n## Conversational loop\\n\\nNow that the Azure OpenAI library is built, you need a conversational loop. I used [commander](https://www.npmjs.com/package/commander) with [readline\'s question](https://nodejs.org/api/readline.html#rlquestionquery-options) to build the CLI. \\n\\n```typescript\\nimport { Command } from \'commander\';\\nimport * as dotenv from \'dotenv\';\\nimport { writeFileSync } from \'fs\';\\nimport { checkRequiredEnvParams } from \'./settings\';\\nimport OpenAIConversationClient, {\\n  OpenAiResponse,\\n  DebugOptions\\n} from \'@azure-typescript-e2e-apps/lib-openai\';\\nimport chalk from \'chalk\';\\n\\nimport readline from \'node:readline/promises\';\\n\\n// CLI settings\\nlet debug = false;\\nlet debugFile = \'debug.log\';\\nlet envFile = \'.env\';\\n\\n// CLI client\\nconst program: Command = new Command();\\n\\n// ReadLine client\\nconst readlineClient = readline.createInterface({\\n  input: process.stdin,\\n  output: process.stdout\\n});\\n\\nfunction printf(text: string) {\\n  printd(text);\\n  process.stdout.write(`${text}\\\\n`);\\n}\\nfunction printd(text: string) {\\n  if (debug) {\\n    writeFileSync(debugFile, `${new Date().toISOString()}:${text}\\\\n`, {\\n      flag: \'a\'\\n    });\\n  }\\n}\\n\\nprogram\\n  .name(\'conversation\')\\n  .description(\\n    `A conversation loop\\n\\n        Examples: \\n        index.js -d \'myfile.txt\' -e \'.env\'        Start convo with text from file with settings from .env file\\n    `\\n  )\\n  .option(\\n    \'-d, --dataFile <filename>\',\\n    \'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.\'\\n  )\\n  .option(\\n    \'-e, --envFile <filename>. Default: .env\',\\n    \'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.\'\\n  )\\n  .option(\'-l, --log <filename>. Default: debug.log\', \'Log everything to file\')\\n  .option(\'-x, --exit\', \'Exit conversation loop\')\\n  .helpOption(\'-h, --help\', \'Display help\');\\n\\nprogram.description(\'Start a conversation\').action(async (options) => {\\n  // Prepare: Get debug logger\\n  if (options.log) {\\n    debug = true;\\n    debugFile = options?.log || \'debug.log\';\\n\\n    // reset debug file\\n    writeFileSync(debugFile, ``);\\n  }\\n  printd(`CLI Options: ${JSON.stringify(options)}`);\\n\\n  // Prepare: Get OpenAi settings and create client\\n  if (options.envFile) {\\n    envFile = options.envFile;\\n  }\\n  dotenv.config(options.envFile ? { path: options.envFile } : { path: \'.env\' });\\n  printd(`CLI Env file: ${envFile}`);\\n  printd(`CLI Env vars: ${JSON.stringify(process.env)}`);\\n\\n  // Prepare: Check required environment variables\\n  const errors = checkRequiredEnvParams(process.env);\\n  if (errors.length > 0) {\\n    const failures = `${errors.join(\'\\\\n\')}`;\\n    printf(chalk.red(`CLI Required env vars failed: ${failures}`));\\n  } else {\\n    printd(`CLI Required env vars success`);\\n  }\\n\\n  // Prepare: OpenAi Client\\n  const openAiClient: OpenAIConversationClient = new OpenAIConversationClient(\\n    process.env.AZURE_OPENAI_ENDPOINT as string,\\n    process.env.AZURE_OPENAI_API_KEY as string,\\n    process.env.AZURE_OPENAI_DEPLOYMENT as string\\n  );\\n  printd(`CLI OpenAi client created`);\\n\\n  // Prepare: Start conversation\\n  printf(chalk.green(\'Welcome to the OpenAI conversation!\'));\\n\\n  /* eslint-disable-next-line no-constant-condition */\\n  while (true) {\\n    const yourQuestion: string = await readlineClient.question(\\n      chalk.green(\'What would you like to ask? (`exit` to stop)\\\\n>\')\\n    );\\n    // Print response\\n    printf(`\\\\n${chalk.green.bold(`YOU`)}: ${chalk.gray(yourQuestion)}`);\\n\\n    // Exit\\n    if (yourQuestion.toLowerCase() === \'exit\') {\\n      printf(chalk.green(\'Goodbye!\'));\\n      process.exit();\\n    }\\n\\n    await getAnswer(yourQuestion, openAiClient);\\n  }\\n});\\n\\nasync function getAnswer(\\n  question: string,\\n  openAiClient: OpenAIConversationClient\\n): Promise<void> {\\n  // Request\\n  const appOptions = undefined;\\n  const requestOptions = undefined;\\n  const debugOptions: DebugOptions = {\\n    debug: debug,\\n    logger: printd\\n  };\\n\\n  const { status, data, error }: OpenAiResponse =\\n    await openAiClient.OpenAiConversationStep(\\n      question,\\n      appOptions,\\n      requestOptions,\\n      debugOptions\\n    );\\n\\n  // Response\\n  printd(`CLI OpenAi response status: ${status}`);\\n  printd(`CLI OpenAi response data: ${JSON.stringify(data)}`);\\n  printd(`CLI OpenAi response error: ${error}`);\\n\\n  // Error\\n  if (Number(status) > 299) {\\n    printf(\\n      chalk.red(\\n        `Conversation step request error: ${error?.message || \'unknown\'}`\\n      )\\n    );\\n    process.exit();\\n  }\\n\\n  // Answer\\n  if (data?.choices[0]?.message) {\\n    printf(\\n      `\\\\n\\\\n${chalk.green.bold(`ASSISTANT`)}:\\\\n\\\\n${\\n        data?.choices[0].message.content\\n      }\\\\n\\\\n`\\n    );\\n    return;\\n  }\\n\\n  // No Answer\\n  printf(`\\\\n\\\\n${chalk.green.bold(`ASSISTANT`)}:\\\\n\\\\nNo response provided.\\\\n\\\\n`);\\n  return;\\n}\\n\\nprogram.parse(process.argv);\\n```\\n\\n[Full sample code for Conversational loop](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/cli-openai)\\n\\n## Learn more\\n\\nLearn more about how to [create this Conversational CLI](https://learn.microsoft.com/azure/developer/javascript/openai-cli)."},{"id":"/2023-02-09-azure-cloud-shell-faq","metadata":{"permalink":"/2023-02-09-azure-cloud-shell-faq","source":"@site/blog/2023-02-09-azure-cloud-shell-faq.md","title":"Azure Cloud Shell Frequently asked questions","description":"Things I wish I knew about Azure CLI and Azure Cloud shell","date":"2023-02-09T00:00:00.000Z","formattedDate":"February 9, 2023","tags":[{"label":"Azure","permalink":"/tags/azure"},{"label":"Azure CLI","permalink":"/tags/azure-cli"},{"label":"Azure Cloud Shell","permalink":"/tags/azure-cloud-shell"},{"label":"Tips","permalink":"/tags/tips"}],"readingTime":0.92,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023-02-09-azure-cloud-shell-faq","canonical_url":"https://dfberry.github.io/blog/2023-02-09-azure-cloud-shell-faq","custom_edit_url":null,"sidebar_label":"2023.02.09 Azure Cloud Shell FAQ","title":"Azure Cloud Shell Frequently asked questions","description":"Things I wish I knew about Azure CLI and Azure Cloud shell","published":true,"tags":["Azure","Azure CLI","Azure Cloud Shell","Tips"],"updated":"2023-02-09 05:00 PST"},"prevItem":{"title":"Azure OpenAI Conversational CLI with TypeScript","permalink":"/2023-06-04-azure-openai-cli-with-typescript"},"nextItem":{"title":"TypeScript type guard for empty JSON object","permalink":"/2023.02.04-github-graphql-commit-history-with-typescript"}},"content":"1. You don\'t need to install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/what-is-azure-cli) in your local dev environment. \\n\\n    The Cloud Shell (Azure CLI in a browser) is available from the [Azure portal](https://portal.azure.com). \\n\\n    ![Screenshot showing Azure Cloud Shell is available from top navigation bar in Azure portal. ](./media/2023-02-09/azure-cloud-shell-button.png)\\n\\n\\n2. The cloud shell is sticky. Because the Cloud shell uses Azure Storage (File storage), when you end your sessions then return, [your files are still there](https://learn.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage). \\n\\n    * Want to quickly work with a GitHub repo? No problem, **git** is available. \\n\\n\\n3. Because you use it from the portal, you are already authenticated. No need for [az login](https://learn.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login).\\n4. Many CLI tools are already installed for you.\\n    * Azure CLI\\n    * git, zip, jq\\n    * code (not exactly Visual Studio Code, but a good IDE)\\n    * nano, vim\\n    * Node.js, npm\\n    * Java and Maven\\n    * Python\\n    * .NET Core\\n    * PowerShell\\n    * Go (Golang)\\n    * [Azure Functions CLI](https://learn.microsoft.com/azure/azure-functions/functions-run-local)\\n    * Docker CLI, Kubectl, Helm, Terraform, Ansible\\n    * [Office 365 CLI](https://pnp.github.io/cli-microsoft365/)\\n    * MySQL client\\n    * PostgreSql client\\n    * SQL cli\\n\\n5. Create [bash scripts with Azure CLI commands](https://learn.microsoft.com/azure/cloud-shell/quickstart) to manage your Azure resources."},{"id":"/2023.02.04-github-graphql-commit-history-with-typescript","metadata":{"permalink":"/2023.02.04-github-graphql-commit-history-with-typescript","source":"@site/blog/2023-02-04-blog.md","title":"TypeScript type guard for empty JSON object","description":"Safely type through an object\'s type which includes an empty JSON object.","date":"2023-02-04T00:00:00.000Z","formattedDate":"February 4, 2023","tags":[{"label":"TypeScript","permalink":"/tags/type-script"},{"label":"type guard","permalink":"/tags/type-guard"},{"label":"GitHub","permalink":"/tags/git-hub"},{"label":"GraphQL","permalink":"/tags/graph-ql"}],"readingTime":0.91,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023.02.04-github-graphql-commit-history-with-typescript","canonical_url":"https://dfberry.github.io/blog/2023.02.04-github-graphql-commit-history-with-typescript","custom_edit_url":null,"sidebar_label":"2023.02.04 TS + GitHub GraphQL Commit history","title":"TypeScript type guard for empty JSON object","description":"Safely type through an object\'s type which includes an empty JSON object.","published":true,"tags":["TypeScript","type guard","GitHub","GraphQL"],"updated":"2023-02-04 06:21 PST"},"prevItem":{"title":"Azure Cloud Shell Frequently asked questions","permalink":"/2023-02-09-azure-cloud-shell-faq"}},"content":"A commit history for a repo on GitHub can be optional, if there are no commits yet. The TypeScript SDK created by the [GraphQL CodeGen](https://www.npmjs.com/package/@graphql-codegen/cli) represents this optionality is represented with an empty object, null, or undefined. If a commit is present, its represented as a nested JSON object with more optional parameters.\\n\\n```typescript\\ndeclare var x:\\n  {} |\\n  null |\\n  undefined |\\n  {\'a\':\\n      { ... more optional params }\\n  }\\n```\\n\\nThe empty JSON object, `{}`, is tricky in JavaScript. There are several examples of testing for an empty object but they generally don\'t work as type guards in TypeScript for type safety.\\n\\n## Type guard with `in`\\n\\nAfter asking on [StackOverlow](https://stackoverflow.com/questions/75278401/how-do-i-get-type-target-history-from-github-graphql-on-defaultbranchref) and getting no response, I reached out to my local TypeScript expert for help.\\n\\nHe helped boil the issue down to the type shown in the previous code block with a type guard using the `in` keyword:\\n\\n```typescript\\nif (x !== null && x !== undefined && \\"a\\" in x) {\\n  // no null\\n  // not undefined\\n  // x has property \'a\' so it isn\'t empty\\n  console.log(x.a);\\n}\\n```"}]}')}}]);