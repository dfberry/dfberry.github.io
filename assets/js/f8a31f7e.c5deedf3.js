"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[8162],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>h});var o=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,o,n=function(e,t){if(null==e)return{};var a,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)a=i[o],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)a=i[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=o.createContext({}),u=function(e){var t=o.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},c=function(e){var t=u(e.components);return o.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(a),m=n,h=p["".concat(s,".").concat(m)]||p[m]||d[m]||i;return a?o.createElement(h,r(r({ref:t},c),{},{components:a})):o.createElement(h,r({ref:t},c))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,r=new Array(i);r[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:n,r[1]=l;for(var u=2;u<i;u++)r[u]=a[u];return o.createElement.apply(null,r)}return o.createElement.apply(null,a)}m.displayName="MDXCreateElement"},7664:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var o=a(7462),n=(a(7294),a(3905));const i={slug:"/2023-10-27-cloud-native-introduction",canonical_url:"https://dfberry.github.io/blog/2023-10-27-cloud-native-introduction",custom_edit_url:null,sidebar_label:"2023.10.27 Cloud-native journey - introduction",title:"Cloud-native journey - introduction",description:"Learn cloud-native is and build roadmap to implement an application for cloud-native.",published:!1,tags:["Cloud-native","Cloud","Beginner","Concept","AI assisted","todo"],updated:"2023-10-27 00:00 PST"},r="Building cloud-native - my journey",l={permalink:"/2023-10-27-cloud-native-introduction",source:"@site/blog/2023-10-27-cloud-native-001.md",title:"Cloud-native journey - introduction",description:"Learn cloud-native is and build roadmap to implement an application for cloud-native.",date:"2023-10-27T00:00:00.000Z",formattedDate:"October 27, 2023",tags:[{label:"Cloud-native",permalink:"/tags/cloud-native"},{label:"Cloud",permalink:"/tags/cloud"},{label:"Beginner",permalink:"/tags/beginner"},{label:"Concept",permalink:"/tags/concept"},{label:"AI assisted",permalink:"/tags/ai-assisted"},{label:"todo",permalink:"/tags/todo"}],readingTime:4.245,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"/2023-10-27-cloud-native-introduction",canonical_url:"https://dfberry.github.io/blog/2023-10-27-cloud-native-introduction",custom_edit_url:null,sidebar_label:"2023.10.27 Cloud-native journey - introduction",title:"Cloud-native journey - introduction",description:"Learn cloud-native is and build roadmap to implement an application for cloud-native.",published:!1,tags:["Cloud-native","Cloud","Beginner","Concept","AI assisted","todo"],updated:"2023-10-27 00:00 PST"},nextItem:{title:"Azure OpenAI Conversational CLI with TypeScript",permalink:"/2023-06-04-azure-openai-cli-with-typescript"}},s={authorsImageUrls:[]},u=[{value:"What is cloud-native?",id:"what-is-cloud-native",level:2},{value:"How do I begin?",id:"how-do-i-begin",level:2},{value:"First cloud-native project?",id:"first-cloud-native-project",level:2},{value:"Architecture",id:"architecture",level:2},{value:"More resources",id:"more-resources",level:2}],c={toc:u},p="wrapper";function d(e){let{components:t,...a}=e;return(0,n.kt)(p,(0,o.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"I've been working in the ",(0,n.kt)("strong",{parentName:"p"},"Azure cloud")," for a few years now. The term ",(0,n.kt)("inlineCode",{parentName:"p"},"cloud-native")," gets used a lot. In an effort to bridge the gap between Azure cloud and cloud-native, Im investing some time in learning cloud-native approaches to building apps. "),(0,n.kt)("p",null,"Along the way, I'll use and ",(0,n.kt)("em",{parentName:"p"},"experiment")," with practices and tools to expedite the end result. Join me along the way, and let me know how you would have proceeded. "),(0,n.kt)("p",null,"To start with, my tool set includes:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://code.visualstudio.com/"},"Visual Studio Code"),"."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/"},"GitHub")," & ",(0,n.kt)("a",{parentName:"li",href:"https://github.com/features/copilot"},"GitHub Copilot")," (AI pair programming and rubber duck). Copilot provides context-aware answers within Visual Studio code. ")),(0,n.kt)("p",null,"This blog will capture the highlights. For the complete picture, head over to the GitHub repo: ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/dfberry/cloud-native-todo"},"Cloud native repo"),"."),(0,n.kt)("h2",{id:"what-is-cloud-native"},"What is cloud-native?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Prompt"),": What is cloud-native?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"GitHub Copilot"),": Cloud-native is an approach to building and running applications that takes full advantage of the cloud computing delivery model. It is characterized by the use of containerized applications, microservices architecture, and dynamic orchestration, all of which are designed to be highly scalable, resilient, and agile. The goal of cloud-native is to enable organizations to build and deploy applications faster, with greater flexibility and reliability, while also reducing costs."),(0,n.kt)("h2",{id:"how-do-i-begin"},"How do I begin?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Prompt"),": Where do I start on a new project for cloud-native?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"GitHub Copilot"),": When starting a new project for cloud-native, there are several steps you can take to ensure that your application is designed for scalability, resilience, and agility. Here are some general steps you can follow:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Choose a cloud platform: Select a cloud platform that meets your needs and provides the services and features you require. Some popular cloud platforms include Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Define your architecture: Define the architecture of your application, including the components, services, and data stores that you will use. Consider using microservices architecture, which can help you build more scalable and resilient applications.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Use containers: Use containers to package your application and its dependencies, making it easier to deploy and manage your application across different environments.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Use container orchestration: Use a container orchestration platform like Kubernetes to manage your containers and ensure that your application is highly available and scalable.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Use automation: Use automation tools like Ansible, Terraform, or CloudFormation to automate the deployment and management of your application.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Use monitoring and logging: Use monitoring and logging tools to track the performance and health of your application, and to identify and troubleshoot issues.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Use security best practices: Follow security best practices to ensure that your application is secure and protected from attacks."))),(0,n.kt)("p",null,"By following these steps, you can build a cloud-native application that is designed for scalability, resilience, and agility, and that can provide a better experience for your users."),(0,n.kt)("h2",{id:"first-cloud-native-project"},"First cloud-native project?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Prompt"),": What is a simple project I can use for my first cloud-native project?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"GitHub Copilot"),": A simple project that you can use for your first cloud-native project is a web application that allows users to create and manage to-do lists. This project can be built using a microservices architecture, with separate services for user authentication, to-do list management, and data storage."),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"My perspective")," "),(0,n.kt)("p",null,"A todo list is perfect, there are plenty of examples: "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://todobackend.com/"},"Todo backend")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://todomvc.com/"},"TodoMVC")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nickfun/learning-guardrail/blob/master/server.yaml"},"Swagger API spec")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/nickfun/learning-guardrail/blob/master/postman-collection.json"},"Postman collection of tests"))),(0,n.kt)("h2",{id:"architecture"},"Architecture"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Prompt"),": Can you suggest a beginning architecture of a todo app which is cloud-native?"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"GitHub Copilot"),": here's a beginning architecture for a cloud-native to-do app:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Frontend: A web or mobile app that allows users to create and manage to-do lists. The frontend can be built using a framework like React, Angular, or Vue.js.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"API Gateway: An API gateway that serves as the entry point for the application and routes requests to the appropriate microservices. The API gateway can be built using a tool like Kong, Istio, or AWS API Gateway.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Authentication Service: A microservice that handles user authentication and authorization. This service can be built using a tool like Auth0, Okta, or AWS Cognito.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"To-Do Service: A microservice that handles the creation, retrieval, updating, and deletion of to-do items. This service can be built using a framework like Express.js, Spring Boot, or Flask.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Database: A database that stores the to-do items and user information. The database can be a SQL or NoSQL database like MySQL, PostgreSQL, MongoDB, or DynamoDB.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Container Orchestration: A container orchestration platform like Kubernetes that manages the deployment and scaling of the microservices. Kubernetes can be used to deploy the microservices as Docker containers and manage their lifecycle.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Monitoring and Logging: A monitoring and logging solution like Prometheus, Grafana, or ELK Stack that provides visibility into the performance and health of the application."))),(0,n.kt)("p",null,"By following this architecture, you can build a cloud-native to-do app that is designed for scalability, resilience, and agility, and that can provide a better experience for your users."),(0,n.kt)("h2",{id:"more-resources"},"More resources"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.youtube.com/watch?v=z2q0gKL9nQg"},"What is Cloud Native, the LinuxFoundation and the CNCF")," by ",(0,n.kt)("a",{parentName:"li",href:"https://www.youtube.com/@DiveInto"},"Dive Into with James Spurin")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.linuxfoundation.org/"},"The Linux Foundation")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.cncf.io/"},"Cloud Native Computing Foundation"))))}d.isMDXComponent=!0}}]);