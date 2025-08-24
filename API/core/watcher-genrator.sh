#!/bin/bash

echo "🚀 Kube-Netra Watcher Generator"

# Prompt for image details
DOCKER_IMAGE=$1
POLL_INTERVAL=$2
ACCESS_TYPE=$3

USERNAME=""
TOKEN=""

if [ "$ACCESS_TYPE" == "private" ]; then
  USERNAME=$4
  TOKEN=$5
fi

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
WATCHER_NAME=$(echo "$DOCKER_IMAGE" | sed 's/\//-/g')
mkdir -p $SCRIPT_DIR/watchers

WATCHER_FILE="$SCRIPT_DIR/watchers/${WATCHER_NAME}-watch.sh"

cat << EOF > "$WATCHER_FILE"
#!/bin/bash

DOCKER_IMAGE="$DOCKER_IMAGE"
POLL_INTERVAL=$POLL_INTERVAL
ACCESS_TYPE="$ACCESS_TYPE"
USERNAME="$USERNAME"
TOKEN="$TOKEN"

API_URL="https://hub.docker.com/v2/repositories/\${DOCKER_IMAGE}/tags?page_size=100"

KUBENETRA_DIR=$(dirname "$(readlink -f "$0")")
mkdir -p "\$KUBENETRA_DIR/tags/list" "\$KUBENETRA_DIR/tags/latest" "\$KUBENETRA_DIR/detector"

TAG_FILE="\$KUBENETRA_DIR/tags/list/${WATCHER_NAME}-tags.txt"
LATEST_FILE="\$KUBENETRA_DIR/tags/latest/${WATCHER_NAME}-latest-tag.txt"

touch "\$TAG_FILE" "\$LATEST_FILE"

echo "🚀 Kube-Netra DockerHub Watcher started..."
echo "Image: \$DOCKER_IMAGE"
echo "Interval: \$POLL_INTERVAL seconds"
echo "Access: \$ACCESS_TYPE"
echo "Saving tags to: \$TAG_FILE"
echo "Saving latest tag to: \$LATEST_FILE"
echo "------------------------------------------"

count=0
DETECTOR_SIGNAL="\$KUBENETRA_DIR/detector/${WATCHER_NAME}-new-tag"
PENDING_SIGNAL="$SCRIPT_DIR/detector/${WATCHER_NAME}-pending-tag"


while true; do
  ((count++))
  echo "⏳ Fetching tags at \$(date)..."

  if [ "\$ACCESS_TYPE" == "private" ]; then
    RESPONSE=\$(curl -s -H "Authorization: Bearer \${TOKEN}" "\$API_URL")
  else
    RESPONSE=\$(curl -s "\$API_URL")
  fi

  TAGS=\$(echo "\$RESPONSE" | jq -r '.results | sort_by(.last_updated) | reverse | .[].name')

  if [ -z "\$TAGS" ]; then
    echo "⚠️ No tags found or failed to fetch tags!"
    echo "\$RESPONSE" | jq
  else
    if [ -s "\$TAG_FILE" ]; then
      NEW_TAGS=\$(echo "\$TAGS" | grep -vxFf "\$TAG_FILE")
    else
      NEW_TAGS="\$TAGS"
    fi

    if [ -n "\$NEW_TAGS" ]; then
      echo "🎉 New Tags Detected:"
      if [[ "\$count" -gt 2 ]]; then
        if [ -f "\$DETECTOR_SIGNAL" ]; then
            touch "\$PENDING_SIGNAL"
        else
          touch "\$DETECTOR_SIGNAL"
        fi
      fi
      echo "\$NEW_TAGS"
      # Save the latest tag
      echo "\$(echo "\$NEW_TAGS" | head -n 1)" > "\$LATEST_FILE"
    else
      echo "ℹ️ No new tags since last check."
    fi

    # Save all sorted tags
    echo "\$TAGS" > "\$TAG_FILE"
  fi

  echo "------------------------------------------"
  sleep \$POLL_INTERVAL
done
EOF

chmod +x "$WATCHER_FILE"

echo "✅ Watcher script created: $WATCHER_FILE"
echo "Run it using: ./$WATCHER_FILE"
