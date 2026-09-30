const results=[
{type:'BUILD',title:'UKSF-inspired modern build',source:'Reference-led demo',price:'Build routes',meta:'Genuine · Used · Alternatives · Budget',why:['Matches the look or role you described','Shows evidence and disagreement','Links components to marketplace routes']},
{type:'NEW',title:'Tokyo Marui MWS',source:'Demo supplier',price:'£529',meta:'In stock · UK delivery',why:['Exact product','In stock','Posts nationally']},
{type:'USED',title:'Tokyo Marui MWS',source:'Verified member',price:'£410',meta:'Very Good · Sheffield',why:['Exact product','Within budget','Used accepted']},
{type:'SWAP',title:'MWS ↔ NGRS opportunity',source:'Member match',price:'Swap',meta:'Potential reciprocal match',why:['You want an MWS','They want an NGRS','Postage compatible']},
{type:'WORKSHOP',title:'MWS Specialist',source:'Demo specialist',price:'From £45',meta:'Repair · upgrades · setup',why:['MWS capability','Postal work accepted','Typical lead time 5–7 days']},
{type:'RANGE',title:'Found Range route',source:'Demo venue search',price:'From £15',meta:'Zero · chrono · test · tune',why:['Suitable for equipment testing','Zeroing available','Prototype venue route']}
];
const grid=document.querySelector('#resultGrid');
function render(filter='ALL'){grid.innerHTML=results.filter(r=>filter==='ALL'||r.type===filter).map(r=>{let action=`<button class="ghost wide">VIEW ROUTE</button>`; if(r.type==='RANGE') action=`<a class="ghost wide route-link" href="/range/">VIEW RANGE</a>`; if(r.type==='BUILD') action=`<a class="ghost wide route-link" href="/builds/">VIEW BUILD</a>`;return `<article class="result-card"><div class="top"><b>${r.type}</b><small>${r.source}</small></div><h3>${r.title}</h3><strong class="price">${r.price}</strong><p>${r.meta}</p><div class="why"><small>WHY THIS MATCHED</small>${r.why.map(x=>`<span>✓ ${x}</span>`).join('')}</div>${action}</article>`}).join('')}
render();
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.tab)});
function search(q){if(!q.trim())return;document.querySelector('#resultTitle').textContent=`We found routes for “${q}”`;document.querySelector('#results').scrollIntoView({behavior:'smooth'})}
document.querySelector('#searchBtn').onclick=()=>search(document.querySelector('#heroSearch').value);document.querySelector('#heroSearch').addEventListener('keydown',e=>{if(e.key==='Enter')search(e.target.value)});document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{document.querySelector('#heroSearch').value=b.dataset.q;search(b.dataset.q)});
