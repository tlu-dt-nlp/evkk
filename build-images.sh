#!/bin/bash
set -e

echo "Building base images..."
echo "Note: This may take 10-20 minutes and requires at least 4GB RAM for Docker"

# Order is important here because images may depend on each other
# Use DOCKER_BUILDKIT=0 so compose uses local images instead of pulling (fixes 'no match for platform')
echo ""
echo "Building evkk-anaconda-2021-05..."
DOCKER_BUILDKIT=0 docker build . -f ./images/evkk-anaconda-2021-05.Dockerfile -t evkk-anaconda-2021-05

echo ""
echo "Building evkk-estnltk141 (10-15 min, conda install)..."
if ! DOCKER_BUILDKIT=0 docker build . -f ./images/evkk-estnltk141.Dockerfile -t evkk-estnltk141; then
    echo "ERROR: Build failed (often OOM 137). Increase Docker memory to 6-8GB, close apps, then run ./build-estnltk-only.sh"
    exit 1
fi

echo ""
echo "Building evkk-stanza..."
DOCKER_BUILDKIT=0 docker build . -f ./images/evkk-stanza.Dockerfile -t evkk-stanza

echo ""
echo "Building evkk-jdk8-mvn..."
DOCKER_BUILDKIT=0 docker build . -f ./images/evkk-jdk8-mvn.Dockerfile -t evkk-jdk8-mvn

echo ""
echo "All base images built successfully!"
