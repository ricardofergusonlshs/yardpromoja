# YardPromoJa Phase 40 — Hero Uses Uploaded Promo Images

Your screenshot shows the hero is now one-at-a-time, but you want the hero image source to match the uploaded promo/post/flyer image, not only fallback or generic display images.

## What this phase does

This phase updates `HeroStack` to use the same robust uploaded-image resolver approach as the Trending cards.

It checks many possible uploaded image URL fields:

```text
image_url
flyer_url
thumbnail_url
cover_image_url
poster_url
photo_url
media_url
file_url
upload_url
uploaded_image_url
image
flyer
poster
photo
cover
picture
```

It also checks storage path fields:

```text
image_path
flyer_path
thumbnail_path
cover_image_path
poster_path
photo_path
media_path
file_path
upload_path
uploaded_image_path
storage_path
object_path
path
key
```

It also checks arrays/JSON:

```text
images
gallery
media
photos
attachments
files
flyers
uploads
assets
```

Then it tries common Supabase buckets:

```text
ad-images
ads
flyers
uploads
promo-images
promos
images
media
listing-images
business-images
yardpromo
public
```

## Files included

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
docs/PHASE_40_TEST_CHECKLIST.md
README_APPLY_PHASE_40_HERO_USE_UPLOADED_PROMO_IMAGES.md
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

Hard refresh:

```text
Ctrl + F5
```

Expected:

- Hero still shows one promo at a time.
- Hero now tries uploaded promo/flyer/post image first.
- Arrows and dots still work.
- View Promo still works.
- Title remains smaller.

## If it still does not show the uploaded image

That means the specific uploaded image is either:

- saved under a different database column,
- saved in a private Supabase bucket,
- or not saved in the `ads` row returned to the homepage.

Open one ad row in Supabase and show the image/file columns so we can make an exact one-column patch.

## Build

Run:

```cmd
npm run build
```
