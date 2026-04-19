#!/bin/bash
set -e

echo "Building EVKK ..."

if [[ -z "$BUILD_TARGET" ]]; then
    echo "\$BUILD_TARGET is not set" 1>&2
    exit 1
fi

echo "BUILD_TARGET=$BUILD_TARGET"

# Remove build dir (if exists)
rm -rf ./build/

# Build common images
./build-images.sh

# Build service images
mkdir -p ./build/images/
declare -a services=("evkk-backend" "evkk-ui" "evkk-stanza-server" "evkk-corrector-server" "evkk-klasterdaja" "evkk-grammar-worker-server")

for service in "${services[@]}"
do
  docker build . -f ./docker/images/${service}.Dockerfile -t ${service}
  docker save -o ./build/images/${service}.tar ${service}
done

# Copy compose files
mkdir -p ./build/compose/
cp ./docker/compose/Caddyfile ./build/compose/Caddyfile
cp ./docker/compose/docker-compose.postgres.yml ./build/compose/docker-compose.postgres.yml
cp ./docker/compose/docker-compose.db.yml ./build/compose/docker-compose.db.yml
cp ./docker/compose/docker-compose.base.yml ./build/compose/docker-compose.base.yml
cp ./docker/compose/docker-compose.${BUILD_TARGET}.yml ./build/compose/docker-compose.yml

# Copy env files and remove `${BUILD_TARGET}_` prefix
mkdir -p ./build/conf/
for file in ./conf/${BUILD_TARGET}_*; do cp "$file" "./build/conf/${file#./conf/${BUILD_TARGET}_}"; done

# Copy scripts
cp ./docker/run.sh ./build/run.sh
cp ./docker/db-backup.sh ./build/db-backup.sh

echo "Build completed"
