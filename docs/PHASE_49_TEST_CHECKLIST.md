# Phase 49 Test Checklist

## Homepage hero

Open:

```text
http://localhost:3000
```

Expected:

- Right hero card is cleaner and more like the reference.
- One image/event at a time.
- No large glass title overlay covering the image.
- "Featured Event" style badge appears.
- Dots below image work.
- Left and right arrows work.
- Clicking image opens the promo detail page.

## Optional global polish

Run:

```powershell
.\scripts\phase-49-elite-hero-homepage-polish.ps1
```

Then hard refresh:

```text
Ctrl + F5
```

## Existing pages

Test:

```text
/
 /browse
 /link-up
 /parish
 /map
 /reels
 /campaigns
 /ad/YOUR_PROMO_SLUG
```

## Build

Run:

```cmd
npm run build
```
