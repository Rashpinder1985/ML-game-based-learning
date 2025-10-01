# ML Learning Platform Documentation

## Overview

The ML Learning Platform is a comprehensive monorepo for game-based machine learning education. It provides an interactive coding environment where students can learn programming concepts through hands-on exercises.

## Architecture

```
├── backend/          # FastAPI backend API
├── frontend/         # React+TypeScript web application
├── runner/           # Docker-based code execution service
├── infra/            # Docker Compose and infrastructure
├── docs/             # Documentation
└── content/          # Lesson content and modules
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js LTS
- Make (optional, for convenience commands)

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd "ML game based learning"
   ```

2. **Start all services:**
   ```bash
   make up
   ```
   Or manually:
   ```bash
   cd infra && docker-compose up -d
   ```

3. **Seed the database:**
   ```bash
   make seed
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - Grafana: http://localhost:3001 (admin/admin)
   - MinIO: http://localhost:9001 (minioadmin/minioadmin123)

### Development

For development with hot reloading:

```bash
# Terminal 1: Backend
make dev-backend

# Terminal 2: Frontend  
make dev-frontend

# Terminal 3: Runner
make dev-runner
```

## Services

### Backend API (`/backend`)

FastAPI application providing REST endpoints:

- **GET /api/v1/lessons** - List lessons with filtering
- **GET /api/v1/lessons/{id}** - Get specific lesson
- **POST /api/v1/submit** - Submit code for execution
- **GET /api/v1/jobs/{id}** - Get job execution status
- **GET /api/v1/progress/me** - Get user progress

**Key Features:**
- SQLAlchemy ORM with PostgreSQL
- Alembic database migrations
- Pydantic data validation
- Redis caching
- Comprehensive test suite

### Frontend (`/frontend`)

React+TypeScript web application with Monaco editor:

**Key Features:**
- Monaco code editor with syntax highlighting
- Real-time code execution
- Progress tracking
- Responsive design
- TypeScript for type safety

### Code Runner (`/runner`)

Docker-based secure code execution service:

**Key Features:**
- Multi-language support (Python, JavaScript, Java)
- Resource limits (CPU, memory, time)
- Network isolation
- Security constraints
- Execution metrics and hints

### Infrastructure (`/infra`)

Docker Compose orchestration:

**Services:**
- PostgreSQL database
- Redis cache
- MinIO object storage
- Grafana monitoring
- All application services

## API Documentation

### Authentication

Currently uses simple user IDs. In production, implement proper authentication.

### Endpoints

#### Lessons

```http
GET /api/v1/lessons?module=module1&difficulty=beginner
```

Response:
```json
[
  {
    "id": 1,
    "title": "Introduction to Python",
    "description": "Learn the basics of Python programming",
    "content": "print('Hello, World!')",
    "difficulty": "beginner",
    "module": "Module 1",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Code Submission

```http
POST /api/v1/submit
Content-Type: application/json

{
  "lesson_id": 1,
  "user_id": "user123",
  "code": "print('Hello, World!')",
  "language": "python"
}
```

Response:
```json
{
  "id": 1,
  "lesson_id": 1,
  "user_id": "user123",
  "code": "print('Hello, World!')",
  "language": "python",
  "status": "pending",
  "job_id": "uuid-here",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Job Status

```http
GET /api/v1/jobs/{job_id}
```

Response:
```json
{
  "id": "uuid-here",
  "status": "completed",
  "result": {
    "passed": true,
    "metrics": {
      "execution_time": 0.123,
      "return_code": 0
    },
    "hints": ["Great job!"],
    "logs": "Hello, World!\n"
  }
}
```

## Database Schema

### Tables

- **lessons** - Lesson content and metadata
- **submissions** - Code submissions and results
- **jobs** - Execution job tracking
- **progress** - User progress tracking

### Migrations

```bash
# Create new migration
make migrate-create message="Add new field"

# Apply migrations
make migrate
```

## Security

### Code Runner Security

- Docker container isolation
- No network access
- Resource limits (CPU, memory, time)
- Dropped capabilities
- Non-root user execution

### API Security

- CORS configuration
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- Rate limiting (to be implemented)

## Monitoring

### Grafana Dashboards

Access Grafana at http://localhost:3001 (admin/admin) for:
- Database performance metrics
- API response times
- Error rates
- Resource utilization

### Logs

```bash
# View all logs
make logs

# View specific service logs
cd infra && docker-compose logs -f api
```

## Testing

### Backend Tests

```bash
make test-backend
```

### Frontend Tests

```bash
make test-frontend
```

### All Tests

```bash
make test
```

## Deployment

### Production Considerations

1. **Environment Variables:**
   - Set secure database passwords
   - Configure CORS origins
   - Set up SSL certificates

2. **Database:**
   - Use managed PostgreSQL service
   - Set up regular backups
   - Configure connection pooling

3. **Security:**
   - Implement proper authentication
   - Add rate limiting
   - Set up monitoring and alerting

4. **Scaling:**
   - Use load balancers
   - Scale runner services horizontally
   - Implement job queues

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Check if ports 3000, 8000, 5432, 6379 are available
   - Modify ports in docker-compose.yml if needed

2. **Database connection:**
   - Ensure PostgreSQL is running and accessible
   - Check connection string in environment variables

3. **Code execution fails:**
   - Check runner service logs
   - Verify Docker is running
   - Check resource limits

### Debug Commands

```bash
# Check service status
make status

# View logs
make logs

# Restart services
make down && make up

# Clean and rebuild
make clean && make build && make up
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

[Add your license here]