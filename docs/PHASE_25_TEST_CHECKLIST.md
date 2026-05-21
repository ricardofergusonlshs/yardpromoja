# Phase 25 Test Checklist

## Homepage

- Trending cards look darker and more premium.
- Cards no longer have tall white bodies.
- Featured badges are readable.
- Location/stat chips are readable.
- View Details button works.
- Plan Link-Up button works.
- Right-side cards do not stick or cut awkwardly.

## Mobile

- Trending cards stack cleanly.
- Buttons fit.
- No horizontal overflow.

## Core route protection

Test:

```text
/
 /browse
 /link-up
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
