# Phase 12 Test Checklist

## Auth

- /login loads.
- /login?mode=signup loads.
- Inputs fit on phone.
- Buttons work.
- next redirect support is not changed.

## Contact

- /contact loads.
- Form fields still work.
- Contact sections are readable on mobile.

## Saved

- /saved loads.
- Saved promos or empty state still show.

## Claim/Report

- /claim?promo=test loads.
- /report?promo=test loads.
- Forms still work.
- Login requirements are not changed.

## Support pages

- /advertise loads.
- /pricing loads.
- /terms loads.
- /privacy loads.

## Existing core pages

- / still loads.
- /browse still loads.
- /link-up still loads.
- /campaigns still loads.
- /ad/[slug] still loads.
- Share Pack still works.
- Open Graph thumbnail code was not touched.

## Build

Run:

```cmd
npm run build
```

If build fails, fix only the file named in the red error.
