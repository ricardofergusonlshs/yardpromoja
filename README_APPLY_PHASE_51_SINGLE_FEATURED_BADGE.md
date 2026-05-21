# YardPromoJa Phase 51 — Single Featured Badge

Your latest screenshot shows the hero is good now, but there are two featured stamps:

```text
Featured promos
★ Featured event
```

This phase removes the duplicate and leaves only one clean featured badge.

## What this phase changes

It replaces:

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
```

## What it keeps

It keeps the working Phase 50 image logic:

- hero pulls from uploaded promo/flyer/post images
- reel images stay blocked
- parish images stay blocked
- brand/logo placeholders stay blocked

It also keeps the Phase 49 elite layout.

## What it fixes

- Adds one controlled badge: `★ Featured promo`
- Disables the old generated CSS badge
- Hides older duplicate badge classes if still present
- Keeps the hero card clickable

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then run:

```powershell
.\scripts\phase-51-check-single-featured-badge.ps1
```

Restart:

```cmd
Ctrl + C
npm run dev
```

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

## Expected result

Only one featured stamp appears on the hero image.

## Build

Run:

```cmd
npm run build
```
