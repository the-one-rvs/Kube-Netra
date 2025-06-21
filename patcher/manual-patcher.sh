#!/bin/bash
# Usage: ./manual-patcher.sh /path/to/env/{env-name}-{project-name}.env.sh

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <environment-file.sh>"
  exit 1
fi

source "$1"

# Check if environment is manual mode
if [ "$MODE" != "manual" ]; then
  echo "⚠️ This environment is NOT configured for manual mode. Exiting."
  exit 1
fi

DOCKER_PROJECT_NAME=$(echo "$DOCKER_IMAGE" | awk -F '/' '{print $2}')

if [ ! -f "$LATEST_TAG_PATH" ]; then
  echo "❌ Latest tag file not found at $LATEST_TAG_PATH. Ensure the watcher is running."
  exit 1
fi

# Get Latest Tag
LATEST_TAG=$(head -n 1 "$LATEST_TAG_PATH")
TMP_DIR="/tmp/${DOCKER_PROJECT_NAME}-manual-patch"

# Ensure temp directory
mkdir -p "$TMP_DIR"

# Clone or Pull the Repo
if [ ! -d "$TMP_DIR/.git" ]; then
  echo "⏳ Cloning $GIT_REPO..."
  git clone -b "$BRANCH" "$GIT_REPO" "$TMP_DIR"
else
  echo "⏳ Pulling latest changes for $BRANCH..."
  git -C "$TMP_DIR" pull origin "$BRANCH"
fi

# Get Current Tag
CURRENT_TAG=$(grep "tag:" "$TMP_DIR/$HELM_VALUES_PATH" | awk '{print $2}')

echo "---------------------------------------------"
echo "🚀 Manual-Patcher started for $DOCKER_PROJECT_NAME..."
echo "ℹ️ Current tag in Helm chart: $CURRENT_TAG"
echo "✅ Latest tag from Watcher: $LATEST_TAG"
echo "---------------------------------------------"

# Confirm Patch
if [ "$LATEST_TAG" != "$CURRENT_TAG" ]; then
  read -p "🎯 New tag available! Do you want to patch Helm chart? (y/N): " CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    sed -i "s/tag:.*/tag: $LATEST_TAG/" "$TMP_DIR/$HELM_VALUES_PATH"

    git -C "$TMP_DIR" add "$HELM_VALUES_PATH"
    git -C "$TMP_DIR" commit -m "👋 Kube-Netra manual patch: updated tag to $LATEST_TAG"
    git -C "$TMP_DIR" push origin "$BRANCH"

    echo "✅ Tag updated to $LATEST_TAG and pushed to $BRANCH."
  else
    echo "❌ Patch skipped."
  fi
else
  echo "ℹ️ No new tag found. Current tag ($CURRENT_TAG) is up to date."
fi
