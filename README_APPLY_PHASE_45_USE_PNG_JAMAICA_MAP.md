# YardPromoJa Phase 45 — Use PNG Jamaica Map

This phase switches the Jamaica map from SVG to PNG.

## What this includes

```text
public/assets/jamaica-parish-map.png
public/assets/jamaica-parish-map.webp
scripts/phase-45-switch-map-to-png.ps1
docs/PHASE_45_TEST_CHECKLIST.md
```

## What changes

The PNG map is a high-resolution raster map with:

- More accurate Jamaica island shape
- Parish marker points
- Parish label placements
- Dark premium background
- YardPromoJa yellow/green styling
- Better visual consistency with the homepage

## Apply

Copy the included `public`, `scripts`, and `docs` folders into your project root.

Correct final PNG location:

```text
C:\Projects\yardpromo-nextjs-supabase-starter\public\assets\jamaica-parish-map.png
```

Then run:

```powershell
.\scripts\phase-45-switch-map-to-png.ps1
```

This replaces references from:

```text
/assets/jamaica-parish-map.svg
```

to:

```text
/assets/jamaica-parish-map.png
```

inside app files.

## Test

Open:

```text
http://localhost:3000
http://localhost:3000/parish
http://localhost:3000/parish/st-elizabeth
```

Hard refresh:

```text
Ctrl + F5
```

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
- auth/admin logic
- browse logic
- parish page logic
- database schema
