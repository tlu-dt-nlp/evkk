#!/bin/bash
# Start services in order to reduce OOM risk. Run after ./build-images.sh

set -e
export COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0

echo "Starting postgres and redis..."
COMPOSE_PROFILES=backend docker-compose up -d postgres redis

echo "Waiting for postgres..."
sleep 5

echo "Starting corrector-server..."
COMPOSE_PROFILES=corrector docker-compose up -d --build corrector-server
sleep 3

echo "Starting stanza-server..."
COMPOSE_PROFILES=stanza docker-compose up -d --build stanza-server
sleep 3

echo "Starting klasterdaja..."
COMPOSE_PROFILES=klasterdaja docker-compose up -d --build klasterdaja
sleep 3

echo "Starting grammar-worker-server..."
COMPOSE_PROFILES=grammar_worker docker-compose up -d --build grammar-worker-server

echo "All services started. Run migrations: export JAVA_HOME=\$(brew --prefix openjdk@11); ./gradlew :db:bootRun --args 'clean migrate seed'"
echo "Then start API: ./gradlew :api:bootRun  and UI: yarn --cwd=./ui start"
