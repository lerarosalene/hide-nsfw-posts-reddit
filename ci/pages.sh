#!/bin/bash

set -ex

TMP_DIR=$(mktemp -d -t hide-nsfw-posts-reddit-XXXXXX)
function cleanup {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

SRC_DIR=$(pwd)
INDEX_HTML="<!DOCTYPE html><html><head></head><body></body></html>";

pushd "${TMP_DIR}"
  mkdir -p .ssh
  echo "${GH_PRIVATE_KEY}" | base64 -d > .ssh/id_rsa

  GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -i $(pwd)/.ssh/id_rsa" git clone -b --depth=1 gh-pages git@github.com:lerarosalene/hide-nsfw-posts-reddit.git
  pushd "hide-nsfw-posts-reddit"
    mkdir -p docs
    pushd docs
      rm -rf *
      touch .nojekyll
      echo "${INDEX_HTML}" > index.html
      cp "${SRC_DIR}/dist/hide-nsfw-posts-reddit.user.js" .
    popd

    git add docs
    git commit --allow-empty -m "Release $(date +%s)"
    GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -i $(pwd)/.ssh/id_rsa" git push
  popd
popd
