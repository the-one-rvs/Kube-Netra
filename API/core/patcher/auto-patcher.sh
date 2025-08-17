#!/bin/bash
# Usage: ./auto-patcher.sh /path/to/env/{env-name}-{project-name}.env.sh

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <environment-file.sh>"
  exit 1
fi

source "$1"

if [ "$MODE" != "auto" ]; then
  echo "⚠️ This environment is NOT configured for auto mode. Exiting."
  exit 1
fi

# Derive project name
DOCKER_PROJECT_NAME=$(echo "$DOCKER_IMAGE" | sed 's/\//-/g')

# Paths
if [ ! -f "$LATEST_TAG_PATH" ]; then
  echo "❌ Latest tag file not found at $LATEST_TAG_PATH. Ensure the watcher is running."
  exit 1
fi

REPO_NAME=$(basename "${GIT_REPO}")
# echo "$REPO_NAME"

GIT_REPO_URL=https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

git config --global user.name "the-one-rvs"
git config --global user.email "vaibhavsarswat142005@gmail.com"


PATCHER_DIR=$(dirname "$(readlink -f "$0")")
REPOS_DIR="$PATCHER_DIR/repos"
mkdir -p "$REPOS_DIR"
while true; do
  RAND_SUFFIX=$((RANDOM % 10000))
  TMP_DIR="$REPOS_DIR/${DOCKER_PROJECT_NAME}-auto-patch-$RAND_SUFFIX"
  if [ ! -d "$TMP_DIR" ]; then
    mkdir -p "$TMP_DIR"
    break
  fi
done

cd "$TMP_DIR" || exit 1

# Clone or Pull
if [ ! -d "$TMP_DIR/.git" ]; then
  echo "⏳ Cloning $GIT_REPO..."
  git clone -b "$BRANCH" "$GIT_REPO_URL" . 
else
  echo "⏳ Pulling latest changes for $BRANCH..."
  git  pull origin "$BRANCH"
fi

echo "🚀 Auto-Patcher started for $DOCKER_PROJECT_NAME..."
echo "👁️ Watching $HELM_VALUES_PATH for tag changes every 10 seconds..."
echo "---------------------------------------------"

while true; do
  NEW_TAG=$(head -n 1 "$LATEST_TAG_PATH")
  CURRENT_TAG=$(grep "tag:" "$TMP_DIR/$HELM_VALUES_PATH" | awk '{print $2}')

  git  pull origin "$BRANCH"

  sleep 5

  if [ "$NEW_TAG" != "$CURRENT_TAG" ]; then
    echo "🎉 New tag detected: $NEW_TAG (Previous: $CURRENT_TAG)"
    sed -i "s/tag:.*/tag: $NEW_TAG/" "$TMP_DIR/$HELM_VALUES_PATH"
    git  pull origin "$BRANCH"
    git  add "$HELM_VALUES_PATH"
    git  commit -m "🤖 Kube-Netra auto patch: updated tag to $NEW_TAG"

    git  push origin "$BRANCH"

    echo "✅ Changes pushed to $BRANCH."
  else
    echo "ℹ️ No new tag. Current tag is still: $CURRENT_TAG."
  fi

  sleep 10
done
