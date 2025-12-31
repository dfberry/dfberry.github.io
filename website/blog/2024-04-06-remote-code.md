---
slug: /2024-04-06-code-includes.md
canonical_url: https://dfberry.github.io/blog/2024-04-06-code-includes.md
custom_edit_url: null
sidebar_label: "2024-04-06 Code includes for Dev.to"
title: "Examples of code includes for Dev.to"
description: "How to add code includes for Dev.to"
published: false
---

# Examples of code includes for Dev.to for rss feed imports with @saucelabs/theme-github-codeblock  

My GitHub site is built with Docusaurus 2 and usually shows code snippets. Since I build to my GitHub site but want to repost to Dev.to and other platforms from RSS feeds, I need the code snippets to work with the minimal amount of manual intervention and corrections after I import the blog post into Dev.to. 

If the code snippet is inside the blog post as text, the Dev.to rss feed import mangles the code snippet syntax, which requires manual fix up which is time-consuming and a step I have to remember. 

## Using @saucelabs/theme-github-codeblock  

I found the saucelabs code block on the [unofficial Docusaurus features](https://docusaurus.io/community/resources#features).

## JavaScript reference: `js`

```js reference
https://github.com/dfberry/mslearn-advocates.azure-functions-and-signalr/blob/main/client-end/src/index.js
```

## Json reference: `json`

```json reference
https://github.com/saucelabs/docusaurus-theme-github-codeblock/blob/main/package.json
```

## Bash reference: `bash`

```bash reference
https://github.com/ruanyf/simple-bash-scripts/blob/master/scripts/addition.sh
```


## Text reference: `text`

```text reference
https://github.com/dfberry/dev-diary/blob/main/notes/Learning-DataLake/Neal.txt
```

## Rust: reference: `rs`

```rs reference
https://github.com/dfberry/rust-axum-mongodb-todo/blob/main/src/main.rs
```

## Yaml

```yml reference
https://github.com/dfberry/actions/blob/main/examples/mono-app-workflow.yml
```