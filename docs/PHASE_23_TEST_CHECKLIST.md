# Phase 23 Test Checklist

## Asset URLs

Test these:

```text
/assets/favicon.png
/assets/apple-touch-icon.png
/assets/yardpromo-icon.png
/assets/yardpromo-app-icon.png
/favicon.png
/apple-touch-icon.png
/manifest.webmanifest
```

Expected:

- All icon URLs return 200.
- No terminal 404 for `/assets/apple-touch-icon.png`.
- Manifest still returns 200.

## Core pages

Test:

```text
/
 /browse
 /link-up
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```

## Notes

This phase only adds image assets and a check script. It does not change app logic.
