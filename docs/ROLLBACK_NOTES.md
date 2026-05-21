# YardPromoJa rollback notes

If a phase causes a problem:

1. Stop the dev server with Ctrl + C.
2. Use VS Code Source Control to see changed files.
3. Revert only the files from that phase.
4. Restart:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

5. Test the route that failed.

## Safe rollback order

If the latest phase causes issues, rollback the latest phase first:

- Phase 16: remove `vercel.json`, `app/health`, `app/api/health`, and scripts added by Phase 16.
- Phase 14/15: remove SEO/PWA generated files only if they caused build issues.
- Phase 13: remove `app/not-found.js`, `app/loading.js`, `app/error.js` if needed.
- CSS-only phases: restore previous `app/yp-dark.css`.

## What not to change during rollback

Do not change:

- Supabase keys
- database schema
- auth logic
- admin role logic
- `app/ad/[slug]/page.js` Open Graph metadata wrapper
