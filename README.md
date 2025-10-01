# ML Learning Platform

A comprehensive monorepo for game-based machine learning education with interactive coding exercises.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js LTS (18 or newer)
- PostgreSQL 14+ (local install or managed service)
- Redis (optional, only needed for advanced features)
- Docker & Docker Compose (optional, for container workflow)

### Environment Variables
Copy the sample env files and adjust values for your machine:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with your Postgres/Redis credentials. The frontend `.env` controls the API base URL (`http://localhost:8002` for local development).

### Setup Commands (Docker workflow)

```bash
# 1. Start all services
make up

# 2. Seed database with sample data
make seed

# 3. Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000
# Grafana: http://localhost:3001 (admin/admin)
```

### Manual Local Setup (without Docker)

```bash
# 1. Ensure Postgres is running (example uses Homebrew services)
brew services start postgresql@14

# 2. Seed the database
psql -U <your-user> -f infra/init.sql postgres

# 3. Create a virtual environment and install backend deps
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# 4. Install frontend dependencies
cd frontend && npm install && cd ..

# 5. Start the backend API on a free port (e.g., 8002)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8002

# 6. In a new terminal start the frontend (Vite auto-selects a port)
cd frontend
npm run dev
```

> **Tip:** If ports 8000/8001 are already taken (Docker Desktop often uses them), start the backend on another port (e.g., `8002`) and update `frontend/.env` to match.

### Authentication

- Register a user: `POST /api/v1/auth/register` (JSON body `{ "email": "you@example.com", "password": "...", "full_name": "Optional" }`).
- Log in: `POST /api/v1/auth/login/json` to receive a bearer token, or use form data against `/api/v1/auth/login`.
- Attach the token to subsequent requests via the `Authorization: Bearer <token>` header.
- The `/api/v1/auth/me` endpoint returns the current user profile.

The frontend stores the token in `localStorage` and automatically sends it with API calls. Signing out clears the token.

_Note: running `infra/init.sql` will reset auth-related tables (users, submissions, progress). Re-register accounts after reseeding._


### Development Commands

```bash
# Install dependencies
make install

# Run tests
make test

# Development with hot reload
make dev-backend    # Terminal 1
make dev-frontend   # Terminal 2
make dev-runner     # Terminal 3

# Database migrations
make migrate

# Clean up
make clean
```

## 📁 Project Structure

```
ML game based learning/
├── backend/                 # FastAPI backend API
│   ├── app/
│   │   ├── api/routes/      # API endpoints
│   │   ├── core/           # Configuration & database
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # Database migrations
│   ├── tests/              # Test suite
│   └── requirements.txt
├── frontend/               # React+TypeScript web app
│   ├── src/
│   │   ├── services/       # API client
│   │   └── types.ts        # TypeScript types
│   └── package.json
├── runner/                 # Docker-based code execution
│   ├── runner.py           # FastAPI runner service
│   └── Dockerfile
├── infra/                  # Infrastructure & Docker Compose
│   ├── docker-compose.yml
│   └── grafana/            # Monitoring setup
├── docs/                   # Documentation
│   ├── README.md
│   └── authoring-guide.md
├── content/                # Lesson content
│   └── module1/            # Example lesson bundle
└── Makefile               # Build automation
```

## 🛠️ Build and Validation

### Local Development Setup

```bash
# 1. Install Python dependencies
cd backend && pip install -r requirements.txt
cd ../runner && pip install -r requirements.txt

# 2. Install Node.js dependencies
cd ../frontend && npm install

# 3. Start services
cd ../infra && docker-compose up -d

# 4. Run database migrations
cd ../backend && alembic upgrade head

# 5. Seed database
cd .. && make seed
```

### Validation Commands

```bash
# Test backend API
cd backend && python -m pytest tests/ -v

# Test frontend
cd frontend && npm run type-check && npm run lint

# Test code runner
curl -X POST "http://localhost:8001/execute" \
  -H "Content-Type: application/json" \
  -d '{"job_id": "test", "code": "print(\"Hello, World!\")", "language": "python"}'

# Check all services
make status
```

### Production Build

```bash
# Build all Docker images
make build

# Start production services
make up

# Verify services
curl http://localhost:8000/health
curl http://localhost:8001/health
```

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ml_learning
REDIS_URL=redis://localhost:6379
RUNNER_URL=http://runner:8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend (.env)
VITE_API_URL=http://localhost:8000
```

### Service Ports

- Frontend: 3000
- Backend API: 8000
- Code Runner: 8001
- PostgreSQL: 5432
- Redis: 6379
- MinIO: 9000 (console: 9001)
- Grafana: 3001

## 📚 API Documentation

### Core Endpoints

- `GET /api/v1/lessons` - List lessons
- `GET /api/v1/lessons/{id}` - Get lesson details
- `POST /api/v1/submit` - Submit code for execution
- `GET /api/v1/jobs/{id}` - Get execution status
- `GET /api/v1/progress/me` - Get user progress

### Example Usage

```bash
# Get lessons
curl http://localhost:8000/api/v1/lessons

# Submit code
curl -X POST http://localhost:8000/api/v1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_id": 1,
    "user_id": "student123",
    "code": "print(\"Hello, World!\")",
    "language": "python"
  }'
```

## 🎯 Features

### Backend (FastAPI)
- ✅ RESTful API with automatic documentation
- ✅ SQLAlchemy ORM with PostgreSQL
- ✅ Alembic database migrations
- ✅ Pydantic data validation
- ✅ Redis caching
- ✅ Comprehensive test suite

### Frontend (React+TypeScript)
- ✅ Monaco code editor with syntax highlighting
- ✅ Real-time code execution
- ✅ Progress tracking
- ✅ Responsive design
- ✅ TypeScript for type safety

### Code Runner (Docker)
- ✅ Multi-language support (Python, JavaScript, Java)
- ✅ Resource limits (CPU, memory, time)
- ✅ Network isolation
- ✅ Security constraints
- ✅ Execution metrics and hints

### Infrastructure
- ✅ Docker Compose orchestration
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ MinIO object storage
- ✅ Grafana monitoring

## 🧪 Testing

```bash
# Run all tests
make test

# Backend tests only
make test-backend

# Frontend tests only
make test-frontend

# Integration tests
cd infra && docker-compose up -d
# Run tests against running services
```

## 📖 Documentation

- [Main Documentation](docs/README.md)
- [Lesson Authoring Guide](docs/authoring-guide.md)
- [Module 1 Content](content/module1/README.md)

## 🔒 Security

- Docker container isolation for code execution
- No network access for user code
- Resource limits (CPU, memory, time)
- Dropped capabilities
- Non-root user execution

## 🚀 Deployment

### Production Checklist

1. Set secure environment variables
2. Configure SSL certificates
3. Set up managed database
4. Implement proper authentication
5. Add rate limiting
6. Set up monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request



**Ready to start learning?** Run `make up` and visit http://localhost:3000!
