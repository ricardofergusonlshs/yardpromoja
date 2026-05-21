# YardPromoJa Phase 50 — Hero Uses Promo Upload Images Only

Your hero format is now looking better, but the image source is wrong. It is pulling reel/parish-style photos instead of uploaded promo flyers/posts.

## Root cause

The previous hero image resolver scanned too broadly for any image-like value.

That means it could accidentally pick:

```text
/assets/reels/...
/assets/parishes/...
yardpromo-brand-preview.png
brand/logo assets
```

instead of the actual uploaded promo/flyer/post image.

## What this phase fixes

This phase replaces:

```text
app/components/HeroStack.js
```

The new logic:

- prefers uploaded promo fields only
- blocks reel images
- blocks parish images
- blocks brand/logo/placeholder images
- filters hero slides to rows that have real promo upload images first
- keeps your current `HeroStack.module.css` look from Phase 49
- keeps one promo at a time
- keeps arrows, dots, and promo click-through working

## Important

This phase does **not** replace:

```text
app/components/HeroStack.module.css
```

So your improved hero look stays the same.

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then run:

```powershell
.\scripts\phase-50-check-hero-upload-only.ps1
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

The hero should now pull from uploaded promo/flyer/post image fields, not reel images.

## If it still shows the wrong image

Then the promo upload image may be stored in a custom column name that is not in the resolver list.

Open one row in your Supabase `ads` table and tell me the exact column name that stores the uploaded flyer/post image. I will add that column name to the resolver.

## Build

Run:

```cmd
npm run build
```
