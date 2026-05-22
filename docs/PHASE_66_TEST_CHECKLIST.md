# Phase 66 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Campaigns & Offers uses more horizontal space.
- Three offer blocks become more landscape.
- The card no longer feels like a narrow tall stack where space is available.
- Other homepage content remains visible.

## Mobile

Resize browser smaller.

Expected:

- Offers stack vertically again on smaller screens.
- No content overlaps.

## Rollback

Restore:

```text
app/globals.css.phase66-backup
```
