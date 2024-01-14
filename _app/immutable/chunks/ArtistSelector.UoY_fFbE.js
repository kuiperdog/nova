import{s as B,n as z,r as G,c as k,b as M}from"./scheduler.7ddvVGuS.js";import{S as N,i as O,g as m,s as V,h as p,j as b,f as d,c as q,k as h,E as g,a as v,x as S,z as A,A as U}from"./index.XmLGRVaW.js";import{C as j,e as I}from"./apis.W9dsQ1rZ.js";import{g as w}from"./assets.UUTeAooi.js";const F=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global,{window:H}=F;function T(n,e,l){const t=n.slice();return t[9]=e[l],t}function J(n){let e;return{c(){e=m("div"),this.h()},l(l){e=p(l,"DIV",{class:!0}),b(e).forEach(d),this.h()},h(){h(e,"class","placeholder svelte-r55zbe")},m(l,t){v(l,e,t)},p:z,d(l){l&&d(e)}}}function K(n){let e,l,t;return{c(){e=m("img"),this.h()},l(s){e=p(s,"IMG",{class:!0,src:!0,alt:!0}),this.h()},h(){h(e,"class","logo svelte-r55zbe"),k(e.src,l=w(n[0]).logo)||h(e,"src",l),h(e,"alt",t=n[0].title),g(e,"tripleS",n[0].name==="tripleS")},m(s,a){v(s,e,a)},p(s,a){a&1&&!k(e.src,l=w(s[0]).logo)&&h(e,"src",l),a&1&&t!==(t=s[0].title)&&h(e,"alt",t),a&1&&g(e,"tripleS",s[0].name==="tripleS")},d(s){s&&d(e)}}}function C(n){let e,l=I(n[1].filter(n[6])),t=[];for(let s=0;s<l.length;s+=1)t[s]=D(T(n,l,s));return{c(){e=m("div");for(let s=0;s<t.length;s+=1)t[s].c();this.h()},l(s){e=p(s,"DIV",{class:!0});var a=b(e);for(let i=0;i<t.length;i+=1)t[i].l(a);a.forEach(d),this.h()},h(){h(e,"class","popup svelte-r55zbe")},m(s,a){v(s,e,a);for(let i=0;i<t.length;i+=1)t[i]&&t[i].m(e,null)},p(s,a){if(a&7){l=I(s[1].filter(s[6]));let i;for(i=0;i<l.length;i+=1){const f=T(s,l,i);t[i]?t[i].p(f,a):(t[i]=D(f),t[i].c(),t[i].m(e,null))}for(;i<t.length;i+=1)t[i].d(1);t.length=l.length}},d(s){s&&d(e),U(t,s)}}}function D(n){let e,l,t,s,a,i,f;function u(){return n[7](n[9])}return{c(){e=m("button"),l=m("img"),a=V(),this.h()},l(o){e=p(o,"BUTTON",{class:!0});var r=b(e);l=p(r,"IMG",{class:!0,src:!0,alt:!0}),a=q(r),r.forEach(d),this.h()},h(){h(l,"class","logo svelte-r55zbe"),k(l.src,t=w(n[9]).logo)||h(l,"src",t),h(l,"alt",s=n[9].title),g(l,"tripleS",n[9].name==="tripleS"),h(e,"class","svelte-r55zbe")},m(o,r){v(o,e,r),S(e,l),S(e,a),i||(f=A(e,"click",u),i=!0)},p(o,r){n=o,r&3&&!k(l.src,t=w(n[9]).logo)&&h(l,"src",t),r&3&&s!==(s=n[9].title)&&h(l,"alt",s),r&3&&g(l,"tripleS",n[9].name==="tripleS")},d(o){o&&d(e),i=!1,f()}}}function L(n){let e,l,t,s,a;function i(r,_){return r[0]?K:J}let f=i(n),u=f(n),o=n[2]&&C(n);return{c(){e=m("div"),l=m("button"),u.c(),t=V(),o&&o.c(),this.h()},l(r){e=p(r,"DIV",{class:!0});var _=b(e);l=p(_,"BUTTON",{class:!0});var c=b(l);u.l(c),c.forEach(d),t=q(_),o&&o.l(_),_.forEach(d),this.h()},h(){h(l,"class","selected svelte-r55zbe"),g(l,"open",n[2]),h(e,"class","container svelte-r55zbe")},m(r,_){v(r,e,_),S(e,l),u.m(l,null),S(e,t),o&&o.m(e,null),n[8](e),s||(a=[A(H,"mouseup",n[4]),A(l,"click",n[5])],s=!0)},p(r,[_]){f===(f=i(r))&&u?u.p(r,_):(u.d(1),u=f(r),u&&(u.c(),u.m(l,null))),_&4&&g(l,"open",r[2]),r[2]?o?o.p(r,_):(o=C(r),o.c(),o.m(e,null)):o&&(o.d(1),o=null)},i:z,o:z,d(r){r&&d(e),u.d(),o&&o.d(),n[8](null),s=!1,G(a)}}}function P(n,e,l){let{selected:t=void 0}=e,s;j.artists().then(c=>{if(l(1,s=c),!t){const E=window.localStorage.getItem("defaultArtist");l(0,t=E?c.find(y=>y.name===E):c[0])}});function a(c){f.contains(c.target)||l(2,i=!1)}let i=!1,f;const u=()=>l(2,i=!i),o=c=>c!==t,r=c=>{l(0,t=c),l(2,i=!1)};function _(c){M[c?"unshift":"push"](()=>{f=c,l(3,f)})}return n.$$set=c=>{"selected"in c&&l(0,t=c.selected)},[t,s,i,f,a,u,o,r,_]}class Y extends N{constructor(e){super(),O(this,e,P,L,B,{selected:0})}}export{Y as A,F as g};