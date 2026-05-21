# YardPromoJa Phase 17 + 18 Final Launch Checklist

## Phase 17 — Accessibility and performance polish

Check:

- Keyboard focus is visible on links, buttons, inputs, and nav.
- Phone tap targets are large enough.
- Inputs do not zoom weirdly on iPhone because mobile font size is at least 16px.
- No horizontal overflow on homepage, browse, link-up, campaigns, and ad detail.
- Tables scroll horizontally on dashboard/admin.
- Reduced motion users are respected.
- Print output is cleaner.

## Phase 18 — Launch packaging

Run:

```cmd
npm run build
```

Then:

```cmd
git status
git add .
git commit -m "Finalize YardPromoJa launch polish"
git push
```

After Vercel deploys, test:

```text
https://yardpromoja.com
https://yardpromoja.com/browse
https://yardpromoja.com/link-up
https://yardpromoja.com/campaigns
https://yardpromoja.com/robots.txt
https://yardpromoja.com/sitemap.xml
https://yardpromoja.com/manifest.webmanifest
https://yardpromoja.com/health
```

## Social thumbnail test

Test a real deployed ad page, not localhost:

```text
https://yardpromoja.com/ad/YOUR_PROMO_SLUG
```

Share it to WhatsApp or Facebook and confirm the thumbnail appears.

## Vercel environment variables

Confirm:

```text
NEXT_PUBLIC_SITE_URL=https://yardpromoja.com
```

Keep Supabase values unchanged unless already wrong.

## Do not change before launch

Do not change:

- Supabase keys
- database schema
- admin role logic
- auth redirect logic
- ad detail metadata wrapper
- Open Graph thumbnail logic
