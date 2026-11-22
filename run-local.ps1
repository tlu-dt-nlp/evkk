param(
  [string]$Profiles = 'all'
)

$ErrorActionPreference = 'Stop'

$Env:COMPOSE_PROFILES = $Profiles

# Prefer Docker Compose v2 (docker compose plugin), fall back to v1 (standalone docker-compose)
try {
  docker compose version *> $null
  $UseComposeV2 = $LASTEXITCODE -eq 0
} catch {
  $UseComposeV2 = $false
}

function Invoke-Compose {
  if ($UseComposeV2) { docker compose @args } else { docker-compose @args }
}

.\build-images.ps1

Invoke-Compose down --remove-orphans
Invoke-Compose up --build --abort-on-container-exit
