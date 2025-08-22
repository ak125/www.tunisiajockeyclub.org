# 🏇 Tunisia Jockey Club - Makefile
# =================================

# Variables par défaut
BACKEND_PORT=3000
FRONTEND_PORT=5173
API_BASE_URL=http://localhost:$(BACKEND_PORT)
FRONTEND_URL=http://localhost:$(FRONTEND_PORT)

.PHONY: help install dev test test-quick test-auth test-races test-full clean build deploy

# Afficher l'aide
help:
	@echo "🏇 Tunisia Jockey Club - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "📦 Setup & Installation:"
	@echo "  make install      - Install all dependencies"
	@echo "  make install-be   - Install backend dependencies"
	@echo "  make install-fe   - Install frontend dependencies"
	@echo ""
	@echo "🚀 Development:"
	@echo "  make dev          - Start both backend and frontend in dev mode"
	@echo "  make dev-be       - Start backend only"
	@echo "  make dev-fe       - Start frontend only"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test         - Run all tests"
	@echo "  make test-quick   - Run quick validation tests"
	@echo "  make test-auth    - Run authentication tests"
	@echo "  make test-races   - Run race management tests"
	@echo "  make test-perf    - Run performance tests"
	@echo ""
	@echo "🏗️  Build & Deploy:"
	@echo "  make build        - Build for production"
	@echo "  make build-be     - Build backend"
	@echo "  make build-fe     - Build frontend"
	@echo "  make deploy       - Deploy to production"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make lint         - Run code linting"
	@echo "  make format       - Format code"

# Installation des dépendances
install: install-be install-fe
	@echo "✅ All dependencies installed"

install-be:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install

install-fe:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

# Développement
# Development commands
dev-backend:
	@echo "🚀 Starting backend development server..."
	cd backend && npm run dev

dev:
	@echo "🚀 Starting Tunisia Jockey Club application..."
	cd backend && npm run dev

dev-be:
	@echo "🔧 Starting backend..."
	cd backend && npm run start:dev

dev-fe:
	@echo "🎨 Starting frontend..."
	cd frontend && npm run dev

# Tests
test: test-quick test-auth test-races
	@echo "🎉 All tests completed!"

test-quick:
	@echo "⚡ Running quick validation tests..."
	@cd tests/api && API_BASE_URL=$(API_BASE_URL) FRONTEND_URL=$(FRONTEND_URL) ./quick-test.sh

test-auth:
	@echo "🔐 Running authentication tests..."
	@cd tests/api && API_BASE_URL=$(API_BASE_URL) ./auth-tests.sh

test-races:
	@echo "🏇 Running race management tests..."
	@cd tests/api && API_BASE_URL=$(API_BASE_URL) ./race-tests.sh

test-full:
	@echo "🧪 Running complete test suite..."
	@cd tests/api && API_BASE_URL=$(API_BASE_URL) FRONTEND_URL=$(FRONTEND_URL) ./test-suite.sh

test-perf:
	@echo "⚡ Running performance tests..."
	@cd tests/api && API_BASE_URL=$(API_BASE_URL) ./performance-tests.sh

# Build
build: build-be build-fe
	@echo "✅ Build completed"

build-be:
	@echo "🏗️ Building backend..."
	cd backend && npm run build

build-fe:
	@echo "🏗️ Building frontend..."
	cd frontend && npm run build

# Déploiement
deploy: build
	@echo "🚀 Deploying to production..."
	@echo "⚠️  Make sure to configure your deployment settings"
	# Add your deployment commands here

# Maintenance
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf backend/dist
	rm -rf frontend/build
	rm -rf frontend/.vite
	rm -rf */node_modules/.vite
	@echo "✅ Clean completed"

lint:
	@echo "🔍 Running code linting..."
	cd backend && npm run lint || true
	cd frontend && npm run lint || true

format:
	@echo "💅 Formatting code..."
	cd backend && npm run format || true
	cd frontend && npm run format || true

