# YardPromoJa Phase 63 - Real Image Category Icons

This phase removes the AI/emoji-looking category icons and replaces them with real SVG image files.

## Important

This phase does **not** change your homepage format or card size.

It only:

- adds SVG image assets
- hides the old emoji/icon symbol visually
- uses the real image asset as the icon background
- preserves the existing category card layout

## Files added

```text
public/assets/category-icons/events.svg
public/assets/category-icons/food.svg
public/assets/category-icons/sale-offers.svg
public/assets/category-icons/campaigns.svg
public/assets/category-icons/beauty.svg
public/assets/category-icons/fashion.svg
public/assets/category-icons/transport.svg
public/assets/category-icons/stay.svg
public/assets/category-icons/weekend.svg
public/assets/category-icons/parish.svg

scripts/phase-63-real-image-category-icons.cmd
scripts/phase-63-real-image-category-icons.js
```

## File edited by script

```text
app/globals.css
```

## Backup created

```text
app/globals.css.phase63-backup
```

## Apply

Copy the included `public`, `scripts`, and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-63-real-image-category-icons.cmd
```

## Restart

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

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

- Existing category card size stays the same.
- Existing category strip format stays the same.
- Emoji / AI-looking icons disappear.
- Real SVG image icons appear in the same icon positions.

## Rollback

Restore:

```text
app/globals.css.phase63-backup
```
