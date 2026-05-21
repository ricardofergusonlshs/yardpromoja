# Phase 40 Test Checklist

## Homepage Hero

- One promo visible at a time.
- Uses uploaded promo/post/flyer image when available.
- No stacked cards.
- Title is not oversized.
- View Promo works.
- Arrows work.
- Dots work.

## Image fallback

If the uploaded image URL/path fails, the component tries the next candidate before using the final brand placeholder.

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
