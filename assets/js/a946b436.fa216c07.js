"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[5032],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>g});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),l=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},u=function(e){var n=l(e.components);return r.createElement(p.Provider,{value:n},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=l(t),m=o,g=c["".concat(p,".").concat(m)]||c[m]||d[m]||i;return t?r.createElement(g,a(a({ref:n},u),{},{components:t})):r.createElement(g,a({ref:n},u))}));function g(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=m;var s={};for(var p in n)hasOwnProperty.call(n,p)&&(s[p]=n[p]);s.originalType=e,s[c]="string"==typeof e?e:o,a[1]=s;for(var l=2;l<i;l++)a[l]=t[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8818:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var r=t(7462),o=(t(7294),t(3905));const i={slug:"/2023-06-04-azure-openai-cli-with-typescript",canonical_url:"https://dfberry.github.io/blog/2023-06-04-azure-openai-cli-with-typescript",custom_edit_url:null,sidebar_label:"2023.06.04 Azure OpenAI CLI (TS)",title:"Azure OpenAI Conversational CLI with TypeScript",description:"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript",published:!1,tags:["Azure","OpenAI","TypeScript","Sample"],updated:"2023-06-04 05:00 PST"},a="Azure OpenAI Conversational CLI with TypeScript",s={permalink:"/2023-06-04-azure-openai-cli-with-typescript",source:"@site/blog/2023-06-04-openai-cli-with-typescript.md",title:"Azure OpenAI Conversational CLI with TypeScript",description:"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript",date:"2023-06-04T00:00:00.000Z",formattedDate:"June 4, 2023",tags:[{label:"Azure",permalink:"/tags/azure"},{label:"OpenAI",permalink:"/tags/open-ai"},{label:"TypeScript",permalink:"/tags/type-script"},{label:"Sample",permalink:"/tags/sample"}],readingTime:5.84,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"/2023-06-04-azure-openai-cli-with-typescript",canonical_url:"https://dfberry.github.io/blog/2023-06-04-azure-openai-cli-with-typescript",custom_edit_url:null,sidebar_label:"2023.06.04 Azure OpenAI CLI (TS)",title:"Azure OpenAI Conversational CLI with TypeScript",description:"Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript",published:!1,tags:["Azure","OpenAI","TypeScript","Sample"],updated:"2023-06-04 05:00 PST"},prevItem:{title:"Cloud-native journey - introduction",permalink:"/2023-10-27-cloud-native-introduction"},nextItem:{title:"Azure Cloud Shell Frequently asked questions",permalink:"/2023-02-09-azure-cloud-shell-faq"}},p={authorsImageUrls:[]},l=[{value:"When to use Azure OpenAI",id:"when-to-use-azure-openai",level:2},{value:"How to use Azure OpenAI programmatically",id:"how-to-use-azure-openai-programmatically",level:2},{value:"Conversational loops",id:"conversational-loops",level:2},{value:"Build a conversational CLI",id:"build-a-conversational-cli",level:2},{value:"Azure OpenAI conversation manager class with TypeScript",id:"azure-openai-conversation-manager-class-with-typescript",level:2},{value:"Conversational loop",id:"conversational-loop",level:2},{value:"Learn more",id:"learn-more",level:2}],u={toc:l},c="wrapper";function d(e){let{components:n,...t}=e;return(0,o.kt)(c,(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/azure/cognitive-services/openai"},"Azure OpenAI Service")," provides access to OpenAI's powerful language models including the GPT-3, Codex and Embeddings model series. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. "),(0,o.kt)("h2",{id:"when-to-use-azure-openai"},"When to use Azure OpenAI"),(0,o.kt)("p",null,"Use this service when you want to use ChapGPT or OpenAI functionality with ",(0,o.kt)("em",{parentName:"p"},"your own data and prompts")," which need to remain ",(0,o.kt)("strong",{parentName:"p"},"private and secure"),"."),(0,o.kt)("h2",{id:"how-to-use-azure-openai-programmatically"},"How to use Azure OpenAI programmatically"),(0,o.kt)("p",null,"As with most other Azure services, you can use the REST APIs or language-based SDKs. I wrote my integration code with the REST APIs then converted to the JavaScript/TypeScript SDK, ",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/openai"},"@azure/openai"),", when it released. "),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Usage tip"),": "),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Use the ",(0,o.kt)("strong",{parentName:"li"},"REST APIs")," when you want to stay on the bleeding edge or use a languages not supported with the SDKs. "),(0,o.kt)("li",{parentName:"ul"},"Use the SDK when you need the more common integration scenarios and not at the bleeding edge of implementation. ")),(0,o.kt)("h2",{id:"conversational-loops"},"Conversational loops"),(0,o.kt)("p",null,"Conversational loops like those presented with ChapGPT, OpenAI, and Azure OpenAI are commonly browser-based chats provided by:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/microsoft/botframework-sdk"},"Microsoft Bot Framework")," - .NET and JavaScript/TypeScript"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://learn.microsoft.com/en-us/power-virtual-agents/fundamentals-what-is-power-virtual-agents"},"Power Virtual Agents")," - Enterprise - No code required")),(0,o.kt)("h2",{id:"build-a-conversational-cli"},"Build a conversational CLI"),(0,o.kt)("p",null,"This conversational CLI interacts with your prompts with a small code-base. This allows you to understand the Azure OpenAI configurations, playing with the knobs and dials, while using the conversational loop and Azure OpenAI SDK to interact with it."),(0,o.kt)("p",null,"Remember to store and pass along the conversation so Azure OpenAI has the context of the full conversation."),(0,o.kt)("h2",{id:"azure-openai-conversation-manager-class-with-typescript"},"Azure OpenAI conversation manager class with TypeScript"),(0,o.kt)("p",null,"This conversation manager class is a starting point to your first Azure OpenAI app. After you ",(0,o.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal"},"create your Azure OpenAI resource"),", you need to pass in your Azure OpenAI endpoint (URL), key, and deployment name to use this class. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import {\n  OpenAIClient,\n  AzureKeyCredential,\n  GetChatCompletionsOptions\n} from '@azure/openai';\nimport { DefaultAzureCredential } from '@azure/identity';\n\nimport {\n  DebugOptions,\n  OpenAiAppConfig,\n  OpenAiConversation,\n  OpenAiRequest,\n  OpenAiRequestConfig,\n  OpenAiResponse,\n  OpenAiSuccessResponse\n} from './models';\nimport { ChatCompletions } from '@azure/openai';\n\n// export types a client needs\nexport {\n  DebugOptions,\n  OpenAiAppConfig,\n  OpenAiRequest,\n  OpenAiRequestConfig,\n  OpenAiResponse,\n  OpenAiSuccessResponse\n} from './models';\n\nexport default class OpenAIConversationClient {\n  #appConfig: OpenAiAppConfig;\n  #conversationConfig: OpenAiConversation;\n  #requestConfig: GetChatCompletionsOptions = {\n    maxTokens: 800,\n    temperature: 0.9,\n    topP: 1,\n    frequencyPenalty: 0,\n    presencePenalty: 0\n  };\n\n  #openAiClient: OpenAIClient;\n\n  constructor(\n    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,\n    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,\n    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string\n  ) {\n    this.#appConfig = {\n      endpoint,\n      apiKey,\n      deployment\n    };\n\n    this.#conversationConfig = {\n      messages: []\n    };\n\n    if (apiKey && endpoint) {\n      this.#openAiClient = new OpenAIClient(\n        endpoint,\n        new AzureKeyCredential(apiKey)\n      );\n    } else {\n      this.#openAiClient = new OpenAIClient(\n        endpoint,\n        new DefaultAzureCredential()\n      );\n    }\n  }\n\n  async OpenAiConversationStep(\n    userText: string,\n    appOptions?: OpenAiAppConfig | undefined,\n    requestOptions?: OpenAiRequestConfig | undefined,\n    debugOptions?: DebugOptions | undefined\n  ): Promise<OpenAiResponse> {\n    try {\n      // REQUEST\n      const request: OpenAiRequest = {\n        conversation: {\n          messages: [\n            // add all previous messages so the conversation\n            // has context\n            ...this.#conversationConfig.messages,\n            // add the latest user message\n            {\n              role: 'user',\n              content: userText\n            }\n          ]\n        },\n        appConfig: appOptions ? appOptions : this.#appConfig,\n        requestConfig: requestOptions ? requestOptions : this.#requestConfig\n      };\n      if (debugOptions?.debug) {\n        debugOptions.logger(`LIB OpenAi request: ${JSON.stringify(request)}`);\n      }\n\n      // RESPONSE\n      const response = await this.OpenAiRequest(request);\n      if (debugOptions?.debug) {\n        debugOptions.logger(`LIB OpenAi response: ${JSON.stringify(response)}`);\n      }\n      return response;\n    } catch (error: unknown) {\n\n      if (error instanceof Error) {\n        return {\n          status: '499',\n          error: {\n            message: error.message,\n            stack: error.stack\n          },\n          data: undefined\n        };\n      } else {\n        return {\n          status: '498',\n          error: {\n            message: JSON.stringify(error)\n          },\n          data: undefined\n        };\n      }\n    }\n  }\n  async OpenAiRequest(request: OpenAiRequest): Promise<OpenAiResponse> {\n    if (\n      !request.appConfig.apiKey ||\n      !request.appConfig.deployment ||\n      !request.appConfig.endpoint\n    ) {\n      return {\n        data: undefined,\n        status: '400',\n        error: {\n          message: 'OpenAiRequest: Missing API Key or Deployment'\n        }\n      };\n    }\n\n    const chatCompletions: ChatCompletions =\n      await this.#openAiClient.getChatCompletions(\n        request.appConfig.deployment,\n        request.conversation.messages,\n        request.requestConfig\n      );\n\n    return {\n      data: chatCompletions,\n      status: '200',\n      error: undefined\n    };\n  }\n}\n")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/lib-openai/src/index.ts"},"Full sample code for Azure OpenAI library")),(0,o.kt)("h2",{id:"conversational-loop"},"Conversational loop"),(0,o.kt)("p",null,"Now that the Azure OpenAI library is built, you need a conversational loop. I used ",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/commander"},"commander")," with ",(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/api/readline.html#rlquestionquery-options"},"readline's question")," to build the CLI. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { Command } from 'commander';\nimport * as dotenv from 'dotenv';\nimport { writeFileSync } from 'fs';\nimport { checkRequiredEnvParams } from './settings';\nimport OpenAIConversationClient, {\n  OpenAiResponse,\n  DebugOptions\n} from '@azure-typescript-e2e-apps/lib-openai';\nimport chalk from 'chalk';\n\nimport readline from 'node:readline/promises';\n\n// CLI settings\nlet debug = false;\nlet debugFile = 'debug.log';\nlet envFile = '.env';\n\n// CLI client\nconst program: Command = new Command();\n\n// ReadLine client\nconst readlineClient = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nfunction printf(text: string) {\n  printd(text);\n  process.stdout.write(`${text}\\n`);\n}\nfunction printd(text: string) {\n  if (debug) {\n    writeFileSync(debugFile, `${new Date().toISOString()}:${text}\\n`, {\n      flag: 'a'\n    });\n  }\n}\n\nprogram\n  .name('conversation')\n  .description(\n    `A conversation loop\n\n        Examples: \n        index.js -d 'myfile.txt' -e '.env'        Start convo with text from file with settings from .env file\n    `\n  )\n  .option(\n    '-d, --dataFile <filename>',\n    'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.'\n  )\n  .option(\n    '-e, --envFile <filename>. Default: .env',\n    'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.'\n  )\n  .option('-l, --log <filename>. Default: debug.log', 'Log everything to file')\n  .option('-x, --exit', 'Exit conversation loop')\n  .helpOption('-h, --help', 'Display help');\n\nprogram.description('Start a conversation').action(async (options) => {\n  // Prepare: Get debug logger\n  if (options.log) {\n    debug = true;\n    debugFile = options?.log || 'debug.log';\n\n    // reset debug file\n    writeFileSync(debugFile, ``);\n  }\n  printd(`CLI Options: ${JSON.stringify(options)}`);\n\n  // Prepare: Get OpenAi settings and create client\n  if (options.envFile) {\n    envFile = options.envFile;\n  }\n  dotenv.config(options.envFile ? { path: options.envFile } : { path: '.env' });\n  printd(`CLI Env file: ${envFile}`);\n  printd(`CLI Env vars: ${JSON.stringify(process.env)}`);\n\n  // Prepare: Check required environment variables\n  const errors = checkRequiredEnvParams(process.env);\n  if (errors.length > 0) {\n    const failures = `${errors.join('\\n')}`;\n    printf(chalk.red(`CLI Required env vars failed: ${failures}`));\n  } else {\n    printd(`CLI Required env vars success`);\n  }\n\n  // Prepare: OpenAi Client\n  const openAiClient: OpenAIConversationClient = new OpenAIConversationClient(\n    process.env.AZURE_OPENAI_ENDPOINT as string,\n    process.env.AZURE_OPENAI_API_KEY as string,\n    process.env.AZURE_OPENAI_DEPLOYMENT as string\n  );\n  printd(`CLI OpenAi client created`);\n\n  // Prepare: Start conversation\n  printf(chalk.green('Welcome to the OpenAI conversation!'));\n\n  /* eslint-disable-next-line no-constant-condition */\n  while (true) {\n    const yourQuestion: string = await readlineClient.question(\n      chalk.green('What would you like to ask? (`exit` to stop)\\n>')\n    );\n    // Print response\n    printf(`\\n${chalk.green.bold(`YOU`)}: ${chalk.gray(yourQuestion)}`);\n\n    // Exit\n    if (yourQuestion.toLowerCase() === 'exit') {\n      printf(chalk.green('Goodbye!'));\n      process.exit();\n    }\n\n    await getAnswer(yourQuestion, openAiClient);\n  }\n});\n\nasync function getAnswer(\n  question: string,\n  openAiClient: OpenAIConversationClient\n): Promise<void> {\n  // Request\n  const appOptions = undefined;\n  const requestOptions = undefined;\n  const debugOptions: DebugOptions = {\n    debug: debug,\n    logger: printd\n  };\n\n  const { status, data, error }: OpenAiResponse =\n    await openAiClient.OpenAiConversationStep(\n      question,\n      appOptions,\n      requestOptions,\n      debugOptions\n    );\n\n  // Response\n  printd(`CLI OpenAi response status: ${status}`);\n  printd(`CLI OpenAi response data: ${JSON.stringify(data)}`);\n  printd(`CLI OpenAi response error: ${error}`);\n\n  // Error\n  if (Number(status) > 299) {\n    printf(\n      chalk.red(\n        `Conversation step request error: ${error?.message || 'unknown'}`\n      )\n    );\n    process.exit();\n  }\n\n  // Answer\n  if (data?.choices[0]?.message) {\n    printf(\n      `\\n\\n${chalk.green.bold(`ASSISTANT`)}:\\n\\n${\n        data?.choices[0].message.content\n      }\\n\\n`\n    );\n    return;\n  }\n\n  // No Answer\n  printf(`\\n\\n${chalk.green.bold(`ASSISTANT`)}:\\n\\nNo response provided.\\n\\n`);\n  return;\n}\n\nprogram.parse(process.argv);\n")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/cli-openai"},"Full sample code for Conversational loop")),(0,o.kt)("h2",{id:"learn-more"},"Learn more"),(0,o.kt)("p",null,"Learn more about how to ",(0,o.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/azure/developer/javascript/openai-cli"},"create this Conversational CLI"),"."))}d.isMDXComponent=!0}}]);