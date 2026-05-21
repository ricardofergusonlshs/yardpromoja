# YardPromoJa Phase 55 — Git Setup

This phase helps you put the project into Git safely.

## What it does

The script:

- creates/updates `.gitignore`
- blocks `.env`, `.env.local`, `node_modules`, `.next`, logs, and phase ZIPs
- creates `.env.example`
- runs `git init`
- runs `git add .`
- creates the first commit
- optionally adds a GitHub remote

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Then open VS Code terminal at:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
```

Run:

```powershell
.\scripts\phase-55-git-setup.ps1
```

If PowerShell asks:

```text
[D] Do not run [R] Run once [S] Suspend [?] Help
```

type:

```text
R
```

## Connect to GitHub

Create a new empty GitHub repo first, then run:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

Or run the Phase 55 script with the remote URL:

```powershell
.\scripts\phase-55-git-setup.ps1 -RemoteUrl "https://github.com/YOUR-USERNAME/YOUR-REPO.git"
git push -u origin main
```

## Daily workflow

After changes:

```powershell
git status
git add .
git commit -m "Update YardPromoJa"
git push
```

## Important

Never commit real secrets.

Protected by `.gitignore`:

```text
.env
.env.local
.env.*
node_modules
.next
```
