#!/bin/bash
# Usage: ./manual-patcher.sh /path/to/env/{env-name}-{project-name}.env.sh

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <environment-file.sh>"
  exit 1
fi

source "$1"

# Check if environment is manual
if [ "$MODE" != "manual" ]; then
  echo "⚠️ This environment is NOT configured for manual mode. Exiting."
  exit 1
fi

# Derive project name
DOCKER_PROJECT_NAME=$(echo "$DOCKER_IMAGE" | sed 's/\//-/g')

# Paths
if [ ! -f "$LATEST_TAG_PATH" ]; then
  echo "❌ Latest tag file not found at $LATEST_TAG_PATH. Ensure the watcher is running."
  exit 1
fi

# read -p "Your Github Persnol Access Token: " GIT_TOKEN

# # Use PAT if available
# if [ -n "$GIT_TOKEN" ]; then
#   GIT_REPO_URL=$(echo "$GIT_REPO" | sed -E "s|https://|https://${GIT_TOKEN}@|")
# else
#   GIT_REPO_URL="$GIT_REPO"
# fi

PATCHER_DIR=$(dirname "$(readlink -f "$0")")
REPOS_DIR="$PATCHER_DIR/repos"
mkdir -p "$REPOS_DIR"
while true; do
  RAND_SUFFIX=$((RANDOM % 10000))
  TMP_DIR="$REPOS_DIR/${DOCKER_PROJECT_NAME}-manual-patch-$RAND_SUFFIX"
  if [ ! -d "$TMP_DIR" ]; then
    mkdir -p "$TMP_DIR"
    break
  fi
done

REPO_NAME=$(basename "${GIT_REPO}")
# echo "$REPO_NAME"

GIT_REPO_URL=https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

cd "$TMP_DIR" || exit 1

if [ ! -d "$TMP_DIR/.git" ]; then
  echo "⏳ Cloning $GIT_REPO..."
  git clone -b "$BRANCH" "$GIT_REPO_URL" . 
else
  echo "⏳ Pulling latest changes for $BRANCH..."
  git  pull origin "$BRANCH"
fi

echo "🚀 Manual-Patcher started for $DOCKER_PROJECT_NAME..."
# echo "👁️ Watching $HELM_VALUES_PATH for tag changes every 10 seconds..."
echo "---------------------------------------------"

# while true; do
NEW_TAG=$(cat "$LATEST_TAG_PATH" | head -n 1)
CURRENT_TAG=$(grep "tag:" "$TMP_DIR/$HELM_VALUES_PATH" | awk '{print $2}')

git  pull origin "$BRANCH"

if [ "$NEW_TAG" != "$CURRENT_TAG" ]; then
  echo "🎉 New tag detected: $NEW_TAG (Previous: $CURRENT_TAG)"
  sed -i "s/tag:.*/tag: $NEW_TAG/" "$TMP_DIR/$HELM_VALUES_PATH"

  git  add "$HELM_VALUES_PATH"
  git  commit -m "🤖 Kube-Netra manual patch: updated tag to $NEW_TAG"

  git  push origin "$BRANCH"

  echo "✅ Changes pushed to $BRANCH."
else
  echo "ℹ️ No new tag. Current tag is still: $CURRENT_TAG."
fi

  # sleep 10
# done
