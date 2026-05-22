# Phase 60 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Category icons are no longer emojis.
- Icons look like clean line SVGs.
- Cards feel more modern and premium.
- Category links still work.

## Click test

Click:

```text
Events & Parties
Food & Drinks
Sale Offers
Weekend
Parish Pulse
```

Expected:

- Links route to browse/campaign/weekend/map pages.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
