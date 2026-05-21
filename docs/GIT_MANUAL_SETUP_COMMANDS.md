# Git Manual Setup Commands

If a PowerShell script gives you trouble, use these commands manually.

## Go to project

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
```

## Check Git

```powershell
git --version
```

## Initialize Git

```powershell
git init
```

## Create .gitignore manually

Create a file named `.gitignore` in the project root and paste:

```text
node_modules/
.next/
out/
build/
dist/

.env
.env.*
!.env.example

supabase/.temp/
supabase/.branches/
supabase/.env
supabase/.env.*

*.log
.DS_Store
Thumbs.db

*.phase*-backup
*.phase*.backup
*.bak

yardpromoja-phase-*.zip
yardpromoja-phase-*/
```

## First commit

```powershell
git add .
git commit -m "Initial YardPromoJa project checkpoint"
```

## Connect GitHub

Create an empty GitHub repo first.

Then run:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

## Daily save

```powershell
git status
git add .
git commit -m "Update YardPromoJa"
git push
```
