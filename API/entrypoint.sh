#!/bin/sh
set -e

# Git config from env vars
if [ -n "$GIT_USER_NAME" ] && [ -n "$GIT_USER_EMAIL" ]; then
  git config --global user.name "$GIT_USER_NAME"
  git config --global user.email "$GIT_USER_EMAIL"
  echo "✅ Git configured: $GIT_USER_NAME <$GIT_USER_EMAIL>"
else
  echo "⚠️  Git user.name and user.email not set. Skipping git config."
fi

# Ab control CMD ko pass kar do (jo Dockerfile me diya h ya run-time pe override hoga)
exec "$@"
