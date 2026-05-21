# YardPromoJa Dark Discovery Homepage Update

This ZIP contains a safe homepage visual update inspired by the dark Jamaica discovery reference.

It preserves the current app routes/functions by only replacing:

- `app/page.js`

and appending CSS to:

- `app/globals.css`

## Files included

- `files/page.js` — replacement homepage file
- `files/dark-homepage.css` — CSS block to append to `app/globals.css`
- `scripts/apply-dark-homepage-update.ps1` — Windows PowerShell helper

## How to apply

Extract this ZIP inside your project root:

`C:\Projects\yardpromo-nextjs-supabase-starter`

Then run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\apply-dark-homepage-update.ps1
```

Then test:

```powershell
& "C:\Users\home\nodejs\npm.cmd" run build
& "C:\Users\home\nodejs\npm.cmd" run dev
```

## What this changes

- Homepage hero becomes dark/premium Jamaica discovery style
- Adds working search form linking to `/browse`
- Adds category quick links
- Keeps AdsGrid and Supabase loading
- Keeps View Details links through current AdsGrid behavior
- Adds parish links
- Adds campaigns/sale offers feature area
- Adds CTA banner

## What this does not change

- Supabase keys
- Auth logic
- Admin logic
- Database schema
- `/ad/[slug]/page.js`
- `/ad/[slug]/AdDetailClient.js`
- Open Graph metadata wrapper
- Login/signup/dashboard/admin/create/claim/report/saved/contact routes
