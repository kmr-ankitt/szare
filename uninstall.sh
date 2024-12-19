#!/bin/bash

set -e

REPO_DIR="$HOME/.local/szare"
APP_BINARY="szare"
BINARY_PATH="/usr/bin/$APP_BINARY"

# Colors for pretty output
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # No color


# Function to print success messages
success() {
  echo -e "${GREEN}$1${NC}"
}

# Function to print error messages and exit
error() {
  echo -e "${RED}$1${NC}"
  exit 1
}

remove_binary() {
  echo "Removing the binary..."
  sudo rm $BINARY_PATH
  success "Binary removed successfully!"
}

remove_repo() {
  echo "Removing the repo..."
  rm -rf $REPO_DIR
  success "Repo removed successfully!"
}

main() {
  remove_binary
  remove_repo
  success "Uninstallation complete!"
}

main
