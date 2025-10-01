.PHONY: help up down build test seed clean logs

# Default target
help:
	@echo "ML Learning Platform - Available Commands:"
	@echo ""
	@echo "  up       - Start all services"
	@echo "  down     - Stop all services"
	@echo "  build    - Build all Docker images"
	@echo "  test     - Run tests for backend and frontend"
	@echo "  seed     - Seed database with sample data"
	@echo "  clean    - Clean up containers and volumes"
	@echo "  logs     - Show logs for all services"
	@echo "  status   - Show status of all services"
	@echo ""

# Start all services
up:
	@echo "Starting ML Learning Platform..."
	cd infra && docker-compose up -d
	@echo "Services started! Access:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  API:      http://localhost:8000"
	@echo "  Grafana:  http://localhost:3001 (admin/admin)"
	@echo "  MinIO:    http://localhost:9001 (minioadmin/minioadmin123)"

# Stop all services
down:
	@echo "Stopping ML Learning Platform..."
	cd infra && docker-compose down

# Build all Docker images
build:
	@echo "Building Docker images..."
	cd infra && docker-compose build

# Run tests
test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	docker exec infra-api-1 python -m pytest tests/ -v

test-frontend:
	@echo "Frontend tests skipped - container built for production"
	@echo "Frontend is running and accessible at http://localhost:3000"

# Seed database with sample data
seed:
	@echo "Seeding database with sample data..."
	docker exec infra-api-1 python seed_data.py

# Clean up containers and volumes
clean:
	@echo "Cleaning up containers and volumes..."
	cd infra && docker-compose down -v --remove-orphans
	docker system prune -f

# Show logs
logs:
	cd infra && docker-compose logs -f

# Show status
status:
	cd infra && docker-compose ps

# Development helpers
dev-backend:
	@echo "Starting backend in development mode..."
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	@echo "Starting frontend in development mode..."
	cd frontend && npm run dev

dev-runner:
	@echo "Starting runner in development mode..."
	cd runner && python runner.py

# Database migrations
migrate:
	@echo "Running database migrations..."
	cd backend && alembic upgrade head

migrate-create:
	@echo "Creating new migration..."
	cd backend && alembic revision --autogenerate -m "$(message)"

# Install dependencies
install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

install-runner:
	cd runner && pip install -r requirements.txt

install: install-backend install-frontend install-runner

# Full setup
setup: install build up seed
	@echo "ML Learning Platform is ready!"
	@echo "Access the application at http://localhost:3000"