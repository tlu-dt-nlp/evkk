#!/bin/bash
set -euo pipefail

# Under Docker Swarm the container is named evkk_postgres.<slot>.<task id>, under plain compose it is evkk-postgres
container=$(docker ps --format '{{.ID}} {{.Names}}' | awk '$2 ~ /^evkk_postgres\.|^evkk-postgres$/ { print $1; exit }')

if [[ -z "$container" ]]; then
  echo "Postgres container is not running" 1>&2
  exit 1
fi

docker exec "$container" pg_dump evkk -U db_user
