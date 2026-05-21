# YardPromoJa Phase 28 — Reels + Bottom Marketing/Footer Polish

This phase adds the bottom homepage look from your reference image:

- YardPromo Reels strip
- Promote your business banner
- Stay in the loop newsletter banner
- Footer dark polish support

## Files included

```text
app/page.js
app/yp-dark.css
public/assets/reels/*.png
docs/PHASE_28_TEST_CHECKLIST.md
README_APPLY_PHASE_28_REELS_FOOTER.md
```

## What this phase does

Adds a new homepage section:

```text
YARDPROMO REELS
Real people. Real vibes. Real Jamaica.
```

Adds reel cards for:

- Blue Lagoon
- Dancehall Night
- Jerk Chicken
- Reach Falls
- Negril Vibes
- Sunset at Rick’s
- Yardie Brunch
- Hiking in Jamaica

Adds a bottom marketing banner:

- Promote your business
- Stay in the loop newsletter form

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
public/assets/reels/*.png
```

## Test

Open:

```text
http://localhost:3000
```

Check:

- YardPromo Reels appears below the By Parish section.
- Reels scroll/look like the reference.
- Reels links go to browse pages.
- Promote your business banner appears.
- Stay in the loop form appears.
- Footer still appears below as normal.
- Mobile layout stacks properly.

Then run:

```cmd
npm run build
```

## Note

The newsletter form is intentionally simple and submits to `/contact` with the email query. It does not add a database table or email provider, so it will not break your current app.
