#!/bin/bash

set -e

# Variables
REPO_URL="https://github.com/kmr-ankitt/szare"
FRONTEND_DIR="client"
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
  command -v go >/dev/null 2>&1 || error "Go is not installed. Please install Go."
  command -v npm >/dev/null 2>&1 || error "npm is not installed. Please install Node.js and npm."
}

# Clone the repository
clone_repo() {
  if [ -d "szare" ]; then
    echo "Directory 'szare' already exists. Pulling latest changes..."
    cd szare && git pull && cd ..
  else
    git clone "$REPO_URL"
  fi
}

# Build the backend
build_backend() {
  echo "Building the backend..."
  cd szare
  go build -o "$APP_BINARY" "$BACKEND_MAIN"
  success "Backend built successfully!"
  cd ..
}

# Set up and start the frontend
setup_frontend() {
  echo "Setting up the frontend..."
  cd "szare/$FRONTEND_DIR"
  npm install
  success "Frontend dependencies installed!"
  echo "Starting the frontend server..."
  npm run build & npm start &
  cd ../..
}

# Start the backend
start_backend() {
  echo "Starting the backend..."
  cd szare
  ./"$APP_BINARY" &
  cd ..
}

# Main installation process
main() {
  check_dependencies
  clone_repo
  build_backend
  setup_frontend
  start_backend
  success "Szare is up and running!"
  # echo "Access the frontend at http://localhost:3000"
}

main

