# Phase 37 Test Checklist

## Homepage trending cards

- Dark cards.
- No white card body.
- No large RSVP/Heat/Contact blocks.
- No View Details/Plan Link-Up buttons inside the card.
- Featured badge appears on top image.
- Category is green.
- Title is white and compact.
- Location row appears.
- Bottom heart/share metrics appear.
- Card click opens promo detail page.

## Existing sections

Check these still look the same:

```text
Hero
Category strip
Plan the Link-Up sidebar
Campaigns & Offers
By Parish
Reels
Footer
```

## Core routes

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
