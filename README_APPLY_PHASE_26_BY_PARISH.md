# YardPromoJa Phase 26 — By Parish Homepage Section

This phase adds a **By Parish** section to the front page, with a Jamaica map panel inspired by the reference image.

## Files included

```text
app/page.js
app/yp-dark.css
public/assets/jamaica-parish-map.svg
public/assets/parishes/*.png
docs/PHASE_26_TEST_CHECKLIST.md
README_APPLY_PHASE_26_BY_PARISH.md
```

## What this phase does

- Adds a new homepage section: **By Parish**.
- Adds parish cards for:
  - Kingston
  - St. Catherine
  - Manchester
  - Clarendon
  - St. Ann
  - Trelawny
  - St. James
  - Hanover
  - Westmoreland
  - St. Elizabeth
  - St. Mary
  - Portland
- Adds a stylized Jamaica map with parish markers.
- Adds an “Explore Your Parish” CTA.
- Links parish cards to `/browse?parish=...`.
- Keeps the homepage flow: hero → categories → trending/sidebar → by parish → stats → CTA.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filter logic
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema
- AdsGrid logic
- HeroStack logic

## Apply

Copy the included `app` and `public` folders into your project root.

This replaces:

```text
app/page.js
app/yp-dark.css
```

This adds:

```text
public/assets/jamaica-parish-map.svg
public/assets/parishes/*.png
```

## Important

Because this replaces `app/page.js`, check that your current homepage did not have any custom edits after Phase 2 that you still need. This file keeps the current dark homepage structure and adds the By Parish section.

## Test

Open:

```text
http://localhost:3000
```

Check:

- By Parish section appears after Trending/Plan/Campaigns area.
- Parish image cards show.
- Jamaica map shows.
- “Select Your Parish” button works.
- Parish card clicks go to `/browse?parish=...`.
- Mobile layout stacks cleanly.

Also test:

```text
http://localhost:3000/browse?parish=Kingston
http://localhost:3000/browse?parish=St.%20Ann
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Then run:

```cmd
npm run build
```

## Note about your terminal warning

The yellow message about `scroll-behavior: smooth` is not a build error. It does not stop the site. A later cleanup phase can add `data-scroll-behavior="smooth"` to `<html>` in `app/layout.js` if you want to silence it.
