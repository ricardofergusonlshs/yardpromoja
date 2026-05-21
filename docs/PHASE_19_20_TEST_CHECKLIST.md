# Phase 19 + 20 Test Checklist

## Advertiser Packages

Test:

```text
/advertise/packages
```

Check:

- Hero loads.
- Package cards show.
- CTAs go to /create, /campaigns, /contact, and /media-kit.
- Mobile layout stacks cleanly.

## Media Kit

Test:

```text
/media-kit
```

Check:

- Audience list shows.
- Placement cards show.
- Launch copy sections show.
- CTAs go to /advertise/packages and /contact.
- Mobile layout stacks cleanly.

## Core protection check

Also test:

```text
/
 /browse
 /browse?category=Food
 /link-up
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
