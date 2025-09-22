#!/bin/bash

echo "📦 PROJECT_NAME : $PROJ_NAME"

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

cd $SCRIPT_DIR

$SCRIPT_DIR/watcher-genrator.sh "$DOCKER_IMAGE" "$POLL_INTERVAL" "$ACCESS_TYPE" "$USERNAME" "$TOKEN"


echo "🐳 Docker Image: $DOCKER_IMAGE"


WATCHER_NAME=$(echo "$DOCKER_IMAGE" | sed 's/\//-/g')


chmod +x $SCRIPT_DIR/patcher/auto-patcher.sh
chmod +x $SCRIPT_DIR/patcher/manual-patcher.sh
chmod +x $SCRIPT_DIR/patcher/dual-patcher.sh
chmod +x $SCRIPT_DIR/environment-genrator.sh
chmod +x $SCRIPT_DIR/watcher-genrator.sh

WATCHER_FILE="$SCRIPT_DIR/watchers/${WATCHER_NAME}-watch.sh"
echo $WATCHER_FILE
LOG_FILE_LOCATION="${WATCHER_NAME}-watch.sh"

mkdir -p $SCRIPT_DIR/logs
mkdir -p $SCRIPT_DIR/pid
mkdir -p $SCRIPT_DIR/pid/${PROJ_NAME}

mkdir -p $SCRIPT_DIR/logs
touch $SCRIPT_DIR/logs/$LOG_FILE_LOCATION.log

nohup $WATCHER_FILE > $SCRIPT_DIR/logs/$LOG_FILE_LOCATION.log 2>&1 &
WATCHER_PID=$!
echo $WATCHER_PID > "$SCRIPT_DIR/pid/${PROJ_NAME}/${WATCHER_NAME}-watcher.pid"
echo "Watcher Started ! Logs at ${SCRIPT_DIR}/logs/${LOG_FILE_LOCATION}.log"

TAG_FILE="\$SCRIPT_DIR/tags/list/${PROJ_NAME}-tags.txt"
LATEST_FILE="\$SCRIPT_DIR/tags/latest/${PROJ_NAME}-latest-tag.txt"

echo "=================================================================================================================="
echo "=================================================================================================================="
echo "=================================================================================================================="

#size of env details
NUM_ENV=$(echo "$ENV_DETAILS" | jq '.environments | length')
echo "Total number of envs: $NUM_ENV"

$SCRIPT_DIR/environment-genrator.sh "$ENV_DETAILS" "$NUM_ENV" "$PROJ_NAME" "$DOCKER_IMAGE" >> "$SCRIPT_DIR/logs/environment-genrator.log" 2>&1

echo "Environment Generator Script initiated"

ENV_FOLDER="$SCRIPT_DIR/env/$PROJ_NAME"

ENV_COUNT=$(find "$ENV_FOLDER" -type f -name "*.env.sh" | wc -l)
echo "Total number of env files: $ENV_COUNT"

# ENV_FOLDER=env/Task

ENV_NAMES=$(find "$ENV_FOLDER" -type f -name "*.env.sh" -exec basename {} -$PROJ_NAME.env.sh \;)

echo "All Environment names:"
declare -A env_map
count=0
for name in $ENV_NAMES; do
    ((count++))
    env_map[$count]="$name"
    echo "$count: $name"
done

selected_envs=()
echo "👉 Create the flow through the number of environment "

runner_mode_vec=()
#create selected envs array from ENV_DETAILS

# Get environments sorted by environmentNumber
sorted_envs=$(echo "$ENV_DETAILS" | jq -c '.environments | sort_by(.environmentNumber)[]')

selected_envs=()
while IFS= read -r env; do
    ENV_NAME=$(echo "$env" | jq -r '.environmentName')
    selected_envs+=("$ENV_NAME")
done <<< "$sorted_envs"

echo "Selected Environments: ${selected_envs[@]}"

for env in "${selected_envs[@]}"; do
    runner_file_auto="$SCRIPT_DIR/runners/$PROJ_NAME/auto/${env}-${PROJ_NAME}-runner.sh"
    runner_file_manual="$SCRIPT_DIR/runners/$PROJ_NAME/manual/${env}-${PROJ_NAME}-runner.sh"

    if [[ -f "$runner_file_auto" ]]; then
        runner_mode_vec+=("$runner_file_auto auto")
    elif [[ -f "$runner_file_manual" ]]; then
        runner_mode_vec+=("$runner_file_manual manual")
    else
        echo "Runner not found for environment: $env"
    fi
