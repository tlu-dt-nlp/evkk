#!/bin/bash
set -e

echo "Running EVKK ..."

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
docker-compose -f compose/docker-compose.postgres.yml -f compose/docker-compose.base.yml -f compose/docker-compose.yml down --remove-orphans
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
docker-compose -f compose/docker-compose.postgres.yml -f compose/docker-compose.db.yml -f compose/docker-compose.yml up --abort-on-container-exit --exit-code-from db

echo "Stopping migration containers"
docker-compose -f compose/docker-compose.postgres.yml -f compose/docker-compose.db.yml -f compose/docker-compose.yml down --remove-orphans

echo "Running database migrations done"

echo "Deploying services using Docker Swarm"
docker stack deploy -c compose/docker-compose.postgres.yml -c compose/docker-compose.base.yml -c compose/docker-compose.yml evkk
echo "Services deployed using Docker Swarm"
