"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[9450],{6029:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"/2023-06-04-azure-openai-cli-with-typescript","metadata":{"permalink":"/2023-06-04-azure-openai-cli-with-typescript","source":"@site/blog/2023-06-04-openai-cli-with-typescript.md","title":"Azure OpenAI Conversational CLI with TypeScript","description":"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript","date":"2023-06-04T00:00:00.000Z","formattedDate":"June 4, 2023","tags":[{"label":"Azure","permalink":"/tags/azure"},{"label":"OpenAI","permalink":"/tags/open-ai"},{"label":"TypeScript","permalink":"/tags/type-script"},{"label":"Sample","permalink":"/tags/sample"}],"readingTime":5.84,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023-06-04-azure-openai-cli-with-typescript","canonical_url":"https://dfberry.github.io/blog/2023-06-04-azure-openai-cli-with-typescript","custom_edit_url":null,"sidebar_label":"2023.06.04 Azure OpenAI CLI (TS)","title":"Azure OpenAI Conversational CLI with TypeScript","description":"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript","published":false,"tags":["Azure","OpenAI","TypeScript","Sample"],"updated":"2023-06-04 05:00 PST"},"nextItem":{"title":"Azure Cloud Shell Frequently asked questions","permalink":"/2023-02-09-azure-cloud-shell-faq"}},"content":"[Azure OpenAI Service](https://learn.microsoft.com/azure/cognitive-services/openai) provides access to OpenAI\'s powerful language models including the GPT-3, Codex and Embeddings model series. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. \\n\\n## When to use Azure OpenAI\\n\\nUse this service when you want to use ChapGPT or OpenAI functionality with _your own data and prompts_ which need to remain **private and secure**.\\n\\n## How to use Azure OpenAI programmatically\\n\\nAs with most other Azure services, you can use the REST APIs or language-based SDKs. I wrote my integration code with the REST APIs then converted to the JavaScript/TypeScript SDK, [@azure/openai](https://www.npmjs.com/package/openai), when it released. \\n\\n**Usage tip**: \\n\\n* Use the **REST APIs** when you want to stay on the bleeding edge or use a languages not supported with the SDKs. \\n* Use the SDK when you need the more common integration scenarios and not at the bleeding edge of implementation. \\n\\n## Conversational loops\\n\\nConversational loops like those presented with ChapGPT, OpenAI, and Azure OpenAI are commonly browser-based chats provided by:\\n\\n* [Microsoft Bot Framework](https://github.com/microsoft/botframework-sdk) - .NET and JavaScript/TypeScript\\n* [Power Virtual Agents](https://learn.microsoft.com/en-us/power-virtual-agents/fundamentals-what-is-power-virtual-agents) - Enterprise - No code required\\n\\n## Build a conversational CLI\\n\\nThis conversational CLI interacts with your prompts with a small code-base. This allows you to understand the Azure OpenAI configurations, playing with the knobs and dials, while using the conversational loop and Azure OpenAI SDK to interact with it.\\n\\nRemember to store and pass along the conversation so Azure OpenAI has the context of the full conversation.\\n\\n## Azure OpenAI conversation manager class with TypeScript\\n\\nThis conversation manager class is a starting point to your first Azure OpenAI app. After you [create your Azure OpenAI resource](https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal), you need to pass in your Azure OpenAI endpoint (URL), key, and deployment name to use this class. \\n\\n```typescript\\nimport {\\n  OpenAIClient,\\n  AzureKeyCredential,\\n  GetChatCompletionsOptions\\n} from \'@azure/openai\';\\nimport { DefaultAzureCredential } from \'@azure/identity\';\\n\\nimport {\\n  DebugOptions,\\n  OpenAiAppConfig,\\n  OpenAiConversation,\\n  OpenAiRequest,\\n  OpenAiRequestConfig,\\n  OpenAiResponse,\\n  OpenAiSuccessResponse\\n} from \'./models\';\\nimport { ChatCompletions } from \'@azure/openai\';\\n\\n// export types a client needs\\nexport {\\n  DebugOptions,\\n  OpenAiAppConfig,\\n  OpenAiRequest,\\n  OpenAiRequestConfig,\\n  OpenAiResponse,\\n  OpenAiSuccessResponse\\n} from \'./models\';\\n\\nexport default class OpenAIConversationClient {\\n  #appConfig: OpenAiAppConfig;\\n  #conversationConfig: OpenAiConversation;\\n  #requestConfig: GetChatCompletionsOptions = {\\n    maxTokens: 800,\\n    temperature: 0.9,\\n    topP: 1,\\n    frequencyPenalty: 0,\\n    presencePenalty: 0\\n  };\\n\\n  #openAiClient: OpenAIClient;\\n\\n  constructor(\\n    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,\\n    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,\\n    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string\\n  ) {\\n    this.#appConfig = {\\n      endpoint,\\n      apiKey,\\n      deployment\\n    };\\n\\n    this.#conversationConfig = {\\n      messages: []\\n    };\\n\\n    if (apiKey && endpoint) {\\n      this.#openAiClient = new OpenAIClient(\\n        endpoint,\\n        new AzureKeyCredential(apiKey)\\n      );\\n    } else {\\n      this.#openAiClient = new OpenAIClient(\\n        endpoint,\\n        new DefaultAzureCredential()\\n      );\\n    }\\n  }\\n\\n  async OpenAiConversationStep(\\n    userText: string,\\n    appOptions?: OpenAiAppConfig | undefined,\\n    requestOptions?: OpenAiRequestConfig | undefined,\\n    debugOptions?: DebugOptions | undefined\\n  ): Promise<OpenAiResponse> {\\n    try {\\n      // REQUEST\\n      const request: OpenAiRequest = {\\n        conversation: {\\n          messages: [\\n            // add all previous messages so the conversation\\n            // has context\\n            ...this.#conversationConfig.messages,\\n            // add the latest user message\\n            {\\n              role: \'user\',\\n              content: userText\\n            }\\n          ]\\n        },\\n        appConfig: appOptions ? appOptions : this.#appConfig,\\n        requestConfig: requestOptions ? requestOptions : this.#requestConfig\\n      };\\n      if (debugOptions?.debug) {\\n        debugOptions.logger(`LIB OpenAi request: ${JSON.stringify(request)}`);\\n      }\\n\\n      // RESPONSE\\n      const response = await this.OpenAiRequest(request);\\n      if (debugOptions?.debug) {\\n        debugOptions.logger(`LIB OpenAi response: ${JSON.stringify(response)}`);\\n      }\\n      return response;\\n    } catch (error: unknown) {\\n\\n      if (error instanceof Error) {\\n        return {\\n          status: \'499\',\\n          error: {\\n            message: error.message,\\n            stack: error.stack\\n          },\\n          data: undefined\\n        };\\n      } else {\\n        return {\\n          status: \'498\',\\n          error: {\\n            message: JSON.stringify(error)\\n          },\\n          data: undefined\\n        };\\n      }\\n    }\\n  }\\n  async OpenAiRequest(request: OpenAiRequest): Promise<OpenAiResponse> {\\n    if (\\n      !request.appConfig.apiKey ||\\n      !request.appConfig.deployment ||\\n      !request.appConfig.endpoint\\n    ) {\\n      return {\\n        data: undefined,\\n        status: \'400\',\\n        error: {\\n          message: \'OpenAiRequest: Missing API Key or Deployment\'\\n        }\\n      };\\n    }\\n\\n    const chatCompletions: ChatCompletions =\\n      await this.#openAiClient.getChatCompletions(\\n        request.appConfig.deployment,\\n        request.conversation.messages,\\n        request.requestConfig\\n      );\\n\\n    return {\\n      data: chatCompletions,\\n      status: \'200\',\\n      error: undefined\\n    };\\n  }\\n}\\n```\\n\\n[Full sample code for Azure OpenAI library](https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/lib-openai/src/index.ts)\\n\\n\\n## Conversational loop\\n\\nNow that the Azure OpenAI library is built, you need a conversational loop. I used [commander](https://www.npmjs.com/package/commander) with [readline\'s question](https://nodejs.org/api/readline.html#rlquestionquery-options) to build the CLI. \\n\\n```typescript\\nimport { Command } from \'commander\';\\nimport * as dotenv from \'dotenv\';\\nimport { writeFileSync } from \'fs\';\\nimport { checkRequiredEnvParams } from \'./settings\';\\nimport OpenAIConversationClient, {\\n  OpenAiResponse,\\n  DebugOptions\\n} from \'@azure-typescript-e2e-apps/lib-openai\';\\nimport chalk from \'chalk\';\\n\\nimport readline from \'node:readline/promises\';\\n\\n// CLI settings\\nlet debug = false;\\nlet debugFile = \'debug.log\';\\nlet envFile = \'.env\';\\n\\n// CLI client\\nconst program: Command = new Command();\\n\\n// ReadLine client\\nconst readlineClient = readline.createInterface({\\n  input: process.stdin,\\n  output: process.stdout\\n});\\n\\nfunction printf(text: string) {\\n  printd(text);\\n  process.stdout.write(`${text}\\\\n`);\\n}\\nfunction printd(text: string) {\\n  if (debug) {\\n    writeFileSync(debugFile, `${new Date().toISOString()}:${text}\\\\n`, {\\n      flag: \'a\'\\n    });\\n  }\\n}\\n\\nprogram\\n  .name(\'conversation\')\\n  .description(\\n    `A conversation loop\\n\\n        Examples: \\n        index.js -d \'myfile.txt\' -e \'.env\'        Start convo with text from file with settings from .env file\\n    `\\n  )\\n  .option(\\n    \'-d, --dataFile <filename>\',\\n    \'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.\'\\n  )\\n  .option(\\n    \'-e, --envFile <filename>. Default: .env\',\\n    \'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.\'\\n  )\\n  .option(\'-l, --log <filename>. Default: debug.log\', \'Log everything to file\')\\n  .option(\'-x, --exit\', \'Exit conversation loop\')\\n  .helpOption(\'-h, --help\', \'Display help\');\\n\\nprogram.description(\'Start a conversation\').action(async (options) => {\\n  // Prepare: Get debug logger\\n  if (options.log) {\\n    debug = true;\\n    debugFile = options?.log || \'debug.log\';\\n\\n    // reset debug file\\n    writeFileSync(debugFile, ``);\\n  }\\n  printd(`CLI Options: ${JSON.stringify(options)}`);\\n\\n  // Prepare: Get OpenAi settings and create client\\n  if (options.envFile) {\\n    envFile = options.envFile;\\n  }\\n  dotenv.config(options.envFile ? { path: options.envFile } : { path: \'.env\' });\\n  printd(`CLI Env file: ${envFile}`);\\n  printd(`CLI Env vars: ${JSON.stringify(process.env)}`);\\n\\n  // Prepare: Check required environment variables\\n  const errors = checkRequiredEnvParams(process.env);\\n  if (errors.length > 0) {\\n    const failures = `${errors.join(\'\\\\n\')}`;\\n    printf(chalk.red(`CLI Required env vars failed: ${failures}`));\\n  } else {\\n    printd(`CLI Required env vars success`);\\n  }\\n\\n  // Prepare: OpenAi Client\\n  const openAiClient: OpenAIConversationClient = new OpenAIConversationClient(\\n    process.env.AZURE_OPENAI_ENDPOINT as string,\\n    process.env.AZURE_OPENAI_API_KEY as string,\\n    process.env.AZURE_OPENAI_DEPLOYMENT as string\\n  );\\n  printd(`CLI OpenAi client created`);\\n\\n  // Prepare: Start conversation\\n  printf(chalk.green(\'Welcome to the OpenAI conversation!\'));\\n\\n  /* eslint-disable-next-line no-constant-condition */\\n  while (true) {\\n    const yourQuestion: string = await readlineClient.question(\\n      chalk.green(\'What would you like to ask? (`exit` to stop)\\\\n>\')\\n    );\\n    // Print response\\n    printf(`\\\\n${chalk.green.bold(`YOU`)}: ${chalk.gray(yourQuestion)}`);\\n\\n    // Exit\\n    if (yourQuestion.toLowerCase() === \'exit\') {\\n      printf(chalk.green(\'Goodbye!\'));\\n      process.exit();\\n    }\\n\\n    await getAnswer(yourQuestion, openAiClient);\\n  }\\n});\\n\\nasync function getAnswer(\\n  question: string,\\n  openAiClient: OpenAIConversationClient\\n): Promise<void> {\\n  // Request\\n  const appOptions = undefined;\\n  const requestOptions = undefined;\\n  const debugOptions: DebugOptions = {\\n    debug: debug,\\n    logger: printd\\n  };\\n\\n  const { status, data, error }: OpenAiResponse =\\n    await openAiClient.OpenAiConversationStep(\\n      question,\\n      appOptions,\\n      requestOptions,\\n      debugOptions\\n    );\\n\\n  // Response\\n  printd(`CLI OpenAi response status: ${status}`);\\n  printd(`CLI OpenAi response data: ${JSON.stringify(data)}`);\\n  printd(`CLI OpenAi response error: ${error}`);\\n\\n  // Error\\n  if (Number(status) > 299) {\\n    printf(\\n      chalk.red(\\n        `Conversation step request error: ${error?.message || \'unknown\'}`\\n      )\\n    );\\n    process.exit();\\n  }\\n\\n  // Answer\\n  if (data?.choices[0]?.message) {\\n    printf(\\n      `\\\\n\\\\n${chalk.green.bold(`ASSISTANT`)}:\\\\n\\\\n${\\n        data?.choices[0].message.content\\n      }\\\\n\\\\n`\\n    );\\n    return;\\n  }\\n\\n  // No Answer\\n  printf(`\\\\n\\\\n${chalk.green.bold(`ASSISTANT`)}:\\\\n\\\\nNo response provided.\\\\n\\\\n`);\\n  return;\\n}\\n\\nprogram.parse(process.argv);\\n```\\n\\n[Full sample code for Conversational loop](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/cli-openai)\\n\\n## Learn more\\n\\nLearn more about how to [create this Conversational CLI](https://learn.microsoft.com/azure/developer/javascript/openai-cli)."},{"id":"/2023-02-09-azure-cloud-shell-faq","metadata":{"permalink":"/2023-02-09-azure-cloud-shell-faq","source":"@site/blog/2023-02-09-azure-cloud-shell-faq.md","title":"Azure Cloud Shell Frequently asked questions","description":"Things I wish I knew about Azure CLI and Azure Cloud shell","date":"2023-02-09T00:00:00.000Z","formattedDate":"February 9, 2023","tags":[{"label":"Azure","permalink":"/tags/azure"},{"label":"Azure CLI","permalink":"/tags/azure-cli"},{"label":"Azure Cloud Shell","permalink":"/tags/azure-cloud-shell"},{"label":"Tips","permalink":"/tags/tips"}],"readingTime":0.92,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023-02-09-azure-cloud-shell-faq","canonical_url":"https://dfberry.github.io/blog/2023-02-09-azure-cloud-shell-faq","custom_edit_url":null,"sidebar_label":"2023.02.09 Azure Cloud Shell FAQ","title":"Azure Cloud Shell Frequently asked questions","description":"Things I wish I knew about Azure CLI and Azure Cloud shell","published":true,"tags":["Azure","Azure CLI","Azure Cloud Shell","Tips"],"updated":"2023-02-09 05:00 PST"},"prevItem":{"title":"Azure OpenAI Conversational CLI with TypeScript","permalink":"/2023-06-04-azure-openai-cli-with-typescript"},"nextItem":{"title":"TypeScript type guard for empty JSON object","permalink":"/2023.02.04-github-graphql-commit-history-with-typescript"}},"content":"1. You don\'t need to install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/what-is-azure-cli) in your local dev environment. \\n\\n    The Cloud Shell (Azure CLI in a browser) is available from the [Azure portal](https://portal.azure.com). \\n\\n    ![Screenshot showing Azure Cloud Shell is available from top navigation bar in Azure portal. ](./media/2023-02-09/azure-cloud-shell-button.png)\\n\\n\\n2. The cloud shell is sticky. Because the Cloud shell uses Azure Storage (File storage), when you end your sessions then return, [your files are still there](https://learn.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage). \\n\\n    * Want to quickly work with a GitHub repo? No problem, **git** is available. \\n\\n\\n3. Because you use it from the portal, you are already authenticated. No need for [az login](https://learn.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login).\\n4. Many CLI tools are already installed for you.\\n    * Azure CLI\\n    * git, zip, jq\\n    * code (not exactly Visual Studio Code, but a good IDE)\\n    * nano, vim\\n    * Node.js, npm\\n    * Java and Maven\\n    * Python\\n    * .NET Core\\n    * PowerShell\\n    * Go (Golang)\\n    * [Azure Functions CLI](https://learn.microsoft.com/azure/azure-functions/functions-run-local)\\n    * Docker CLI, Kubectl, Helm, Terraform, Ansible\\n    * [Office 365 CLI](https://pnp.github.io/cli-microsoft365/)\\n    * MySQL client\\n    * PostgreSql client\\n    * SQL cli\\n\\n5. Create [bash scripts with Azure CLI commands](https://learn.microsoft.com/azure/cloud-shell/quickstart) to manage your Azure resources."},{"id":"/2023.02.04-github-graphql-commit-history-with-typescript","metadata":{"permalink":"/2023.02.04-github-graphql-commit-history-with-typescript","source":"@site/blog/2023-02-04-blog.md","title":"TypeScript type guard for empty JSON object","description":"Safely type through an object\'s type which includes an empty JSON object.","date":"2023-02-04T00:00:00.000Z","formattedDate":"February 4, 2023","tags":[{"label":"TypeScript","permalink":"/tags/type-script"},{"label":"type guard","permalink":"/tags/type-guard"},{"label":"GitHub","permalink":"/tags/git-hub"},{"label":"GraphQL","permalink":"/tags/graph-ql"}],"readingTime":0.91,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023.02.04-github-graphql-commit-history-with-typescript","canonical_url":"https://dfberry.github.io/blog/2023.02.04-github-graphql-commit-history-with-typescript","custom_edit_url":null,"sidebar_label":"2023.02.04 TS + GitHub GraphQL Commit history","title":"TypeScript type guard for empty JSON object","description":"Safely type through an object\'s type which includes an empty JSON object.","published":true,"tags":["TypeScript","type guard","GitHub","GraphQL"],"updated":"2023-02-04 06:21 PST"},"prevItem":{"title":"Azure Cloud Shell Frequently asked questions","permalink":"/2023-02-09-azure-cloud-shell-faq"}},"content":"A commit history for a repo on GitHub can be optional, if there are no commits yet. The TypeScript SDK created by the [GraphQL CodeGen](https://www.npmjs.com/package/@graphql-codegen/cli) represents this optionality is represented with an empty object, null, or undefined. If a commit is present, its represented as a nested JSON object with more optional parameters.\\n\\n```typescript\\ndeclare var x:\\n  {} |\\n  null |\\n  undefined |\\n  {\'a\':\\n      { ... more optional params }\\n  }\\n```\\n\\nThe empty JSON object, `{}`, is tricky in JavaScript. There are several examples of testing for an empty object but they generally don\'t work as type guards in TypeScript for type safety.\\n\\n## Type guard with `in`\\n\\nAfter asking on [StackOverlow](https://stackoverflow.com/questions/75278401/how-do-i-get-type-target-history-from-github-graphql-on-defaultbranchref) and getting no response, I reached out to my local TypeScript expert for help.\\n\\nHe helped boil the issue down to the type shown in the previous code block with a type guard using the `in` keyword:\\n\\n```typescript\\nif (x !== null && x !== undefined && \\"a\\" in x) {\\n  // no null\\n  // not undefined\\n  // x has property \'a\' so it isn\'t empty\\n  console.log(x.a);\\n}\\n```"}]}')}}]);