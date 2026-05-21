# YardPromoJa Phase 23 — Brand Icon Assets Fix

This phase fixes the visible 404 from the terminal:

```text
GET /assets/apple-touch-icon.png 404
```

## Files added

```text
public/assets/favicon.png
public/assets/apple-touch-icon.png
public/assets/yardpromo-icon.png
public/assets/yardpromo-app-icon.png
public/favicon.png
public/apple-touch-icon.png
scripts/check-brand-assets.ps1
docs/PHASE_23_TEST_CHECKLIST.md
```

## Why this matters

Your `manifest.webmanifest` is loading successfully, but it references brand icon files. The browser then requests the icon files. Since `apple-touch-icon.png` was missing, the terminal showed a 404.

This phase adds the missing PWA/mobile icon assets so the manifest, browser tab, mobile save icon, and install metadata have real files to use.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema
- CSS
- routes

## Apply

Copy the included `public` and `scripts` folders into your project root.

## Test

Open:

```text
http://localhost:3000/assets/apple-touch-icon.png
http://localhost:3000/assets/yardpromo-icon.png
http://localhost:3000/assets/yardpromo-app-icon.png
http://localhost:3000/manifest.webmanifest
```

The icon URLs should return 200 instead of 404.

Optional PowerShell check:

```powershell
.\scripts\check-brand-assets.ps1
```

Then run:

```cmd
npm run build
```
