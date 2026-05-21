# YardPromoJa Phase 37 — Trending Cards Dark Reference Style

This phase changes the promo/trending cards to match your second reference image.

## What changes visually

The cards now use the reference style:

```text
dark card body
poster/flyer image at top
small yellow Featured pill
green category label
white title
small grey location row
bottom heart/share metrics
no white card body
no RSVP/heat/contact/details clutter
no visible View Details / Plan Link-Up buttons inside the card
```

The whole card is still clickable and opens the promo detail page.

## Files included

```text
app/AdsGrid.js
app/AdsGrid.module.css
docs/PHASE_37_TEST_CHECKLIST.md
README_APPLY_PHASE_37_TRENDING_CARDS_DARK_REFERENCE.md
```

## Apply

Copy the included `app` folder into your project root.

This replaces:

```text
app/AdsGrid.js
```

This adds:

```text
app/AdsGrid.module.css
```

## Important

This phase changes only the promo cards rendered by `AdsGrid`.

It does not change:

```text
homepage hero
Plan the Link-Up sidebar
Campaigns & Offers sidebar
By Parish section
Reels
footer
browse logic
ad detail page
Supabase keys
auth/admin logic
database schema
```

## Test

Open:

```text
http://localhost:3000
```

Check the Trending Now section.

Expected:

- Cards look like the second image reference.
- No white card body.
- Cards are compact.
- Card image is large.
- Card title is smaller and clean.
- Whole card clicks to promo page.

Then test:

```text
http://localhost:3000/browse
```

Then run:

```cmd
npm run build
```
