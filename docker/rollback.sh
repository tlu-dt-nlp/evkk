#!/bin/bash
set -euo pipefail

# Rolls every service running the last deployed build back to the build that ran before it, then waits until
# they are healthy. Database migrations are NOT rolled back (they must be backward compatible, see CLAUDE.md).
# Only goes back one build: run.sh keeps the images of the current and the previous build only.
#
# Usage: ./rollback.sh [tag]
#   tag: the build to roll back, defaults to ./IMAGE_TAG (the last build copied here by Jenkins)

STACK=evkk
ROLLBACK_TIMEOUT_SECONDS="${ROLLBACK_TIMEOUT_SECONDS:-7200}"

cd "$(dirname "$0")"
tag="${1:-$(cat ./IMAGE_TAG)}"

stack_services() {
  docker service ls --filter "label=com.docker.stack.namespace=${STACK}" --format '{{.Name}}'
}

print_services() {
  docker service ls --filter "label=com.docker.stack.namespace=${STACK}"
}

# Only services on this build. postgres, redis and caddy are left alone: their previous spec can be from long ago.
services=()
while read -r name; do
  if [[ "$(docker service inspect -f '{{.Spec.TaskTemplate.ContainerSpec.Image}}' "$name")" == *":${tag}" ]]; then
    services+=("$name")
  fi
done < <(stack_services)

if [[ ${#services[@]} -eq 0 ]]; then
  # Also what happens when running this twice: after the first run, no service is on this build any more
  echo "No services are running build ${tag}, nothing to roll back"
  print_services
  exit 0
fi

echo "Rolling back build ${tag}"
rolled_back=()
for name in "${services[@]}"; do
  previous=$(docker service inspect -f '{{if .PreviousSpec}}{{.PreviousSpec.TaskTemplate.ContainerSpec.Image}}{{end}}' "$name")
  if [[ -z "$previous" ]]; then
    echo "  ${name}: no previous version to roll back to, skipped" 1>&2
    continue
  fi
  echo "  ${name}: ${tag} -> ${previous##*:}"
  docker service rollback --detach=true "$name" >/dev/null
  rolled_back+=("$name")
done

# 0 = all rolled back and healthy, 1 = still in progress, 2 = a rollback got stuck
check_rollbacks() {
  local pending=0 name info state spec_image desired running
  for name in "${rolled_back[@]}"; do
    info=$(docker service inspect -f '{{if .UpdateStatus}}{{.UpdateStatus.State}}{{end}}|{{.Spec.TaskTemplate.ContainerSpec.Image}}|{{if .Spec.Mode.Replicated}}{{.Spec.Mode.Replicated.Replicas}}{{else}}1{{end}}' "$name")
    IFS='|' read -r state spec_image desired <<<"$info"
    if [[ "$state" == rollback_paused ]]; then
      echo "Rollback of ${name} got stuck: $(docker service inspect -f '{{.UpdateStatus.Message}}' "$name")" 1>&2
      return 2
    fi
    if [[ "$state" != rollback_completed ]]; then
      pending=1
      continue
    fi
    running=$(docker service ps "$name" --no-trunc --filter desired-state=running --format '{{.Image}} {{.CurrentState}}' \
      | awk -v image="$spec_image" '$1 == image && $2 == "Running"' | wc -l)
    (( running == desired )) || pending=1
  done
  return $pending
}

if [[ ${#rolled_back[@]} -gt 0 ]]; then
  echo "Waiting for the rolled back services to be healthy"
  deadline=$(( $(date +%s) + ROLLBACK_TIMEOUT_SECONDS ))
  while true; do
    sleep 10
    status=0
    check_rollbacks || status=$?
    if [[ $status -eq 0 ]]; then
      break
    elif [[ $status -eq 2 ]]; then
      print_services
      exit 1
    elif (( $(date +%s) > deadline )); then
      echo "Timed out after ${ROLLBACK_TIMEOUT_SECONDS}s waiting for the rolled back services to be healthy" 1>&2
      echo "To wait longer, set ROLLBACK_TIMEOUT_SECONDS (whole seconds, default 7200), e.g. ROLLBACK_TIMEOUT_SECONDS=10800 ./rollback.sh" 1>&2
      print_services
      exit 1
    fi
  done
fi

print_services
if [[ ${#rolled_back[@]} -lt ${#services[@]} ]]; then
  echo "Rollback finished, but some services had no previous version (see above)" 1>&2
  exit 1
fi
echo "Rollback of build ${tag} completed"
