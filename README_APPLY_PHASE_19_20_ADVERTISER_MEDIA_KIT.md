# YardPromoJa Phase 19 + 20 — Advertiser Packages + Media Kit

This combines the next two phases in one ZIP.

## Phase 19

Adds an advertiser package landing page:

```text
app/advertise/packages/page.js
app/advertise/packages/Packages.module.css
```

Route:

```text
/advertise/packages
```

Purpose:

- Turn your niche into clear advertiser packages.
- Explain how YardPromoJa complements social media.
- Give advertisers package choices without changing your backend.

## Phase 20

Adds a media kit page:

```text
app/media-kit/page.js
app/media-kit/MediaKit.module.css
```

Route:

```text
/media-kit
```

Purpose:

- Give you a clean page to explain the platform to advertisers.
- Show audience types, placements, and pitch copy.
- Prepare you for sponsors, promoters, and business outreach.

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
- existing CSS

## Apply

Copy the included `app` folder into your project root.

## Test

Start dev server if needed:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

Open:

```text
http://localhost:3000/advertise/packages
http://localhost:3000/media-kit
```

Then test existing routes:

```text
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Then run:

```cmd
npm run build
```

## Optional later step

Add footer/header links to these pages later only after testing:

```text
/advertise/packages
/media-kit
```