# Utilitaires de développement
logs-be:
	@echo "📋 Backend logs (last 50 lines):"
	@tail -n 50 backend/logs/*.log 2>/dev/null || echo "No log files found"

logs-fe:
	@echo "📋 Frontend development server logs"
	# Frontend logs are typically shown in the terminal

status:
	@echo "📊 Tunisia Jockey Club Status"
	@echo "=============================="
	@echo ""
	@echo "🔧 Backend Status:"
	@curl -s $(API_BASE_URL)/health > /dev/null 2>&1 && echo "  ✅ Running on $(API_BASE_URL)" || echo "  ❌ Not responding"
	@echo ""
	@echo "🎨 Frontend Status:"
	@curl -s $(FRONTEND_URL) > /dev/null 2>&1 && echo "  ✅ Running on $(FRONTEND_URL)" || echo "  ❌ Not responding"
	@echo ""
	@echo "📁 Build Status:"
	@[ -d backend/dist ] && echo "  ✅ Backend built" || echo "  ❌ Backend not built"
	@[ -d frontend/build ] && echo "  ✅ Frontend built" || echo "  ❌ Frontend not built"

# Docker commands (si vous utilisez Docker)
docker-build:
	@echo "🐳 Building Docker images..."
	docker-compose build

docker-up:
	@echo "🐳 Starting services with Docker..."
	docker-compose up -d

docker-down:
	@echo "🐳 Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "🐳 Docker logs:"
	docker-compose logs -f

# Base de données
db-migrate:
	@echo "🗄️ Running database migrations..."
	cd backend && npm run db:migrate

db-seed:
	@echo "🌱 Seeding database..."
	cd backend && npm run db:seed

db-reset:
	@echo "🔄 Resetting database..."
	cd backend && npm run db:reset

# Surveillance
watch:
	@echo "👀 Watching for changes..."
	@echo "Use Ctrl+C to stop"
	@make -j3 watch-be watch-fe watch-tests

watch-be:
	@cd backend && npm run start:dev

watch-fe:
	@cd frontend && npm run dev

watch-tests:
	@echo "🧪 Running tests every 30 seconds..."
	@while true; do \
		sleep 30; \
		make test-quick; \
	done

# Informations sur le projet
info:
	@echo "🏇 Tunisia Jockey Club - Project Information"
	@echo "==========================================="
	@echo ""
	@echo "📁 Project Structure:"
	@echo "  backend/     - NestJS API server"
	@echo "  frontend/    - Remix frontend application"  
	@echo "  tests/api/   - cURL-based API tests"
	@echo ""
	@echo "🛠️  Technology Stack:"
	@echo "  Backend:  NestJS + Prisma + Supabase"
	@echo "  Frontend: Remix + Vite + Shadcn/ui + Tailwind"
	@echo "  Icons:    Lucide React"
	@echo "  Animation: Framer Motion"
	@echo "  State:    React Query + Zustand"
	@echo ""
	@echo "🔗 URLs:"
	@echo "  Backend:  $(API_BASE_URL)"
	@echo "  Frontend: $(FRONTEND_URL)"
	@echo ""
	@echo "🧪 Available Tests:"
	@echo "  - Quick validation tests"
	@echo "  - Authentication tests"
	@echo "  - Race management tests"
	@echo "  - Performance tests"
	@echo "  - Security tests"

# Développement avancé
dev-debug:
	@echo "🐛 Starting in debug mode..."
	@make -j2 dev-be-debug dev-fe

dev-be-debug:
	cd backend && npm run start:debug

setup-dev:
	@echo "🔧 Setting up development environment..."
	@make install
	@echo "✅ Development environment ready!"
	@echo ""
	@echo "🚀 To start developing:"
	@echo "  make dev     - Start both backend and frontend"
	@echo "  make test    - Run tests"
	@echo "  make status  - Check status"
