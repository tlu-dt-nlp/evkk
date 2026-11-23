#!/bin/bash
set -euo pipefail

# Deploys EVKK as a rolling update of the running Docker Swarm stack:
#   1. make sure postgres is running (on a cold start, it is the only service started)
#   2. run database migrations against it while the old version keeps serving
#   3. `docker stack deploy` the new images; Swarm replaces each service only once the new task is healthy
#      and rolls back on its own if it never gets healthy (update policies are in docker-compose.base.yml)
# If anything fails before step 3, the old version is left running untouched.

STACK=evkk
NETWORK="${STACK}_default"
STACK_FILES=(-c compose/docker-compose.postgres.yml -c compose/docker-compose.base.yml -c compose/docker-compose.yml)
SERVICE_IMAGES=(evkk-backend evkk-ui evkk-stanza-server evkk-corrector-server evkk-klasterdaja evkk-grammar-worker-server)
DEPLOY_TIMEOUT_SECONDS="${DEPLOY_TIMEOUT_SECONDS:-7200}"

export IMAGE_TAG
IMAGE_TAG="$(cat ./IMAGE_TAG)"
export CADDYFILE_SHA
CADDYFILE_SHA="$(sha256sum compose/Caddyfile | cut -c1-12)"

echo "Running EVKK ${IMAGE_TAG} ..."

stack_exists() {
  docker stack ls --format '{{.Name}}' | grep -x "$STACK" >/dev/null
}

stack_services() {
  docker service ls --filter "label=com.docker.stack.namespace=${STACK}" --format '{{.Name}}'
}

print_services() {
  docker service ls --filter "label=com.docker.stack.namespace=${STACK}"
}

wait_until() {
  local description=$1 timeout=$2
  shift 2
  echo "Waiting for ${description}"
  for _ in $(seq 1 $((timeout / 2))); do
    if "$@"; then
      return 0
    fi
    sleep 2
  done
  echo "Timed out waiting for ${description}" 1>&2
  return 1
}

no_stack() { ! stack_exists && ! docker network inspect "$NETWORK" >/dev/null 2>&1; }

postgres_healthy() {
  docker ps --filter "label=com.docker.swarm.service.name=${STACK}_postgres" --filter health=healthy --format '{{.ID}}' | grep . >/dev/null
}

echo "Initializing Docker Swarm if needed"
if [[ "$(docker info --format '{{.Swarm.LocalNodeState}}')" != "active" ]]; then
  docker swarm init
  echo "Docker Swarm initialized"
else
  echo "Docker Swarm already initialized"
fi

