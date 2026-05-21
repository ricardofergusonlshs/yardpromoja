# Phase 33 Test Checklist

## Homepage hero

- Only one featured promo card/photo is visible.
- The image/card fills the showcase border.
- No angled cards are visible behind the main promo.
- Featured promos ribbon still appears.
- View Promo still clicks.
- Arrows/dots still appear if present.

## Mobile

- Hero showcase does not overflow.
- One card is visible.
- Image remains inside the border.

## Existing routes

Test:

```text
/
 /browse
 /link-up
 /reels
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
