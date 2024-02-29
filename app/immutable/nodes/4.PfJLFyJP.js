import{s as me,n as x,c as ue,e as ce,y as ze}from"../chunks/scheduler.nSpB3e7h.js";import{S as be,i as ke,e as u,t as A,s as E,c as d,a as m,b as W,d as i,f as j,r as De,u as f,g as V,h as n,j as z,y as ae,v as ge,x as Pe,w as ee,z as Ve,k as de,l as _e,m as he,o as ne,A as Fe,n as ie,p as ve,B as Ze}from"../chunks/index.EYyPxix3.js";import{$ as je,P as Ce,C as Ue,e as fe,j as Je,S as oe,Z as qe}from"../chunks/apis.rP1ghAGS.js";import{s as Se,a as $e}from"../chunks/status_warning.C_r86Sei.js";import{s as Ie}from"../chunks/status_error.K3rrPbxW.js";import{a as Ke}from"../chunks/units.XFe2sYSS.js";import{p as Ge}from"../chunks/stores.fqi9kFjr.js";import{p as Le}from"../chunks/entry.NXMp9NvT.js";function Qe(a){let e;return{c(){e=u("div"),this.h()},l(t){e=d(t,"DIV",{class:!0}),m(e).forEach(i),this.h()},h(){f(e,"class","textPlaceholder"),ae(e,"width","110px")},m(t,l){V(t,e,l)},p:x,d(t){t&&i(e)}}}function Xe(a){let e,t;return{c(){e=u("p"),t=A(a[4]),this.h()},l(l){e=d(l,"P",{class:!0});var s=m(e);t=W(s,a[4]),s.forEach(i),this.h()},h(){f(e,"class","message svelte-1oj9i46")},m(l,s){V(l,e,s),n(e,t)},p(l,s){s&16&&z(t,l[4])},d(l){l&&i(e)}}}function Ye(a){let e;return{c(){e=u("div"),this.h()},l(t){e=d(t,"DIV",{class:!0}),m(e).forEach(i),this.h()},h(){f(e,"class","statusPlaceholder svelte-1oj9i46")},m(t,l){V(t,e,l)},p:x,d(t){t&&i(e)}}}function xe(a){let e,t;return{c(){e=u("img"),this.h()},l(l){e=d(l,"IMG",{src:!0,alt:!0,class:!0}),this.h()},h(){ce(e.src,t=a[1])||f(e,"src",t),f(e,"alt","Status"),f(e,"class","svelte-1oj9i46")},m(l,s){V(l,e,s)},p(l,s){s&2&&!ce(e.src,t=l[1])&&f(e,"src",t)},d(l){l&&i(e)}}}function et(a){let e;return{c(){e=u("div"),this.h()},l(t){e=d(t,"DIV",{class:!0}),m(e).forEach(i),this.h()},h(){f(e,"class","statusPlaceholder svelte-1oj9i46")},m(t,l){V(t,e,l)},p:x,d(t){t&&i(e)}}}function tt(a){let e,t,l;return{c(){e=u("img"),this.h()},l(s){e=d(s,"IMG",{src:!0,alt:!0,title:!0,class:!0}),this.h()},h(){ce(e.src,t=a[2])||f(e,"src",t),f(e,"alt","Status"),f(e,"title",l=a[5]?`Gas: ${Math.round(a[5]).toLocaleString("en-US")} Gwei`:""),f(e,"class","svelte-1oj9i46")},m(s,r){V(s,e,r)},p(s,r){r&4&&!ce(e.src,t=s[2])&&f(e,"src",t),r&32&&l!==(l=s[5]?`Gas: ${Math.round(s[5]).toLocaleString("en-US")} Gwei`:"")&&f(e,"title",l)},d(s){s&&i(e)}}}function lt(a){let e;return{c(){e=u("div"),this.h()},l(t){e=d(t,"DIV",{class:!0}),m(e).forEach(i),this.h()},h(){f(e,"class","statusPlaceholder svelte-1oj9i46")},m(t,l){V(t,e,l)},p:x,d(t){t&&i(e)}}}function st(a){let e,t;return{c(){e=u("img"),this.h()},l(l){e=d(l,"IMG",{src:!0,alt:!0,class:!0}),this.h()},h(){ce(e.src,t=a[3])||f(e,"src",t),f(e,"alt","Status"),f(e,"class","svelte-1oj9i46")},m(l,s){V(l,e,s)},p(l,s){s&8&&!ce(e.src,t=l[3])&&f(e,"src",t)},d(l){l&&i(e)}}}function at(a){let e,t,l,s=a[0]("widget.status.title")+"",r,o,c,_,v,h,g,w,y="Cosmo:",b,p,k,I,P,O,B="Polygon:",H,G,J,Q,F,K,X="Nova:",q;function N(S,U){return S[1]&&S[2]&&S[3]?Xe:Qe}let R=N(a),T=R(a);function re(S,U){return S[1]?xe:Ye}let te=re(a),M=te(a);function D(S,U){return S[2]?tt:et}let C=D(a),$=C(a);function L(S,U){return S[3]?st:lt}let Y=L(a),Z=Y(a);return{c(){e=u("div"),t=u("div"),l=u("b"),r=A(s),o=E(),T.c(),c=E(),_=u("hr"),v=E(),h=u("div"),g=u("div"),w=u("p"),w.textContent=y,b=E(),M.c(),p=E(),k=u("hr"),I=E(),P=u("div"),O=u("p"),O.textContent=B,H=E(),$.c(),G=E(),J=u("hr"),Q=E(),F=u("div"),K=u("p"),K.textContent=X,q=E(),Z.c(),this.h()},l(S){e=d(S,"DIV",{class:!0});var U=m(e);t=d(U,"DIV",{class:!0});var se=m(t);l=d(se,"B",{});var pe=m(l);r=W(pe,s),pe.forEach(i),o=j(se),T.l(se),se.forEach(i),c=j(U),_=d(U,"HR",{}),v=j(U),h=d(U,"DIV",{class:!0});var le=m(h);g=d(le,"DIV",{class:!0});var we=m(g);w=d(we,"P",{class:!0,"data-svelte-h":!0}),De(w)!=="svelte-26le49"&&(w.textContent=y),b=j(we),M.l(we),we.forEach(i),p=j(le),k=d(le,"HR",{}),I=j(le),P=d(le,"DIV",{class:!0});var ye=m(P);O=d(ye,"P",{class:!0,"data-svelte-h":!0}),De(O)!=="svelte-10he4ig"&&(O.textContent=B),H=j(ye),$.l(ye),ye.forEach(i),G=j(le),J=d(le,"HR",{}),Q=j(le),F=d(le,"DIV",{class:!0});var Ee=m(F);K=d(Ee,"P",{class:!0,"data-svelte-h":!0}),De(K)!=="svelte-4bipqc"&&(K.textContent=X),q=j(Ee),Z.l(Ee),Ee.forEach(i),le.forEach(i),U.forEach(i),this.h()},h(){f(t,"class","header"),f(w,"class","svelte-1oj9i46"),f(g,"class","item svelte-1oj9i46"),f(O,"class","svelte-1oj9i46"),f(P,"class","item svelte-1oj9i46"),f(K,"class","svelte-1oj9i46"),f(F,"class","item svelte-1oj9i46"),f(h,"class","content svelte-1oj9i46"),f(e,"class","widget svelte-1oj9i46")},m(S,U){V(S,e,U),n(e,t),n(t,l),n(l,r),n(t,o),T.m(t,null),n(e,c),n(e,_),n(e,v),n(e,h),n(h,g),n(g,w),n(g,b),M.m(g,null),n(h,p),n(h,k),n(h,I),n(h,P),n(P,O),n(P,H),$.m(P,null),n(h,G),n(h,J),n(h,Q),n(h,F),n(F,K),n(F,q),Z.m(F,null)},p(S,[U]){U&1&&s!==(s=S[0]("widget.status.title")+"")&&z(r,s),R===(R=N(S))&&T?T.p(S,U):(T.d(1),T=R(S),T&&(T.c(),T.m(t,null))),te===(te=re(S))&&M?M.p(S,U):(M.d(1),M=te(S),M&&(M.c(),M.m(g,null))),C===(C=D(S))&&$?$.p(S,U):($.d(1),$=C(S),$&&($.c(),$.m(P,null))),Y===(Y=L(S))&&Z?Z.p(S,U):(Z.d(1),Z=Y(S),Z&&(Z.c(),Z.m(F,null)))},i:x,o:x,d(S){S&&i(e),T.d(),M.d(),$.d(),Z.d()}}}function rt(a,e,t){let l;ue(a,je,w=>t(0,l=w));let{data:s}=e,r,o,c,_=l("widget.status.no_errors"),v;async function h(){try{if(!await(await fetch(Ue.URL)).json())throw new Error;t(1,r=$e)}catch{t(1,r=Ie),t(4,_=l("widget.status.cosmo_unreachable"))}}async function g(){try{const w=await Ce.RPC.getFeeData();t(5,v=Number(Ke(w.gasPrice,"gwei"))),v>400?(t(2,o=Se),t(4,_=l("widget.status.blockchain_congested"))):t(2,o=$e)}catch{t(2,o=Ie),t(4,_=l("widget.status.blockchain_unreachable"))}}return h(),g(),a.$$set=w=>{"data"in w&&t(6,s=w.data)},a.$$.update=()=>{a.$$.dirty&65&&s&&(s.data?Ce.RPC.getBlockNumber().then(w=>{s.data.squidStatus.height<w-3800?(t(3,c=Se),t(4,_=l("widget.status.db_unsynced"))):t(3,c=$e)}):(t(3,c=Ie),t(4,_=l("widget.status.db_unreachable"))))},[l,r,o,c,_,v,s]}class ot extends be{constructor(e){super(),ke(this,e,rt,at,me,{data:6})}}function Me(a,e,t){const l=a.slice();return l[5]=e[t],l[7]=t,l}function Oe(a){let e,t,l,s=`${a[0]&&a[0].data?a[0].data[`day${a[7]+1}`].totalCount/a[1]*100:10}px`,r,o,c=new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(new Date().setDate(new Date().getDate()+a[7]+1))+"",_,v;return{c(){e=u("div"),t=u("div"),r=E(),o=u("p"),_=A(c),v=E(),this.h()},l(h){e=d(h,"DIV",{class:!0});var g=m(e);t=d(g,"DIV",{class:!0,title:!0}),m(t).forEach(i),r=j(g),o=d(g,"P",{class:!0});var w=m(o);_=W(w,c),w.forEach(i),v=j(g),g.forEach(i),this.h()},h(){f(t,"class","bar svelte-km24cf"),f(t,"title",l=a[0]&&a[0].data?a[0].data[`day${a[7]+1}`].totalCount.toLocaleString("en-US"):""),Pe(t,"loaded",a[0]&&a[0].data),ae(t,"height",s),f(o,"class","svelte-km24cf"),f(e,"class","day svelte-km24cf")},m(h,g){V(h,e,g),n(e,t),n(e,r),n(e,o),n(o,_),n(e,v)},p(h,g){g&1&&l!==(l=h[0]&&h[0].data?h[0].data[`day${h[7]+1}`].totalCount.toLocaleString("en-US"):"")&&f(t,"title",l),g&1&&Pe(t,"loaded",h[0]&&h[0].data),g&3&&s!==(s=`${h[0]&&h[0].data?h[0].data[`day${h[7]+1}`].totalCount/h[1]*100:10}px`)&&ae(t,"height",s)},d(h){h&&i(e)}}}function nt(a){let e;return{c(){e=u("div"),this.h()},l(t){e=d(t,"DIV",{class:!0}),m(e).forEach(i),this.h()},h(){f(e,"class","textPlaceholder"),ae(e,"width","50px")},m(t,l){V(t,e,l)},p:x,d(t){t&&i(e)}}}function it(a){let e,t=a[3](Object.keys(a[0].data).filter(Re).reduce(a[4],0))+"",l;return{c(){e=u("p"),l=A(t),this.h()},l(s){e=d(s,"P",{class:!0});var r=m(e);l=W(r,t),r.forEach(i),this.h()},h(){f(e,"class","svelte-km24cf")},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&9&&t!==(t=s[3](Object.keys(s[0].data).filter(Re).reduce(s[4],0))+"")&&z(l,t)},d(s){s&&i(e)}}}function ct(a){let e;return{c(){e=u("div"),this.h()},l(t){e=d(t,"DIV",{class:!0}),m(e).forEach(i),this.h()},h(){f(e,"class","textPlaceholder"),ae(e,"width","40px")},m(t,l){V(t,e,l)},p:x,d(t){t&&i(e)}}}function ft(a){let e,t=a[3](a[0].data.day7.totalCount)+"",l;return{c(){e=u("p"),l=A(t),this.h()},l(s){e=d(s,"P",{class:!0});var r=m(e);l=W(r,t),r.forEach(i),this.h()},h(){f(e,"class","svelte-km24cf")},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&9&&t!==(t=s[3](s[0].data.day7.totalCount)+"")&&z(l,t)},d(s){s&&i(e)}}}function ut(a){let e,t,l,s=a[2]("widget.objektsupply.title")+"",r,o,c,_,v,h,g,w,y,b,p,k=a[2]("widget.objektsupply.weekly_supply")+"",I,P,O,B,H,G,J,Q=a[2]("widget.objektsupply.daily_supply")+"",F,K,X=fe({length:7}),q=[];for(let D=0;D<X.length;D+=1)q[D]=Oe(Me(a,X,D));function N(D,C){return D[0]&&D[0].data?it:nt}let R=N(a),T=R(a);function re(D,C){return D[0]&&D[0].data?ft:ct}let te=re(a),M=te(a);return{c(){e=u("div"),t=u("div"),l=u("b"),r=A(s),o=E(),c=u("hr"),_=E(),v=u("div");for(let D=0;D<q.length;D+=1)q[D].c();h=E(),g=u("hr"),w=E(),y=u("div"),b=u("div"),p=u("b"),I=A(k),P=E(),T.c(),O=E(),B=u("hr"),H=E(),G=u("div"),J=u("b"),F=A(Q),K=E(),M.c(),this.h()},l(D){e=d(D,"DIV",{class:!0});var C=m(e);t=d(C,"DIV",{class:!0});var $=m(t);l=d($,"B",{});var L=m(l);r=W(L,s),L.forEach(i),$.forEach(i),o=j(C),c=d(C,"HR",{}),_=j(C),v=d(C,"DIV",{class:!0});var Y=m(v);for(let le=0;le<q.length;le+=1)q[le].l(Y);Y.forEach(i),h=j(C),g=d(C,"HR",{}),w=j(C),y=d(C,"DIV",{class:!0});var Z=m(y);b=d(Z,"DIV",{class:!0});var S=m(b);p=d(S,"B",{class:!0});var U=m(p);I=W(U,k),U.forEach(i),P=j(S),T.l(S),S.forEach(i),O=j(Z),B=d(Z,"HR",{class:!0}),H=j(Z),G=d(Z,"DIV",{class:!0});var se=m(G);J=d(se,"B",{class:!0});var pe=m(J);F=W(pe,Q),pe.forEach(i),K=j(se),M.l(se),se.forEach(i),Z.forEach(i),C.forEach(i),this.h()},h(){f(t,"class","header"),f(v,"class","graph svelte-km24cf"),f(p,"class","svelte-km24cf"),f(b,"class","svelte-km24cf"),f(B,"class","svelte-km24cf"),f(J,"class","svelte-km24cf"),f(G,"class","svelte-km24cf"),f(y,"class","details svelte-km24cf"),f(e,"class","widget svelte-km24cf")},m(D,C){V(D,e,C),n(e,t),n(t,l),n(l,r),n(e,o),n(e,c),n(e,_),n(e,v);for(let $=0;$<q.length;$+=1)q[$]&&q[$].m(v,null);n(e,h),n(e,g),n(e,w),n(e,y),n(y,b),n(b,p),n(p,I),n(b,P),T.m(b,null),n(y,O),n(y,B),n(y,H),n(y,G),n(G,J),n(J,F),n(G,K),M.m(G,null)},p(D,[C]){if(C&4&&s!==(s=D[2]("widget.objektsupply.title")+"")&&z(r,s),C&3){X=fe({length:7});let $;for($=0;$<X.length;$+=1){const L=Me(D,X,$);q[$]?q[$].p(L,C):(q[$]=Oe(L),q[$].c(),q[$].m(v,null))}for(;$<q.length;$+=1)q[$].d(1);q.length=X.length}C&4&&k!==(k=D[2]("widget.objektsupply.weekly_supply")+"")&&z(I,k),R===(R=N(D))&&T?T.p(D,C):(T.d(1),T=R(D),T&&(T.c(),T.m(b,null))),C&4&&Q!==(Q=D[2]("widget.objektsupply.daily_supply")+"")&&z(F,Q),te===(te=re(D))&&M?M.p(D,C):(M.d(1),M=te(D),M&&(M.c(),M.m(G,null)))},i:x,o:x,d(D){D&&i(e),ge(q,D),T.d(),M.d()}}}const Re=a=>a.startsWith("day");function dt(a,e,t){let l,s,r;ue(a,je,_=>t(2,s=_)),ue(a,Je,_=>t(3,r=_));let{data:o}=e;const c=(_,v)=>_+o.data[v].totalCount;return a.$$set=_=>{"data"in _&&t(0,o=_.data)},a.$$.update=()=>{a.$$.dirty&1&&t(1,l=o&&o.data?Object.keys(o.data).filter(_=>_.startsWith("day")).reduce((_,v)=>o.data[v].totalCount>_?o.data[v].totalCount:_,0):0)},[o,l,s,r,c]}class Ae extends be{constructor(e){super(),ke(this,e,dt,ut,me,{data:0})}}function _t(a,e,t){const l=a.slice();return l[8]=e[t],l[7]=t,l}function He(a,e,t){const l=a.slice();l[4]=e[t],l[7]=t;const s=(Date.now()-l[4].node.minted)/1e3;return l[5]=s,l}function ht(a){let e,t=fe({length:10}),l=[];for(let s=0;s<t.length;s+=1)l[s]=mt(_t(a,t,s));return{c(){for(let s=0;s<l.length;s+=1)l[s].c();e=ee()},l(s){for(let r=0;r<l.length;r+=1)l[r].l(s);e=ee()},m(s,r){for(let o=0;o<l.length;o+=1)l[o]&&l[o].m(s,r);V(s,e,r)},p:x,d(s){s&&i(e),ge(l,s)}}}function vt(a){let e,t=fe(a[0].data.mints.edges),l=[];for(let s=0;s<t.length;s+=1)l[s]=Te(He(a,t,s));return{c(){for(let s=0;s<l.length;s+=1)l[s].c();e=ee()},l(s){for(let r=0;r<l.length;r+=1)l[r].l(s);e=ee()},m(s,r){for(let o=0;o<l.length;o+=1)l[o]&&l[o].m(s,r);V(s,e,r)},p(s,r){if(r&7){t=fe(s[0].data.mints.edges);let o;for(o=0;o<t.length;o+=1){const c=He(s,t,o);l[o]?l[o].p(c,r):(l[o]=Te(c),l[o].c(),l[o].m(e.parentNode,e))}for(;o<l.length;o+=1)l[o].d(1);l.length=t.length}},d(s){s&&i(e),ge(l,s)}}}function pt(a){let e;return{c(){e=u("hr")},l(t){e=d(t,"HR",{})},m(t,l){V(t,e,l)},d(t){t&&i(e)}}}function mt(a){let e,t,l,s,r,o,c=a[7]<9&&pt();return{c(){e=u("div"),t=u("div"),l=E(),s=u("div"),r=E(),c&&c.c(),o=ee(),this.h()},l(_){e=d(_,"DIV",{class:!0});var v=m(e);t=d(v,"DIV",{class:!0}),m(t).forEach(i),l=j(v),s=d(v,"DIV",{class:!0}),m(s).forEach(i),v.forEach(i),r=j(_),c&&c.l(_),o=ee(),this.h()},h(){f(t,"class","textPlaceholder objektPlaceholder svelte-9rx6np"),ae(t,"width","140px"),f(s,"class","textPlaceholder"),ae(s,"width","100px"),f(e,"class","objekt svelte-9rx6np")},m(_,v){V(_,e,v),n(e,t),n(e,l),n(e,s),V(_,r,v),c&&c.m(_,v),V(_,o,v)},p:x,d(_){_&&(i(e),i(r),i(o)),c&&c.d(_)}}}function bt(a){let e,t=a[1]("general.hours_past",{values:{hours:Math.floor(a[5]/3600)}})+"",l;return{c(){e=u("p"),l=A(t),this.h()},l(s){e=d(s,"P",{class:!0});var r=m(e);l=W(r,t),r.forEach(i),this.h()},h(){f(e,"class","svelte-9rx6np")},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&3&&t!==(t=s[1]("general.hours_past",{values:{hours:Math.floor(s[5]/3600)}})+"")&&z(l,t)},d(s){s&&i(e)}}}function kt(a){let e,t=a[1]("general.minutes_past",{values:{minutes:Math.floor(a[5]/60)}})+"",l;return{c(){e=u("p"),l=A(t),this.h()},l(s){e=d(s,"P",{class:!0});var r=m(e);l=W(r,t),r.forEach(i),this.h()},h(){f(e,"class","svelte-9rx6np")},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&3&&t!==(t=s[1]("general.minutes_past",{values:{minutes:Math.floor(s[5]/60)}})+"")&&z(l,t)},d(s){s&&i(e)}}}function gt(a){let e,t=a[1]("general.seconds_past",{values:{seconds:Math.floor(a[5])}})+"",l;return{c(){e=u("p"),l=A(t),this.h()},l(s){e=d(s,"P",{class:!0});var r=m(e);l=W(r,t),r.forEach(i),this.h()},h(){f(e,"class","svelte-9rx6np")},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&3&&t!==(t=s[1]("general.seconds_past",{values:{seconds:Math.floor(s[5])}})+"")&&z(l,t)},d(s){s&&i(e)}}}function wt(a){let e;return{c(){e=u("hr")},l(t){e=d(t,"HR",{})},m(t,l){V(t,e,l)},d(t){t&&i(e)}}}function Te(a){let e,t,l=oe.formatObjekt(a[4].node.collection,a[4].node)+"",s,r,o,c,_,v;function h(){return a[3](a[4])}function g(p,k){return p[5]<60?gt:p[5]<3600?kt:bt}let w=g(a),y=w(a),b=a[7]<9&&wt();return{c(){e=u("div"),t=u("button"),s=A(l),r=E(),y.c(),o=E(),b&&b.c(),c=ee(),this.h()},l(p){e=d(p,"DIV",{class:!0});var k=m(e);t=d(k,"BUTTON",{class:!0});var I=m(t);s=W(I,l),I.forEach(i),r=j(k),y.l(k),k.forEach(i),o=j(p),b&&b.l(p),c=ee(),this.h()},h(){f(t,"class","svelte-9rx6np"),f(e,"class","objekt svelte-9rx6np")},m(p,k){V(p,e,k),n(e,t),n(t,s),n(e,r),y.m(e,null),V(p,o,k),b&&b.m(p,k),V(p,c,k),_||(v=Ve(t,"click",h),_=!0)},p(p,k){a=p,k&1&&l!==(l=oe.formatObjekt(a[4].node.collection,a[4].node)+"")&&z(s,l),w===(w=g(a))&&y?y.p(a,k):(y.d(1),y=w(a),y&&(y.c(),y.m(e,null)))},d(p){p&&(i(e),i(o),i(c)),y.d(),b&&b.d(p),_=!1,v()}}}function yt(a){let e,t,l,s=a[1]("widget.mints.title")+"",r,o,c,_=a[1]("widget.mints.subtitle")+"",v,h,g,w;function y(k,I){return k[0]&&k[0].data?vt:ht}let b=y(a),p=b(a);return{c(){e=u("div"),t=u("div"),l=u("b"),r=A(s),o=E(),c=u("p"),v=A(_),h=E(),g=u("hr"),w=E(),p.c(),this.h()},l(k){e=d(k,"DIV",{class:!0});var I=m(e);t=d(I,"DIV",{class:!0});var P=m(t);l=d(P,"B",{});var O=m(l);r=W(O,s),O.forEach(i),o=j(P),c=d(P,"P",{});var B=m(c);v=W(B,_),B.forEach(i),P.forEach(i),h=j(I),g=d(I,"HR",{}),w=j(I),p.l(I),I.forEach(i),this.h()},h(){f(t,"class","header"),f(e,"class","widget svelte-9rx6np")},m(k,I){V(k,e,I),n(e,t),n(t,l),n(l,r),n(t,o),n(t,c),n(c,v),n(e,h),n(e,g),n(e,w),p.m(e,null)},p(k,[I]){I&2&&s!==(s=k[1]("widget.mints.title")+"")&&z(r,s),I&2&&_!==(_=k[1]("widget.mints.subtitle")+"")&&z(v,_),b===(b=y(k))&&p?p.p(k,I):(p.d(1),p=b(k),p&&(p.c(),p.m(e,null)))},i:x,o:x,d(k){k&&i(e),p.d()}}}function Et(a,e,t){let l,s;ue(a,je,c=>t(1,l=c)),ue(a,Ge,c=>t(2,s=c));let{data:r}=e;const o=c=>Le(`/objekt/${c.node.collection.id}/${c.node.serial}`,{collection:c.node.collection,objekt:c.node,previous:s.url.href});return a.$$set=c=>{"data"in c&&t(0,r=c.data)},[r,l,s,o]}class We extends be{constructor(e){super(),ke(this,e,Et,yt,me,{data:0})}}function jt(a,e,t){const l=a.slice();return l[13]=e[t],l[12]=t,l}function Be(a,e,t){const l=a.slice();l[7]=e[t],l[12]=t;const s=(Date.now()-l[7].node.timestamp)/1e3;l[8]=s;const r=l[1].find(function(..._){return a[5](l[7],..._)});l[9]=r;const o=l[1].find(function(..._){return a[6](l[7],..._)});return l[10]=o,l}function Dt(a){let e,t=fe({length:5}),l=[];for(let s=0;s<t.length;s+=1)l[s]=Vt(jt(a,t,s));return{c(){for(let s=0;s<l.length;s+=1)l[s].c();e=ee()},l(s){for(let r=0;r<l.length;r+=1)l[r].l(s);e=ee()},m(s,r){for(let o=0;o<l.length;o+=1)l[o]&&l[o].m(s,r);V(s,e,r)},p:x,d(s){s&&i(e),ge(l,s)}}}function $t(a){let e,t=fe(a[0].data.transfersConnection.edges),l=[];for(let s=0;s<t.length;s+=1)l[s]=Ne(Be(a,t,s));return{c(){for(let s=0;s<l.length;s+=1)l[s].c();e=ee()},l(s){for(let r=0;r<l.length;r+=1)l[r].l(s);e=ee()},m(s,r){for(let o=0;o<l.length;o+=1)l[o]&&l[o].m(s,r);V(s,e,r)},p(s,r){if(r&15){t=fe(s[0].data.transfersConnection.edges);let o;for(o=0;o<t.length;o+=1){const c=Be(s,t,o);l[o]?l[o].p(c,r):(l[o]=Ne(c),l[o].c(),l[o].m(e.parentNode,e))}for(;o<l.length;o+=1)l[o].d(1);l.length=t.length}},d(s){s&&i(e),ge(l,s)}}}function It(a){let e;return{c(){e=u("hr")},l(t){e=d(t,"HR",{})},m(t,l){V(t,e,l)},d(t){t&&i(e)}}}function Vt(a){let e,t,l,s,r,o,c,_,v,h,g,w,y,b,p,k,I=a[12]<4&&It();return{c(){e=u("div"),t=u("div"),l=u("div"),s=E(),r=u("div"),o=E(),c=u("div"),_=E(),v=u("div"),h=u("div"),g=E(),w=u("div"),y=E(),b=u("div"),p=E(),I&&I.c(),k=ee(),this.h()},l(P){e=d(P,"DIV",{class:!0});var O=m(e);t=d(O,"DIV",{class:!0});var B=m(t);l=d(B,"DIV",{class:!0}),m(l).forEach(i),s=j(B),r=d(B,"DIV",{class:!0}),m(r).forEach(i),o=j(B),c=d(B,"DIV",{class:!0}),m(c).forEach(i),B.forEach(i),_=j(O),v=d(O,"DIV",{class:!0});var H=m(v);h=d(H,"DIV",{class:!0}),m(h).forEach(i),g=j(H),w=d(H,"DIV",{class:!0}),m(w).forEach(i),y=j(H),b=d(H,"DIV",{class:!0}),m(b).forEach(i),H.forEach(i),O.forEach(i),p=j(P),I&&I.l(P),k=ee(),this.h()},h(){f(l,"class","textPlaceholder"),ae(l,"width","120px"),f(r,"class","spacer svelte-2x9hqo"),f(c,"class","textPlaceholder"),ae(c,"width","120px"),f(t,"class","users svelte-2x9hqo"),f(h,"class","textPlaceholder"),ae(h,"width","140px"),f(w,"class","spacer svelte-2x9hqo"),f(b,"class","textPlaceholder"),ae(b,"width","100px"),f(v,"class","objekt svelte-2x9hqo"),f(e,"class","transfer transferPlaceholder svelte-2x9hqo")},m(P,O){V(P,e,O),n(e,t),n(t,l),n(t,s),n(t,r),n(t,o),n(t,c),n(e,_),n(e,v),n(v,h),n(v,g),n(v,w),n(v,y),n(v,b),V(P,p,O),I&&I.m(P,O),V(P,k,O)},p:x,d(P){P&&(i(e),i(p),i(k)),I&&I.d(P)}}}function Pt(a){let e,t=a[2]("general.hours_past",{values:{hours:Math.floor(a[8]/3600)}})+"",l;return{c(){e=u("p"),l=A(t)},l(s){e=d(s,"P",{});var r=m(e);l=W(r,t),r.forEach(i)},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&5&&t!==(t=s[2]("general.hours_past",{values:{hours:Math.floor(s[8]/3600)}})+"")&&z(l,t)},d(s){s&&i(e)}}}function Ct(a){let e,t=a[2]("general.minutes_past",{values:{minutes:Math.floor(a[8]/60)}})+"",l;return{c(){e=u("p"),l=A(t)},l(s){e=d(s,"P",{});var r=m(e);l=W(r,t),r.forEach(i)},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&5&&t!==(t=s[2]("general.minutes_past",{values:{minutes:Math.floor(s[8]/60)}})+"")&&z(l,t)},d(s){s&&i(e)}}}function qt(a){let e,t=a[2]("general.seconds_past",{values:{seconds:Math.floor(a[8])}})+"",l;return{c(){e=u("p"),l=A(t)},l(s){e=d(s,"P",{});var r=m(e);l=W(r,t),r.forEach(i)},m(s,r){V(s,e,r),n(e,l)},p(s,r){r&5&&t!==(t=s[2]("general.seconds_past",{values:{seconds:Math.floor(s[8])}})+"")&&z(l,t)},d(s){s&&i(e)}}}function St(a){let e;return{c(){e=u("hr")},l(t){e=d(t,"HR",{})},m(t,l){V(t,e,l)},d(t){t&&i(e)}}}function Ne(a){let e,t,l,s,r,o,c=(a[9]?a[9].nickname:a[7].node.from.slice(0,6)+"..."+a[7].node.from.slice(-4))+"",_,v,h,g,w,y,b,p,k,I=(a[10]?a[10].nickname:a[7].node.to.slice(0,6)+"..."+a[7].node.to.slice(-4))+"",P,O,B,H,G,J=oe.formatObjekt(a[7].node.objekt.collection,a[7].node.objekt)+"",Q,F,K,X,q,N,R,T;function re(){return a[4](a[7])}function te($,L){return $[8]<60?qt:$[8]<3600?Ct:Pt}let M=te(a),D=M(a),C=a[12]<4&&St();return{c(){e=u("div"),t=u("div"),l=u("img"),r=E(),o=u("a"),_=A(c),h=E(),g=u("div"),w=E(),y=u("img"),p=E(),k=u("a"),P=A(I),B=E(),H=u("div"),G=u("button"),Q=A(J),F=E(),K=u("div"),X=E(),D.c(),q=E(),C&&C.c(),N=ee(),this.h()},l($){e=d($,"DIV",{class:!0});var L=m(e);t=d(L,"DIV",{class:!0});var Y=m(t);l=d(Y,"IMG",{class:!0,src:!0,alt:!0}),r=j(Y),o=d(Y,"A",{href:!0,class:!0});var Z=m(o);_=W(Z,c),Z.forEach(i),h=j(Y),g=d(Y,"DIV",{class:!0}),m(g).forEach(i),w=j(Y),y=d(Y,"IMG",{class:!0,src:!0,alt:!0}),p=j(Y),k=d(Y,"A",{href:!0,class:!0});var S=m(k);P=W(S,I),S.forEach(i),Y.forEach(i),B=j(L),H=d(L,"DIV",{class:!0});var U=m(H);G=d(U,"BUTTON",{class:!0});var se=m(G);Q=W(se,J),se.forEach(i),F=j(U),K=d(U,"DIV",{class:!0}),m(K).forEach(i),X=j(U),D.l(U),U.forEach(i),L.forEach(i),q=j($),C&&C.l($),N=ee(),this.h()},h(){f(l,"class","profileImage svelte-2x9hqo"),ce(l.src,s="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png")||f(l,"src",s),f(l,"alt","To"),f(o,"href",v="/@"+(a[9]?a[9].nickname:a[7].node.from)),f(o,"class","svelte-2x9hqo"),f(g,"class","spacer svelte-2x9hqo"),f(y,"class","profileImage svelte-2x9hqo"),ce(y.src,b="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png")||f(y,"src",b),f(y,"alt","To"),f(k,"href",O="/@"+(a[10]?a[10].nickname:a[7].node.to)),f(k,"class","svelte-2x9hqo"),f(t,"class","users svelte-2x9hqo"),f(G,"class","svelte-2x9hqo"),f(K,"class","spacer svelte-2x9hqo"),f(H,"class","objekt svelte-2x9hqo"),f(e,"class","transfer svelte-2x9hqo")},m($,L){V($,e,L),n(e,t),n(t,l),n(t,r),n(t,o),n(o,_),n(t,h),n(t,g),n(t,w),n(t,y),n(t,p),n(t,k),n(k,P),n(e,B),n(e,H),n(H,G),n(G,Q),n(H,F),n(H,K),n(H,X),D.m(H,null),V($,q,L),C&&C.m($,L),V($,N,L),R||(T=Ve(G,"click",re),R=!0)},p($,L){a=$,L&3&&c!==(c=(a[9]?a[9].nickname:a[7].node.from.slice(0,6)+"..."+a[7].node.from.slice(-4))+"")&&z(_,c),L&3&&v!==(v="/@"+(a[9]?a[9].nickname:a[7].node.from))&&f(o,"href",v),L&3&&I!==(I=(a[10]?a[10].nickname:a[7].node.to.slice(0,6)+"..."+a[7].node.to.slice(-4))+"")&&z(P,I),L&3&&O!==(O="/@"+(a[10]?a[10].nickname:a[7].node.to))&&f(k,"href",O),L&1&&J!==(J=oe.formatObjekt(a[7].node.objekt.collection,a[7].node.objekt)+"")&&z(Q,J),M===(M=te(a))&&D?D.p(a,L):(D.d(1),D=M(a),D&&(D.c(),D.m(H,null)))},d($){$&&(i(e),i(q),i(N)),D.d(),C&&C.d($),R=!1,T()}}}function Mt(a){let e,t,l,s=a[2]("widget.transfers.title")+"",r,o,c,_=a[2]("widget.transfers.subtitle")+"",v,h,g,w,y,b,p=a[2]("widget.transfers.sender")+"",k,I,P,O,B,H=a[2]("widget.transfers.receiver")+"",G,J,Q,F;function K(N,R){return N[0]&&N[0].data&&N[1]?$t:Dt}let X=K(a),q=X(a);return{c(){e=u("div"),t=u("div"),l=u("b"),r=A(s),o=E(),c=u("p"),v=A(_),h=E(),g=u("hr"),w=E(),y=u("div"),b=u("p"),k=A(p),I=E(),P=u("div"),O=E(),B=u("p"),G=A(H),J=E(),Q=u("hr"),F=E(),q.c(),this.h()},l(N){e=d(N,"DIV",{class:!0});var R=m(e);t=d(R,"DIV",{class:!0});var T=m(t);l=d(T,"B",{});var re=m(l);r=W(re,s),re.forEach(i),o=j(T),c=d(T,"P",{});var te=m(c);v=W(te,_),te.forEach(i),T.forEach(i),h=j(R),g=d(R,"HR",{}),w=j(R),y=d(R,"DIV",{class:!0});var M=m(y);b=d(M,"P",{class:!0});var D=m(b);k=W(D,p),D.forEach(i),I=j(M),P=d(M,"DIV",{class:!0}),m(P).forEach(i),O=j(M),B=d(M,"P",{class:!0});var C=m(B);G=W(C,H),C.forEach(i),M.forEach(i),J=j(R),Q=d(R,"HR",{}),F=j(R),q.l(R),R.forEach(i),this.h()},h(){f(t,"class","header"),f(b,"class","svelte-2x9hqo"),f(P,"class","spacer svelte-2x9hqo"),f(B,"class","svelte-2x9hqo"),f(y,"class","header labels svelte-2x9hqo"),f(e,"class","widget svelte-2x9hqo")},m(N,R){V(N,e,R),n(e,t),n(t,l),n(l,r),n(t,o),n(t,c),n(c,v),n(e,h),n(e,g),n(e,w),n(e,y),n(y,b),n(b,k),n(y,I),n(y,P),n(y,O),n(y,B),n(B,G),n(e,J),n(e,Q),n(e,F),q.m(e,null)},p(N,[R]){R&4&&s!==(s=N[2]("widget.transfers.title")+"")&&z(r,s),R&4&&_!==(_=N[2]("widget.transfers.subtitle")+"")&&z(v,_),R&4&&p!==(p=N[2]("widget.transfers.sender")+"")&&z(k,p),R&4&&H!==(H=N[2]("widget.transfers.receiver")+"")&&z(G,H),X===(X=K(N))&&q?q.p(N,R):(q.d(1),q=X(N),q&&(q.c(),q.m(e,null)))},i:x,o:x,d(N){N&&i(e),q.d()}}}function Ot(a,e,t){let l,s;ue(a,je,h=>t(2,l=h)),ue(a,Ge,h=>t(3,s=h));let{data:r}=e,o;const c=h=>Le(`/objekt/${h.node.objekt.collection.id}/${h.node.objekt.serial}`,{collection:h.node.objekt.collection,objekt:h.node.objekt,previous:s.url.href}),_=(h,g)=>g.address===h.node.from,v=(h,g)=>g.address===h.node.to;return a.$$set=h=>{"data"in h&&t(0,r=h.data)},a.$$.update=()=>{if(a.$$.dirty&3&&r&&r.data&&!o){const h=new Set(r.data.transfersConnection.edges.reduce((g,w)=>[...g,w.node.to,w.node.from],[]));fetch(`${Ue.URL}/user/v1/by-address/${Array.from(h).join(",")}`).then(async g=>t(1,o=await g.json()))}},[r,o,l,s,c,_,v]}class Rt extends be{constructor(e){super(),ke(this,e,Ot,Mt,me,{data:0})}}function Ht(a){let e,t,l,s;return e=new Ae({props:{data:void 0}}),l=new We({props:{data:a[0]}}),{c(){de(e.$$.fragment),t=E(),de(l.$$.fragment)},l(r){_e(e.$$.fragment,r),t=j(r),_e(l.$$.fragment,r)},m(r,o){he(e,r,o),V(r,t,o),he(l,r,o),s=!0},p(r,o){const c={};o&1&&(c.data=r[0]),l.$set(c)},i(r){s||(ie(e.$$.fragment,r),ie(l.$$.fragment,r),s=!0)},o(r){ne(e.$$.fragment,r),ne(l.$$.fragment,r),s=!1},d(r){r&&i(t),ve(e,r),ve(l,r)}}}function Tt(a){let e,t,l,s;return e=new We({props:{data:a[0]}}),l=new Ae({props:{data:void 0}}),{c(){de(e.$$.fragment),t=E(),de(l.$$.fragment)},l(r){_e(e.$$.fragment,r),t=j(r),_e(l.$$.fragment,r)},m(r,o){he(e,r,o),V(r,t,o),he(l,r,o),s=!0},p(r,o){const c={};o&1&&(c.data=r[0]),e.$set(c)},i(r){s||(ie(e.$$.fragment,r),ie(l.$$.fragment,r),s=!0)},o(r){ne(e.$$.fragment,r),ne(l.$$.fragment,r),s=!1},d(r){r&&i(t),ve(e,r),ve(l,r)}}}function Bt(a){let e,t,l,s,r,o,c,_,v,h;ze(a[2]),t=new ot({props:{data:a[0]}});const g=[Tt,Ht],w=[];function y(b,p){return b[1]>750?0:1}return s=y(a),r=w[s]=g[s](a),c=new Rt({props:{data:a[0]}}),{c(){e=u("div"),de(t.$$.fragment),l=E(),r.c(),o=E(),de(c.$$.fragment),this.h()},l(b){e=d(b,"DIV",{class:!0});var p=m(e);_e(t.$$.fragment,p),l=j(p),r.l(p),o=j(p),_e(c.$$.fragment,p),p.forEach(i),this.h()},h(){f(e,"class","layout svelte-6cvig1")},m(b,p){V(b,e,p),he(t,e,null),n(e,l),w[s].m(e,null),n(e,o),he(c,e,null),_=!0,v||(h=Ve(window,"resize",a[2]),v=!0)},p(b,[p]){const k={};p&1&&(k.data=b[0]),t.$set(k);let I=s;s=y(b),s===I?w[s].p(b,p):(Ze(),ne(w[I],1,1,()=>{w[I]=null}),Fe(),r=w[s],r?r.p(b,p):(r=w[s]=g[s](b),r.c()),ie(r,1),r.m(e,o));const P={};p&1&&(P.data=b[0]),c.$set(P)},i(b){_||(ie(t.$$.fragment,b),ie(r),ie(c.$$.fragment,b),_=!0)},o(b){ne(t.$$.fragment,b),ne(r),ne(c.$$.fragment,b),_=!1},d(b){b&&i(e),ve(t),w[s].d(),ve(c),v=!1,h()}}}function Nt(a,e,t){let l;for(let o=0;o<7;o++){const c=new Date;c.setHours(0,0,0,0),c.setDate(c.getDate()-(6-o)),c.getTime(),c.setDate(c.getDate()+1),c.getTime()}fetch(oe.URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`
                query {
                    squidStatus {
                        height
                    }
                    transfersConnection(orderBy: id_DESC, first: 5, where: {from_not_eq: "${qe}", to_not_eq: "${qe}"}) {
                        edges {
                            node {
                                ${Object.keys(oe.Transfer).join(`
`)}
                                objekt {
                                    ${Object.keys(oe.Objekt).join(`
`)}
                                    collection {
                                        ${Object.keys(oe.Collection).join(`
`)}
                                    }
                                }
                            }
                        }
                    }
                    mints: objektsConnection(orderBy: minted_DESC, where: {collection_isNull: false}, first: 10) {
                        edges {
                            node {
                                ${Object.keys(oe.Objekt).join(`
`)}
                                collection {
                                    ${Object.keys(oe.Collection).join(`
`)}
                                }
                            }
                        }
                    }
                }
            `})}).then(async o=>{t(0,l=await o.json())});let s;function r(){t(1,s=window.innerWidth)}return[l,s,r]}class Jt extends be{constructor(e){super(),ke(this,e,Nt,Bt,me,{})}}export{Jt as component};