import { CheerioCrawler, Configuration } from '@crawlee/cheerio';
import { assertPublicUrl, extractPage, guardScout } from './_lib/scout-core.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (!guardScout(req,res)) return;
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'POST only'});

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const urls = (Array.isArray(body.urls) ? body.urls : [body.url]).filter(Boolean).slice(0,5);
  if (!urls.length) return res.status(400).json({ok:false,error:'Provide at least one public URL.'});

  const maxPages = Math.max(1, Math.min(Number(body.maxPages || 8), 20));
  const requestedType = String(body.resourceType || 'AUTO').toUpperCase();
  const safeUrls=[];
  for (const raw of urls) safeUrls.push((await assertPublicUrl(raw)).toString());

  const results=[];
  const failures=[];
  const config = new Configuration({ persistStorage: false });

  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: maxPages,
    maxConcurrency: 3,
    requestHandlerTimeoutSecs: 25,
    async requestHandler({ request, $, enqueueLinks }) {
      results.push(extractPage($, request.loadedUrl || request.url, requestedType));
      if (body.followSameHost !== false) {
        await enqueueLinks({ strategy: 'same-hostname', limit: Math.max(0,maxPages-results.length) });
      }
    },
    failedRequestHandler({ request, error }) {
      failures.push({url:request.url,error:error?.message || 'Request failed'});
    }
  }, config);

  await crawler.run(safeUrls);

  const unique = [...new Map(results.map(r=>[r.canonical || r.url,r])).values()];
  return res.status(200).json({
    ok:true,
    engine:'FOUND Scout / Crawlee',
    mode:'public-web',
    pages:unique.length,
    resources:unique,
    failures,
    limits:{maxPages,seedUrls:safeUrls.length},
    note:'Public-source discovery only. Results are leads until reviewed and approved for publication.'
  });
}
