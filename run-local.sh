#!/bin/bash
set -e

# Prefer Docker Compose v2 (docker compose plugin), fall back to v1 (standalone docker-compose)
if docker compose version >/dev/null 2>&1; then
  compose() { docker compose "$@"; }
else
  compose() { docker-compose "$@"; }
fi

./build-images.sh
COMPOSE_PROFILES=all compose down --remove-orphans && COMPOSE_PROFILES="${COMPOSE_PROFILES:=all}" compose up --build --abort-on-container-exit
