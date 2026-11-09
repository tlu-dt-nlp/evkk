#!/bin/bash
set -euo pipefail

# Runs backend tests in CI against throwaway Redis, Postgres and Stanza containers.
# Containers share a per-build network and use the same hostnames as demo/prod
# (redis, postgres, stanza-server), so the "demo" service profile resolves them.

ID="evkk-test-$(printf '%s' "${BUILD_TAG:-local}" | tr -c 'a-zA-Z0-9_.-' '-')"

cleanup() {
  docker rm -f "$ID-redis" "$ID-postgres" "$ID-stanza" >/dev/null 2>&1 || true
  docker network rm "$ID" >/dev/null 2>&1 || true
}
trap cleanup EXIT
cleanup

# Workspace is reused between builds: don't let the junit step pick up results from a previous build
rm -rf ./*/build/test-results

echo "Starting test dependencies ..."

docker network create "$ID" >/dev/null

# Stanza takes a couple of minutes to load its models, so start it first
docker build . -f ./images/evkk-stanza.Dockerfile -t evkk-stanza
docker build . -f ./docker/images/evkk-stanza-server.Dockerfile -t evkk-stanza-server
docker run -d --name "$ID-stanza" --network "$ID" --network-alias stanza-server \
  -e CPU_CORE=0 evkk-stanza-server >/dev/null

docker run -d --name "$ID-redis" --network "$ID" --network-alias redis \
  redis:6-alpine >/dev/null

docker run -d --name "$ID-postgres" --network "$ID" --network-alias postgres \
  -e POSTGRES_USER=db_user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=evkk \
  --tmpfs /var/lib/postgresql/data \
  postgres:13-alpine >/dev/null

# Passwords come from conf/local_*.env, everything else is overridden here
gradle() {
  docker run --rm --network "$ID" \
    -u "$(id -u):$(id -g)" \
    -v "$PWD":"$PWD" -w "$PWD" \
    -e GRADLE_USER_HOME="$PWD/.gradle-home" \
    -e EVKK_SERVICE_PROFILE=demo \
    -e EVKK_COMMON_DATASOURCE_URL=jdbc:postgresql://postgres:5432/evkk \
    -e EVKK_COMMON_REDIS_HOST=redis \
    -e EVKK_DB_FLYWAY_COMMANDS=migrate \
    -e SPRING_FLYWAY_LOCATIONS=classpath:/migration/versioned,classpath:/migration/callbacks \
    eclipse-temurin:11-jdk \
    ./gradlew "$@" --no-daemon
}

# wait_for <name> <timeout seconds> <command...>
wait_for() {
  local name=$1 timeout=$2; shift 2
  local start=$SECONDS
  until "$@" >/dev/null 2>&1; do
    if (( SECONDS - start > timeout )); then
      echo "$name did not become ready in ${timeout}s" 1>&2
      docker logs --tail 50 "$ID-${name}" 1>&2 || true
      exit 1
    fi
    sleep 2
  done
  echo "$name ready after $(( SECONDS - start ))s"
}

# -h forces TCP, so the temporary server used during init doesn't count as ready
wait_for postgres 60 docker exec "$ID-postgres" pg_isready -h 127.0.0.1 -U db_user -d evkk

# Schema only: repeatable migrations contain corpus data that tests don't need
echo "Migrating database ..."
gradle :db:bootRun

wait_for stanza 600 docker exec "$ID-stanza" \
  python -c "import urllib.request; urllib.request.urlopen('http://localhost:5300/tervitus')"

echo "Running tests ..."
gradle test
