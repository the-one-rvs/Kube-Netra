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
TMP_DIR="/tmp/${DOCKER_PROJECT_NAME}-dual-patch"
mkdir -p "$TMP_DIR"

if [ ! -d "$TMP_DIR/.git" ]; then
  echo "⏳ Cloning $GIT_REPO..."
  git clone -b "$BRANCH" "$GIT_REPO" "$TMP_DIR"
else
  echo "⏳ Pulling latest changes for $BRANCH..."
  git -C "$TMP_DIR" pull origin "$BRANCH"
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
