@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo  Merge - Rive Asset Sync
echo ========================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0push-rive.ps1"

if errorlevel 1 (
  echo.
  echo Failed to start push-rive.ps1
  pause
)
