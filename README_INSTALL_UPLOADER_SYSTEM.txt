YardPromoJa Content Uploader Login System

Goal:
Create restricted logins for people you employ to populate the website with curated listings.

Uploaders can:
- log in
- open /uploader
- submit curated listings
- view their own submissions
- read guidelines
- edit only allowed workflow records through RLS

Uploaders cannot:
- approve listings
- publish directly
- access admin dashboard
- edit other users' listings
- see private user data
- mark listings verified

============================================================
STEP 1 — Run SQL migration
============================================================

Run this in Supabase SQL Editor:

sql/uploader_role_migration.sql.txt

This adds:
- content_uploader role support
- ads review workflow columns
- content_upload_sources
- content_uploader_payouts
- RLS policies

============================================================
STEP 2 — Add role checker component
============================================================

Create:

app/components/RequireRole.js

Use:

app/components/RequireRole.js

If your project uses root-level components instead, create:

components/RequireRole.js

and adjust imports in pages from:
@/app/components/RequireRole

to:
@/components/RequireRole

============================================================
STEP 3 — Create uploader pages
============================================================

Create these folders/files:

app/uploader/page.js
app/uploader/new-listing/page.js
app/uploader/my-submissions/page.js
app/uploader/guidelines/page.js

Use the matching .txt files in this package.

============================================================
STEP 4 — Add Uploader link to header
============================================================

Update:

app/components/AuthNav.js

Use:

components/AuthNav_uploader_update_snippet.txt

Only show Uploader link to:
content_uploader
admin
super_admin

============================================================
STEP 5 — Create uploader accounts
============================================================

Option A:
Ask each uploader to sign up using your normal /login page.

Option B:
Create users manually in Supabase Auth.

After the account exists, run:

sql/promote_user_to_content_uploader.sql.txt

Replace:
uploader@example.com

with the uploader's email.

============================================================
STEP 6 — Test
============================================================

Test as logged-out:
- /uploader should redirect to login.

Test as normal customer:
- /uploader should show access restricted.

Test as content_uploader:
- /uploader loads dashboard.
- /uploader/new-listing submits pending review.
- /uploader/my-submissions shows only that uploader's submissions.

Test as admin:
- admin should be able to manage/review submissions.

============================================================
STEP 7 — Commit and push
============================================================

git add .
git commit -m "Add content uploader login system"
git push origin main

============================================================
Important notes
============================================================

1. The migration assumes ads.id is UUID. If your ads.id is text, tell ChatGPT before running.
2. The uploader form inserts many common fields. If your ads table has required fields not included here, add them to the form payload.
3. Keep admin approval separate. Uploaders should submit, admins publish.
4. Use placeholder images unless the owner gives permission.
