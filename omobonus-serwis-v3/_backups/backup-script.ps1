# Automatic backup script for Omobonus Serwis v3
# Usage: .\backup-script.ps1

$projectPath = "C:\Users\Andrii\omobonus-serwis-v3"
$backupPath = "C:\Users\Andrii\omobonus-serwis-v3\_backups\auto-backups"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = Join-Path $backupPath "backup_$timestamp"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
}

# Create folder for current backup
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

Write-Host "Creating backup..." -ForegroundColor Green
Write-Host "Source: $projectPath" -ForegroundColor Yellow
Write-Host "Destination: $backupFolder" -ForegroundColor Yellow

# Files and folders to backup
$itemsToBackup = @(
    "src",
    "public",
    "tailwind.config.ts",
    "postcss.config.js",
    "next.config.ts",
    "package.json",
    "tsconfig.json",
    "README.md"
)

$copiedCount = 0
$skippedCount = 0

foreach ($item in $itemsToBackup) {
    $sourcePath = Join-Path $projectPath $item
    $destPath = Join-Path $backupFolder $item
    
    if (Test-Path $sourcePath) {
        try {
            Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
            Write-Host "  [OK] Copied: $item" -ForegroundColor Green
            $copiedCount++
        }
        catch {
            Write-Host "  [ERROR] Failed to copy: $item - $($_.Exception.Message)" -ForegroundColor Red
            $skippedCount++
        }
    }
    else {
        Write-Host "  [SKIP] Not found: $item" -ForegroundColor Gray
        $skippedCount++
    }
}

# Create backup info file
$backupInfo = @"
Backup created: $timestamp
Source: $projectPath
Items copied: $copiedCount
Items skipped: $skippedCount

Critical files:
- tailwind.config.ts
- postcss.config.js
- src/app/uslugi/[slug]/page.tsx
- src/lib/services-data.ts
- src/components/sections/services.tsx
- src/components/sections/hero.tsx
"@

$backupInfo | Out-File -FilePath (Join-Path $backupFolder "BACKUP_INFO.txt") -Encoding UTF8

Write-Host ""
Write-Host "Backup completed!" -ForegroundColor Green
Write-Host "Location: $backupFolder" -ForegroundColor Cyan
Write-Host "Items copied: $copiedCount" -ForegroundColor Cyan

# Remove old backups (keep only last 10)
$allBackups = Get-ChildItem -Path $backupPath -Directory | Where-Object { $_.Name -like "backup_*" } | Sort-Object CreationTime -Descending

if ($allBackups.Count -gt 10) {
    $oldBackups = $allBackups | Select-Object -Skip 10
    Write-Host ""
    Write-Host "Removing old backups (keeping last 10)..." -ForegroundColor Yellow
    foreach ($oldBackup in $oldBackups) {
        Remove-Item -Path $oldBackup.FullName -Recurse -Force
        Write-Host "  Removed: $($oldBackup.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Done! Backup successfully created." -ForegroundColor Green
