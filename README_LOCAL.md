# ML Learning Platform - Local Setup

This guide shows you how to run the ML Learning Platform using local PostgreSQL instead of Docker.

## 🎮 Module 0: The Mathematical Realm

The platform now includes a **story-driven game world** where learners progress through 10 chained math challenges:

1. **🗺️ Journey Between Towns** - Distance calculation
2. **⚔️ Vector Duel** - Angle between vectors  
3. **🌉 Magic Bridge** - Perpendicular bisector
4. **🛤️ Roads & Waypoints** - Line intersections
5. **🌊 Valley of Curves** - Parabola analysis
6. **⚔️ Duel of Lines** - Angle between lines
7. **🏰 Tower Watch** - Angle of depression
8. **🔺 Triangle Forge** - Centroid calculation
9. **🔮 Circle Rune** - Parametric equations
10. **🌀 Portals of Planes** - 3D plane analysis

### Game Features
- **Hearts System**: 3 hearts, lose one on failure
- **Streak System**: Consecutive wins build combo multipliers
- **XP & Leveling**: Progressive experience system
- **Badge System**: Unlock achievements for milestones
- **AI/ML Connections**: Each challenge explains its relevance to machine learning

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
./start_local.sh
```

### Option 2: Manual Setup

#### 1. Start PostgreSQL
```bash
brew services start postgresql@15
```

#### 2. Set up Database
```bash
# Create database
createdb ml_learning

# Set up schema and sample data
python3 setup_db_simple.py
```

#### 3. Start Backend
```bash
cd backend
python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 4. Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
```

## 🌐 Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Module 0 Game**: Click "🎮 Module 0: Math Adventure" in the main navigation

## 📊 Database Schema

The platform uses the following PostgreSQL tables:

- **lessons**: Course content and metadata
- **users**: User accounts and authentication
- **submissions**: Code submissions and results
- **jobs**: Background job processing
- **progress**: User progress tracking

## 🎯 Learning Outcomes

Module 0 teaches foundational math concepts that seed AI/ML intuition:

- **Distance/angles** → similarity, cosine
- **Symmetry/lines** → decision boundaries, bias
- **Quadratic vertex** → optimization minima
- **Planes/normals** → hyperplanes, margins
- **Centroid** → averages, cluster centers
- **Parametric circle** → trajectories

## 🛠️ Development

### Backend (FastAPI)
- **Location**: `backend/`
- **Port**: 8000
- **API Docs**: http://localhost:8000/docs

### Frontend (React + TypeScript)
- **Location**: `frontend/`
- **Port**: 3000
- **Build**: `npm run build`
- **Dev Server**: `npm run dev`

### Database
- **Type**: PostgreSQL 15
- **Database**: `ml_learning`
- **User**: `rashpinderkaur` (your system user)

## 🎮 Game Mechanics

### Challenge Structure
Each challenge includes:
- **Narrative hook** with characters and story
- **Visual elements** (grids, diagrams, coordinate maps)
- **Interactive widgets** for input and feedback
- **Tiered hints** (3 progressive hints with XP penalties)
- **AI/ML connections** explaining relevance
- **Rewards system** with XP, badges, and achievements

### Progression System
- **Hearts**: Start with 3, lose one on failure
- **Streaks**: Build multipliers for consecutive wins
- **XP**: Earn experience points for completion
- **Badges**: Unlock achievements for milestones
- **Levels**: Progress through levels based on XP

### Failure Handling
- **Graceful failures**: Friendly coaching messages
- **Hint system**: Progressive assistance
- **Retry mechanism**: Learn from mistakes
- **No hard stops**: Continuous learning journey

## 🔧 Troubleshooting

### PostgreSQL Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@15

# Check database exists
psql -l | grep ml_learning
```

### Port Conflicts
- **Backend**: Change port in `backend/app/main.py`
- **Frontend**: Change port in `frontend/vite.config.ts`

### Database Reset
```bash
# Drop and recreate database
dropdb ml_learning
createdb ml_learning
python3 setup_db_simple.py
```

## 🎉 Success!

You now have a fully functional ML Learning Platform with:
- ✅ Local PostgreSQL database
- ✅ FastAPI backend with REST endpoints
- ✅ React frontend with Module 0 game
- ✅ Story-driven math challenges
- ✅ Progressive learning system
- ✅ AI/ML connection explanations

**Ready to start your mathematical adventure!** 🧙‍♂️⚔️📐