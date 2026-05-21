# Phase 10 Test Checklist

## Dashboard

- /dashboard loads.
- Dashboard cards still show.
- Existing buttons still work.
- Tables scroll horizontally on phone.
- No role/auth behavior changed.

## Admin

- /admin loads for admin users.
- Admin tables still show.
- Admin buttons/actions still appear.
- Status chips are readable.
- Tables scroll horizontally on phone.
- No admin role behavior changed.

## Create Promo

- /create loads.
- Inputs still full width on phone.
- Upload/poster preview still works.
- Submit flow is not changed.

## Existing pages

- / still loads.
- /browse still loads.
- /browse?category=Food still loads.
- /link-up still loads.
- /ad/[slug] still loads.
- Share Pack still works.
- Open Graph thumbnail code was not touched.

## Build

Run:

```cmd
npm run build
```

If build fails, do not make broad changes. Fix only the file named in the red error.
