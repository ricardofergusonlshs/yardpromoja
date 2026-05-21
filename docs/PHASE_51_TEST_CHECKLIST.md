# Phase 51 Test Checklist

## Homepage hero

Open:

```text
http://localhost:3000
```

Expected:

- Only one featured badge appears.
- No duplicate `Featured promos` plus `Featured event` stack.
- Hero still uses uploaded promo/flyer/post images.
- Arrows work.
- Dots work.
- Clicking hero card opens promo detail page.

## Install check

Run:

```powershell
.\scripts\phase-51-check-single-featured-badge.ps1
```

## Build

Run:

```cmd
npm run build
```
