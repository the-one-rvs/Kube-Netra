#!/bin/bash

echo "🚀 Installing Kube-Netra CLI..."

# Make kube-netra script executable
chmod +x kube-netra
chmod +x cli-workflow.sh
chmod +x environment-genrator.sh
chmod +x watcher-genrator.sh

# Make all patcher scripts executable
chmod +x patcher/*.sh

# Create symbolic link
sudo ln -sf "$(pwd)/kube-netra" /usr/local/bin/kube-netra

# git config credential.helper store
# git credential-store --file .git-credentials store
git config credential.helper "store --file=.git-credentials"


# Verify installation
if command -v kube-netra &> /dev/null; then
    echo "✅ Kube-Netra CLI installed successfully!"
    echo "🎯 Try 'kube-netra --help' to get started"
else
    echo "❌ Installation failed"
    exit 1
fi