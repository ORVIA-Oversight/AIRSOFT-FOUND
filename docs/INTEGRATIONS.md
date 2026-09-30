# AIRSOFT FOUND — BACKEND & INTEGRATION REGISTER
Date: 2026-09-30

## Source / deployment
- GitHub: ORVIA-Oversight/AIRSOFT-FOUND — connected source repository.
- Vercel: production project shown by user as airsoft-found; main-branch deploy. Connector visibility should be rechecked because the Vercel connector did not list this project despite the user-visible Vercel project existing.
- Static prototype: current production source is root index.html / styles.css / app.js plus feature routes.

## Planned application backend
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Canonical Product / Listing / Retail Offer / Wanted / Specialist separation
- Member Locker, match, conversation, transaction, verification, evidence, decision, subscription, notification and country capability entities

## Payments / commerce
- Payment abstraction layer required.
- Stripe candidate integration.
- PayPal / regional providers may be added by country.
- Affiliate routes require retailer/programme registration and clear advertising disclosure.
- Ranking logic must not be commission-led.

## ORVIA / Vanguard
- ORVIA assurance principles: provenance, evidence, human approval, visible uncertainty.
- Overwatch / SENSE: event state, callsigns, scoring, sensors, marshal and command views.
- ORVIA Socials: planned media-output destination after human editorial approval.
- Business-in-a-Box: licensed operating framework, customer-owned environment, controlled pilot first.

## Hardware
- Starlink / connectivity layer: proposed, not yet standardised.
- Campaign Box: reusable configured hardware package.
- Sensors: event/game state only until approved hardware and protocols are defined.
- Drones: observation/game-state integration; avoid automatic identification claims.
- Cameras: local full-resolution recording, central ingest after return.
- NVG/player cameras: only compatible recordings and consented use.

## Media pipeline
Local recording -> return/check-in -> verified ingest -> time sync -> event indexing -> AI-assisted selects -> editorial assembly -> human approval -> ORVIA Socials / customer outputs.

## Globalisation
Country Capability Registry must control:
currency; language; payment provider; digital products; marketplace status; physical fulfilment; hardware deployment; affiliate programmes; tax/compliance configuration; support model.

## Known gaps
No production database, authentication, live booking engine, verified venue feed, creator royalty engine, production affiliate feed, hardware provisioning service, campaign scoring backend or automated media pipeline is represented as live today.
