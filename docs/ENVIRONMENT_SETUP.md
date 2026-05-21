# YardPromoJa environment setup

Use these values in Vercel Environment Variables.

## Required public site URL

```text
NEXT_PUBLIC_SITE_URL=https://yardpromoja.com
```

This helps:

- share links use the public domain
- social thumbnails use production URLs
- sitemap/robots use the correct domain
- campaign/share links avoid localhost

## Supabase

Keep your current Supabase values. Do not rotate keys unless needed.

Expected names used by the project:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

or:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The app supports `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` first, then falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## After changing env vars

Redeploy on Vercel.

Then test:

```text
https://yardpromoja.com/health
https://yardpromoja.com/browse
https://yardpromoja.com/link-up
https://yardpromoja.com/opengraph-image
```
