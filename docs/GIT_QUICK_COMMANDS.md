# YardPromoJa Git Quick Commands

Run these from:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
```

## 1. Check Git

```powershell
git --version
```

## 2. Set up local Git

```powershell
git init
git add .
git commit -m "Initial YardPromoJa project checkpoint"
```

## 3. Connect GitHub

Replace the URL with your repo URL:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

## 4. Daily save

```powershell
git status
git add .
git commit -m "Update YardPromoJa"
git push
```

## Important

Do not commit:

```text
.env.local
.env
node_modules
.next
```

The Phase 55 script creates/updates `.gitignore` to protect these.
