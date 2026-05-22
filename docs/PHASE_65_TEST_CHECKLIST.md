# Phase 65 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Trending Now cards have landscape images.
- Titles are centered near the bottom.
- Location/category text is also lower-center.
- Cards still link to promo detail pages.
- Plan the Link-Up panel still looks normal.

## Browse

Open:

```text
http://localhost:3000/browse
```

Expected:

- Browse still works.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
