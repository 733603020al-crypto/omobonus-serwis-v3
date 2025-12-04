Set-Location "C:\Users\Andrii\omobonus-serwis-v3"
$fileName = "GIT_INTEGRITY_REPORT.md"
if (Test-Path $fileName) {
    git add $fileName
    Write-Host "File $fileName added to Git"
} else {
    Write-Host "File $fileName not found"
}

