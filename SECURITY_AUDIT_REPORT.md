# YardPromo Security Audit Report

## Summary
This audit reviewed the Next.js + Supabase application for authentication, authorization, form validation, upload safety, route reliability, and environment security.

### Key issues found and fixed
- `app/ad/[slug]/page.js` previously rendered static demo content for every slug; now it fetches live `ads` data from Supabase and falls back gracefully when unavailable.
- `app/create/page.js` now validates poster files for allowed image types and a maximum size of 5MB.
- `app/create/page.js` now validates website and ticket URLs before submit.
- `app/login/LoginClient.js` no longer stores user role metadata in Supabase auth sign-up payload; role is still sanitized locally to `member` or `advertiser`.
- `app/ad/AdDetailClient.js` now uses the fetched ad data when rendering and secures external links with `rel="noreferrer noopener"`.
- `app/dashboard/page.js` and `app/saved/page.js` now use `console.warn` instead of `console.error` for expected Supabase fallback flows.

## Files changed
- `app/create/page.js`
- `app/login/LoginClient.js`
- `app/ad/[slug]/page.js`
- `app/ad/AdDetailClient.js`
- `app/dashboard/page.js`
- `app/saved/page.js`
- `SECURITY_AUDIT_REPORT.md`
- `SECURITY_SQL_REVIEW.sql`

## Issues fixed
- Fixed ad detail route reliability and prevented falling back to incorrect sample content for every slug.
- Hardened poster upload handling and file type/size validation in the create form.
- Reduced auth metadata surface area by not sending role in Supabase sign-up metadata.
- Prevented invalid external link window-opener risks on ad detail cards.
- Added safer error/fallback logging for expected network or Supabase failures.

## Remaining risks
- The app relies on client-side role checks for `app/admin/page.js` and other protected routes. This is not sufficient by itself; Supabase RLS must enforce permissions server-side.
- The `profiles` table still needs strong RLS policies to block users from elevating their own role or editing other users' role fields.
- The `ads` table requires row-level policies to ensure users can only create and manage their own ads, while public reads are restricted to approved/active promos.
- Environment variables were not directly inspected, so verify `NEXT_PUBLIC_SUPABASE_URL` is the base URL only and not a REST endpoint path.
- `next lint` could not be executed in this environment because the project appears to have a missing `eslint.config.js` or incompatible lint invocation.

## Supabase RLS recommendations
See `SECURITY_SQL_REVIEW.sql` for SQL policy examples. The central recommendations are:
- Enable RLS on `profiles`, `ads`, and related user tables.
- Allow public `SELECT` only for approved/active ads.
- Allow inserts into `ads` only when `user_id = auth.uid()`.
- Allow updates on `ads` only when `user_id = auth.uid()` or the current user is admin.
- Allow users to select and update their own `profiles` rows but not change `role` unless they are admin.
- Allow reads/writes on `saved_promos`, `rsvps`, `interest_events`, `promoter_follows`, `venue_follows`, and `alerts` only for `user_id = auth.uid()`.

## Manual Supabase steps
1. In Supabase dashboard, enable Row Level Security for `profiles`, `ads`, and the user-specific tables mentioned above.
2. Add policies to permit controlled public read access for active ads.
3. Add policies to permit inserts and updates only for authenticated owners.
4. Confirm the `posters` storage bucket is correctly configured for your desired access model.
5. Verify that `NEXT_PUBLIC_SUPABASE_URL` is a base URL and not `/rest/v1`.

## How to test admin vs normal user
1. Login as the admin account (`ricardofergusonlshs@gmail.com`) and verify `/admin` is accessible.
2. Login as a normal advertiser account (`rkferguson1@gmail.com`) and verify `/admin` redirects away or shows no admin UI.
3. Create a new user, sign in, and verify they cannot access `/admin` and are treated as a normal advertiser/member.
4. Confirm the create promo flow still uploads and submits.
5. Confirm `/ad/[slug]` loads and shows the live ad or a clean not-found message.

## Commands to run next
- To build the project:
  - `$env:Path = "C:\Users\home\nodejs;$env:Path"
  - & "C:\Users\home\nodejs\npm.cmd" run build`
- To run locally:
  - `$env:Path = "C:\Users\home\nodejs;$env:Path"
  - & "C:\Users\home\nodejs\npm.cmd" run dev`
- To run lint if ESLint config is added:
  - `$env:Path = "C:\Users\home\nodejs;$env:Path"
  - & "C:\Users\home\nodejs\npm.cmd" exec -- eslint .`
