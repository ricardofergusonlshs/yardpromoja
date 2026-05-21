# YardPromoJa Phase 52 — Modern Hero Text + Search

This phase makes the homepage hero text and search area closer to your reference image.

## Goal

Current text:

```text
Social media gets attention.
YardPromoJa turns it into action.
```

New direction:

```text
What’s happening in Jamaica?
Find amazing places, events, restaurants, adventures and hidden gems near you.
```

With a modern reference-style search bar:

- large rounded glass search
- search icon
- category selector
- location selector
- yellow circular search button
- popular search chips

## Files included

```text
app/components/HomeSearchPanel.js
app/components/HomeSearchPanel.module.css
scripts/phase-52-modernize-hero-copy-search.ps1
docs/PHASE_52_TEST_CHECKLIST.md
README_APPLY_PHASE_52_MODERN_HERO_TEXT_SEARCH.md
```

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then run:

```powershell
.\scripts\phase-52-modernize-hero-copy-search.ps1
```

Restart:

```cmd
Ctrl + C
npm run dev
```

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

## Notes

This phase replaces the search panel component:

```text
app/components/HomeSearchPanel.js
app/components/HomeSearchPanel.module.css
```

It also patches `app/page.js` copy where possible.

If your homepage uses a different search component name, the new component will still be available, but we may need to swap the import in `app/page.js`.

## Protected

This phase does not touch:

- HeroStack image logic
- HeroStack carousel styling
- Supabase keys
- auth/admin/dashboard
- database schema
- ad detail pages
- browse page logic
