import { assertPublicUrl, guardScout } from './_lib/scout-core.js';

export const config = { maxDuration: 60 };

export default async function handler(req,res) {
  if (!guardScout(req,res)) return;
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'POST only'});
  const base=(process.env.FOUND_SCOUT_CRAWL4AI_URL || '').replace(/\/$/,'');
  const token=process.env.FOUND_SCOUT_CRAWL4AI_TOKEN || '';
  if (!base) return res.status(503).json({ok:false,error:'Crawl4AI adapter is installed but FOUND_SCOUT_CRAWL4AI_URL is not configured.'});

  const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  const url=(await assertPublicUrl(body.url)).toString();

  const response=await fetch(base+'/crawl',{
    method:'POST',
    headers:{
      'content-type':'application/json',
      ...(token ? {'authorization':'Bearer '+token} : {})
    },
    body:JSON.stringify({urls:[url]})
  });
  const text=await response.text();
  if(!response.ok) return res.status(502).json({ok:false,error:'Crawl4AI returned '+response.status,detail:text.slice(0,1000)});
  let data; try{data=JSON.parse(text)}catch{data={raw:text}};
  return res.status(200).json({ok:true,engine:'Crawl4AI',url,result:data});
}
