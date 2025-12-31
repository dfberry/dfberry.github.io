---
slug: /2023-06-04-azure-openai-cli-with-typescript
canonical_url: https://dfberry.github.io/blog/2023-06-04-azure-openai-cli-with-typescript
custom_edit_url: null
sidebar_label: "2023.06.04 Azure OpenAI CLI (TS)"
title: "Azure OpenAI Conversational CLI with TypeScript"
description: "Running boilerplate for a Conversational CLI with Azure OpenAI and TypeScript"
published: false
tags: 
  - Azure
  - OpenAI
  - TypeScript
  - Sample
updated: 2023-06-04 05:00 PST
---

# Azure OpenAI Conversational CLI with TypeScript

[Azure OpenAI Service](https://learn.microsoft.com/azure/cognitive-services/openai) provides access to OpenAI's powerful language models including the GPT-3, Codex and Embeddings model series. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. 

## When to use Azure OpenAI

Use this service when you want to use ChapGPT or OpenAI functionality with _your own data and prompts_ which need to remain **private and secure**.

## How to use Azure OpenAI programmatically

As with most other Azure services, you can use the REST APIs or language-based SDKs. I wrote my integration code with the REST APIs then converted to the JavaScript/TypeScript SDK, [@azure/openai](https://www.npmjs.com/package/openai), when it released. 

**Usage tip**: 

* Use the **REST APIs** when you want to stay on the bleeding edge or use a languages not supported with the SDKs. 
* Use the SDK when you need the more common integration scenarios and not at the bleeding edge of implementation. 

## Conversational loops

Conversational loops like those presented with ChapGPT, OpenAI, and Azure OpenAI are commonly browser-based chats provided by:

* [Microsoft Bot Framework](https://github.com/microsoft/botframework-sdk) - .NET and JavaScript/TypeScript
* [Power Virtual Agents](https://learn.microsoft.com/en-us/power-virtual-agents/fundamentals-what-is-power-virtual-agents) - Enterprise - No code required

## Build a conversational CLI

This conversational CLI interacts with your prompts with a small code-base. This allows you to understand the Azure OpenAI configurations, playing with the knobs and dials, while using the conversational loop and Azure OpenAI SDK to interact with it.

Remember to store and pass along the conversation so Azure OpenAI has the context of the full conversation.

## Azure OpenAI conversation manager class with TypeScript

This conversation manager class is a starting point to your first Azure OpenAI app. After you [create your Azure OpenAI resource](https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal), you need to pass in your Azure OpenAI endpoint (URL), key, and deployment name to use this class. 

```typescript
import {
  OpenAIClient,
  AzureKeyCredential,
  GetChatCompletionsOptions
} from '@azure/openai';
import { DefaultAzureCredential } from '@azure/identity';

import {
  DebugOptions,
  OpenAiAppConfig,
  OpenAiConversation,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse,
  OpenAiSuccessResponse
} from './models';
import { ChatCompletions } from '@azure/openai';

// export types a client needs
export {
  DebugOptions,
  OpenAiAppConfig,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse,
  OpenAiSuccessResponse
} from './models';

export default class OpenAIConversationClient {
  #appConfig: OpenAiAppConfig;
  #conversationConfig: OpenAiConversation;
  #requestConfig: GetChatCompletionsOptions = {
    maxTokens: 800,
    temperature: 0.9,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  };

  #openAiClient: OpenAIClient;

  constructor(
    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,
    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,
    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string
  ) {
    this.#appConfig = {
      endpoint,
      apiKey,
      deployment
    };

    this.#conversationConfig = {
      messages: []
    };

    if (apiKey && endpoint) {
      this.#openAiClient = new OpenAIClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
    } else {
      this.#openAiClient = new OpenAIClient(
        endpoint,
        new DefaultAzureCredential()
      );
    }
  }

  async OpenAiConversationStep(
    userText: string,
    appOptions?: OpenAiAppConfig | undefined,
    requestOptions?: OpenAiRequestConfig | undefined,
    debugOptions?: DebugOptions | undefined
  ): Promise<OpenAiResponse> {
    try {
      // REQUEST
      const request: OpenAiRequest = {
        conversation: {
          messages: [
            // add all previous messages so the conversation
            // has context
            ...this.#conversationConfig.messages,
            // add the latest user message
            {
              role: 'user',
              content: userText
            }
          ]
        },
        appConfig: appOptions ? appOptions : this.#appConfig,
        requestConfig: requestOptions ? requestOptions : this.#requestConfig
      };
      if (debugOptions?.debug) {
        debugOptions.logger(`LIB OpenAi request: ${JSON.stringify(request)}`);
      }

      // RESPONSE
      const response = await this.OpenAiRequest(request);
      if (debugOptions?.debug) {
        debugOptions.logger(`LIB OpenAi response: ${JSON.stringify(response)}`);
      }
      return response;
    } catch (error: unknown) {

      if (error instanceof Error) {
        return {
          status: '499',
          error: {
            message: error.message,
            stack: error.stack
          },
          data: undefined
        };
      } else {
        return {
          status: '498',
          error: {
            message: JSON.stringify(error)
          },
          data: undefined
        };
      }
    }
  }
  async OpenAiRequest(request: OpenAiRequest): Promise<OpenAiResponse> {
    if (
      !request.appConfig.apiKey ||
      !request.appConfig.deployment ||
      !request.appConfig.endpoint
    ) {
      return {
        data: undefined,
        status: '400',
        error: {
          message: 'OpenAiRequest: Missing API Key or Deployment'
        }
      };
    }

    const chatCompletions: ChatCompletions =
      await this.#openAiClient.getChatCompletions(
        request.appConfig.deployment,
        request.conversation.messages,
        request.requestConfig
      );

    return {
      data: chatCompletions,
      status: '200',
      error: undefined
    };
  }
}
```

[Full sample code for Azure OpenAI library](https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/lib-openai/src/index.ts)


## Conversational loop

Now that the Azure OpenAI library is built, you need a conversational loop. I used [commander](https://www.npmjs.com/package/commander) with [readline's question](https://nodejs.org/api/readline.html#rlquestionquery-options) to build the CLI. 

```typescript
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { checkRequiredEnvParams } from './settings';
import OpenAIConversationClient, {
  OpenAiResponse,
  DebugOptions
} from '@azure-typescript-e2e-apps/lib-openai';
import chalk from 'chalk';

import readline from 'node:readline/promises';

// CLI settings
let debug = false;
let debugFile = 'debug.log';
let envFile = '.env';

// CLI client
const program: Command = new Command();

// ReadLine client
const readlineClient = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function printf(text: string) {
  printd(text);
  process.stdout.write(`${text}\n`);
}
function printd(text: string) {
  if (debug) {
    writeFileSync(debugFile, `${new Date().toISOString()}:${text}\n`, {
      flag: 'a'
    });
  }
}

program
  .name('conversation')
  .description(
    `A conversation loop

        Examples: 
        index.js -d 'myfile.txt' -e '.env'        Start convo with text from file with settings from .env file
    `
  )
  .option(
    '-d, --dataFile <filename>',
    'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.'
  )
  .option(
    '-e, --envFile <filename>. Default: .env',
    'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.'
  )
  .option('-l, --log <filename>. Default: debug.log', 'Log everything to file')
  .option('-x, --exit', 'Exit conversation loop')
  .helpOption('-h, --help', 'Display help');

program.description('Start a conversation').action(async (options) => {
  // Prepare: Get debug logger
  if (options.log) {
    debug = true;
    debugFile = options?.log || 'debug.log';

    // reset debug file
    writeFileSync(debugFile, ``);
  }
  printd(`CLI Options: ${JSON.stringify(options)}`);

  // Prepare: Get OpenAi settings and create client
  if (options.envFile) {
    envFile = options.envFile;
  }
  dotenv.config(options.envFile ? { path: options.envFile } : { path: '.env' });
  printd(`CLI Env file: ${envFile}`);
  printd(`CLI Env vars: ${JSON.stringify(process.env)}`);

  // Prepare: Check required environment variables
  const errors = checkRequiredEnvParams(process.env);
  if (errors.length > 0) {
    const failures = `${errors.join('\n')}`;
    printf(chalk.red(`CLI Required env vars failed: ${failures}`));
  } else {
    printd(`CLI Required env vars success`);
  }

  // Prepare: OpenAi Client
  const openAiClient: OpenAIConversationClient = new OpenAIConversationClient(
    process.env.AZURE_OPENAI_ENDPOINT as string,
    process.env.AZURE_OPENAI_API_KEY as string,
    process.env.AZURE_OPENAI_DEPLOYMENT as string
  );
  printd(`CLI OpenAi client created`);

  // Prepare: Start conversation
  printf(chalk.green('Welcome to the OpenAI conversation!'));

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    const yourQuestion: string = await readlineClient.question(
      chalk.green('What would you like to ask? (`exit` to stop)\n>')
    );
    // Print response
    printf(`\n${chalk.green.bold(`YOU`)}: ${chalk.gray(yourQuestion)}`);

    // Exit
    if (yourQuestion.toLowerCase() === 'exit') {
      printf(chalk.green('Goodbye!'));
      process.exit();
    }

    await getAnswer(yourQuestion, openAiClient);
  }
});

async function getAnswer(
  question: string,
  openAiClient: OpenAIConversationClient
): Promise<void> {
  // Request
  const appOptions = undefined;
  const requestOptions = undefined;
  const debugOptions: DebugOptions = {
    debug: debug,
    logger: printd
  };

  const { status, data, error }: OpenAiResponse =
    await openAiClient.OpenAiConversationStep(
      question,
      appOptions,
      requestOptions,
      debugOptions
    );

  // Response
  printd(`CLI OpenAi response status: ${status}`);
  printd(`CLI OpenAi response data: ${JSON.stringify(data)}`);
  printd(`CLI OpenAi response error: ${error}`);

  // Error
  if (Number(status) > 299) {
    printf(
      chalk.red(
        `Conversation step request error: ${error?.message || 'unknown'}`
      )
    );
    process.exit();
  }

  // Answer
  if (data?.choices[0]?.message) {
    printf(
      `\n\n${chalk.green.bold(`ASSISTANT`)}:\n\n${
        data?.choices[0].message.content
      }\n\n`
    );
    return;
  }

  // No Answer
  printf(`\n\n${chalk.green.bold(`ASSISTANT`)}:\n\nNo response provided.\n\n`);
  return;
}

program.parse(process.argv);
```

[Full sample code for Conversational loop](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/cli-openai)

## Learn more

Learn more about how to [create this Conversational CLI](https://learn.microsoft.com/azure/developer/javascript/openai-cli).