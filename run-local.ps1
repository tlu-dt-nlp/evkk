param(
  [string]$Profiles = 'all'
)

$ErrorActionPreference = 'Stop'

$Env:COMPOSE_PROFILES = $Profiles

.\build-images.ps1

docker-compose down --remove-orphans
docker-compose up --build --abort-on-container-exit
