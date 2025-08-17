#!/bin/bash
# Usage: ./dual-patcher.sh /path/to/env/{env-name}-{project-name}.env.sh

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <environment-file.sh>"
  exit 1
fi

source "$1"

DOCKER_PROJECT_NAME=$(echo "$DOCKER_IMAGE" | awk -F '/' '{print $2}')

# Check required files
if [ ! -f "$TAGS_PATH" ]; then
  echo "❌ Tags file not found at $TAGS_PATH. Ensure the watcher is running."
  exit 1
fi

# Get Current Tag
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

REPO_NAME=$(basename "${GIT_REPO}")
# echo "$REPO_NAME"

GIT_REPO_URL=https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

git config --global user.name "the-one-rvs"
git config --global user.email "vaibhavsarswat142005@gmail.com"

# Clone or Pull
if [ ! -d "$TMP_DIR/.git" ]; then
  echo "⏳ Cloning $GIT_REPO..."
  git clone -b "$BRANCH" "$GIT_REPO_URL" . 
else
  echo "⏳ Pulling latest changes for $BRANCH..."
  git  pull origin "$BRANCH"
fi

CURRENT_TAG=$(grep "tag:" "$TMP_DIR/$HELM_VALUES_PATH" | awk '{print $2}')

# List available tags
echo "---------------------------------------------"
echo "🚀 Dual-Patcher started for $DOCKER_PROJECT_NAME..."
echo "ℹ️ Current tag in Helm chart: $CURRENT_TAG"
echo "✅ Available tags from Watcher:"
cat "$TAGS_PATH" | nl
echo "---------------------------------------------"

# Ask user to pick
read -p "Enter the number of the tag you want to patch with: " SELECTION
SELECTED_TAG=$(sed -n "${SELECTION}p" "$TAGS_PATH")

if [ -z "$SELECTED_TAG" ]; then
  echo "❌ Invalid selection. Exiting..."
  exit 1
fi

echo "🎯 You have selected tag: $SELECTED_TAG"

# Confirm and Patch
read -p "👉 Do you want to patch the Helm chart with tag $SELECTED_TAG? (y/N): " CONFIRM
if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
  sed -i "s/tag:.*/tag: $SELECTED_TAG/" "$TMP_DIR/$HELM_VALUES_PATH"

  git -C "$TMP_DIR" add "$HELM_VALUES_PATH"
  git -C "$TMP_DIR" commit -m "👋 Kube-Netra dual patch: updated tag to $SELECTED_TAG"
  git -C "$TMP_DIR" push origin "$BRANCH"

  echo "✅ Tag updated to $SELECTED_TAG and pushed to $BRANCH."
else
  echo "❌ Patch skipped."
fi
