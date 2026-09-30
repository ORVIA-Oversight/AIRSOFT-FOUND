const venues=[
{name:'Northline Test Range',location:'South Yorkshire',kind:'INDOOR',distance:'Demo location',range:'30m',price:'From £15',tags:['INDOOR','ELECTRONIC','ZEROING','CHRONO','OWNRIF','PRIVATE','TECH'],features:['Indoor','30m useful lane','Own equipment','Chrono','Zeroing','Smart targets','Private lane','Tech bench'],events:['TEST & TUNE · Demo session','ZERO DAY · Demo session'],verified:'DEMO VENUE · NOT VERIFIED'},
{name:'Fieldhouse Zero & Tune',location:'West Yorkshire',kind:'OUTDOOR',distance:'Demo location',range:'60m',price:'From £20',tags:['OUTDOOR','50M','ZEROING','CHRONO','OWNRIF','DEMO','SWAP'],features:['Outdoor','60m useful range','Own equipment','Chrono','Zeroing','Parking','Retail demo capable','Swap meet capable'],events:['DEMO DAY · Demo session','FOUND SWAP MEET · Demo session'],verified:'DEMO VENUE · NOT VERIFIED'},
{name:'Vector Smart Target Lab',location:'Greater Manchester',kind:'INDOOR',distance:'Demo location',range:'25m',price:'From £18',tags:['INDOOR','ELECTRONIC','ZEROING','RENTAL','PRIVATE','TECH','NVG'],features:['Indoor','25m lanes','Electronic targets','Rental available','Private session','Tech bench','Controlled low-light capability'],events:['TECH DAY · Demo session','NVG NIGHT · Demo session'],verified:'DEMO VENUE · NOT VERIFIED'}
];
const grid=document.querySelector('#rangeGrid');
function renderRange(filter='ALL'){
 const list=venues.filter(v=>filter==='ALL'||v.tags.includes(filter));
 grid.innerHTML=list.map(v=>`<article class="venue-card"><div class="venue-top"><span class="status">${v.verified}</span><b>${v.range}</b></div><h3>${v.name}</h3><p class="venue-loc">${v.location} · ${v.distance}</p><div class="venue-features">${v.features.map(x=>`<span>${x}</span>`).join('')}</div><div class="venue-events">${v.events.map(x=>`<small>${x}</small>`).join('')}</div><div class="venue-bottom"><strong>${v.price}</strong><div><button class="ghost">VIEW RANGE</button><button class="primary demo-book">BOOK</button></div></div><small class="demo-note">Opening times, availability, accessibility and age requirements are placeholders until a real partner profile is connected.</small></article>`).join('') || `<div class="no-ranges"><h3>No matching demo venue.</h3><p>That is exactly the demand signal FOUND RANGE is designed to retain.</p><button class="primary" id="emptyDemand">TELL ME WHEN ONE OPENS</button></div>`;
 document.querySelectorAll('.demo-book').forEach(b=>b.onclick=()=>alert('Demo action only — live booking is not connected.'));
 const ed=document.querySelector('#emptyDemand'); if(ed) ed.onclick=()=>openDemand();
}
renderRange();
document.querySelectorAll('#rangeFilters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#rangeFilters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderRange(b.dataset.filter)});
function runRangeSearch(q){if(!q.trim())return;document.querySelector('#rangeResultTitle').textContent=`Range routes for “${q}”`;document.querySelector('.range-results').scrollIntoView({behavior:'smooth'});}
document.querySelector('#rangeSearchBtn').onclick=()=>runRangeSearch(document.querySelector('#rangeSearch').value);
document.querySelector('#rangeSearch').addEventListener('keydown',e=>{if(e.key==='Enter')runRangeSearch(e.target.value)});
document.querySelectorAll('[data-range-q]').forEach(b=>b.onclick=()=>{document.querySelector('#rangeSearch').value=b.dataset.rangeQ;runRangeSearch(b.dataset.rangeQ)});
function openDemand(){alert('Prototype demand capture: future backend fields will include location, desired facility, travel radius, preferred day/session and equipment type. No location is published.');}
document.querySelector('#demandBtn').onclick=openDemand;
document.querySelector('#flagshipBtn').onclick=()=>alert('Prototype market-validation action: future capture will ask location preference, travel distance, facility interests and likely visit frequency.');
