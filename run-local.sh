#!/bin/bash
set -e

echo "Building base images..."
./build-images.sh

echo "Verifying base images..."
for img in evkk-anaconda-2021-05 evkk-estnltk141; do
  if ! docker image inspect "$img" >/dev/null 2>&1; then
    echo "ERROR: $img not found. Build failed."
    exit 1
  fi
done

echo "Starting docker-compose..."
COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 COMPOSE_PROFILES=all docker-compose down --remove-orphans && \
COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 COMPOSE_PROFILES="${COMPOSE_PROFILES:=all}" docker-compose up --build --abort-on-container-exit
