# Phase 36 Test Checklist

## Homepage hero

- One promo visible at a time.
- Title is smaller.
- Overlay is smaller.
- More image/photo area is visible.
- Real promo photo appears where the ad has a valid image URL.
- If no image URL exists, parish/reels fallback appears.

## Interaction

- View Promo works.
- Arrows work.
- Dots work.
- Auto-rotation works.

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
