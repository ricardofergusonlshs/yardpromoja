# Phase 32 Test Checklist

## SEO route files

Test:

```text
/robots.txt
/sitemap.xml
```

Expected:

- Both return 200.
- Sitemap includes `/reels`, `/advertise/packages`, and `/media-kit`.
- Robots points to the sitemap.

## Public routes

Test:

```text
/
 /browse
 /link-up
 /campaigns
 /reels
 /advertise/packages
 /media-kit
```

Expected:

- No 404.
- Pages load normally.

## Private routes

Robots should not invite crawlers into:

```text
/admin
/account
/dashboard
/saved
/uploader
/api/
```

## Build

Run:

```cmd
npm run build
```

Expected:

- Build passes.
