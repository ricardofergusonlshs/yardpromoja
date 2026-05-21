# YardPromoJa Phase 33 — Hero Single-Card Carousel Fix

This phase fixes the homepage hero showcase where multiple stacked/angled promo cards are visible behind the main card.

## Goal

Make the hero showcase show:

- One promo card at a time
- No angled/stacked background cards
- The photo/card filling the full card border
- Existing arrows/dots/buttons still visible where possible

## Files included

```text
app/yp-dark.css
docs/PHASE_33_TEST_CHECKLIST.md
README_APPLY_PHASE_33_HERO_SINGLE_CARD.md
```

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

Check the hero card:

- Only one promo card/photo is visible.
- No side/behind cards are peeking out.
- Image fills the border cleanly.
- The View Promo button still works.
- Arrows/dots still show if your HeroStack component supports them.

Then test:

```text
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/reels
```

Then run:

```cmd
npm run build
```

## Protected

This phase is CSS-only. It does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse logic
- link-up logic
- campaigns
- ad detail sharing/thumbnail logic
- database schema
- HeroStack JavaScript
- AdsGrid JavaScript
- homepage page.js
