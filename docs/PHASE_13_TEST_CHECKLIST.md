# Phase 13 Test Checklist

## System pages

- Visit `/this-page-should-not-exist`.
- Confirm the custom YardPromoJa 404 page appears.
- Confirm Browse Promos button works.
- Confirm Plan the Link-Up button works.
- Confirm Go Home button works.

## Loading page

- The loading page may appear briefly during route transitions.
- It should show YardPromoJa loading text and animated dots.

## Error fallback

- `app/error.js` is now available for route-level rendering errors.
- It includes Try Again, Browse Promos, and Go Home actions.

## Core routes

Test:

```text
/
 /browse
 /browse?category=Food
 /link-up
 /campaigns
 /login
 /contact
 /saved
 /claim?promo=test
 /report?promo=test
```

## Optional smoke test

While `npm run dev` is running, in PowerShell:

```powershell
.\scripts\smoke-test-local.ps1
```

## Build

Run:

```cmd
npm run build
```

If build fails, fix only the file named in the red error.
