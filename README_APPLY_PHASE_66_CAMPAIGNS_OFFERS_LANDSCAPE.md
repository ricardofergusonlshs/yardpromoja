# YardPromoJa Phase 66 - Campaigns & Offers Landscape

This phase makes the Campaigns & Offers card use the space better.

## What it changes

- Makes the offer tiles landscape-style.
- Places the three campaign/offer tiles in a row where space allows.
- Keeps the same section content.
- Does not touch `app/page.js`.
- Does not remove homepage content.

## File edited

```text
app/globals.css
```

## Backup created

```text
app/globals.css.phase66-backup
```

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-66-campaigns-offers-landscape.cmd
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

- Campaigns & Offers card feels wider/landscape.
- Win Tickets, Vote For Your Favourite DJ, and Sale Offers use space better.
- Plan the Link-Up card remains unchanged.
- Trending cards remain unchanged.
