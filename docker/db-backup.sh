#!/bin/bash
set -euo pipefail

# Swarm names the container evkk_postgres.<slot>.<task id>
container=$(docker ps --format '{{.ID}} {{.Names}}' | awk '$2 ~ /^evkk_postgres\./ { print $1; exit }')

if [[ -z "$container" ]]; then
  echo "Postgres container is not running" 1>&2
  exit 1
fi

docker exec "$container" pg_dump evkk -U db_user
