import{s as b,h as w,c as F,u as j,i as C,j as L}from"./scheduler.7ddvVGuS.js";import{S as y,i as B,g as m,s as k,h as p,j as E,c as q,f as v,k as o,a as I,x as f,z as S,d as z,t as A}from"./index.XmLGRVaW.js";const G="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='%23FFFFFF'%20height='24'%20viewBox='0%20-960%20960%20960'%20width='24'%3e%3cpath%20d='m382-388%20321-321q19-19%2045-19t45%2019q19%2019%2019%2045t-19%2045L427-253q-19%2019-45%2019t-45-19L167-423q-19-19-19-45t19-45q19-19%2045-19t45%2019l125%20125Z'/%3e%3c/svg%3e";function M(n){let e,c,h,r,s,u,i,_,g;const d=n[2].default,a=w(d,n,n[1],null);return{c(){e=m("label"),c=m("img"),r=k(),s=m("input"),u=k(),a&&a.c(),this.h()},l(t){e=p(t,"LABEL",{class:!0});var l=E(e);c=p(l,"IMG",{src:!0,alt:!0,class:!0}),r=q(l),s=p(l,"INPUT",{type:!0,class:!0}),u=q(l),a&&a.l(l),l.forEach(v),this.h()},h(){F(c.src,h=G)||o(c,"src",h),o(c,"alt","Check"),o(c,"class","svelte-ah8tjq"),o(s,"type","checkbox"),o(s,"class","svelte-ah8tjq"),o(e,"class","svelte-ah8tjq")},m(t,l){I(t,e,l),f(e,c),f(e,r),f(e,s),s.checked=n[0],f(e,u),a&&a.m(e,null),i=!0,_||(g=S(s,"change",n[3]),_=!0)},p(t,[l]){l&1&&(s.checked=t[0]),a&&a.p&&(!i||l&2)&&j(a,d,t,t[1],i?L(d,t[1],l,null):C(t[1]),null)},i(t){i||(z(a,t),i=!0)},o(t){A(a,t),i=!1},d(t){t&&v(e),a&&a.d(t),_=!1,g()}}}function N(n,e,c){let{$$slots:h={},$$scope:r}=e,{checked:s=!1}=e;function u(){s=this.checked,c(0,s)}return n.$$set=i=>{"checked"in i&&c(0,s=i.checked),"$$scope"in i&&c(1,r=i.$$scope)},[s,r,h,u]}class U extends y{constructor(e){super(),B(this,e,N,M,b,{checked:0})}}export{U as C};