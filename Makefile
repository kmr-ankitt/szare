# Variables
FRONTEND_DIR := client
BACKEND_MAIN := ./cmd/szare/main.go

# Targets
.PHONY: frontend backend run clean 

# Build both frontend and backend
build: frontend backend

# Build the frontend
frontend:
	@echo "Building the frontend..."
	cd $(FRONTEND_DIR) && npm install && npm run build

# Build the backend
backend:
	@echo "Building the backend..."
	go build -o szare $(BACKEND_MAIN)

# Run the application (starts frontend and backend)
run: frontend backend
	@echo "Starting the application..."
	# Start the frontend in a separate process
	cd $(FRONTEND_DIR) && npm start &
	# Start the backend
	./szare

# Clean up build artifacts
clean:
	@echo "Cleaning up..."
	rm -f szare
	cd $(FRONTEND_DIR) && rm -rf node_modules .next out
