# Phase 28 Test Checklist

## Homepage

- YardPromo Reels section appears.
- Reel cards load images.
- Play icons show.
- Reel cards click to browse pages.
- Promote your business banner appears.
- List Your Business button goes to `/create`.
- Stay in the loop newsletter form appears.
- Subscribe submit goes to `/contact?email=...`.
- Footer still shows below.

## Mobile

- Reel row scrolls horizontally.
- Bottom marketing banner stacks.
- Newsletter input and button stack.
- No horizontal page overflow.

## Existing sections

Check these still work:

```text
Hero
Category strip
Trending cards
Plan the Link-Up card
Campaigns & Offers
By Parish
Footer
```

## Core routes

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
