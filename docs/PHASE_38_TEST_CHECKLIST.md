# Phase 38 Test Checklist

## Homepage Trending Now

- Cards still use dark Phase 37 style.
- Cards try uploaded post/flyer images first.
- Parish/reels fallback artwork should no longer be used by `AdsGrid`.
- Whole card still clicks to ad detail page.

## Browser console/network

If an uploaded image fails, you may see the browser try several image URLs.
That is expected. It cycles through likely Supabase storage URL formats.

## Existing routes

Test:

```text
/
 /browse
 /ad/YOUR_PROMO_SLUG
 /link-up
 /campaigns
 /reels
```

## Build

Run:

```cmd
npm run build
```
