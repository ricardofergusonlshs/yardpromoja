# YardPromoJa Phase 30 — Advertiser Packages + Media Kit

This phase adds advertiser-facing pages that support your business model without changing existing app functions.

## Adds

```text
app/advertise/packages/page.js
app/advertise/packages/Packages.module.css
app/media-kit/page.js
app/media-kit/MediaKit.module.css
scripts/phase-30-smoke-test.ps1
docs/PHASE_30_TEST_CHECKLIST.md
```

## Why this phase

Your footer now links to:

```text
/advertise/packages
/media-kit
```

This phase makes those routes real and gives advertisers a clear, polished explanation of what YardPromoJa offers.

## New pages

### `/advertise/packages`

Includes:

- Starter Promo
- Link-Up Boost
- Campaign Kit
- Business Presence
- Package comparison table
- Clear advertiser CTAs

### `/media-kit`

Includes:

- YardPromoJa positioning
- Audience/action explanation
- Placement options
- The gap YardPromoJa fills between social media attention and real action

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filter logic
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema
- AdsGrid logic
- HeroStack logic
- homepage page.js
- app/layout.js
- footer install script

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then test:

```text
http://localhost:3000/advertise/packages
http://localhost:3000/media-kit
```

Optional smoke test while dev server is running:

```powershell
.\scripts\phase-30-smoke-test.ps1
```

Then run:

```cmd
npm run build
```
