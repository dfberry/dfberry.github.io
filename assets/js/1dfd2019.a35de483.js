"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[7743],{3905:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>h});var r=o(7294);function a(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function i(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function n(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?i(Object(o),!0).forEach((function(t){a(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,r,a=function(e,t){if(null==e)return{};var o,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)o=i[r],t.indexOf(o)>=0||(a[o]=e[o]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)o=i[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(a[o]=e[o])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),o=t;return e&&(o="function"==typeof e?e(t):n(n({},t),e)),o},u=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var o=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=s(o),m=a,h=c["".concat(p,".").concat(m)]||c[m]||d[m]||i;return o?r.createElement(h,n(n({ref:t},u),{},{components:o})):r.createElement(h,n({ref:t},u))}));function h(e,t){var o=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=o.length,n=new Array(i);n[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[c]="string"==typeof e?e:a,n[1]=l;for(var s=2;s<i;s++)n[s]=o[s];return r.createElement.apply(null,n)}return r.createElement.apply(null,o)}m.displayName="MDXCreateElement"},267:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>p,contentTitle:()=>n,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var r=o(7462),a=(o(7294),o(3905));const i={slug:"/2023-12-10-deploy-from-github.md",canonical_url:"https://dfberry.github.io/blog/2023-12-10-cloud-native-005-deploy-from-github-to-azure.md",custom_edit_url:null,sidebar_label:"2023.12-10 Deploy from GitHub",title:"Deploy to Azure from GitHub with Azure Developer CLI",description:"Explore the power of Azure Developer CLI in this fifth iteration of our cloud-native project. Learn how to deploy directly from GitHub to Azure, set up a sustainable deployment process, and automate your workflow with `azure-dev.yml`. This post guides you through each step, from configuring your pipeline to deploying manually from GitHub. Dive in to discover how Azure Developer CLI can streamline your cloud deployments.",published:!1,tags:["Cloud-native","Deploy","Azure Developer CLI","Azure"],updated:"2023-12-10 00:00 PST"},n="Deploy to cloud from source control with Azure Developer CLI",l={permalink:"/2023-12-10-deploy-from-github.md",source:"@site/blog/2023-12-10-cloud-native-005-deploy-from-github-to-azure.md",title:"Deploy to Azure from GitHub with Azure Developer CLI",description:"Explore the power of Azure Developer CLI in this fifth iteration of our cloud-native project. Learn how to deploy directly from GitHub to Azure, set up a sustainable deployment process, and automate your workflow with `azure-dev.yml`. This post guides you through each step, from configuring your pipeline to deploying manually from GitHub. Dive in to discover how Azure Developer CLI can streamline your cloud deployments.",date:"2023-12-10T00:00:00.000Z",formattedDate:"December 10, 2023",tags:[{label:"Cloud-native",permalink:"/tags/cloud-native"},{label:"Deploy",permalink:"/tags/deploy"},{label:"Azure Developer CLI",permalink:"/tags/azure-developer-cli"},{label:"Azure",permalink:"/tags/azure"}],readingTime:5.525,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"/2023-12-10-deploy-from-github.md",canonical_url:"https://dfberry.github.io/blog/2023-12-10-cloud-native-005-deploy-from-github-to-azure.md",custom_edit_url:null,sidebar_label:"2023.12-10 Deploy from GitHub",title:"Deploy to Azure from GitHub with Azure Developer CLI",description:"Explore the power of Azure Developer CLI in this fifth iteration of our cloud-native project. Learn how to deploy directly from GitHub to Azure, set up a sustainable deployment process, and automate your workflow with `azure-dev.yml`. This post guides you through each step, from configuring your pipeline to deploying manually from GitHub. Dive in to discover how Azure Developer CLI can streamline your cloud deployments.",published:!1,tags:["Cloud-native","Deploy","Azure Developer CLI","Azure"],updated:"2023-12-10 00:00 PST"},prevItem:{title:"React Vite Client UI: quick Todo app proof of concept",permalink:"/2023-12-28-cloud-native-006-client-todo.md"},nextItem:{title:"Supercharging DevOps: Streamlining Cloud Infrastructure with Azure Developer CLI",permalink:"/2023-11-21-cloud-native-devops.md"}},p={authorsImageUrls:[]},s=[{value:"Setup",id:"setup",level:2},{value:"Add <code>azure-dev.yml</code> GitHub action to deploy from source repository",id:"add-azure-devyml-github-action-to-deploy-from-source-repository",level:2},{value:"Run <code>azd pipeline config</code> to create deployment from source repository",id:"run-azd-pipeline-config-to-create-deployment-from-source-repository",level:2},{value:"Service principal for secure identity",id:"service-principal-for-secure-identity",level:2},{value:"GitHub action variables to use service principal",id:"github-action-variables-to-use-service-principal",level:2},{value:"Test a deployment from source repository to Azure with Azure Developer CLI",id:"test-a-deployment-from-source-repository-to-azure-with-azure-developer-cli",level:2},{value:"Verify deployment from source repository to Azure with Azure Developer CLI",id:"verify-deployment-from-source-repository-to-azure-with-azure-developer-cli",level:2},{value:"Deployment from source code works",id:"deployment-from-source-code-works",level:2},{value:"Tips",id:"tips",level:2},{value:"Summary",id:"summary",level:2}],u={toc:s},c="wrapper";function d(e){let{components:t,...i}=e;return(0,a.kt)(c,(0,r.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"This ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dfberry/cloud-native-todo/tree/005-deploy-from-github"},"fifth iteration")," of the cloud-native project, ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dfberry/cloud-native-todo"},"https://github.com/dfberry/cloud-native-todo"),", added the changes to deploy from the GitHub repository:"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://youtu.be/CSZ6dMEkO4Q"},"YouTube demo")),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Add ",(0,a.kt)("inlineCode",{parentName:"li"},"azure-dev.yml")," GitHub action to deploy from source code"),(0,a.kt)("li",{parentName:"ol"},"Run ",(0,a.kt)("inlineCode",{parentName:"li"},"azd pipeline config"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"push action to repo"),(0,a.kt)("li",{parentName:"ul"},"create Azure service principal with appropriate cloud permissions"),(0,a.kt)("li",{parentName:"ul"},"create GitHub variables to connect to Azure service principal")))),(0,a.kt)("h2",{id:"setup"},"Setup"),(0,a.kt)("p",null,"In the ",(0,a.kt)("a",{parentName:"p",href:"https://dev.to/dfberry/supercharging-devops-streamlining-cloud-infrastructure-with-azure-developer-cli-2o98"},"fourth iteration"),", the project added the infrastructure as code (IaC), created with Azure Developer CLI with ",(0,a.kt)("inlineCode",{parentName:"p"},"azd init"),". This created the ",(0,a.kt)("inlineCode",{parentName:"p"},"./azure.yml")," file and the ",(0,a.kt)("inlineCode",{parentName:"p"},"./infra")," folder. Using the infrastructure, the project was deployed with ",(0,a.kt)("inlineCode",{parentName:"p"},"azd up")," from the local development environment (my local computer). That isn't sustainable or desirable. Let's change that so deployment happens from the source code repository."),(0,a.kt)("h2",{id:"add-azure-devyml-github-action-to-deploy-from-source-repository"},"Add ",(0,a.kt)("inlineCode",{parentName:"h2"},"azure-dev.yml")," GitHub action to deploy from source repository"),(0,a.kt)("p",null,"The easiest way to find the correct ",(0,a.kt)("inlineCode",{parentName:"p"},"azure-dev.yml")," is to use the official documentation to find the ",(0,a.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/configure-devops-pipeline?tabs=GitHub"},"template")," closest to your deployed resources and sample. "),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Browser screenshot of the Azure Developer CLI template table by language and host",src:o(440).Z,width:"1780",height:"1340"})),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Copy the contents of the template's ",(0,a.kt)("inlineCode",{parentName:"p"},"azure-dev.yml")," file from the sample repository into your own source control in the ",(0,a.kt)("inlineCode",{parentName:"p"},"./github/workflows/azure-dev.yml")," file. "),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of template source code azure-dev.yml",src:o(5216).Z,width:"1868",height:"1340"}))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Add the ",(0,a.kt)("strong",{parentName:"p"},"name")," to the top of the file if one isn't there, such as ",(0,a.kt)("inlineCode",{parentName:"p"},"name: AZD Deploy"),". This helps distinguish between other actions you have the in repository. "),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre"},"name: AZD Deploy\n\non:\n  workflow_dispatch:\n  push:\n    # Run when commits are pushed to mainline branch (main or master)\n    # Set this to the mainline branch you are using\n    branches:\n      - main\n      - master\n"))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Make sure the ",(0,a.kt)("inlineCode",{parentName:"p"},"azure-dev.yml")," also has the ",(0,a.kt)("inlineCode",{parentName:"p"},"workflow_dispatch")," as one of the ",(0,a.kt)("inlineCode",{parentName:"p"},"on")," settings. This allows you to deploy manually from GitHub. "))),(0,a.kt)("h2",{id:"run-azd-pipeline-config-to-create-deployment-from-source-repository"},"Run ",(0,a.kt)("inlineCode",{parentName:"h2"},"azd pipeline config")," to create deployment from source repository"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Switch to a branch you intend to be used for deployment such as ",(0,a.kt)("inlineCode",{parentName:"p"},"main")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"dev"),". The current branch name is used to create the federated credentials. ")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Run ",(0,a.kt)("inlineCode",{parentName:"p"},"azd pipeline config"))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"If asked, log into your source control.")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"When the process is complete, copy the ",(0,a.kt)("strong",{parentName:"p"},"service principal")," name and id. Mine looked something like: "),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre"},"az-dev-12-04-2023-18-11-29 (abc2c40c-b547-4dca-b591-1a4590963066)\n")),(0,a.kt)("p",{parentName:"li"},"When you need to add new configurations, you'll need to know either the name or ID to find it in the Microsoft Entra ID in the Azure portal."))),(0,a.kt)("h2",{id:"service-principal-for-secure-identity"},"Service principal for secure identity"),(0,a.kt)("p",null,"The process created your service principal which is the identity used to deploy securely from GitHub to Azure. If you search for service principal in the Azure portal, it takes you Enterprise app. Don't go there. An Enterprise app is meant for other people, like customers, to log in. That's a different kind of thing. When you want to find your deployment service principal, search for ",(0,a.kt)("strong",{parentName:"p"},"Microsoft Entra ID"),". "),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Go ahead ... find your service principal in the ",(0,a.kt)("a",{parentName:"p",href:"https://portal.azure.com/"},"Azure portal")," by searching for ",(0,a.kt)("strong",{parentName:"p"},"Microsoft Entra ID"),". The service principals are listed under the ",(0,a.kt)("strong",{parentName:"p"},"Manage -> App registrations -> All applications"),". ")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Select your service principal. This takes you to the ",(0,a.kt)("strong",{parentName:"p"},"Default Directory | App registrations"),".")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"On the ",(0,a.kt)("strong",{parentName:"p"},"Manage -> Certificates & secrets"),", view the federated credentials. "),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of federated credentials",src:o(4979).Z,width:"1900",height:"801"}))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"On the ",(0,a.kt)("strong",{parentName:"p"},"Manage -> Roles and Administrators"),", view the ",(0,a.kt)("strong",{parentName:"p"},"Cloud Application Administrator"),". "))),(0,a.kt)("p",null,"When you want to remove this service principal, you can come back to the portal, or use ",(0,a.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/cli/azure/"},"Azure CLI"),"'s ",(0,a.kt)("inlineCode",{parentName:"p"},"az ad sp delete --id <service-principal-id>")),(0,a.kt)("h2",{id:"github-action-variables-to-use-service-principal"},"GitHub action variables to use service principal"),(0,a.kt)("p",null,"The process added the service principal information to your GitHub repository as action variables. "),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Open your GitHub repository in a browser and go to ",(0,a.kt)("strong",{parentName:"p"},"Settings"),".")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Select ",(0,a.kt)("strong",{parentName:"p"},"Security -> Secrets and variable -> Actions"),".")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Select variables to see the service principal variables. "),(0,a.kt)("p",{parentName:"li"},"![Browser screenshot of GitHub repository showing settings page with secure action variables table which lists the values necessary to deploy to Azure securely.]")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Take a look at the actions run as part of the push from the process. The ",(0,a.kt)("strong",{parentName:"p"},"Build/Test")," action ran successfully when AZD pushed the new pipeline file in commit ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dfberry/cloud-native-todo/commit/24f78f4336e7bed72801a620176c04f0330b198e"},"24f78f4"),". Look for the actions that run based on that commit. "),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of GitHub actions run with the commit",src:o(1927).Z,width:"1906",height:"410"})),(0,a.kt)("p",{parentName:"li"},"Verify that the action ran successfully. Since this was the only change, the application should still have the ",(0,a.kt)("inlineCode",{parentName:"p"},"1.0.1")," version number in the response from a root request. "))),(0,a.kt)("p",null,"When you want to remove these, you can come back to your repo's settings. "),(0,a.kt)("h2",{id:"test-a-deployment-from-source-repository-to-azure-with-azure-developer-cli"},"Test a deployment from source repository to Azure with Azure Developer CLI"),(0,a.kt)("p",null,"To test the deployment, make a change and push to the repository. This can be in a branch you merge back into the default branch, or you can stay on the default branch to make the change and push. The important thing is that a push is made to the default branch to run the GitHub action."),(0,a.kt)("p",null,"In this project, a simple change to the API version in the ",(0,a.kt)("inlineCode",{parentName:"p"},"./api-todo/package.json"),"'s ",(0,a.kt)("strong",{parentName:"p"},"version")," property is enough of a change. And this change is reflected in the home route and the returned headers from an API call. "),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Change the version from ",(0,a.kt)("inlineCode",{parentName:"li"},"1.0.1")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1.0.2"),"."),(0,a.kt)("li",{parentName:"ol"},"Push the change to main. ")),(0,a.kt)("h2",{id:"verify-deployment-from-source-repository-to-azure-with-azure-developer-cli"},"Verify deployment from source repository to Azure with Azure Developer CLI"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Open the repository's actions panel to see the action to deploy complete. "),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of actions run from version change and push",src:o(5333).Z,width:"1906",height:"292"}))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Select the ",(0,a.kt)("strong",{parentName:"p"},"AZD Deploy")," for that commit to understand it is the same deployment as the local deployment. Continue to drill into the action until you see the individual steps."),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of action steps for deploying from GitHub to Azure from Azure Developer CLI",src:o(6418).Z,width:"1906",height:"932"}))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Select the ",(0,a.kt)("strong",{parentName:"p"},"Deploy Application")," step and scroll to the bottom of that step. It shows the same deployed endpoint for the api-todo as the deployment from my local computer. "),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of Deploy Application step in GitHub action results",src:o(1599).Z,width:"1906",height:"976"}))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Open the endpoint in a browser to see the updated version. "),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("img",{alt:"Browser screenshot of updated application api-todo with new version number 1.0.2",src:o(3285).Z,width:"1906",height:"254"})))),(0,a.kt)("h2",{id:"deployment-from-source-code-works"},"Deployment from source code works"),(0,a.kt)("p",null,"This application can now deploy the API app from source code with Azure Developer CLI. "),(0,a.kt)("h2",{id:"tips"},"Tips"),(0,a.kt)("p",null,"After some trial and error, here are the tips I would suggest for this process:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Add a meaningful name to the ",(0,a.kt)("inlineCode",{parentName:"li"},"azure-dev.yml"),". You will have several actions eventually, make sure the name of the deployment action is short and distinct. "),(0,a.kt)("li",{parentName:"ul"},"Run ",(0,a.kt)("inlineCode",{parentName:"li"},"azd pipeline config")," with the ",(0,a.kt)("inlineCode",{parentName:"li"},"--principal-name")," switch in order to have a meaningful name. ")),(0,a.kt)("h2",{id:"summary"},"Summary"),(0,a.kt)("p",null,"This was an easy process for such an easy project. I'm interested to see how the infrastructure as code experience changes and the project changes."))}d.isMDXComponent=!0},5216:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/azure-dev-yml-e82a6d3dc82ff427ca895931806eaa09.png"},4979:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/azure-portal-federated-credentials-967b7f6e0c9006773808e8c0bad965b3.png"},3285:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/browser-api-todo-app-version-update-3ee9cf07fda7abde78837cada1203ecd.png"},440:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/browser-azure-developer-cli-template-by-language-and-host-e1689a4311de639739374a70cece6999.png"},6418:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/github-action-azd-deploy-steps-successful-2d1ea573cc6a7ef03e994be33d8c8142.png"},1599:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/github-action-deploy-application-step-9ab186699bc85feaff05928d4aea827b.png"},1927:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/github-action-initial-deploy-action-edd41f93b7d1378d8acdc73ceaa10539.png"},5333:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/github-action-update-version-actions-8e206327342d65345bdd62fa182936ef.png"}}]);