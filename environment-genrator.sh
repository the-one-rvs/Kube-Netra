#!/bin/bash

read -p "Enter the Patcher-Name: " PATCHER_NAME 
# echo $(find / -type d -name "Kube-Netra" 2>/dev/null)
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

mkdir -p $SCRIPT_DIR/env/$PATCHER_NAME

read -p "How many Environments do you want? " NUMBER
count=1
while [ $count -le $NUMBER ]; do
  read -p "Enter name for environment $count: " ENV_NAME
  ENV_FILE="$SCRIPT_DIR/env/$PATCHER_NAME/${ENV_NAME}-${PATCHER_NAME}.env.sh"

  # Get Inputs
  read -p "Enter the DOCKER IMAGE : " DOCKER_IMAGE
  read -p "Enter the GIT REPO : " GIT_REPO
  read -p "Enter the HELM VALUES PATH : " HELM_VALUES_PATH
  read -p "Enter the MODE : (auto/manual) " MODE
  read -p "Enter the BRANCH : " BRANCH
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
EOF

  chmod +x "$ENV_FILE"
   # Create Runner Scripts
  if [ "$MODE" == "auto" ]; then
    mkdir -p "$SCRIPT_DIR/runners/${PATCHER_NAME}/auto"

    RUNNER_FILE="$SCRIPT_DIR/runners/${PATCHER_NAME}/auto/${ENV_NAME}-${PATCHER_NAME}-runner.sh"

    cat << EOF > "$RUNNER_FILE"
#!/bin/bash
# Runner for ${ENV_NAME}-${PATCHER_NAME}
"$SCRIPT_DIR/patcher/auto-patcher.sh" "$ENV_FILE"
EOF
    chmod +x "$RUNNER_FILE"
    sleep 10
    "$RUNNER_FILE"

  else
    mkdir -p "$SCRIPT_DIR/runners/${PATCHER_NAME}/manual"

    RUNNER_FILE="$SCRIPT_DIR/runners/${PATCHER_NAME}/manual/${ENV_NAME}-${PATCHER_NAME}-runner.sh"

    cat << EOF > "$RUNNER_FILE"
#!/bin/bash
# Runner for ${ENV_NAME}-${PATCHER_NAME}
"$SCRIPT_DIR/patcher/manual-patcher.sh" "$ENV_FILE"
EOF
    chmod +x "$RUNNER_FILE"
  fi
  mkdir -p "$SCRIPT_DIR/runners/${PATCHER_NAME}/dual"
  DUAL_RUNNER_FILE="$SCRIPT_DIR/runners/${PATCHER_NAME}/dual/${ENV_NAME}-${PATCHER_NAME}-runner.sh"
  cat << EOF > "$DUAL_RUNNER_FILE"
#!/bin/bash
# Runner for ${ENV_NAME}-${PATCHER_NAME}
"$SCRIPT_DIR/patcher/dual-patcher.sh" "$ENV_FILE"
EOF
  chmod +x "$RUNNER_FILE"

  count=$((count + 1))
done

echo "✅ All environment files and runner scripts created successfully."

