# Phase 26 Test Checklist

## Homepage

- By Parish section appears on `/`.
- Parish image cards load.
- Jamaica map SVG loads.
- “Explore Your Parish” card is visible.
- “Select Your Parish” button works.
- “View all parishes” link works.
- Parish card links go to browse with parish query.

## Layout

- Desktop: cards on left, map on right.
- Tablet: section stacks cleanly.
- Mobile: cards become 2 columns or 1 column on very small screens.
- No horizontal overflow.

## Existing homepage

- Hero still works.
- Search still works.
- HeroStack still works.
- Trending cards still work.
- Plan Link-Up card still works.
- Campaigns & Offers card still works.
- Stats and CTA remain.

## Core routes

Test:

```text
/
 /browse?parish=Kingston
 /browse?parish=St.%20Ann
 /link-up
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
