# YardPromo Jamaica — Next.js + Supabase Starter

This starter connects YardPromo to Supabase so users can:

- Sign up and log in
- Upload poster/flyer images to the `posters` storage bucket
- Create ads in the `ads` table
- Browse active ads
- View public ad pages at `/ad/[slug]`
- Copy share links
- View their own dashboard
- Approve/reject/feature ads from a simple admin page

## 1. Before running

You already created the Supabase tables and the `posters` bucket.

Now get your Supabase keys:

1. Open Supabase Dashboard
2. Go to **Project Settings**
3. Click **API**
4. Copy:
   - Project URL
   - anon public / publishable key

## 2. Install

```bash
npm install
```

## 3. Add environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

On Windows, you can manually create `.env.local`.

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## 4. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 5. Make yourself admin

After signing up through the app, go to Supabase SQL Editor and run:

```sql
update public.profiles
set role = 'admin'
where email = 'yardpromoja@gmail.com';
```

## 6. Important

New ads are saved as `pending_review`. They will not show publicly until an admin approves them.

For testing, approve from `/admin`, or run this SQL:

```sql
update public.ads
set status = 'active'
where title = 'YOUR AD TITLE';
```
