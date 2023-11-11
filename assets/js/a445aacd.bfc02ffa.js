"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[2423],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),d=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=d(e.components);return o.createElement(s.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},h=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=d(n),h=r,m=p["".concat(s,".").concat(h)]||p[h]||c[h]||i;return n?o.createElement(m,a(a({ref:t},u),{},{components:n})):o.createElement(m,a({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:r,a[1]=l;for(var d=2;d<i;d++)a[d]=n[d];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3893:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>c,frontMatter:()=>i,metadata:()=>l,toc:()=>d});var o=n(7462),r=(n(7294),n(3905));const i={slug:"/2023-11-11-cloud-native-api.md",canonical_url:"https://dfberry.github.io/blog/2023-11-10-cloud-native-api.md",custom_edit_url:null,sidebar_label:"2023.11.11 Cloud native API",title:"Embarking on a Cloud-native Journey with a Todo API",description:"Unleash the power of Visual Studio Code and GitHub Copilot to create a Todo API.",published:!1,tags:["Cloud-native","AI assisted","todo","api"],updated:"2023-11-11 00:00 PST"},a="Kickstart Your Cloud Native Project with an API",l={permalink:"/2023-11-11-cloud-native-api.md",source:"@site/blog/2023-11-10-cloud-native-003-api.md",title:"Embarking on a Cloud-native Journey with a Todo API",description:"Unleash the power of Visual Studio Code and GitHub Copilot to create a Todo API.",date:"2023-11-10T00:00:00.000Z",formattedDate:"November 10, 2023",tags:[{label:"Cloud-native",permalink:"/tags/cloud-native"},{label:"AI assisted",permalink:"/tags/ai-assisted"},{label:"todo",permalink:"/tags/todo"},{label:"api",permalink:"/tags/api"}],readingTime:3.365,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"/2023-11-11-cloud-native-api.md",canonical_url:"https://dfberry.github.io/blog/2023-11-10-cloud-native-api.md",custom_edit_url:null,sidebar_label:"2023.11.11 Cloud native API",title:"Embarking on a Cloud-native Journey with a Todo API",description:"Unleash the power of Visual Studio Code and GitHub Copilot to create a Todo API.",published:!1,tags:["Cloud-native","AI assisted","todo","api"],updated:"2023-11-11 00:00 PST"},nextItem:{title:"Cloud-native journey - developer environment setup",permalink:"/2023-11-03-cloud-native-002-developer-environment-setup"}},s={authorsImageUrls:[]},d=[{value:"Fire Up the Dev Container",id:"fire-up-the-dev-container",level:2},{value:"Stay in the dev container",id:"stay-in-the-dev-container",level:2},{value:"Building an API with Copilot Chat",id:"building-an-api-with-copilot-chat",level:2},{value:"Refining Types and Refactoring",id:"refining-types-and-refactoring",level:2},{value:"Copilot&#39;s Strengths",id:"copilots-strengths",level:2},{value:"Copilot&#39;s Weaknesses",id:"copilots-weaknesses",level:2},{value:"Why Not Use Existing Code?",id:"why-not-use-existing-code",level:2},{value:"Time Investment",id:"time-investment",level:2}],u={toc:d},p="wrapper";function c(e){let{components:t,...n}=e;return(0,r.kt)(p,(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Our cloud-native adventure begins with the API layer - the magical bridge between the front-end UI and the back-end services. For our Todo project, we're keeping the API simple and efficient. Express.js is our chosen framework, a tried-and-true Node.js project. With the power of Copilot Chat, we'll be speeding through the process in no time!"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://bit.ly/3SBV3zx"},"How do you typically approach building a new API for a cloud-native project?")),(0,r.kt)("h2",{id:"fire-up-the-dev-container"},"Fire Up the Dev Container"),(0,r.kt)("p",null,"In the previous chapter of our journey, ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/dfberry/cloud-native-todo/tree/002-developer-environment-setup"},"002-developer-environment-setup"),", we set up a robust dev environment. Now, it's time to bring it to life! Open it in GitHub Codespaces or locally on your computer with Visual Studio Code (Docker installation required). "),(0,r.kt)("p",null,"Whether you're the lead developer or part of a team, whether you're working on a familiar project or exploring new territories, you've got options. Visual Studio Code and the dev container for local work, or Codespaces for a cloud-based approach."),(0,r.kt)("h2",{id:"stay-in-the-dev-container"},"Stay in the dev container"),(0,r.kt)("p",null,"If you are like me, your local computer may not be a workhorse so docker may not be started when you start working on your project. You can start using Copilot chap locally, then realize you need the dev container for something. The Copilot chat stays with the environment, it doesn't move (at this time). If you are 20 questions into your conversation with a few side trips here and there, switching environments and not having the chat to reference is frustrating. "),(0,r.kt)("p",null,"If you are using dev containers and Copilot chat, start and stay in the container for the entire conversation."),(0,r.kt)("h2",{id:"building-an-api-with-copilot-chat"},"Building an API with Copilot Chat"),(0,r.kt)("p",null,"In just half an hour, Copilot Chat helped me create a fully functional API, complete with types, linting, tests, and a build-test workflow. Here's a sneak peek into the prompts I used:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Building a todo microservice with Node.js and TypeScript."),(0,r.kt)("li",{parentName:"ol"},"Adding tests for the todo API."),(0,r.kt)("li",{parentName:"ol"},"Refactoring server.ts for both server and test."),(0,r.kt)("li",{parentName:"ol"},"Modifying server.ts for CRUD operations."),(0,r.kt)("li",{parentName:"ol"},"Providing initial sample data."),(0,r.kt)("li",{parentName:"ol"},"Creating an OpenAPI yaml for the API."),(0,r.kt)("li",{parentName:"ol"},"Adding an OpenAPI UI route."),(0,r.kt)("li",{parentName:"ol"},"Setting up ESLint with Prettier."),(0,r.kt)("li",{parentName:"ol"},"Deciding .gitignore contents."),(0,r.kt)("li",{parentName:"ol"},"Moving openapi.yaml to the dist folder using tsc."),(0,r.kt)("li",{parentName:"ol"},"Creating a GitHub action for linting, building, and testing."),(0,r.kt)("li",{parentName:"ol"},"Identifying missing microservice elements."),(0,r.kt)("li",{parentName:"ol"},"Adding type safety.")),(0,r.kt)("h2",{id:"refining-types-and-refactoring"},"Refining Types and Refactoring"),(0,r.kt)("p",null,"There was some back-and-forth over types and refactoring. Copilot shone in evaluating incoming API request data. After a few prompts, the validation looked like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"\nexport interface Todo {\n  id: number;\n  title: string;\n}\n\nexport interface PartialTodo {\n  id?: unknown;\n  title?: unknown;\n}\n\nconst todoSchema = Joi.object({\n  id: Joi.number().greater(0).required(),\n  title: Joi.string().min(1).max(1000).required(),\n}).unknown(false);\n\nconst todoPartialSchema = Joi.object({\n  id: Joi.number().greater(0),\n  title: Joi.string().min(1).max(1000).required(),\n}).unknown(false);\n\nexport interface TodoValidation {\n  valid: boolean;\n  error: Error | null | string | ValidationErrorItem[];\n  todo: Todo | PartialTodo | null;\n}\n\nexport const validateTodo = (\n  todo: PartialTodo,\n  isNewTodo: boolean = false\n): TodoValidation => {\n  const schema = isNewTodo ? todoPartialSchema : todoSchema;\n  const { error } = schema.validate(todo);\n  if (error) {\n    return {\n      valid: false,\n      error: error.details,\n      todo: null,\n    };\n  }\n  return { valid: true, error: null, todo };\n};\n")),(0,r.kt)("p",null,"Copilot also excelled in creating logging handlers for requests and responses, and in adding those handlers to the route."),(0,r.kt)("h2",{id:"copilots-strengths"},"Copilot's Strengths"),(0,r.kt)("p",null,"Copilot gave me a flying start. While some answers lacked details, running the app or tests quickly revealed any errors, which were easy to fix."),(0,r.kt)("h2",{id:"copilots-weaknesses"},"Copilot's Weaknesses"),(0,r.kt)("p",null,"Despite the conversation and the wealth of examples, I encountered more issues than expected. For more obscure subjects, I'd recommend breaking down the steps more atomically."),(0,r.kt)("h2",{id:"why-not-use-existing-code"},"Why Not Use Existing Code?"),(0,r.kt)("p",null,"Sure, there are plenty of examples on GitHub. But navigating licenses and attributions can be tricky. I preferred to avoid any potential missteps."),(0,r.kt)("h2",{id:"time-investment"},"Time Investment"),(0,r.kt)("p",null,"From start to finish, the project took about 2 hours. There were a few hiccups along the way, but each step was small, making issues manageable. Considering everything, 2 hours is a solid benchmark for a proof-of-concept project."))}c.isMDXComponent=!0}}]);