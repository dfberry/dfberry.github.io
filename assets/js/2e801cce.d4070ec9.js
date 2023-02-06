"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[450],{6029:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"/2023.02.04-github-graphql-commit-history-with-typescript","metadata":{"permalink":"/2023.02.04-github-graphql-commit-history-with-typescript","source":"@site/blog/2023-01-blog.md","title":"TypeScript type guard for empty JSON object","description":"Safely type through a type including an empty JSON object.","date":"2023-02-06T05:42:22.000Z","formattedDate":"February 6, 2023","tags":[{"label":"TypeScript","permalink":"/tags/type-script"},{"label":"Type guard","permalink":"/tags/type-guard"},{"label":"Optional params","permalink":"/tags/optional-params"},{"label":"GraphQL","permalink":"/tags/graph-ql"},{"label":"Commit","permalink":"/tags/commit"},{"label":"GitHub","permalink":"/tags/git-hub"}],"readingTime":0.905,"hasTruncateMarker":false,"authors":[],"frontMatter":{"slug":"/2023.02.04-github-graphql-commit-history-with-typescript","custom_edit_url":null,"sidebar_label":"2023.02.04 TS + GitHub Commit history","title":"TypeScript type guard for empty JSON object","description":"Safely type through a type including an empty JSON object.","tags":["TypeScript","Type guard","Optional params","GraphQL","Commit","GitHub"]}},"content":"Commit history for a repo on GitHub can be optional, if there are no commits yet. The TypeScript SDK created by the [GraphQL CodeGen](https://www.npmjs.com/package/@graphql-codegen/cli) represents this optionality is represented with an empty object, null, or undefined. If a commit is present, its represented as a nested JSON object with more optional parameters.\\n\\n```typescript\\ndeclare var x:\\n  {} |\\n  null |\\n  undefined |\\n  {\'a\':\\n      { ... more optional params }\\n  }\\n```\\n\\nThe empty JSON object, `{}`, is tricky in JavaScript. There are several examples of testing for an empty object but they generally don\'t work as type guards in TypeScript for type safety.\\n\\n## Type guard with `in`\\n\\nAfter asking on [StackOverlow](https://stackoverflow.com/questions/75278401/how-do-i-get-type-target-history-from-github-graphql-on-defaultbranchref) and getting no response, I reached out to my local TypeScript expert for help.\\n\\nHe helped boil the issue down to the type shown in the previous code block with a type guard using the `in` keyword:\\n\\n```typescript\\nif (x !== null && x !== undefined && \\"a\\" in x) {\\n  // no null\\n  // not undefined\\n  // x has property \'a\' so it isn\'t empty\\n  console.log(x.a);\\n}\\n```"}]}')}}]);