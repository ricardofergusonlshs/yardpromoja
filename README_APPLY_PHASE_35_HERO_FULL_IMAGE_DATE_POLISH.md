# YardPromoJa Phase 35 — Hero Full Image + Date Polish

Your latest screenshot confirms Phase 34 worked for the main issue:

```text
The hero is now one at a time.
```

But the image is still being cropped/zoomed and the date is showing raw ISO text.

This phase polishes that.

## What this phase fixes

- Keeps **one promo at a time**
- Shows the **full flyer/image inside the card border**
- Uses `object-fit: contain` instead of `cover`
- Makes the overlay smaller
- Keeps the dots and arrows
- Formats raw ISO dates into readable dates like `May 21, 2026`
- Stops long dates from overflowing

## Files included

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
docs/PHASE_35_TEST_CHECKLIST.md
README_APPLY_PHASE_35_HERO_FULL_IMAGE_DATE_POLISH.md
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

- Hero still shows only one promo at a time.
- The full flyer/image appears inside the card border.
- No stacked/angled cards.
- Date is readable.
- View Promo works.
- Arrows and dots work.

Then run:

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
