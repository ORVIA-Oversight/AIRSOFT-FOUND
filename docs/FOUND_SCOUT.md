# FOUND Scout — Airsoft Found resource discovery layer

FOUND Scout is the internal public-web research layer for Airsoft Found.

## Installed

### Crawlee / Cheerio
- Package: `@crawlee/cheerio@4.0.0`
- Licence: Apache-2.0
- Runs behind `/api/scout`
- Extracts title, description, canonical URL, links, JSON-LD Product/Event/Business data, price, availability, brand, location and timestamps.
- Follows same-host links with a hard page cap.
- Blocks private/local network destinations before crawling.

### Crawl4AI adapter
- Endpoint: `/api/scout-crawl4ai`
- Set `FOUND_SCOUT_CRAWL4AI_URL` to a current self-hosted Crawl4AI Docker server.
- Optional `FOUND_SCOUT_CRAWL4AI_TOKEN` passes the API bearer token.
- Use a current hardened Crawl4AI release; older Docker API versions had serious security fixes.

### Price / stock monitoring
The result schema already contains price and availability so a later watch worker can compare snapshots. Geist/Hawkwatch/PriceBuddy patterns are reference implementations rather than customer-facing products. Persistence should go to the Airsoft Found database (planned Supabase/Postgres) rather than Git commits.

## Access

Set `FOUND_SCOUT_KEY` in the production environment. Production calls are denied if the key is not configured.

Internal UI:
`/scout/`

## Intended resource classes
- Product
- Retailer
- Specialist
- Range / venue
- Event
- Brand / affiliate lead
- General public resource

## Operating rule
Scout discovers and structures public information. It does not auto-publish scraped text. Every candidate keeps a source URL and retrieval time, then a human approves what enters the marketplace/resource library.

## Next persistence layer
Create Supabase tables for:
- resources
- resource_sources
- product_offers
- price_snapshots
- saved_searches
- scout_jobs
- partner_leads

That allows FOUND Scout to feed New / Used / Swap / Specialist / Range / Events without making the crawler itself the system of record.
