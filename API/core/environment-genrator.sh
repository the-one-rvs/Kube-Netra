#!/bin/bash

ENV_DETAILS=$1
NUM_ENV=$2
PROJ_NAME=$3
DOCKER_IMAGE=$4
# echo $(find / -type d -name "Kube-Netra" 2>/dev/null)
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

mkdir -p $SCRIPT_DIR/env/$PROJ_NAME

# echo "🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥"
# read -p "👉 Enter the GITHUB PAT with edit access to repo : " GITHUB_PAT
# read -p "👉  Enter GITHUB Username : " GITHUB_USERNAME

count=1
while [ $count -le $NUM_ENV ]; do
  echo "🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥"
  echo "🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥"
  echo "🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥🖥"
 
  # read -p "👉 Enter name for environment $count: " ENV_NAME
  ENV_NAME=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].environmentName")
  GIT_REPO=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].gitRepo")
  HELM_VALUES_PATH=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].helmValuePath")
  MODE=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].mode")
  BRANCH=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].branch")
  GITHUB_PAT=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].githubPAT")
  GITHUB_USERNAME=$(echo "$ENV_DETAILS" | jq -r ".environments[$((count-1))].githubUsername")

  # echo "👉 Environment Name: $ENV_NAME"
  # echo "👉 Git Repo: $GIT_REPO"
  # echo "👉 Helm Values Path: $HELM_VALUES_PATH"
  # echo "👉 Mode: $MODE"
  # echo "👉 Branch: $BRANCH"
  # echo "👉 GITHUB_PAT: $GITHUB_PAT"
  # echo "👉 GITHUB_USERNAME: $GITHUB_USERNAME"


  mkdir -p "$SCRIPT_DIR/pid/${PROJ_NAME}/${ENV_NAME}"


  ENV_FILE="$SCRIPT_DIR/env/$PROJ_NAME/${ENV_NAME}-${PROJ_NAME}.env.sh"

  # Get Inputs
  # read -p "👉 Enter the DOCKER IMAGE : " DOCKER_IMAGE
  # read -p "👉 Enter the GIT REPO : " GIT_REPO
  # read -p "👉 Enter the HELM VALUES PATH : " HELM_VALUES_PATH
  # read -p "👉 Enter the MODE : (auto/manual) " MODE
  # read -p "👉 Enter the BRANCH : " BRANCH
  WATCHER_NAME=$(echo "$DOCKER_IMAGE" | sed 's/\//-/g')
  # Create the environment file
  cat << EOF > "$ENV_FILE"
#!/bin/bash
# Kube-Netra $ENV_NAME Environment Variables
DOCKER_IMAGE="$DOCKER_IMAGE"
GIT_REPO="$GIT_REPO"
HELM_VALUES_PATH="$HELM_VALUES_PATH"
MODE="$MODE"
BRANCH="$BRANCH"
TAGS_PATH="$SCRIPT_DIR/tags/list/$WATCHER_NAME-tags.txt"
LATEST_TAG_PATH="$SCRIPT_DIR/tags/latest/$WATCHER_NAME-latest-tag.txt"
GITHUB_PAT="$GITHUB_PAT"
GITHUB_USERNAME="$GITHUB_USERNAME"
EOF

  chmod +x "$ENV_FILE"
   # Create Runner Scripts
  if [ "$MODE" == "auto" ]; then
    mkdir -p "$SCRIPT_DIR/runners/${PROJ_NAME}/auto"

    RUNNER_FILE="$SCRIPT_DIR/runners/${PROJ_NAME}/auto/${ENV_NAME}-${PROJ_NAME}-runner.sh"

    cat << EOF > "$RUNNER_FILE"
#!/bin/bash
# Runner for ${ENV_NAME}-${PROJ_NAME}
mkdir -p $SCRIPT_DIR/logs
nohup "$SCRIPT_DIR/patcher/auto-patcher.sh" "$ENV_FILE" \
    > "$SCRIPT_DIR/logs/${ENV_NAME}-${PROJ_NAME}-auto-patcher.log" 2>&1 &
AUTO_PATCHER_PID=\$!
echo \$AUTO_PATCHER_PID > "$SCRIPT_DIR/pid/${PROJ_NAME}/${ENV_NAME}/$ENV_NAME-auto-patcher.pid"
EOF
    chmod +x "$RUNNER_FILE"
    sleep 4
    # "$RUNNER_FILE"

  else
    mkdir -p "$SCRIPT_DIR/runners/${PROJ_NAME}/manual"

    RUNNER_FILE="$SCRIPT_DIR/runners/${PROJ_NAME}/manual/${ENV_NAME}-${PROJ_NAME}-runner.sh"

    cat << EOF > "$RUNNER_FILE"
#!/bin/bash
# Runner for ${ENV_NAME}-${PROJ_NAME}
mkdir -p $SCRIPT_DIR/logs
nohup "$SCRIPT_DIR/patcher/manual-patcher.sh" "$ENV_FILE" \
    > "$SCRIPT_DIR/logs/${ENV_NAME}-${PROJ_NAME}-manual-patcher.log" 2>&1 &
MANUAL_PATCHER_PID=\$!
echo \$MANUAL_PATCHER_PID > "$SCRIPT_DIR/pid/${PROJ_NAME}/${ENV_NAME}/$ENV_NAME-manual-patcher.pid"
EOF
    chmod +x "$RUNNER_FILE"
  fi
  mkdir -p "$SCRIPT_DIR/runners/${PROJ_NAME}/dual"
  DUAL_RUNNER_FILE="$SCRIPT_DIR/runners/${PROJ_NAME}/dual/${ENV_NAME}-${PROJ_NAME}-runner.sh"
  cat << EOF > "$DUAL_RUNNER_FILE"
#!/bin/bash
# Runner for ${ENV_NAME}-${PROJ_NAME}
mkdir -p $SCRIPT_DIR/logs
nohup "$SCRIPT_DIR/patcher/dual-patcher.sh" "$ENV_FILE" \
    > "$SCRIPT_DIR/logs/${ENV_NAME}-${PROJ_NAME}-dual-patcher.log" 2>&1 &
DUAL_PATCHER_PID=\$!
echo \$DUAL_PATCHER_PID > "$SCRIPT_DIR/pid/${PROJ_NAME}/${ENV_NAME}/$ENV_NAME-dual-patcher.pid"
EOF
  chmod +x "$DUAL_RUNNER_FILE"

  count=$((count + 1))
done

echo "✅ All environment files and runner scripts created successfully."

