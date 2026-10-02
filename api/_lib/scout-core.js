import dns from 'node:dns/promises';
import net from 'node:net';

const CURRENCY_RE = /(?:£|GBP\s?)(\d{1,5}(?:[.,]\d{2})?)/i;
const PRICE_META = ['product:price:amount','og:price:amount','twitter:data1'];

function isPrivateIp(ip) {
  if (!ip) return true;
  if (net.isIPv4(ip)) {
    const [a,b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 0;
  }
  const v = ip.toLowerCase();
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') ||
    v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb') ||
    v.startsWith('::ffff:127.') || v.startsWith('::ffff:10.') || v.startsWith('::ffff:192.168.');
}

export async function assertPublicUrl(raw) {
  const url = new URL(raw);
  if (!['http:','https:'].includes(url.protocol)) throw new Error('Only public HTTP/HTTPS URLs are allowed.');
  if (['localhost','0.0.0.0'].includes(url.hostname.toLowerCase())) throw new Error('Local addresses are blocked.');
  const records = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (!records.length || records.some(r => isPrivateIp(r.address))) throw new Error('Private or non-public network destinations are blocked.');
  return url;
}

function clean(s='') {
  return String(s).replace(/\s+/g,' ').trim();
}

function absolute(base, value) {
  if (!value) return null;
  try { return new URL(value, base).toString(); } catch { return null; }
}

function flattenJsonLd(value, out=[]) {
  if (!value) return out;
  if (Array.isArray(value)) { value.forEach(v => flattenJsonLd(v, out)); return out; }
  if (typeof value !== 'object') return out;
  if (value['@graph']) flattenJsonLd(value['@graph'], out);
  out.push(value);
  return out;
}

function firstType(node) {
  const t=node?.['@type'];
  return Array.isArray(t) ? t[0] : t || '';
}

export function extractPage($, requestUrl, requestedType='AUTO') {
  const canonical = absolute(requestUrl, $('link[rel="canonical"]').attr('href')) || requestUrl;
  const title = clean($('meta[property="og:title"]').attr('content') || $('title').first().text() || $('h1').first().text());
  const description = clean($('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('p').first().text());
  const image = absolute(requestUrl, $('meta[property="og:image"]').attr('content') || $('img').first().attr('src'));
  const text = clean($('body').text()).slice(0, 16000);

  let jsonNodes=[];
  $('script[type="application/ld+json"]').each((_, el) => {
    try { flattenJsonLd(JSON.parse($(el).text()), jsonNodes); } catch {}
  });

  const product = jsonNodes.find(n => /product/i.test(firstType(n)));
  const event = jsonNodes.find(n => /event/i.test(firstType(n)));
  const org = jsonNodes.find(n => /(organization|localbusiness|store|sportsactivitylocation)/i.test(firstType(n)));

  const offers = Array.isArray(product?.offers) ? product.offers[0] : product?.offers;
  let price = offers?.price || offers?.lowPrice || null;
  let currency = offers?.priceCurrency || null;
  let availability = offers?.availability || null;

  if (!price) {
    for (const key of PRICE_META) {
      const val = $('meta[property="'+key+'"],meta[name="'+key+'"]').first().attr('content');
      if (val) { price = clean(val); break; }
    }
  }
  if (!price) {
    const match=text.match(CURRENCY_RE);
    if (match) { price=match[1].replace(',','.'); currency=currency||'GBP'; }
  }

  const inferredType = product ? 'PRODUCT' : event ? 'EVENT' : org ? 'BUSINESS' : requestedType === 'AUTO' ? 'RESOURCE' : requestedType;
  const name = clean(product?.name || event?.name || org?.name || title);
  const structuredDescription = clean(product?.description || event?.description || org?.description || description);
  const structuredImage = absolute(requestUrl,
    (Array.isArray(product?.image) ? product.image[0] : product?.image) ||
    (Array.isArray(event?.image) ? event.image[0] : event?.image) ||
    (Array.isArray(org?.image) ? org.image[0] : org?.image) || image
  );

  const links=[];
  $('a[href]').each((_, a) => {
    const href=absolute(requestUrl,$(a).attr('href'));
    if (!href || !/^https?:/i.test(href)) return;
    const label=clean($(a).text()).slice(0,160);
    if (!links.some(x=>x.url===href)) links.push({label,url:href});
  });

  return {
    type: inferredType,
    name,
    title,
    description: structuredDescription.slice(0,1200),
    url: requestUrl,
    canonical,
    image: structuredImage,
    price: price ? String(price) : null,
    currency,
    availability: availability ? String(availability).split('/').pop() : null,
    brand: clean(product?.brand?.name || product?.brand || ''),
    sku: clean(product?.sku || product?.mpn || ''),
    eventStart: event?.startDate || null,
    eventEnd: event?.endDate || null,
    location: clean(event?.location?.name || org?.address?.addressLocality || ''),
    externalLinks: links.slice(0,80),
    evidence: {
      jsonLdTypes: [...new Set(jsonNodes.map(firstType).filter(Boolean))].slice(0,20),
      retrievedAt: new Date().toISOString()
    }
  };
}

export function guardScout(req, res) {
  if (req.method === 'OPTIONS') { res.status(204).end(); return false; }
  const configured = process.env.FOUND_SCOUT_KEY;
  const isProd = process.env.VERCEL_ENV === 'production';
  if (isProd && !configured) {
    res.status(503).json({ok:false,error:'FOUND Scout is installed but production access is not configured.'});
    return false;
  }
  if (configured && req.headers['x-found-scout-key'] !== configured) {
    res.status(401).json({ok:false,error:'Invalid FOUND Scout access key.'});
    return false;
  }
  return true;
}
