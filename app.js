const previewResults=[
  {type:'COMPARE',title:'UK product comparison',source:'BETA CAPABILITY',price:'Price + stock',meta:'Compare credible UK routes',why:['Product identity first','Source and last-checked time visible','Affiliate status does not change organic rank']},
  {type:'FIT',title:'Umarex G17 Gen 5 MOS CO₂ → ACRO P-2',source:'ACCEPTANCE TEST',price:'Compatibility',meta:'Exact variant required',why:['Umarex kept as the user-facing identity','6 mm and CO₂ are part of the match','Unconfirmed fit stays unconfirmed']},
  {type:'SITE',title:'CQB within 50 miles of Sheffield',source:'ACCEPTANCE TEST',price:'Distance + style',meta:'Venue search',why:['SITE intent only','Radius and play style matter','No product cards in a venue query']},
  {type:'SPECIALIST',title:'Find a technician by capability',source:'BETA CAPABILITY',price:'Location + postal',meta:'Platform skill · lead time · evidence',why:['Capability beats generic directory tags','Source-linked profile','Last verified date visible']}
];

let currentResults=previewResults;
const grid=document.querySelector('#resultGrid');

function render(filter='ALL'){
  const rows=currentResults.filter(r=>filter==='ALL'||r.type===filter);
  grid.innerHTML=rows.map(r=>`<article class="result-card"><div class="top"><b>${r.type}</b><small>${r.source}</small></div><h3>${r.title}</h3><strong class="price">${r.price}</strong><p>${r.meta}</p><div class="why"><small>WHY THIS MATTERS</small>${r.why.map(x=>`<span>✓ ${x}</span>`).join('')}</div><button class="ghost wide">BETA PREVIEW</button></article>`).join('');
}
render();

document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  render(b.dataset.tab);
});

function classify(q){
  const s=q.toLowerCase();
  if(/cqb|site|range|skirmish|woodland|within\s+\d+|miles|near\s+/.test(s)) return 'SITE';
  if(/fit|fits|compatible|compatib|acro|mos|plate|adapter|mount|for my/.test(s)) return 'FIT';
  if(/tech|technician|repair|upgrade|service|specialist/.test(s)) return 'SPECIALIST';
  return 'COMPARE';
}

function search(q){
  if(!q.trim()) return;
  const intent=classify(q);
  currentResults=previewResults.filter(r=>r.type===intent);
  const title=document.querySelector('#resultTitle');
  title.textContent=`Beta route for “${q}”`;
  const p=title.nextElementSibling;
  if(p) p.textContent='This beta currently demonstrates intent routing only. Real indexed results are being connected to FOUND Scout and the resource database; we will not substitute irrelevant demo cards.';
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x.dataset.tab===intent));
  render(intent);
  document.querySelector('#results').scrollIntoView({behavior:'smooth'});
}

document.querySelector('#searchBtn').onclick=()=>search(document.querySelector('#heroSearch').value);
document.querySelector('#heroSearch').addEventListener('keydown',e=>{if(e.key==='Enter')search(e.target.value)});
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
  document.querySelector('#heroSearch').value=b.dataset.q;
  search(b.dataset.q);
});
