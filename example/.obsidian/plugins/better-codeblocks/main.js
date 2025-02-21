//@ts-nocheck
var m=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var i=(r,e)=>m(r,"name",{value:e,configurable:!0});var v=(r,e)=>{for(var t in e)m(r,t,{get:e[t],enumerable:!0})},T=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of P(e))!E.call(r,n)&&n!==t&&m(r,n,{get:()=>e[n],enumerable:!(o=M(e,n))||o.enumerable});return r};var A=r=>T(m({},"__esModule",{value:!0}),r);var _={};v(_,{default:()=>N});module.exports=A(_);var a=require("obsidian");var b=require("obsidian");function h(r){return r[0]}i(h,"first");function y(r,e){let t=typeof r=="string"?new RegExp(r,"g"):new RegExp(r.source,r.flags||"g");return[...e.matchAll(t)].map(h)}i(y,"matchAll");function g(r){let e=r.split(/<\S*>/),t=y(/<\S*>.*<\/\S*>/,r),o=document.createDocumentFragment();for(let n of e){let c=t.find(f=>f.includes(n)),d=w(c||`<span>${n}</span>`);o.appendChild(d)}return o}i(g,"getMessageFragment");function w(r){return new DOMParser().parseFromString(r.trim(),"text/html").getElementsByTagName("body")[0].firstChild||document.createElement("span")}i(w,"stringToHtml");var s=class r{constructor(e){this.plugin=e}static{i(this,"Announcer")}static#e=null;static plugin;static initialize(e){this.#e||(this.plugin=e,this.#e=new r(this.plugin))}static get instance(){if(!this.#e)throw new Error("Announcer not initialized");return this.#e}createNotice(e,t=1e4){let o=typeof e=="string"?g(e):e,n=document.createElement("footer");return n.textContent=this.plugin.manifest.name+" Plugin",n.style.fontSize="xx-small",n.style.opacity="0.5",n.style.borderTop="1px solid var(--text-muted)",n.style.marginTop="1em",n.style.paddingTop="0.5em",n.style.textAlign="right",o.appendChild(n),new b.Notice(o,t)}success(e,t=15e3){return this.createNotice(`✨ ${e}`,t)}info(e,t=15e3){return this.createNotice(`💬 ${e}`,t)}failure(e,t=15e3){return this.createNotice(`❌ ${e}`,t)}warn(e,t=1e4){let o=document.createDocumentFragment(),n=document.createElement("span");return n.innerHTML="⚠️",n.classList.add("emoji"),o.append(n," ",g(e)),this.createNotice(o,t)}cannotRun(e,t){return this.warn(`The task <strong><u>${e}</u></strong> cannot be run ${t}.`)}error(e,t,o=2e4){return this.failure(`<p>${e}</p><code>${JSON.stringify({name:t.name,message:t.message,cause:t.cause},null,2)}</code>`,o)}};function p(r,e){let t=r[e],o={pattern:/^\b$/};return t?t instanceof RegExp?{pattern:t}:Array.isArray(t)?o:t:o}i(p,"getGrammarToken");function k(){let r="if (stream != state.thisLine.stream)",{CodeMirror:e}=window,t=e.modes.markdown;if(t.isPatch)return;let o=t.toString(),n=o.indexOf(r),c=o.substring(0,n).replace("function(cmCfg, modeCfg)",""),d=o.substring(n),C=[c,"state.quote = 0;",d].join("").replace("modeCfg.strikethrough = false;","modeCfg.strikethrough = true;"),u=new Function("cmCfg","modeCfg",`"use strict"; return function markdown(cmCfg, modeCfg) ${C};`)();Object.defineProperty(u,"dependencies",{enumerable:!0,configurable:!0,value:["xml"]}),Object.defineProperty(u,"isPatch",{enumerable:!1,configurable:!1,value:!0}),e.defineMode("markdown",u)}i(k,"patchCodeMirror");function x(r){let e=r.languages.markdown,t={...p(e,"bold"),pattern:/\*{2}[^\n\r]+\*{2}|_{2}[^\n\r]+_{2}/gm,alias:["inline"]},o={...p(e,"italic"),pattern:/\*{1}[^\n\r *]{1,}[^\n\r*]+[^\n\r *]{1,}\*{1}(?!.*\*)|_{1}[^\n\r _]{1,}[^\n\r_]+[^\n\r _]{1,}_{1}(?!.*_)/gm,alias:["inline"]},n={blockquote:{alias:["block","thematic-break"],pattern:/^>{1,} ?[^\n\r]*[\n|\r]{0,}/gm,inside:{bold:t,italic:o}},bold:t,italic:o,list:{...p(e,"list"),alias:["block","thematic-break"],pattern:/^[ \t]{0,}(\d{1,}\. [^\n\r]*[\n|\r]{0,1}|[-*+] [^\n\r]*[\n|\r]{0,1})/gm,greedy:!1,lookbehind:!1,inside:{bold:t,italic:o}}};r.languages.markdown=r.languages.extend("markdown",n),r.languages.md=r.languages.extend("md",n)}i(x,"patchPrism");var l=class extends a.Plugin{static{i(this,"BetterCodeBlocksPlugin")}onload(){s.initialize(this),this.app.workspace.onLayoutReady(async()=>{try{let e=this.app.workspace.getActiveViewOfType(a.MarkdownView),t=await(0,a.loadPrism)();k(),x(t),console.log({view:e}),e&&e.file&&e.previewMode.rerender(!0),t.highlightAll()}catch(e){if(e instanceof Error){s.instance.error(e?.message,e);return}s.instance.error("Something went wrong",e)}})}};var N=l;
