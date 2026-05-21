# YardPromoJa Phase 39 — Homepage Trending Landscape Cards

This phase makes the homepage Trending Now cards landscape.

## What changes

On the homepage only:

- Trending cards become horizontal/landscape.
- Cards use 2 columns, creating 2 rows when there are 4 cards.
- Image appears on the left.
- Text appears on the right.
- Card remains dark like Phase 37.
- Whole card still clicks to the promo detail page.

## What stays protected

Other pages keep the previous card layout:

- `/browse`
- `/reels`
- `/link-up`
- promo detail pages
- dashboard/admin
- Supabase/data logic

## Files included

```text
app/AdsGrid.js
app/AdsGrid.module.css
docs/PHASE_39_TEST_CHECKLIST.md
README_APPLY_PHASE_39_HOME_TRENDING_LANDSCAPE_CARDS.md
```

## Apply

Copy the included `app` folder into your project root.

This replaces:

```text
app/AdsGrid.js
app/AdsGrid.module.css
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

- Trending cards are landscape.
- You should see 2 columns / 2 rows for 4 cards.
- Image left, text right.
- No white card body.
- No RSVP/heat/contact clutter.
- Cards still click to `/ad/...`.

Then test:

```text
http://localhost:3000/browse
```

Expected:

- Browse page is not forced into the homepage landscape layout.

Then run:

```cmd
npm run build
```