echo "Loading images"
for file in ./images/*.tar; do docker load -i "${file}"; done
echo "Loading images done"

# Leftovers from the old compose-based migration step, e.g. after an aborted deploy
docker rm -f evkk-postgres evkk-db >/dev/null 2>&1 || true

# One-time switch: stacks created before the network was made attachable must be recreated (causes downtime once)
if docker network inspect "$NETWORK" >/dev/null 2>&1 \
  && [[ "$(docker network inspect -f '{{.Attachable}}' "$NETWORK")" != "true" ]]; then
  echo "Network ${NETWORK} is not attachable, recreating the stack (one-time downtime)"
  docker stack rm "$STACK"
  wait_until "stack ${STACK} to be removed" 300 no_stack
fi

echo "Starting postgres (no-op if already running)"
docker stack deploy --resolve-image never -c compose/docker-compose.postgres.yml -c compose/docker-compose.yml "$STACK"
wait_until "postgres to be healthy" 300 postgres_healthy

echo "Running database migrations"
docker run --rm --name evkk-db --network "$NETWORK" \
  -v /srv/evkk/secrets/EVKK_DB_DATASOURCE_PASSWORD:/run/secrets/EVKK_DB_DATASOURCE_PASSWORD:ro \
  -v /srv/evkk/secrets/EVKK_API_DATASOURCE_PASSWORD:/run/secrets/EVKK_API_DATASOURCE_PASSWORD:ro \
  -v /srv/evkk/secrets/EVKK_TASK_SCHEDULER_DATASOURCE_PASSWORD:/run/secrets/EVKK_TASK_SCHEDULER_DATASOURCE_PASSWORD:ro \
  --env-file conf/common.env \
  --env-file conf/db.env \
  --env-file conf/api.env \
  --env-file conf/task-scheduler.env \
  "evkk-backend:${IMAGE_TAG}" java -jar app/db.jar || {
  echo "Database migrations failed, the running version was left untouched" 1>&2
  exit 1
}
echo "Running database migrations done"

echo "Deploying services using Docker Swarm (rolling update)"
deploy_started_at=$(date +%s)
docker stack deploy --resolve-image never "${STACK_FILES[@]}" "$STACK"

# Done when, for every service, no update is in progress and all desired replicas are running (and healthy)
# with the image the service spec now points to. Comparing images means old tasks that are still running
# right after `stack deploy` don't count. Fails if any service was rolled back during this deploy.
# 0 = all updated and healthy, 1 = still in progress, 2 = a service failed to update (rolled back or stuck)
check_services() {
  local pending=0 name info state started spec_image desired running
  while read -r name; do
    info=$(docker service inspect -f '{{if .UpdateStatus}}{{.UpdateStatus.State}}|{{.UpdateStatus.StartedAt.Unix}}{{else}}|{{end}}|{{.Spec.TaskTemplate.ContainerSpec.Image}}|{{if .Spec.Mode.Replicated}}{{.Spec.Mode.Replicated.Replicas}}{{else}}1{{end}}' "$name")
    IFS='|' read -r state started spec_image desired <<<"$info"
    if [[ "$state" == rollback_* || "$state" == paused ]] \
      && [[ -n "$started" ]] && (( started >= deploy_started_at )); then
      if [[ "$state" == rollback_started ]]; then
        pending=1
        continue
      fi
      echo "Service ${name} failed to update (${state}): $(docker service inspect -f '{{.UpdateStatus.Message}}' "$name")" 1>&2
      return 2
    fi
    [[ "$state" == updating ]] && pending=1
    running=$(docker service ps "$name" --no-trunc --filter desired-state=running --format '{{.Image}} {{.CurrentState}}' \
      | awk -v image="$spec_image" '$1 == image && $2 == "Running"' | wc -l)
    (( running == desired )) || pending=1
  done < <(stack_services)
  return $pending
}

# Swarm rolls back only the service that failed. Roll back every service that was moved to this build too,
# so the stack doesn't stay on a mix of old and new versions (migrations stay applied, they must be backward compatible).
rollback_all() {
  local name
  echo "Rolling back all services updated to ${IMAGE_TAG}" 1>&2
  while read -r name; do
    if [[ "$(docker service inspect -f '{{.Spec.TaskTemplate.ContainerSpec.Image}}' "$name")" == *":${IMAGE_TAG}" ]]; then
      docker service rollback --detach=true "$name" >/dev/null && echo "  ${name}" 1>&2
    fi
  done < <(stack_services)
  echo "Rollback started, follow it with: docker service ls" 1>&2
  print_services
}

echo "Waiting for all services to be updated and healthy"
deadline=$((deploy_started_at + DEPLOY_TIMEOUT_SECONDS))
while true; do
  # Give Swarm a moment to start the update before the first check
  sleep 10
  status=0
  check_services || status=$?
  if [[ $status -eq 0 ]]; then
    break
  elif [[ $status -eq 2 ]]; then
    rollback_all
    exit 1
  elif (( $(date +%s) > deadline )); then
    echo "Timed out after ${DEPLOY_TIMEOUT_SECONDS}s waiting for services to become healthy" 1>&2
    echo "If services just need longer to start, raise the limit by setting DEPLOY_TIMEOUT_SECONDS (whole seconds, default 7200)," 1>&2
    echo "e.g. DEPLOY_TIMEOUT_SECONDS=10800 ./run.sh" 1>&2
    rollback_all
    exit 1
  fi
done
print_services
echo "Services deployed using Docker Swarm"

echo "Removing old images (keeping the current and the previous build for rollback)"
# Only touch tags of this build target (e.g. prod-*), the demo host also holds images built for prod.
# "latest" is the tag used before images were tagged per build.
tag_prefix=""
[[ "$IMAGE_TAG" == *-* ]] && tag_prefix="${IMAGE_TAG%-*}-"
for image in "${SERVICE_IMAGES[@]}"; do
  docker image ls "$image" --format '{{.CreatedAt}}\t{{.Tag}}' \
    | sort -r | cut -f2 | grep -E "^(${tag_prefix}|latest$)" | grep -vx "$IMAGE_TAG" | tail -n +2 \
    | sed "s|^|${image}:|" | xargs -r docker image rm >/dev/null 2>&1 || true
done
