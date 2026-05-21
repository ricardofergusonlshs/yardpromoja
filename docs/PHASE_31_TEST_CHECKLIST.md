# Phase 31 Test Checklist

## Assets

Test these URLs:

```text
/assets/parishes/st-elizabeth.png
/assets/parishes/st-mary.png
/assets/parishes/westmoreland.png
/assets/parishes/st-james.png
/assets/parishes/hanover.png
/assets/reels/hiking-jamaica.png
/assets/reels/yardie-brunch.png
/assets/reels/blue-lagoon.png
/assets/jamaica-parish-map.svg
/assets/apple-touch-icon.png
```

Expected:

- All return 200.
- Terminal no longer shows 404 for parish/reels images.

## Pages

Test:

```text
/
 /reels
 /browse
 /link-up
```

Expected:

- By Parish images show.
- Reels images show.
- Jamaica map shows.

## Build

Run:

```cmd
npm run build
```
