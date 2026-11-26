#!/bin/bash
set -euo pipefail

# Runs UI (Vitest) tests in CI, in the same Node image the UI is built with (docker/images/evkk-ui.Dockerfile).

UI_DIR="${1:-$PWD/ui}"

# Workspace is reused between builds: don't let the junit step pick up results from a previous build
rm -rf "$UI_DIR/test-results"

# Runs as the current user, so Jenkins can clean up the files created in the workspace
docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$UI_DIR":/app -w /app \
  -e HOME=/tmp \
  node:24.0-alpine3.20 sh -c '
    set -eu
    echo "Installing dependencies ..."
    corepack yarn install --immutable

    echo "Running UI tests ..."
    corepack yarn test --reporter=default --reporter=junit --outputFile.junit=test-results/junit.xml
  '
