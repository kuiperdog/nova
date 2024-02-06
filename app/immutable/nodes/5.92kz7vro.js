import{s as A,c as $,g as P,o as x}from"../chunks/scheduler.nSpB3e7h.js";import{S as N,i as D,k as E,l as R,m as F,n as T,o as W,p as B}from"../chunks/index.EYyPxix3.js";import{p as y}from"../chunks/stores.efi3U76y.js";import{O as G}from"../chunks/ObjektGrid.iegYeXLY.js";import{C as h,S as _}from"../chunks/apis.rP1ghAGS.js";import{l as J}from"../chunks/likes.HbKIfPu5.js";function L(o){let r,s;return r=new G({props:{load:o[2],total:o[0],profile:!0}}),{c(){E(r.$$.fragment)},l(t){R(r.$$.fragment,t)},m(t,i){F(r,t,i),s=!0},p(t,[i]){const b={};i&1&&(b.total=t[0]),r.$set(b)},i(t){s||(T(r.$$.fragment,t),s=!0)},o(t){W(r.$$.fragment,t),s=!1},d(t){B(r,t)}}}function U(o,r,s){let t,i,b;$(o,J,l=>s(5,t=l)),$(o,y,l=>s(6,i=l));let m=null,c=i.url.searchParams;const j=P("address");$(o,j,l=>s(7,b=l));async function w(l,O){let n=[],d=[`owner_eq: "${b}"`],p="received_DESC";const C=await h.artists();if(c.forEach((e,u)=>{switch(u){case"minSerial":d.push(`serial_gte: ${e}`);break;case"maxSerial":d.push(`serial_lte: ${e}`);break;case"sendable":d.push("transferrable_eq: true");break;case"sort":switch(e){case"oldest":p="received_ASC";break;case"number":p="collection_number_ASC";break;case"minted":p="minted_ASC";break;case"serial":p="serial_ASC";break}break}}),c.has("liked")){if(!t.length)return s(0,m=0),[];const e=_.filterCollections(t,c);n.push(`id_eq: "${e[0].id}"`+e.slice(1).reduce((u,f,a)=>u.slice(0,u.length-a)+`, OR: {id_eq: "${f.id}"`+"}".repeat(a+1),""))}else c.forEach((e,u)=>{var f;switch(u){case"artist":C.find(a=>a.name===e)?n.push(`artists_containsAll: "${e}"`):C.find(a=>a.members.find(g=>g.name===e))?n.push(`member_eq: "${e}"`):h.unit(e)&&n.push(`AND: {member_eq: "${h.unit(e)[0]}"`+((f=h.unit(e))==null?void 0:f.slice(1).reduce((a,g,q)=>a.slice(0,a.length-q)+`, OR: {member_eq: "${g}"`+"}".repeat(q+1),""))+"}");break;case"season":n.push(`season_eq: "${e}"`);break;case"class":n.push(`class_eq: "${e}"`);break;case"number":n.push(`number_startsWith: "${e}"`);break;case"minNumber":n.push(`number_gte: "${e}"`);break;case"maxNumber":n.push(`number_lte: "${e}"`);break;case"type":n.push(`number_endsWith: "${e}"`);break}});const S=await(await fetch(_.URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`
                    query {
                        objektsConnection(orderBy: ${p}, first: ${O}, ${l?`after: "${l}", `:""} where: {${d.join(", ")}, collection: {${n.join(", ")}}}) {
                            ${m===null?`
                                totalCount
                            `:""}
                            edges {
                                node {
                                    ${Object.keys(_.Objekt).join(`
`)}
                                    collection {
                                        ${Object.keys(_.Collection).join(`
`)}
                                    }
                                }
                            }
                        }
                    }

                `})})).json();return m===null&&s(0,m=S.data.objektsConnection.totalCount),S.data.objektsConnection.edges.map(e=>({objekt:e.node,collection:e.node.collection}))}x(y.subscribe(()=>{[...c.entries()].toString()!==[...i.url.searchParams.entries()].toString()&&(s(3,c=i.url.searchParams),s(0,m=null))}));let k=t;return o.$$.update=()=>{o.$$.dirty&56&&k!==t&&(s(4,k=t),c.has("liked")&&s(0,m=null))},[m,j,w,c,k,t]}class X extends N{constructor(r){super(),D(this,r,U,L,A,{})}}export{X as component};
