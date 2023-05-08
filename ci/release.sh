#!/bin/bash

set -ex
RELEASE_NAME=$(git rev-parse --abbrev-ref HEAD)
gh release create "${RELEASE_NAME}" --notes "Release: ${RELEASE_NAME}" dist/hide-nsfw-posts-reddit.user.js
