# YardPromoJa Phase 56 - Safe Git Setup
# This is a simpler replacement for Phase 55.
# Run from project root:
# .\scripts\phase-56-git-setup-safe.ps1

param(
  [string]$RemoteUrl = ''
)

Write-Host 'YardPromoJa Phase 56 - Safe Git Setup' -ForegroundColor Yellow

if (!(Test-Path 'package.json')) {
  Write-Host 'package.json not found. Run this from the project root.' -ForegroundColor Red
  Write-Host 'Expected: C:\Projects\yardpromo-nextjs-supabase-starter' -ForegroundColor Yellow
  exit 1
}

try {
  git --version | Out-Null
} catch {
  Write-Host 'Git is not available in this terminal.' -ForegroundColor Red
  Write-Host 'Install Git for Windows, then reopen VS Code.' -ForegroundColor Yellow
  exit 1
}

$gitignoreLines = @(
  '# YardPromoJa Git Ignore',
  '',
  'node_modules/',
  '.next/',
  'out/',
  'build/',
  'dist/',
  '',
  '.env',
  '.env.*',
  '!.env.example',
  '',
  'supabase/.temp/',
  'supabase/.branches/',
  'supabase/.env',
  'supabase/.env.*',
  '',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  'pnpm-debug.log*',
  '*.log',
  '',
  '.DS_Store',
  'Thumbs.db',
  '',
  '*.phase*-backup',
  '*.phase*.backup',
  '*.bak',
  '',
  'yardpromoja-phase-*.zip',
  'yardpromoja-phase-*/'
)

if (!(Test-Path '.gitignore')) {
  Set-Content -Path '.gitignore' -Value $gitignoreLines -Encoding UTF8
  Write-Host 'Created .gitignore' -ForegroundColor Green
} else {
  $existing = Get-Content '.gitignore' -Raw
  if (!$existing.Contains('# YardPromoJa Git Ignore')) {
    Add-Content -Path '.gitignore' -Value ''
    Add-Content -Path '.gitignore' -Value $gitignoreLines
    Write-Host 'Updated .gitignore' -ForegroundColor Green
  } else {
    Write-Host '.gitignore already has YardPromoJa rules' -ForegroundColor Yellow
  }
}

if (!(Test-Path '.env.example')) {
  $envLines = @(
    '# Copy this file to .env.local and fill in real values locally.',
    '# Do not commit .env.local.',
    '',
    'NEXT_PUBLIC_SUPABASE_URL=',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=',
    'SUPABASE_SERVICE_ROLE_KEY=',
    'NEXT_PUBLIC_SITE_URL=http://localhost:3000'
  )
  Set-Content -Path '.env.example' -Value $envLines -Encoding UTF8
  Write-Host 'Created .env.example' -ForegroundColor Green
}

if (!(Test-Path '.git')) {
  git init
  Write-Host 'Initialized Git repository' -ForegroundColor Green
} else {
  Write-Host 'Git repository already exists' -ForegroundColor Yellow
}

git status --short

git add .

git commit -m 'Initial YardPromoJa project checkpoint'
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Commit was skipped or there was nothing new to commit.' -ForegroundColor Yellow
}

if ($RemoteUrl.Trim().Length -gt 0) {
  git remote get-url origin *> $null
  if ($LASTEXITCODE -eq 0) {
    git remote set-url origin $RemoteUrl
    Write-Host 'Updated origin remote' -ForegroundColor Green
  } else {
    git remote add origin $RemoteUrl
    Write-Host 'Added origin remote' -ForegroundColor Green
  }

  git branch -M main

  Write-Host 'Ready to push. Run this command next:' -ForegroundColor Yellow
  Write-Host 'git push -u origin main'
} else {
  Write-Host 'Local Git setup complete.' -ForegroundColor Green
  Write-Host 'To connect GitHub later, run these commands:' -ForegroundColor Yellow
  Write-Host 'git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git'
  Write-Host 'git branch -M main'
  Write-Host 'git push -u origin main'
}
