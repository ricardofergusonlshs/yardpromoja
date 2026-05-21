# YardPromoJa Phase 41 — Hero Raw Uploaded Image Fix

Your screenshot still shows parish/fallback artwork in the hero.

## Why Phase 40 did not fix it

The hero was still doing this:

```js
data.map(cleanAd).map(normalisePromo)
```

If `cleanAd()` removes the raw uploaded image columns from your Supabase row, the hero cannot see the real uploaded flyer/photo anymore.

So even though Phase 40 had a strong image resolver, it was resolving against already-cleaned data.

## What this phase fixes

This phase keeps the raw Supabase row, then merges cleaned fields back in:

```js
{ ...rawRow, ...cleanAd(rawRow) }
```

That means:

- uploaded image columns stay available
- title/category/location normalization still works
- hero tries uploaded promo image first
- fallback art is only used at the very end

## Files included

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
docs/PHASE_41_TEST_CHECKLIST.md
README_APPLY_PHASE_41_HERO_RAW_UPLOAD_IMAGE_FIX.md
```

## Apply

Copy the included `app` folder into your project root.

This replaces:

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
```

## Test

Restart if needed:

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

Expected:

- Hero should now use the real uploaded promo image if it is present in the raw `ads` row.
- Hero remains one-at-a-time.
- Title remains smaller.
- View Promo, arrows, and dots still work.

## If it still shows fallback art

Then the uploaded image is likely not present in the `ads` row returned by:

```js
supabase.from("ads").select("*")
```

or the bucket is private. At that point, check one ad row in Supabase and tell me the exact image column name and bucket name.

## Build

Run:

```cmd
npm run build
```
