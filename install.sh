#!/bin/bash

set -e

# Variables
REPO_URL="https://github.com/kmr-ankitt/szare"
STORED_DIR="$HOME/.local/share/szare"
FRONTEND_DIR="$HOME/.local/share/szare/client"
BACKEND_MAIN="./cmd/szare/main.go"
APP_BINARY="szare"

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

# Check if required tools are installed
check_dependencies() {
  command -v git >/dev/null 2>&1 || error "Git is not installed. Please install Git."
  # command -v go >/dev/null 2>&1 || error "Go is not installed. Please install Go."
  command -v npm >/dev/null 2>&1 || error "npm is not installed. Please install Node.js and npm."
}

# Clone the repository
clone_repo() {
  if [ -d "$STORED_DIR" ]; then
    echo "Directory 'szare' already exists. Pulling latest changes..."
    cd $STORED_DIR && git pull && cd -
  else
    mkdir -p "$HOME/.local/share"
    cd "$HOME/.local/share"
    git clone "$REPO_URL"
  fi
}

# Set up and start the frontend
setup_frontend() {
  echo "Setting up the frontend..."
  cd $FRONTEND_DIR
  npm install
  success "Frontend dependencies installed!"
  echo "Building the frontend..."
  npm run build
  echo "Frontend built successfully!"
  cd -
}

# Start the backend
start_backend() {
  echo "Starting the backend..."
  cd szare
  ./"$APP_BINARY" &
  cd -
}

run_frontend() {
  echo "Starting the frontend..."
  cd $FRONTEND_DIR
  npm start
  cd -
}

place_backend_binary() {
  echo "Placing the backend binary..."
  cp "$HOME/.local/share/szare/$APP_BINARY" "$HOME/.local/bin/"
  success "Backend installed successfully!"
}

# Main installation process
main() {
  check_dependencies
  clone_repo
  # build_backend
  setup_frontend
  place_backend_binary
  success "Szare installed successfully!"
}

main
