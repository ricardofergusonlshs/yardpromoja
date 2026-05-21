# YardPromoJa Phase 56 - Safe Git Setup

Phase 55 failed because PowerShell hit a string parsing issue.

This is a safer replacement script with simpler syntax.

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-56-git-setup-safe.ps1
```

If PowerShell asks:

```text
[D] Do not run [R] Run once [S] Suspend [?] Help
```

type:

```text
R
```

## Connect GitHub immediately

After creating an empty GitHub repo, run:

```powershell
.\scripts\phase-56-git-setup-safe.ps1 -RemoteUrl "https://github.com/YOUR-USERNAME/YOUR-REPO.git"
git push -u origin main
```

## If the script still fails

Use the manual commands in:

```text
docs/GIT_MANUAL_SETUP_COMMANDS.md
```
