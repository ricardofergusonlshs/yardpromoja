# YardPromoJa Phase 65 - Trending Landscape Overlay Cards

This phase updates the Trending Now cards.

## What it changes

- Image becomes full-card landscape.
- Text moves to the lower center of the image.
- The old left-image / right-text split is removed visually.
- Existing card grid/section stays in place.
- No JSX/page structure is changed.

## File edited

```text
app/globals.css
```

## Backup created

```text
app/globals.css.phase65-backup
```

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-65-trending-landscape-overlay.cmd
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

- Trending cards are landscape.
- Image fills the card.
- Text is lower-center over the image.
- Right-side link-up panel is unchanged.
- Homepage content remains visible.

## Rollback

Restore:

```text
app/globals.css.phase65-backup
```
