---
slug: /2023-11-11-cloud-native-api.md
canonical_url: https://dfberry.github.io/blog/2023-11-10-cloud-native-api.md
custom_edit_url: null
sidebar_label: "2023.11.11 Cloud native API"
title: "Embarking on a Cloud-native Journey with a Todo API"
description: "Unleash the power of Visual Studio Code and GitHub Copilot to create a Todo API."
published: false
tags: 
  - Cloud-native
  - AI assisted
  - todo
  - api
updated: 2023-11-11 00:00 PST
---
# Kickstart Your Cloud Native Project with an API

Our cloud-native adventure begins with the API layer - the magical bridge between the front-end UI and the back-end services. For our Todo project, we're keeping the API simple and efficient. Express.js is our chosen framework, a tried-and-true Node.js project. With the power of Copilot Chat, we'll be speeding through the process in no time!

[How do you typically approach building a new API for a cloud-native project?](https://bit.ly/3SBV3zx)

## Fire Up the Dev Container

In the previous chapter of our journey, [002-developer-environment-setup](https://github.com/dfberry/cloud-native-todo/tree/002-developer-environment-setup), we set up a robust dev environment. Now, it's time to bring it to life! Open it in GitHub Codespaces or locally on your computer with Visual Studio Code (Docker installation required). 

Whether you're the lead developer or part of a team, whether you're working on a familiar project or exploring new territories, you've got options. Visual Studio Code and the dev container for local work, or Codespaces for a cloud-based approach.


## Stay in the dev container

If you are like me, your local computer may not be a workhorse so docker may not be started when you start working on your project. You can start using Copilot chap locally, then realize you need the dev container for something. The Copilot chat stays with the environment, it doesn't move (at this time). If you are 20 questions into your conversation with a few side trips here and there, switching environments and not having the chat to reference is frustrating. 

If you are using dev containers and Copilot chat, start and stay in the container for the entire conversation.

## Building an API with Copilot Chat

In just half an hour, Copilot Chat helped me create a fully functional API, complete with types, linting, tests, and a build-test workflow. Here's a sneak peek into the prompts I used:

1. Building a todo microservice with Node.js and TypeScript.
1. Adding tests for the todo API.
1. Refactoring server.ts for both server and test.
1. Modifying server.ts for CRUD operations.
1. Providing initial sample data.
1. Creating an OpenAPI yaml for the API.
1. Adding an OpenAPI UI route.
1. Setting up ESLint with Prettier.
1. Deciding .gitignore contents.
1. Moving openapi.yaml to the dist folder using tsc.
1. Creating a GitHub action for linting, building, and testing.
1. Identifying missing microservice elements.
1. Adding type safety.

## Refining Types and Refactoring

There was some back-and-forth over types and refactoring. Copilot shone in evaluating incoming API request data. After a few prompts, the validation looked like this:

```typescript

export interface Todo {
  id: number;
  title: string;
}

export interface PartialTodo {
  id?: unknown;
  title?: unknown;
}

const todoSchema = Joi.object({
  id: Joi.number().greater(0).required(),
  title: Joi.string().min(1).max(1000).required(),
}).unknown(false);

const todoPartialSchema = Joi.object({
  id: Joi.number().greater(0),
  title: Joi.string().min(1).max(1000).required(),
}).unknown(false);

export interface TodoValidation {
  valid: boolean;
  error: Error | null | string | ValidationErrorItem[];
  todo: Todo | PartialTodo | null;
}

export const validateTodo = (
  todo: PartialTodo,
  isNewTodo: boolean = false
): TodoValidation => {
  const schema = isNewTodo ? todoPartialSchema : todoSchema;
  const { error } = schema.validate(todo);
  if (error) {
    return {
      valid: false,
      error: error.details,
      todo: null,
    };
  }
  return { valid: true, error: null, todo };
};
```

Copilot also excelled in creating logging handlers for requests and responses, and in adding those handlers to the route.

## Copilot's Strengths
Copilot gave me a flying start. While some answers lacked details, running the app or tests quickly revealed any errors, which were easy to fix.

## Copilot's Weaknesses
Despite the conversation and the wealth of examples, I encountered more issues than expected. For more obscure subjects, I'd recommend breaking down the steps more atomically.

## Why Not Use Existing Code?
Sure, there are plenty of examples on GitHub. But navigating licenses and attributions can be tricky. I preferred to avoid any potential missteps.

## Time Investment
From start to finish, the project took about 2 hours. There were a few hiccups along the way, but each step was small, making issues manageable. Considering everything, 2 hours is a solid benchmark for a proof-of-concept project.