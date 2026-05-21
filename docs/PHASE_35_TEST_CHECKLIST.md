# Phase 35 Test Checklist

## Homepage hero

- One promo visible at a time.
- Full image/flyer visible inside the border.
- No stacked cards.
- Overlay is smaller and does not dominate the image.
- Date looks like `May 21, 2026`, not raw ISO.
- View Promo works.
- Arrows work.
- Dots work.

## Existing routes

Test:

```text
/
 /browse
 /link-up
 /reels
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
