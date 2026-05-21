# Phase 29 Test Checklist

## Homepage

- Footer appears once.
- Footer has columns and app badges.
- Footer looks good on mobile.
- Homepage “View all reels” goes to `/reels`.

## Reels page

Test:

```text
/reels
```

Check:

- Hero loads.
- Filter pills work.
- Reel cards show.
- Reel cards click to browse pages.
- CTA button goes to `/create`.

## Core routes

Test:

```text
/
 /browse
 /link-up
 /campaigns
 /ad/YOUR_PROMO_SLUG
 /health
 /api/health
```

## Build

Run:

```cmd
npm run build
```
