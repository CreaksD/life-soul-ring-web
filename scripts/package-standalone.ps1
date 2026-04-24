param(
  [string]$OutputDir = ".deploy",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$deployRoot = Join-Path $projectRoot $OutputDir
$bundleRoot = Join-Path $deployRoot "bundle"
$standaloneRoot = Join-Path $bundleRoot "current"
$archivePath = Join-Path $deployRoot "life-soul-ring-web-standalone.tar.gz"

Write-Output "Preparing standalone output..."
Push-Location $projectRoot
try {
  if (-not $SkipBuild) {
    npm run build
  }

  if (Test-Path $deployRoot) {
    Remove-Item -Recurse -Force $deployRoot
  }

  New-Item -ItemType Directory -Force -Path $standaloneRoot | Out-Null

  Copy-Item -Recurse -Force (Join-Path $projectRoot ".next\\standalone\\*") $standaloneRoot

  $staticTarget = Join-Path $standaloneRoot ".next\\static"
  New-Item -ItemType Directory -Force -Path $staticTarget | Out-Null
  Copy-Item -Recurse -Force (Join-Path $projectRoot ".next\\static\\*") $staticTarget

  $publicSource = Join-Path $projectRoot "public"
  if (Test-Path $publicSource) {
    Copy-Item -Recurse -Force $publicSource (Join-Path $standaloneRoot "public")
  }

  $linuxDeployRoot = Join-Path $bundleRoot "deploy\\linux"
  New-Item -ItemType Directory -Force -Path $linuxDeployRoot | Out-Null
  Copy-Item -Recurse -Force (Join-Path $projectRoot "deploy\\linux\\*") $linuxDeployRoot

  tar.exe -czf $archivePath -C $bundleRoot .
  Write-Output "Standalone archive created: $archivePath"
}
finally {
  Pop-Location
}
