#!/bin/bash

echo "🚀 Kube-Netra Watcher Generator"

# Prompt for image details
read -p "Enter Docker image (namespace/repo): " DOCKER_IMAGE
read -p "Enter poll interval (in seconds): " POLL_INTERVAL
read -p "Is the image public or private? (public/private): " ACCESS_TYPE

USERNAME=""
TOKEN=""

if [ "$ACCESS_TYPE" == "private" ]; then
  read -p "Enter Docker Hub username: " USERNAME
  read -p "Enter Docker Hub PAT (token): " TOKEN
fi

PROJECT_NAME=$(echo "$DOCKER_IMAGE" | awk -F '/' '{print $2}')

mkdir -p watchers

WATCHER_FILE="watchers/${PROJECT_NAME}-watch.sh"

cat << EOF > "$WATCHER_FILE"
#!/bin/bash

DOCKER_IMAGE="$DOCKER_IMAGE"
POLL_INTERVAL=$POLL_INTERVAL
ACCESS_TYPE="$ACCESS_TYPE"
USERNAME="$USERNAME"
TOKEN="$TOKEN"

API_URL="https://hub.docker.com/v2/repositories/\${DOCKER_IMAGE}/tags?page_size=100"

# Assume this watcher lives in <root>/watchers
SCRIPT_DIR="\$(dirname "\$(readlink -f "\$0")")"
KUBENETRA_DIR="\$(dirname "\$SCRIPT_DIR")/"

mkdir -p "\$KUBENETRA_DIR/tags/list" "\$KUBENETRA_DIR/tags/latest"

TAG_FILE="\$KUBENETRA_DIR/tags/list/${PROJECT_NAME}-tags.txt"
LATEST_FILE="\$KUBENETRA_DIR/tags/latest/${PROJECT_NAME}-latest-tag.txt"

touch "\$TAG_FILE" "\$LATEST_FILE"

echo "🚀 Kube-Netra DockerHub Watcher started..."
echo "Image: \$DOCKER_IMAGE"
echo "Interval: \$POLL_INTERVAL seconds"
echo "Access: \$ACCESS_TYPE"
echo "Saving tags to: \$TAG_FILE"
echo "Saving latest tag to: \$LATEST_FILE"
echo "------------------------------------------"

while true; do
  echo "⏳ Fetching tags at \$(date)..."

  if [ "\$ACCESS_TYPE" == "private" ]; then
    RESPONSE=\$(curl -s -H "Authorization: Bearer \${TOKEN}" "\$API_URL")
  else
    RESPONSE=\$(curl -s "\$API_URL")
  fi

  TAGS=\$(echo "\$RESPONSE" | jq -r '.results[].name' | sort)

  if [ -z "\$TAGS" ]; then
    echo "⚠️  No tags found or failed to fetch tags!"
    echo "\$RESPONSE" | jq
  else
    if [ -s "\$TAG_FILE" ]; then
      NEW_TAGS=\$(comm -13 "\$TAG_FILE" <(echo "\$TAGS"))
    else
      NEW_TAGS="\$TAGS"
    fi

    if [ -n "\$NEW_TAGS" ]; then
      echo "🎉 NEW TAGS DETECTED:"
      echo "\$NEW_TAGS"
      echo "\$(echo "\$NEW_TAGS" | head -n 1)" > "\$LATEST_FILE"
    else
      echo "ℹ️ No new tags since last check."
    fi

    echo "\$TAGS" > "\$TAG_FILE"
  fi

  echo "------------------------------------------"
  sleep \$POLL_INTERVAL
done
EOF

chmod +x "$WATCHER_FILE"

echo "✅ Watcher script created: $WATCHER_FILE"
echo "Run it using: ./$WATCHER_FILE"
