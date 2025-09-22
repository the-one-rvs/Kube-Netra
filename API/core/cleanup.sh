#!/bin/bash

echo "📦 PROJECT_NAME : $PROJ_NAME"

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR"

WATCHER_NAME=$(echo "$DOCKER_IMAGE" | sed 's/\//-/g')

echo "🚀 Cleaning up..."

# Kill all processes from pid files if exist
if [ -d "$SCRIPT_DIR/pid/$PROJ_NAME" ]; then
    for pid_file in "$SCRIPT_DIR/pid/$PROJ_NAME"/*.pid; do
        if [ -f "$pid_file" ]; then
            PID=$(cat "$pid_file")
            if kill -0 "$PID" 2>/dev/null; then
                echo "🛑 Killing process $PID (from $pid_file)"
                kill "$PID"
            else
                echo "⚠️ Process $PID not running (from $pid_file)"
            fi
        fi
    done
    # Remove the pid directory after killing processes
    rm -rf "$SCRIPT_DIR/pid/$PROJ_NAME"
fi

# Remove logs
DETECTOR_SIGNAL="$SCRIPT_DIR/detector/${WATCHER_NAME}-new-tag"
PENDING_SIGNAL="$SCRIPT_DIR/detector/${WATCHER_NAME}-pending-tag"

rm  "$SCRIPT_DIR/logs/$PROJ_NAME-workflow.log"
echo "Log files cleaned up.  $SCRIPT_DIR/logs/$PROJ_NAME-workflow.log" 
rm  "$SCRIPT_DIR/logs/$PROJ_NAME/$WATCHER_NAME-watch.sh.log"
echo "Log files cleaned up.  $SCRIPT_DIR/logs/$WATCHER_NAME-watch.sh.log"
rm -rf "$SCRIPT_DIR/env/$PROJ_NAME"
echo "Environment files cleaned up.  $SCRIPT_DIR/env/$PROJ_NAME"
rm -rf "$SCRIPT_DIR/runners/$PROJ_NAME"
echo "Runner scripts cleaned up.  $SCRIPT_DIR/runners/$PROJ_NAME"
rm -rf "$SCRIPT_DIR/repos/$WATCHER_NAME"
echo "Repository files cleaned up.  $SCRIPT_DIR/repos/$WATCHER_NAME"
rm -rf "$DETECTOR_SIGNAL"
rm -rf "$PENDING_SIGNAL"

# count=1
ENV_COUNT=$(echo "$ENV_DETAILS" | jq '.environments | length')
count=1
while [ "$count" -le "$ENV_COUNT" ]; do
    ENV_NAME=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].environmentName")
    MODE=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].mode")

    echo "Cleaning logs for: $ENV_NAME ($MODE)"
    rm -rf "$SCRIPT_DIR/logs/$ENV_NAME-$PROJ_NAME-$MODE-patcher.log"
    echo "Removed: $SCRIPT_DIR/logs/$ENV_NAME-$PROJ_NAME-$MODE-patcher.log"

    count=$((count+1))
done


echo "✅ Cleanup complete."
