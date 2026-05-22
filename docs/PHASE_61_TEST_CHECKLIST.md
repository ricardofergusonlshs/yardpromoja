# Phase 61 Test Checklist

## Run

```powershell
.\scripts\phase-61-restore-homepage-layout.cmd
```

## Restart

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Main homepage sections return.
- Trending Now section returns.
- Link-up planning card returns.
- Campaigns/offers card returns.
- Footer/reels/parish sections return if they existed before.
- Category strip may return to the old look. That is okay for this restore phase.

## Browse

Open:

```text
http://localhost:3000/browse
```

Expected:

- Browse still works.
