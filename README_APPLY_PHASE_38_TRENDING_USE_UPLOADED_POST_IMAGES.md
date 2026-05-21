# YardPromoJa Phase 38 — Trending Cards Use Uploaded Post Images

Your screenshot shows the first three trending cards using generated fallback artwork instead of the real uploaded post images.

## Why it happened

Phase 37 made the card style closer to your reference, but the image resolver was still falling back to parish/reels artwork when it could not find the uploaded image field.

Your uploaded post image may be stored in Supabase under a different field name or as a storage path instead of a full URL.

## What this phase changes

This phase keeps the Phase 37 card design, but changes the image logic.

It now checks many possible uploaded image fields:

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

Then it tries Supabase public storage buckets such as:

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

## Important

This phase removes the parish/reels fallback from `AdsGrid`.

If the uploaded post image exists in your database/storage, the card should now find it.

If the card still does not show the uploaded post image, then the image is not saved in the `ads` row in any of the checked fields, or the Supabase storage bucket is private.

## Files included

```text
app/AdsGrid.js
docs/PHASE_38_TEST_CHECKLIST.md
README_APPLY_PHASE_38_TRENDING_USE_UPLOADED_POST_IMAGES.md
```

## Apply

Copy the included `app` folder into your project root.

This replaces:

```text
app/AdsGrid.js
```

It does not replace the Phase 37 CSS.

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

- Trending card design stays dark like Phase 37.
- Cards now try uploaded post/flyer images first.
- No parish/reels generated artwork unless the uploaded image truly cannot be found.
- Whole card still opens the promo detail page.

Then run:

```cmd
npm run build
```

## If still not showing

Open one promo in Supabase and check which column stores the uploaded image URL/path. Send me that column name and I will make the exact resolver patch.
