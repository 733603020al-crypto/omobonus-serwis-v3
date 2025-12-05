# Скрипт установки Git hooks для автоматического запуска npm run dev
# Запустите этот скрипт после клонирования репозитория

Write-Host "🔧 Установка Git hooks..." -ForegroundColor Yellow

$hooksDir = ".git\hooks"
$scriptsDir = "scripts\hooks"

if (-not (Test-Path $hooksDir)) {
    Write-Host "❌ Папка .git\hooks не найдена. Убедитесь, что вы в корне Git репозитория." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $scriptsDir)) {
    Write-Host "❌ Папка scripts\hooks не найдена." -ForegroundColor Red
    exit 1
}

# Копируем hooks
Copy-Item "$scriptsDir\post-commit" "$hooksDir\post-commit" -Force
Copy-Item "$scriptsDir\post-merge" "$hooksDir\post-merge" -Force

Write-Host "✅ Git hooks установлены:" -ForegroundColor Green
Write-Host "   - post-commit (запуск после коммита)" -ForegroundColor Green
Write-Host "   - post-merge (запуск после pull)" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Hooks будут автоматически запускать npm run dev после коммита или pull" -ForegroundColor Cyan
Write-Host ""

