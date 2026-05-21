# Phase 50 Test Checklist

## Homepage hero

Open:

```text
http://localhost:3000
```

Expected:

- Hero no longer uses reel photos.
- Hero no longer uses parish artwork.
- Hero uses uploaded promo/flyer/post image where available.
- Hero remains one slide at a time.
- Arrows work.
- Dots work.
- Clicking the card opens the promo detail page.

## Check install

Run:

```powershell
.\scripts\phase-50-check-hero-upload-only.ps1
```

## Existing pages

Test:

```text
/
 /browse
 /link-up
 /parish
 /map
 /reels
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
