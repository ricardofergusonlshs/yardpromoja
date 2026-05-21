# Phase 27 Test Checklist

## Scroll warning cleanup

Run:

```powershell
.\scripts\fix-scroll-behavior-warning.ps1
```

Then check `app/layout.js`.

Expected `<html>` tag example:

```jsx
<html lang="en" data-scroll-behavior="smooth">
```

or:

```jsx
<html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
```

## Build

Run:

```cmd
npm run build
```

Expected:

- Build passes.
- The scroll-behavior warning should be gone.

## Local smoke test

Start dev server:

```cmd
npm run dev
```

Then run:

```powershell
.\scripts\local-health-smoke.ps1
```

Expected:

- `/` returns 200.
- `/health` returns 200.
- `/api/health` returns 200.
- `/manifest.webmanifest` returns 200.
- `/assets/apple-touch-icon.png` returns 200.
- `/assets/jamaica-parish-map.svg` returns 200.

## Deploy guard

Run:

```powershell
.\scripts\deploy-guard.ps1
```

Check any warnings.

## AuthNav note

If the script says `AuthNav.js` is missing and you did not mean to delete it, run:

```cmd
git restore app/components/AuthNav.js
```

Then build again.
