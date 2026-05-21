# Phase 52 Test Checklist

## Homepage copy

Open:

```text
http://localhost:3000
```

Expected:

- Main headline reads similar to: `What’s happening in Jamaica?`
- `Jamaica?` should appear in yellow script-style text.
- Subtitle should feel more like the reference.

## Search

Expected:

- Search is one modern rounded glass bar.
- Search input is on the left.
- Category selector appears in the middle.
- Location selector appears in the middle/right.
- Yellow circular search button appears on the right.
- Popular search chips appear below.

## Functionality

Test:

- Type `beach` and click search.
- Click a popular chip.
- Change category and search.
- Change location and search.

Expected:

- You should route to `/browse` with query params.

## Build

Run:

```cmd
npm run build
```
