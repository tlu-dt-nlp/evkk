#!/bin/bash
set -e

echo "Building EVKK ..."

if [[ -z "$BUILD_TARGET" ]]; then
    echo "\$BUILD_TARGET is not set" 1>&2
    exit 1
fi

echo "BUILD_TARGET=$BUILD_TARGET"

# Unique tag per build, so Swarm detects changed images and can roll back to the previous one
IMAGE_TAG="${IMAGE_TAG:-$(date +%Y%m%d%H%M%S)}"
echo "IMAGE_TAG=$IMAGE_TAG"

# Remove build dir (if exists)
rm -rf ./build/

# Build common images
./build-images.sh

# Build service images
mkdir -p ./build/images/
declare -a services=("evkk-backend" "evkk-ui" "evkk-stanza-server" "evkk-corrector-server" "evkk-klasterdaja" "evkk-grammar-worker-server")

for service in "${services[@]}"
do
  BUILD_ARGS=""
  if [ "$service" == "evkk-ui" ] && [ -n "$GA_MEASUREMENT_ID" ]; then
    BUILD_ARGS="--build-arg GA_MEASUREMENT_ID=${GA_MEASUREMENT_ID}"
  fi
  docker build . $BUILD_ARGS -f ./docker/images/${service}.Dockerfile -t ${service}:${IMAGE_TAG}
  docker save -o ./build/images/${service}.tar ${service}:${IMAGE_TAG}
done
echo "$IMAGE_TAG" > ./build/IMAGE_TAG

# Remove this target's images from earlier builds (e.g. prod-* on the Jenkins host), they're in the tars already.
# Tags used by containers (like the running demo stack's) are kept: an unchanged service builds the same image under
# a new tag, and removing the old tag would leave the running service pointing at a tag that no longer exists.
tag_prefix=""
[[ "$IMAGE_TAG" == *-* ]] && tag_prefix="${IMAGE_TAG%-*}-"
used_tags=$(docker ps -a --format '{{.Image}}' | sed 's/@.*//')
for service in "${services[@]}"; do
  docker image ls "$service" --format '{{.Tag}}' | grep "^${tag_prefix}" | grep -vx "$IMAGE_TAG" \
    | sed "s|^|${service}:|" | grep -vxF -e "$used_tags" \
    | xargs -r docker image rm >/dev/null 2>&1 || true
done

# Copy compose files
mkdir -p ./build/compose/
cp ./docker/compose/Caddyfile ./build/compose/Caddyfile
cp ./docker/compose/docker-compose.postgres.yml ./build/compose/docker-compose.postgres.yml
cp ./docker/compose/docker-compose.base.yml ./build/compose/docker-compose.base.yml
cp ./docker/compose/docker-compose.${BUILD_TARGET}.yml ./build/compose/docker-compose.yml

# Copy env files and remove `${BUILD_TARGET}_` prefix
mkdir -p ./build/conf/
for file in ./conf/${BUILD_TARGET}_*; do cp "$file" "./build/conf/${file#./conf/${BUILD_TARGET}_}"; done

# Copy scripts
cp ./docker/run.sh ./build/run.sh
cp ./docker/rollback.sh ./build/rollback.sh
cp ./docker/db-backup.sh ./build/db-backup.sh

echo "Build completed"
