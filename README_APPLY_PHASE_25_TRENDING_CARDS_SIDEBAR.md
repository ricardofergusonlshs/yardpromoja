# YardPromoJa Phase 25 — Trending Cards + Sticky/Sidebar Fix

This is a CSS-only phase.

## Why this phase

From your screenshots:

1. The right-side homepage support cards can feel like they are sticking/cutting awkwardly.
2. The trending cards in the second screenshot still have tall white bodies.
3. You want those trending cards to look closer to the dark premium card style from the target/reference image.

## What this phase does

- Stops homepage right rail/sidebar cards from behaving like sticky cards.
- Makes the right-column cards stack normally.
- Converts homepage trending/listing cards into a darker, premium style.
- Keeps card images consistent.
- Makes text readable on dark cards.
- Keeps featured badges gold.
- Keeps View Details green.
- Keeps Plan Link-Up gold.
- Improves card height consistency.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema
- homepage JavaScript
- hero carousel logic
- AdsGrid logic
- card hrefs or click behavior

## Apply

Copy the included `app` folder into your project root and replace:

```text
app/yp-dark.css
```

## Test

Open:

```text
http://localhost:3000
```

Check:

- Trending cards are now dark/premium.
- Card images stay clean.
- View Details still works.
- Plan Link-Up still works.
- Right-side cards do not stick/cut weirdly.

Also test:

```text
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Then run:

```cmd
npm run build
```
