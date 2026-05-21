# YardPromoJa Phase 29 — Reels Page + Full Footer Install

This phase completes the bottom of the site more like your reference image.

## Adds

```text
app/reels/page.js
app/reels/Reels.module.css
app/components/YardPromoFooter.js
app/yp-dark.css
public/assets/reels/*.png
scripts/install-yardpromo-footer.ps1
scripts/update-home-reels-link.ps1
docs/PHASE_29_TEST_CHECKLIST.md
```

## What this phase does

- Adds a full `/reels` page.
- Adds a premium footer component with:
  - Brand section
  - Social icons
  - Explore links
  - Company links
  - Support links
  - Popular locations
  - App download badges
- Adds a script to safely install the new footer into your current `app/layout.js`.
- Adds a script to update the homepage “View all reels” link to `/reels`.

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

Copy the included `app`, `public`, `scripts`, and `docs` folders into your project root.

Then run:

```powershell
.\scripts\install-yardpromo-footer.ps1
.\scripts\update-home-reels-link.ps1
```

Then test:

```text
http://localhost:3000
http://localhost:3000/reels
```

Then run:

```cmd
npm run build
```

## If footer duplicates

If you see two footers, open `app/layout.js` and remove the older footer component, leaving:

```jsx
<YardPromoFooter />
```

The script creates a backup:

```text
app/layout.js.phase29-footer-backup
```
