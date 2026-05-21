# YardPromoJa Phase 42 — Parish Detail Pages

This phase makes every parish open its own page.

## What this adds

```text
/parish
/parish/kingston
/parish/st-andrew
/parish/st-catherine
/parish/manchester
/parish/clarendon
/parish/st-ann
/parish/trelawny
/parish/st-james
/parish/hanover
/parish/westmoreland
/parish/st-elizabeth
/parish/st-mary
/parish/portland
/parish/st-thomas
```

## What each parish page does

Each parish page has:

- Parish hero section
- Parish image/card
- Stats strip
- Quick category buttons
- Latest promos filtered for that parish
- Nearby parish links
- Browse button
- Plan Link-Up button

The page fetches live promos from Supabase and filters them client-side by parish/location/venue/address/title.

## Files included

```text
app/parish/page.js
app/parish/parishData.js
app/parish/parish.module.css
app/parish/[slug]/page.js
app/parish/[slug]/ParishPageClient.js
scripts/phase-42-update-home-parish-links.ps1
docs/PHASE_42_TEST_CHECKLIST.md
```

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then run this from the project root:

```powershell
.\scripts\phase-42-update-home-parish-links.ps1
```

That updates the homepage parish card links from:

```text
/browse?parish=St.%20Elizabeth
```

to:

```text
/parish/st-elizabeth
```

## Test

Open:

```text
http://localhost:3000/parish
http://localhost:3000/parish/st-elizabeth
http://localhost:3000/parish/kingston
http://localhost:3000/parish/portland
```

Then go to the homepage and click parish cards.

## Build

Run:

```cmd
npm run build
```

## Protected

This phase does not touch:

- HeroStack
- AdsGrid
- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- campaigns
- ad detail sharing/thumbnail logic
- database schema
- current browse page
