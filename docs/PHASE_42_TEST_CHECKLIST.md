# Phase 42 Test Checklist

## New routes

Test:

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

Expected:

- No 404.
- Each page has a parish hero.
- Each page has stats and quick category links.
- Latest promos show when matching Supabase rows exist.
- Empty state shows when no promos exist for that parish.

## Homepage parish card links

Run:

```powershell
.\scripts\phase-42-update-home-parish-links.ps1
```

Then click a parish card from the homepage.

Expected:

- Card opens `/parish/[slug]`, not `/browse?parish=...`.

## Existing pages

Test:

```text
/
 /browse
 /link-up
 /reels
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

Expected:

- Existing pages still load.

## Build

Run:

```cmd
npm run build
```
