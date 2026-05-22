# Phase 67 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Trending Now shows 6 cards.
- Cards display as 3 columns x 2 rows on wide screens.
- Images are landscape.
- Text is lower-center.

## If only 4 show

Check whether there are at least 6 active/featured promos in your data.

Then search:

```text
.slice(0, 4)
```

Change the Trending one to:

```text
.slice(0, 6)
```

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
