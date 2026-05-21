# YardPromoJa Phase 34 — Hero One-at-a-Time Carousel

This phase directly replaces the stacked hero component.

## What this fixes

The previous CSS-only fix did not work because your real `HeroStack.js` structure still renders visible behind-cards.

This phase changes the actual component so the hero shows:

```text
one featured promo at a time
one full image inside the border
no stacked cards behind it
no angled background cards
```

It still keeps:

```text
View Promo link
left/right arrows
slide dots
auto-rotation
Supabase loading with safe fallback
```

## Files included

```text
app/components/HeroStack.js
app/components/HeroStack.module.css
docs/PHASE_34_TEST_CHECKLIST.md
README_APPLY_PHASE_34_HERO_ONE_AT_A_TIME.md
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

Check:

- Hero shows one promo only.
- No background stacked cards.
- Image fills the border.
- View Promo works.
- Arrows switch one promo at a time.
- Dots switch one promo at a time.

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
