"use strict";(self.webpackChunkdocusaurus_blog_with_search=self.webpackChunkdocusaurus_blog_with_search||[]).push([[7920],{8374:(e,t,a)=>{a.r(t),a.d(t,{default:()=>w});var n=a(7294),r=a(2263),c=a(3929),s=a(5742),l=a(9960),u=a(6550),o=a(412);const m="q";const h=function(){const e=(0,u.k6)(),t=(0,u.TH)(),{siteConfig:{baseUrl:a}}=(0,r.Z)();return{searchValue:o.Z.canUseDOM&&new URLSearchParams(t.search).get(m)||"",updateSearchPath:a=>{const n=new URLSearchParams(t.search);a?n.set(m,a):n.delete(m),e.replace({search:n.toString()})},generateSearchPageLink:e=>`${a}search?q=${encodeURIComponent(e)}`}};var i=a(22),p=a(8202),d=a(2539),_=a(726),f=a(1073),I=a(311),g=a(1029);function E(e,t){return e.replace(/\{\{\s*(\w+)\s*\}\}/g,((e,a)=>Object.prototype.hasOwnProperty.call(t,a)?String(t[a]):e))}const y={searchQueryInput:"searchQueryInput_CFBF",searchResultItem:"searchResultItem_U687",searchResultItemPath:"searchResultItemPath_uIbk",searchResultItemSummary:"searchResultItemSummary_oZHr"};function S(e){let{searchResult:{document:t,type:a,page:r,tokens:c,metadata:s}}=e;const u=0===a,o=2===a,m=(u?t.b:r.b).slice(),h=o?t.s:t.t;return u||m.push(r.t),n.createElement("article",{className:y.searchResultItem},n.createElement("h2",null,n.createElement(l.Z,{to:t.u+(t.h||""),dangerouslySetInnerHTML:{__html:o?(0,d.C)(h,c):(0,_.o)(h,(0,f.m)(s,"t"),c,100)}})),m.length>0&&n.createElement("p",{className:y.searchResultItemPath},m.join(" \u203a ")),o&&n.createElement("p",{className:y.searchResultItemSummary,dangerouslySetInnerHTML:{__html:(0,_.o)(t.t,(0,f.m)(s,"t"),c,100)}}))}const w=function(){const{siteConfig:{baseUrl:e}}=(0,r.Z)(),{searchValue:t,updateSearchPath:a}=h(),[l,u]=(0,n.useState)(t),[o,m]=(0,n.useState)(),[d,_]=(0,n.useState)(),f=(0,n.useMemo)((()=>l?E(g.Iz.search_results_for,{keyword:l}):g.Iz.search_the_documentation),[l]);(0,n.useEffect)((()=>{a(l),o&&(l?o(l,(e=>{_(e)})):_(void 0))}),[l,o]);const w=(0,n.useCallback)((e=>{u(e.target.value)}),[]);return(0,n.useEffect)((()=>{t&&t!==l&&u(t)}),[t]),(0,n.useEffect)((()=>{!async function(){const{wrappedIndexes:t,zhDictionary:a}=await(0,i.w)(e);m((()=>(0,p.v)(t,a,100)))}()}),[e]),n.createElement(c.Z,{title:f},n.createElement(s.Z,null,n.createElement("meta",{property:"robots",content:"noindex, follow"})),n.createElement("div",{className:"container margin-vert--lg"},n.createElement("h1",null,f),n.createElement("input",{type:"search",name:"q",className:y.searchQueryInput,"aria-label":"Search",onChange:w,value:l,autoComplete:"off",autoFocus:!0}),!o&&l&&n.createElement("div",null,n.createElement(I.Z,null)),d&&(d.length>0?n.createElement("p",null,E(1===d.length?g.Iz.count_documents_found:g.Iz.count_documents_found_plural,{count:d.length})):n.createElement("p",null,g.Iz.no_documents_were_found)),n.createElement("section",null,d&&d.map((e=>n.createElement(S,{key:e.document.i,searchResult:e}))))))}}}]);