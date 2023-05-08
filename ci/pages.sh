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
  chmod 600 .ssh/id_rsa

  GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -i ${TMP_DIR}/.ssh/id_rsa" git clone --depth=1 -b gh-pages git@github.com:lerarosalene/hide-nsfw-posts-reddit.git
  pushd "hide-nsfw-posts-reddit"
    mkdir -p docs
    pushd docs
      rm -rf *
      touch .nojekyll
      echo "${INDEX_HTML}" > index.html
      mkdir -p latest
      cp "${SRC_DIR}/dist/hide-nsfw-posts-reddit.user.js" latest/
    popd

    git add docs
    git config user.name "github actions runner"
    git config user.email "lerarosalene@outlook.com"
    git commit --allow-empty -m "Release $(date +%s)"
    GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -i ${TMP_DIR}/.ssh/id_rsa" git push
  popd
popd
