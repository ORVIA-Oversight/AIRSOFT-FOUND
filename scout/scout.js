const $=s=>document.querySelector(s);
const key=()=>$('#key').value.trim();
$('#key').value=sessionStorage.getItem('foundScoutKey')||'';
$('#key').addEventListener('change',()=>sessionStorage.setItem('foundScoutKey',key()));

function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function headers(){return {'content-type':'application/json',...(key()?{'x-found-scout-key':key()}:{})};}
function render(items=[]){
  $('#count').textContent=items.length?items.length+' candidate'+(items.length===1?'':'s')+' found.':'No candidates found.';
  $('#results').innerHTML=items.map(r=>`
    <article class="scout-card">
      <div class="scout-card-top"><b>${escapeHtml(r.type||'RESOURCE')}</b><small>${escapeHtml(r.evidence?.retrievedAt||'')}</small></div>
      <h3>${escapeHtml(r.name||r.title||'Untitled')}</h3>
      <p>${escapeHtml((r.description||'').slice(0,280))}</p>
      <div class="scout-meta">
        ${r.price?`<span><b>Price</b> ${escapeHtml(r.currency||'')} ${escapeHtml(r.price)}</span>`:''}
        ${r.availability?`<span><b>Stock</b> ${escapeHtml(r.availability)}</span>`:''}
        ${r.location?`<span><b>Location</b> ${escapeHtml(r.location)}</span>`:''}
        ${r.brand?`<span><b>Brand</b> ${escapeHtml(r.brand)}</span>`:''}
      </div>
      <a class="ghost route-link" target="_blank" rel="noreferrer" href="${escapeHtml(r.canonical||r.url)}">OPEN SOURCE</a>
    </article>`).join('');
}
async function run(endpoint){
  const url=$('#url').value.trim();
  if(!url)return;
  sessionStorage.setItem('foundScoutKey',key());
  $('#state').textContent='Scanning public source…';
  $('#run').disabled=true; $('#crawl4').disabled=true;
  try{
    const payload=endpoint==='/api/scout-crawl4ai'?{url}:{url,maxPages:Number($('#pages').value||8),resourceType:$('#type').value,followSameHost:$('#follow').checked};
    const r=await fetch(endpoint,{method:'POST',headers:headers(),body:JSON.stringify(payload)});
    const data=await r.json();
    if(!r.ok||!data.ok)throw new Error(data.error||'Scout request failed');
    if(endpoint==='/api/scout') render(data.resources||[]);
    else {
      $('#count').textContent='Crawl4AI extraction complete.';
      $('#results').innerHTML='<article class="scout-card"><h3>Deep extraction result</h3><pre>'+escapeHtml(JSON.stringify(data.result,null,2)).slice(0,12000)+'</pre></article>';
    }
    $('#state').textContent=(data.engine||'Scout')+' completed.';
  }catch(e){$('#state').textContent=e.message;}
  finally{$('#run').disabled=false;$('#crawl4').disabled=false;}
}
$('#run').onclick=()=>run('/api/scout');
$('#crawl4').onclick=()=>run('/api/scout-crawl4ai');