done

echo "Starting runners sequentially..."
touch "$SCRIPT_DIR/logs/$PROJ_NAME-workflow.log"
(
DETECTOR_SIGNAL="$SCRIPT_DIR/detector/${WATCHER_NAME}-new-tag"
PENDING_SIGNAL="$SCRIPT_DIR/detector/${WATCHER_NAME}-pending-tag"
echo "📡 Finding new tags. "

while true; do
    # if [[ -f "$PENDING_SIGNAL" ]]; then
    #     echo "🚨 Signal detected again."
    #     mv "$PENDING_SIGNAL" "$DETECTOR_SIGNAL"
    # fi
    if [[ -f "$DETECTOR_SIGNAL" ]]; then
        echo "🚨 Signal detected. Proceeding with patchers..."
        # rm -f "$PENDING_SIGNAL"

        for pair in "${runner_mode_vec[@]}"; do
            runner_file=$(echo "$pair" | awk '{print $1}')
            mode=$(echo "$pair" | awk '{print $2}')
            env_name=$(basename "$runner_file" | sed -E "s/-${PROJ_NAME}-runner\.sh//")

            if [[ $mode == "manual" ]]; then
                pid_file="$SCRIPT_DIR/pid/${PROJ_NAME}/${env_name}/$env_name-manual-patcher.pid"
                while [[ ! -f "$pid_file" ]]; do
                    echo "🕐 Waiting for manual patcher to start: $pid_file"
                    sleep 20
                done
            elif [[ $mode == "auto" ]]; then
                log_file="$SCRIPT_DIR/logs/${env_name}-${PROJ_NAME}-auto-patcher.log"
                echo "▶️ Starting: $runner_file"
                bash "$runner_file"
                sleep 20
                [[ $? -ne 0 ]] && echo "❌ Failed: $runner_file" && exit 1
                echo "✅ Done: $runner_file"
                sleep 5
            fi
        done

        sleep 40
        rm -f "$DETECTOR_SIGNAL"
        echo "📤 Signal processed and removed."

        
        AUTO_PATCHER_PID_FILE="$SCRIPT_DIR/pid/${PROJ_NAME}/${env_name}/$env_name-auto-patcher.pid"
        DUAL_PATCHER_PID_FILE="$SCRIPT_DIR/pid/${PROJ_NAME}/${env_name}/$env_name-dual-patcher.pid"
        MANUAL_PATCHER_PID_FILE="$SCRIPT_DIR/pid/${PROJ_NAME}/${env_name}/$env_name-manual-patcher.pid"

        if [[ -f "$AUTO_PATCHER_PID_FILE" ]]; then
            AUTO_PATCHER_PID=$(cat "$AUTO_PATCHER_PID_FILE")
            echo "🚫 Killing Auto Patcher: $AUTO_PATCHER_PID"
            kill "$AUTO_PATCHER_PID"
            rm -f "$AUTO_PATCHER_PID_FILE"
        fi

        if [[ -f "$DUAL_PATCHER_PID_FILE" ]]; then
            DUAL_PATCHER_PID=$(cat "$DUAL_PATCHER_PID_FILE")
            echo "🚫 Killing Dual Patcher: $DUAL_PATCHER_PID"
            kill "$DUAL_PATCHER_PID"
            rm -f "$DUAL_PATCHER_PID_FILE"
        fi

        if [[ -f "$MANUAL_PATCHER_PID_FILE" ]]; then
            MANUAL_PATCHER_PID=$(cat "$MANUAL_PATCHER_PID_FILE")
            echo "🚫 Killing Manual Patcher: $MANUAL_PATCHER_PID"
            kill "$MANUAL_PATCHER_PID"
            rm -f "$MANUAL_PATCHER_PID_FILE"
        fi
    else
        if [[ -f "$PENDING_SIGNAL" ]]; then
            echo "🚨 Pending Signal Forwarding."
            mv "$PENDING_SIGNAL" "$DETECTOR_SIGNAL"
        fi
        echo "🕵️ Still waiting... ($DETECTOR_SIGNAL not found)"
        sleep 5
    fi

done
) > "$SCRIPT_DIR/logs/$PROJ_NAME-workflow.log" 2>&1 & disown
WORKFLOW_PID=$!
echo $WORKFLOW_PID > "$SCRIPT_DIR/pid/${PROJ_NAME}/$PROJ_NAME-workflow.pid"
echo "Workflow Started (PID: $WORKFLOW_PID)"
