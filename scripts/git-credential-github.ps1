param(
  [string]$Action
)

$inputLines = @()
while (($line = [Console]::In.ReadLine()) -ne $null) {
  if ($line -eq "") {
    break
  }
  $inputLines += $line
}

if ($Action -ne "get") {
  exit 0
}

$token = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "User")
if ([string]::IsNullOrWhiteSpace($token)) {
  exit 0
}

Write-Output "username=x-access-token"
Write-Output "password=$token"
