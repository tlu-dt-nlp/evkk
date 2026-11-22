#!/bin/bash
set -e

echo "Running EVKK ..."

# Prefer Docker Compose v2 (docker compose plugin), fall back to v1 (standalone docker-compose)
if docker compose version >/dev/null 2>&1; then
  compose() { docker compose "$@"; }
else
  compose() { docker-compose "$@"; }
fi

echo "Initializing Docker Swarm if needed"
if ! docker info | grep -q 'Swarm: active'; then
  docker swarm init
  echo "Docker Swarm initialized"
else
  echo "Docker Swarm already initialized"
fi

echo "Loading images"
for file in ./images/*.tar; do docker load -i ${file}; done
echo "Loading images done"

echo "Stopping services"
compose -f compose/docker-compose.postgres.yml -f compose/docker-compose.base.yml -f compose/docker-compose.yml down --remove-orphans
docker stack rm evkk

echo "Waiting for stack services to be removed"
for _ in $(seq 1 60); do
  if ! docker stack ls --format '{{.Name}}' | grep -qx 'evkk'; then
    break
  fi
  sleep 2
done

echo "Waiting for postgres containers to stop"
for _ in $(seq 1 60); do
  if ! docker ps --format '{{.Names}}' | grep -Eq '^evkk_postgres\.|^evkk-postgres$'; then
    break
  fi
  sleep 2
done

echo "Stopping services done"

echo "Running database migrations"
compose -f compose/docker-compose.postgres.yml -f compose/docker-compose.db.yml -f compose/docker-compose.yml up --abort-on-container-exit --exit-code-from db

echo "Stopping migration containers"
compose -f compose/docker-compose.postgres.yml -f compose/docker-compose.db.yml -f compose/docker-compose.yml down --remove-orphans

echo "Running database migrations done"

echo "Deploying services using Docker Swarm"
docker stack deploy -c compose/docker-compose.postgres.yml -c compose/docker-compose.base.yml -c compose/docker-compose.yml evkk
echo "Services deployed using Docker Swarm"
