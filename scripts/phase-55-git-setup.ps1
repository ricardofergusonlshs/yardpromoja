# YardPromoJa Phase 55
# Git setup for local project.
#
# Run from project root:
# .\scripts\phase-55-git-setup.ps1

param(
  [string]$RemoteUrl = ""
)

Write-Host "YardPromoJa Phase 55 — Git setup" -ForegroundColor Yellow

if (!(Test-Path "package.json")) {
  Write-Host "package.json not found. Run this from the project root." -ForegroundColor Red
  Write-Host "Expected root: C:\Projects\yardpromo-nextjs-supabase-starter" -ForegroundColor Yellow
  exit 1
}

try {
  git --version | Out-Null
} catch {
  Write-Host "Git is not available in this terminal." -ForegroundColor Red
  Write-Host "Install Git for Windows, then reopen VS Code." -ForegroundColor Yellow
  exit 1
}

# Create/append .gitignore safely
$GitignorePath = ".gitignore"
$Marker = "# YardPromoJa / Next.js / Supabase"

$GitignoreBlock = @'
# YardPromoJa / Next.js / Supabase

# dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/

# production
dist/

# local env files - never commit secrets
.env
.env.*
!.env.example

# Supabase local files that may contain secrets
supabase/.temp/
supabase/.branches/
supabase/.env
supabase/.env.*

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.log

# OS/editor
.DS_Store
Thumbs.db
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# local backups created by phases
*.phase*-backup
*.phase*.backup
*.bak

# zip downloads / extracted phase folders
yardpromoja-phase-*.zip
yardpromoja-phase-*/
'@

if (Test-Path $GitignorePath) {
  $existing = Get-Content $GitignorePath -Raw
  if (!$existing.Contains($Marker)) {
    Add-Content -Path $GitignorePath -Value "`r`n$GitignoreBlock" -Encoding UTF8
    Write-Host "Updated .gitignore" -ForegroundColor Green
  } else {
    Write-Host ".gitignore already has YardPromoJa rules" -ForegroundColor Yellow
  }
} else {
  Set-Content -Path $GitignorePath -Value $GitignoreBlock -Encoding UTF8
  Write-Host "Created .gitignore" -ForegroundColor Green
}

# Create safe env example if missing
if (!(Test-Path ".env.example")) {
  @'
# Copy this file to .env.local and fill in real values locally.
# Do not commit .env.local.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
'@ | Set-Content -Path ".env.example" -Encoding UTF8
  Write-Host "Created .env.example" -ForegroundColor Green
}

if (!(Test-Path ".git")) {
  git init
  Write-Host "Initialized git repository" -ForegroundColor Green
} else {
  Write-Host "Git repository already exists" -ForegroundColor Yellow
}

git status --short

git add .
git commit -m "Initial YardPromoJa project checkpoint"

if ($LASTEXITCODE -ne 0) {
  Write-Host "Commit may already exist or there may be nothing new to commit." -ForegroundColor Yellow
}

if ($RemoteUrl.Trim()) {
  $existingRemote = git remote get-url origin 2>$null

  if ($existingRemote) {
    git remote set-url origin $RemoteUrl
    Write-Host "Updated origin remote" -ForegroundColor Green
  } else {
    git remote add origin $RemoteUrl
    Write-Host "Added origin remote" -ForegroundColor Green
  }

  git branch -M main
  Write-Host "Ready to push. Run:" -ForegroundColor Yellow
  Write-Host "git push -u origin main"
} else {
  Write-Host ""
  Write-Host "Local git setup complete." -ForegroundColor Green
  Write-Host "To connect GitHub later:" -ForegroundColor Yellow
  Write-Host 'git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git'
  Write-Host 'git branch -M main'
  Write-Host 'git push -u origin main'
}
