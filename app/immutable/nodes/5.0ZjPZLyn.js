import{s as O,d as g,m as A,l as P}from"../chunks/scheduler.7ddvVGuS.js";import{S as x,i as N,r as D,u as E,v as R,d as F,t as T,w as W}from"../chunks/index.XmLGRVaW.js";import{p as y}from"../chunks/stores.xmd8dhsU.js";import{O as B}from"../chunks/ObjektGrid._sxkPs4l.js";import{C as h,S as _}from"../chunks/apis.W9dsQ1rZ.js";import{l as G}from"../chunks/likes.EmucdeCy.js";function J(o){let r,s;return r=new B({props:{load:o[2],total:o[0],profile:!0}}),{c(){D(r.$$.fragment)},l(t){E(r.$$.fragment,t)},m(t,a){R(r,t,a),s=!0},p(t,[a]){const p={};a&1&&(p.total=t[0]),r.$set(p)},i(t){s||(F(r.$$.fragment,t),s=!0)},o(t){T(r.$$.fragment,t),s=!1},d(t){W(r,t)}}}function L(o,r,s){let t,a,p;g(o,G,c=>s(5,t=c)),g(o,y,c=>s(6,a=c));let m=null,i=a.url.searchParams;const $=A("address");g(o,$,c=>s(7,p=c));async function S(c,w){let n=[],f=[`owner_eq: "${p}"`],d="received_DESC";const j=await h.artists();if(i.forEach((e,u)=>{switch(u){case"minSerial":f.push(`serial_gte: ${e}`);break;case"maxSerial":f.push(`serial_lte: ${e}`);break;case"sendable":f.push("transferrable_eq: true");break;case"sort":switch(e){case"oldest":d="received_ASC";break;case"number":d="collection_number_ASC";break;case"minted":d="minted_ASC";break;case"serial":d="serial_ASC";break}break}}),i.has("liked")){if(!t.length)return s(0,m=0),[];const e=_.filterCollections(t,i);n.push(`id_eq: "${e[0].id}"`+e.slice(1).reduce((u,l,b)=>u.slice(0,u.length-b)+`, OR: {id_eq: "${l.id}"`+"}".repeat(b+1),""))}else i.forEach((e,u)=>{switch(u){case"artist":j.find(l=>l.name===e)?n.push(`artists_containsAll: "${e}"`):j.find(l=>l.members.find(b=>b.name===e))?n.push(`member_eq: "${e}"`):h.unit(e)&&n.push(`AND: {member_eq: "${h.unit(e)[0]}"`+h.unit(e)?.slice(1).reduce((l,b,q)=>l.slice(0,l.length-q)+`, OR: {member_eq: "${b}"`+"}".repeat(q+1),"")+"}");break;case"season":n.push(`season_eq: "${e}"`);break;case"class":n.push(`class_eq: "${e}"`);break;case"number":n.push(`number_startsWith: "${e}"`);break;case"minNumber":n.push(`number_gte: "${e}"`);break;case"maxNumber":n.push(`number_lte: "${e}"`);break;case"type":n.push(`number_endsWith: "${e}"`);break}});const C=await(await fetch(_.URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`
                    query {
                        objektsConnection(orderBy: ${d}, first: ${w}, ${c?`after: "${c}", `:""} where: {${f.join(", ")}, collection: {${n.join(", ")}}}) {
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

                `})})).json();return m===null&&s(0,m=C.data.objektsConnection.totalCount),C.data.objektsConnection.edges.map(e=>({objekt:e.node,collection:e.node.collection}))}P(y.subscribe(()=>{i!==a.url.searchParams&&(s(3,i=a.url.searchParams),s(0,m=null))}));let k=t;return o.$$.update=()=>{o.$$.dirty&56&&k!==t&&(s(4,k=t),i.has("liked")&&s(0,m=null))},[m,$,S,i,k,t]}class V extends x{constructor(r){super(),N(this,r,L,J,O,{})}}export{V as component};
