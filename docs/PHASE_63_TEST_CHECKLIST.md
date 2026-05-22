# Phase 63 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Category strip is in same place.
- Category cards keep same dimensions.
- Homepage sections still show.
- Old emoji/AI icons are no longer visible.
- Real SVG image icons show instead.

## Click test

Click category cards:

```text
Events & Parties
Food & Drinks
Sale Offers
Campaigns
Weekend
Parish Pulse
```

Expected:

- Links still work.

## Browse

Open:

```text
http://localhost:3000/browse
```

Expected:

- Browse page still works.
- No homepage layout is removed.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
