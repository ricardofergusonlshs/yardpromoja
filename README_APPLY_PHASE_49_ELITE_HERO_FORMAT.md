# YardPromoJa Phase 49 — Elite Hero Format

This phase moves the homepage hero closer to the reference image you sent:

- left side remains strong, bold, and premium
- right side becomes a cleaner featured image/flyer card
- the old heavy overlay panel is hidden
- the card feels smoother, modern, and elite
- arrows and dots match the reference better
- logic stays protected

## Files included

```text
app/components/HeroStack.module.css
scripts/phase-49-elite-hero-homepage-polish.ps1
docs/PHASE_49_TEST_CHECKLIST.md
README_APPLY_PHASE_49_ELITE_HERO_FORMAT.md
```

## What this replaces

```text
app/components/HeroStack.module.css
```

## What this does not touch

It does not replace:

```text
app/components/HeroStack.js
app/page.js
Supabase files
database schema
auth/admin/dashboard files
browse/link-up/campaign/ad detail logic
```

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then optionally run:

```powershell
.\scripts\phase-49-elite-hero-homepage-polish.ps1
```

That appends extra homepage polish to:

```text
app/globals.css
```

It does not replace your global CSS.

## Test

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

Expected:

- Right featured promo looks like a clean event/flyer card.
- Old large title overlay on the right card is gone.
- Badge is top-left like the target.
- Arrows sit cleaner around the card.
- Dots sit below the card like the target.
- Card still clicks through to the promo page.
- Homepage functions still work.

## Build

Run:

```cmd
npm run build
```
