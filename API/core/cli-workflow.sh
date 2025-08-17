#!/bin/bash

read -p "What is the Project Name : " PROJ_NAME

echo "=================================================================================================================="
echo "=================================================================================================================="
echo "=================================================================================================================="

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

cd $SCRIPT_DIR

$SCRIPT_DIR/watcher-genrator.sh

echo "=================================================================================================================="
echo "=================================================================================================================="
echo "=================================================================================================================="


read -p "👉 Enter the Docker Image name again for running watcher : " DOCKER_IMAGE

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

nohup $WATCHER_FILE > $SCRIPT_DIR/logs/$LOG_FILE_LOCATION.log 2>&1 &
echo "Watcher Started ! Logs at ${SCRIPT_DIR}/logs/${LOG_FILE_LOCATION}.log"

TAG_FILE="\$SCRIPT_DIR/tags/list/${PROJECT_NAME}-tags.txt"
LATEST_FILE="\$SCRIPT_DIR/tags/latest/${PROJECT_NAME}-latest-tag.txt"

echo "=================================================================================================================="
echo "=================================================================================================================="
echo "=================================================================================================================="

$SCRIPT_DIR/environment-genrator.sh

read -p "👉 Enter the Patcher Name again for running runners : " PATCHER_NAME

echo "=================================================================================================================="
echo "=================================================================================================================="
echo "=================================================================================================================="


ENV_FOLDER="$SCRIPT_DIR/env/$PATCHER_NAME/"

ENV_COUNT=$(find "$ENV_FOLDER" -type f -name "*.env.sh" | wc -l)
echo "Total number of env files: $ENV_COUNT"

# ENV_FOLDER=env/Task

ENV_NAMES=$(find "$ENV_FOLDER" -type f -name "*.env.sh" -exec basename {} -$PATCHER_NAME.env.sh \;)

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
for ((num=0; num<$ENV_COUNT; num++)); do
    read -p "👉 Enter your Environment Number : " ENV_SUB_NUM
    selected_envs+=("${env_map[$ENV_SUB_NUM]}")
done

echo "Selected environments:"
for env in "${selected_envs[@]}"; do
    echo "$env"
done

# runner_files=()

# for env in "${selected_envs[@]}"; do
#     # Search for runner scripts for this environment in all runner types (auto/manual/dual)
#     found_runners=$(find "$SCRIPT_DIR/runners/$PATCHER_NAME" -type f -name "${env}-${PATCHER_NAME}-runner.sh")
#     for runner in $found_runners; do
#         runner_files+=("$runner")
#     done
# done

runner_mode_vec=()

for env in "${selected_envs[@]}"; do
    runner_file_auto="$SCRIPT_DIR/runners/$PATCHER_NAME/auto/${env}-${PATCHER_NAME}-runner.sh"
    runner_file_manual="$SCRIPT_DIR/runners/$PATCHER_NAME/manual/${env}-${PATCHER_NAME}-runner.sh"

    if [[ -f "$runner_file_auto" ]]; then
        runner_mode_vec+=("$runner_file_auto auto")
    elif [[ -f "$runner_file_manual" ]]; then
        runner_mode_vec+=("$runner_file_manual manual")
    else
        echo "Runner not found for environment: $env"
    fi
done

echo "Starting runners sequentially..."
(
DETECTOR_SIGNAL="$SCRIPT_DIR/detector/${WATCHER_NAME}-new-tag"
echo "📡 Finding new tags. "

while true; do
    if [[ -f "$DETECTOR_SIGNAL" ]]; then
        echo "🚨 Signal detected. Proceeding with patchers..."

        for pair in "${runner_mode_vec[@]}"; do
            runner_file=$(echo "$pair" | awk '{print $1}')
            mode=$(echo "$pair" | awk '{print $2}')
            env_name=$(basename "$runner_file" | sed -E "s/-${PATCHER_NAME}-runner\.sh//")

            if [[ $mode == "manual" ]]; then
                log_file="$SCRIPT_DIR/logs/${env_name}-${PATCHER_NAME}-manual-patcher.log"
                while [[ ! -f "$log_file" ]]; do
                    echo "🕐 Waiting for manual patcher to start: $log_file"
                    sleep 2
                done
            elif [[ $mode == "auto" ]]; then
                log_file="$SCRIPT_DIR/logs/${env_name}-${PATCHER_NAME}-auto-patcher.log"
                echo "▶️ Starting: $runner_file"
                bash "$runner_file"
                [[ $? -ne 0 ]] && echo "❌ Failed: $runner_file" && exit 1
                echo "✅ Done: $runner_file"
                sleep 5
            fi
        done

        sleep 30
        rm -f "$DETECTOR_SIGNAL"

        echo "📤 Signal processed and removed. Exiting."

        # pkill -f $WATCHER_FILE
        pkill -f $SCRIPT_DIR/patcher/auto-patcher.sh
        pkill -f $SCRIPT_DIR/patcher/manual-patcher.sh
    else
        echo "🕵️ Still waiting... ($DETECTOR_SIGNAL not found)"
        sleep 5
    fi
done
) > "$SCRIPT_DIR/logs/$PROJ_NAME-workflow.log" 2>&1 & disown
