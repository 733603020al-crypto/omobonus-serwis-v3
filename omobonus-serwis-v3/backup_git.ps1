$projectPath = "C:\Users\Andrii\omobonus-serwis-v3"

Write-Host "Switching to project directory:" $projectPath
Set-Location $projectPath

Write-Host "Staging changes..."
git add .

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nothing to commit. Working tree is clean."
    exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMessage = "Auto backup: $timestamp"

Write-Host "Creating commit:" $commitMessage
git commit -m $commitMessage

try {
    Write-Host "Pushing to origin/main..."
    git push origin main
} catch {
    Write-Warning "git push failed: $($_.Exception.Message)"
    Write-Warning "You can run 'git push origin main' manually later."
}

