# Phase 14 + 15 Final Release Checklist

## SEO/PWA routes

Test:

```text
/robots.txt
/sitemap.xml
/manifest.webmanifest
/opengraph-image
/twitter-image
```

Expected:

- robots.txt loads
- sitemap.xml loads
- manifest.webmanifest loads
- Open Graph image renders
- Twitter image renders

## Core pages

Test:

```text
/
 /browse
 /browse?category=Food
 /browse?category=Sale
 /link-up
 /campaigns
 /login
 /login?mode=signup
 /contact
 /saved
 /claim?promo=test
 /report?promo=test
```

## Ad detail protection

Test a real ad URL:

```text
/ad/YOUR_PROMO_SLUG
```

Check:

- poster loads
- Interested works
- RSVP works
- More Actions is closed by default
- Open Share Pack works
- WhatsApp/Facebook/X/TikTok buttons still work
- Download flyer still works
- Claim and Report buttons still work
- social share thumbnails are not broken

## Campaign protection

Test:

```text
/campaigns
/campaigns/share-to-win-weekend-tickets
/campaigns/vote-for-next-dj
```

Check:

- Campaign page loads
- Share/copy buttons work
- Vote form works
- RSVP/share-to-win forms still work

## Mobile

Check mobile width:

- homepage
- browse
- link-up
- ad detail
- campaigns
- login
- create
- dashboard/admin if logged in

## Build

Run:

```cmd
npm run build
```

## Deploy

After successful build:

1. Commit files.
2. Push to GitHub.
3. Let Vercel deploy.
4. Confirm environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://yardpromoja.com
```

5. Test deployed pages and share previews.
