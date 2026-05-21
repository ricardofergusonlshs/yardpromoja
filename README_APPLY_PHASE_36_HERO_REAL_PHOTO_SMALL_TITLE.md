# YardPromoJa Phase 36 — Hero Real Photo + Smaller Titles

Your screenshot shows two issues:

1. The hero is showing a generic YardPromo-style fallback/preview instead of the real promo photo.
2. The title text inside the overlay is too large and covering too much of the card.

## Why it happened

The hero component can only show the real photo if it can find the image URL field from your ad row.

Different parts of your app appear to use different image field names, such as:

```text
image_url
flyer_url
thumbnail_url
cover_image_url
poster_url
photo_url
image
flyer
```

The previous component was not checking enough possible field names. When it could not find a valid image, it used the generic YardPromo fallback.

## What this phase fixes

- Checks many more possible image fields.
- Supports `images[0]` and `gallery[0]` if your Supabase rows use arrays.
- Stops using the brand preview as the first hero fallback.
- Adds image `onError` fallback if a Supabase URL is broken.
- Makes the overlay smaller.
- Makes the hero title smaller.
- Keeps one promo at a time.
- Keeps arrows, dots, and View Promo.

## Files included

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
docs/PHASE_36_TEST_CHECKLIST.md
README_APPLY_PHASE_36_HERO_REAL_PHOTO_SMALL_TITLE.md
```

## Apply

Copy the included `app` folder into your project root.

This replaces:

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
```

## Test

Open:

```text
http://localhost:3000
```

Expected:

- One promo at a time.
- Title smaller.
- Overlay smaller.
- More photo/flyer visible.
- Real photo appears if your ad row has a valid image field.
- If a row has no image at all, it uses parish/reels fallback instead of brand preview.

## Important

If you still see fallback images after this phase, it means the database row being shown has no usable image URL in the fields checked. Then we need to inspect the actual Supabase column names for one ad.

## Build

Run:

```cmd
npm run build
```

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse logic
- link-up logic
- campaigns
- ad detail sharing/thumbnail logic
- database schema
- homepage page.js
- AdsGrid
