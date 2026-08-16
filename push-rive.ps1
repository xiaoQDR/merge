$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot
$scriptFailed = $false

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($Arguments -join ' ')"
    }
}

try {
    Write-Host ''
    Write-Host '========================================' -ForegroundColor Cyan
    Write-Host ' Merge - Rive Asset Sync' -ForegroundColor Cyan
    Write-Host '========================================' -ForegroundColor Cyan
    Write-Host ''

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw 'Git was not found. Install Git and make sure git.exe is in PATH.'
    }

    if (-not (Test-Path '.git')) {
        throw 'This script must stay in the root of the merge Git repository.'
    }

    if (-not (Test-Path 'public/rive')) {
        New-Item -ItemType Directory -Path 'public/rive' -Force | Out-Null
        Write-Host 'Created public/rive/' -ForegroundColor Yellow
    }

    $branch = (& git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($branch)) {
        throw 'Unable to detect the current Git branch.'
    }

    $remoteUrl = (& git remote get-url origin).Trim()
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($remoteUrl)) {
        throw 'Git remote "origin" is not configured.'
    }

    Write-Host "Branch : $branch"
    Write-Host "Remote : $remoteUrl"
    Write-Host ''

    $riveChanges = @(& git status --porcelain -- 'public/rive')
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to read Rive asset status.'
    }

    if ($riveChanges.Count -eq 0) {
        Write-Host 'No Rive changes found. Nothing to push.' -ForegroundColor Green
        Write-Host ''
        Read-Host 'Press Enter to close'
        exit 0
    }

    Write-Host 'Rive changes:' -ForegroundColor Yellow
    & git status --short -- 'public/rive'
    Write-Host ''

    Invoke-Git @('add', '--all', '--', 'public/rive')

    & git diff --cached --quiet -- 'public/rive'
    if ($LASTEXITCODE -eq 0) {
        Write-Host 'No staged Rive changes found. Nothing to push.' -ForegroundColor Green
        Write-Host ''
        Read-Host 'Press Enter to close'
        exit 0
    }
    elseif ($LASTEXITCODE -ne 1) {
        throw 'Unable to check staged Rive changes.'
    }

    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $message = "chore(rive): sync assets $stamp"

    Invoke-Git @('commit', '-m', $message, '--', 'public/rive')

    & git ls-remote --exit-code --heads origin $branch *> $null
    $remoteBranchExists = ($LASTEXITCODE -eq 0)

    if ($remoteBranchExists) {
        Write-Host ''
        Write-Host 'Syncing latest remote changes...' -ForegroundColor Cyan
        Invoke-Git @('pull', '--rebase', '--autostash', 'origin', $branch)
    }

    Write-Host ''
    Write-Host 'Pushing Rive assets...' -ForegroundColor Cyan
    Invoke-Git @('push', '-u', 'origin', $branch)

    Write-Host ''
    Write-Host 'Rive assets synced successfully.' -ForegroundColor Green
    Write-Host "Commit: $message" -ForegroundColor Green
}
catch {
    $scriptFailed = $true
    Write-Host ''
    Write-Host 'Rive sync failed:' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ''
}

Read-Host 'Press Enter to close'

if ($scriptFailed) {
    exit 1
}

exit 0
