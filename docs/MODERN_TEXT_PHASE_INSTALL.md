# YardPromoJa Modern Text Phase

This patch focuses on the homepage copy and typography tone without changing database, routes, auth, or Supabase logic.

## What it modernizes

Hero copy becomes cleaner and more platform-like:

- Eyebrow: `Jamaica’s discovery hub`
- Hero headline: `Find your next move in Jamaica.`
- Subheadline: `Explore events, food spots, weekend plans, services, deals, and local promos — searchable by parish, category, and date.`
- Featured carousel label: `Featured now`
- CTA casing becomes sentence case: `Post your promo`, `Explore promos`, `Plan a link-up`

## Install

Copy this patch into your project root.

Then run:

```bash
node scripts/apply-modern-text-phase.js
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Notes

The script is conservative. It searches for the current text visible in your screenshots and replaces it with the cleaner copy. It also appends a small CSS typography polish block to `app/globals.css` and `app/mobile/mobile.css` if those files exist.

If your homepage text is split across many JSX elements, the script may update some strings but not all. In that case, use `components/ModernHeroCopy.js` as the drop-in hero copy block.

## Drop-in component usage

```jsx
import ModernHeroCopy from "@/components/ModernHeroCopy";

<ModernHeroCopy />
```

Replace your current left-side hero copy block with the component above.

## Rollback

Before running the script, commit your current work or copy your files. To rollback, undo changes in:

- `app/page.js`
- `app/layout.js`
- `components/HeroStack.js`
- `components/HeroStackCarousel.js`
- `app/globals.css`
- `app/mobile/mobile.css`
