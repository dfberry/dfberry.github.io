"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[8482],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},s="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),s=c(r),h=a,d=s["".concat(l,".").concat(h)]||s[h]||y[h]||o;return r?n.createElement(d,i(i({ref:t},u),{},{components:r})):n.createElement(d,i({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=h;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p[s]="string"==typeof e?e:a,i[1]=p;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}h.displayName="MDXCreateElement"},9650:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>y,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const o={slug:"/2023.02.04-github-graphql-commit-history-with-typescript",canonical_url:"https://dfberry.github.io/blog/2023.02.04-github-graphql-commit-history-with-typescript",custom_edit_url:null,sidebar_label:"2023.02.04 TS + GitHub GraphQL Commit history",title:"TypeScript type guard for empty JSON object",description:"Safely type through an object's type which includes an empty JSON object.",published:!0,tags:["TypeScript","type guard","GitHub","GraphQL"],updated:"2023-02-04 06:21 PST"},i="TypeScript type guard for empty JSON object",p={permalink:"/2023.02.04-github-graphql-commit-history-with-typescript",source:"@site/blog/2023-02-04-blog.md",title:"TypeScript type guard for empty JSON object",description:"Safely type through an object's type which includes an empty JSON object.",date:"2023-02-04T00:00:00.000Z",formattedDate:"February 4, 2023",tags:[{label:"TypeScript",permalink:"/tags/type-script"},{label:"type guard",permalink:"/tags/type-guard"},{label:"GitHub",permalink:"/tags/git-hub"},{label:"GraphQL",permalink:"/tags/graph-ql"}],readingTime:.91,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"/2023.02.04-github-graphql-commit-history-with-typescript",canonical_url:"https://dfberry.github.io/blog/2023.02.04-github-graphql-commit-history-with-typescript",custom_edit_url:null,sidebar_label:"2023.02.04 TS + GitHub GraphQL Commit history",title:"TypeScript type guard for empty JSON object",description:"Safely type through an object's type which includes an empty JSON object.",published:!0,tags:["TypeScript","type guard","GitHub","GraphQL"],updated:"2023-02-04 06:21 PST"},prevItem:{title:"Azure Cloud Shell Frequently asked questions",permalink:"/2023-02-09-azure-cloud-shell-faq"}},l={authorsImageUrls:[]},c=[{value:"Type guard with <code>in</code>",id:"type-guard-with-in",level:2}],u={toc:c},s="wrapper";function y(e){let{components:t,...r}=e;return(0,a.kt)(s,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"A commit history for a repo on GitHub can be optional, if there are no commits yet. The TypeScript SDK created by the ",(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@graphql-codegen/cli"},"GraphQL CodeGen")," represents this optionality is represented with an empty object, null, or undefined. If a commit is present, its represented as a nested JSON object with more optional parameters."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"declare var x:\n  {} |\n  null |\n  undefined |\n  {'a':\n      { ... more optional params }\n  }\n")),(0,a.kt)("p",null,"The empty JSON object, ",(0,a.kt)("inlineCode",{parentName:"p"},"{}"),", is tricky in JavaScript. There are several examples of testing for an empty object but they generally don't work as type guards in TypeScript for type safety."),(0,a.kt)("h2",{id:"type-guard-with-in"},"Type guard with ",(0,a.kt)("inlineCode",{parentName:"h2"},"in")),(0,a.kt)("p",null,"After asking on ",(0,a.kt)("a",{parentName:"p",href:"https://stackoverflow.com/questions/75278401/how-do-i-get-type-target-history-from-github-graphql-on-defaultbranchref"},"StackOverlow")," and getting no response, I reached out to my local TypeScript expert for help."),(0,a.kt)("p",null,"He helped boil the issue down to the type shown in the previous code block with a type guard using the ",(0,a.kt)("inlineCode",{parentName:"p"},"in")," keyword:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"if (x !== null && x !== undefined && \"a\" in x) {\n  // no null\n  // not undefined\n  // x has property 'a' so it isn't empty\n  console.log(x.a);\n}\n")))}y.isMDXComponent=!0}}]);