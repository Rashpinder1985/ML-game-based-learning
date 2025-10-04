# 🎓 ML Learning Platform

A comprehensive, open-source machine learning education platform that combines interactive lessons, coding challenges, and gamified learning experiences.

## 🌟 Features

### 🎮 Gamified Learning
- **Module 0: Math Adventure** - Story-driven mathematical challenges that introduce AI/ML concepts
- **XP & Leveling System** - Earn experience points and level up as you learn
- **Badge System** - Unlock achievements for completing challenges
- **Streak Multipliers** - Build consecutive wins for bonus rewards
- **Hearts System** - Manage your learning attempts with a lives-based system

### 🔐 User Authentication & Progress Tracking
- **Email-based Registration** - Secure user accounts with JWT authentication
- **Progress Analytics** - Track learning progress, time spent, and completion rates
- **User Dashboard** - Personalized learning statistics and achievements
- **Leaderboards** - Compete with other learners

### 💻 Interactive Coding Environment
- **Monaco Editor** - Professional code editor with syntax highlighting
- **Python Execution** - Run code directly in the browser
- **Real-time Feedback** - Instant results and error messages
- **Data Visualizations** - Interactive charts and graphs for ML concepts

### 📚 Educational Content
- **Structured Lessons** - Progressive learning modules from beginner to advanced
- **AI/ML Focus** - Mathematics and concepts relevant to machine learning
- **Story-driven Challenges** - Engaging narratives that make learning fun
- **Comprehensive Coverage** - From basic math to advanced ML algorithms

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+ (LTS)
- PostgreSQL 15+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ml-learning-platform.git
cd ml-learning-platform
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup
```bash
# Start PostgreSQL (if not already running)
# macOS with Homebrew:
brew services start postgresql

# Create database
createdb ml_learning

# Run database setup
python3 setup_database_with_auth.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Platform
```bash
# Option 1: Use the startup script
chmod +x start_local.sh
./start_local.sh

# Option 2: Start manually
# Terminal 1 (Backend)
cd backend
python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

### 6. Access the Platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:3000/dashboard (after login)

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Documentation**: Auto-generated Swagger/OpenAPI docs
- **Analytics**: User engagement and progress tracking

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Code Editor**: Monaco Editor (VS Code engine)
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Context for authentication and user state

### Database Schema
- **Users**: Authentication, profiles, and game statistics
- **Lessons**: Educational content and metadata
- **Progress**: User progress tracking per lesson
- **Analytics**: Platform usage statistics
- **Module0**: Game-specific progress and achievements

## 📊 Analytics & Tracking

The platform tracks comprehensive analytics for both users and administrators:

### User Analytics
- Session duration and frequency
- Challenge completion rates
- Learning progress over time
- XP and level progression
- Badge achievements

### Platform Analytics
- Total registered users
- Active users per day
- New registrations
- Challenge completions
- Code submissions
- Average session duration

## 🎮 Module 0: Math Adventure

A unique gamified learning experience that introduces mathematical concepts through story-driven challenges:

### Challenge Progression
1. **Journey Between Towns** - Distance calculations
2. **Vector Duel** - Vector mathematics
3. **Magic Bridge** - Perpendicular bisectors
4. **Roads & Waypoints** - Linear equations
5. **Valley of Curves** - Parabola mathematics
6. **Duel of Lines** - Line intersections
7. **Tower Watch** - Trigonometric functions
8. **Triangle Forge** - Triangle properties
9. **Circle Rune** - Circle mathematics
10. **Portals of Planes** - 3D plane equations

### Game Mechanics
- **Hearts System**: 3 lives, lose one on failure
- **Streak Multipliers**: Consecutive wins build combo bonuses
- **XP Rewards**: Earn experience for completing challenges
- **Badge System**: Unlock achievements for milestones
- **Progressive Unlocking**: Complete challenges to unlock new ones

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ml_learning
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Database Configuration
The platform uses PostgreSQL with the following default settings:
- Database: `ml_learning`
- Port: `5432`
- Authentication: Local user authentication

## 📈 Deployment

### Production Deployment
1. **Database**: Set up PostgreSQL server
2. **Backend**: Deploy FastAPI with Gunicorn/Uvicorn
3. **Frontend**: Build React app and serve with Nginx
4. **SSL**: Configure HTTPS certificates
5. **Environment**: Set production environment variables

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **TypeScript**: Use strict mode and proper typing
- **Commits**: Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's code editor
- **FastAPI** - Modern Python web framework
- **React** - Facebook's UI library
- **PostgreSQL** - Robust relational database
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/ml-learning-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/ml-learning-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ml-learning-platform/discussions)

## 🎯 Roadmap

### Upcoming Features
- [ ] Additional learning modules
- [ ] Collaborative coding challenges
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with external ML libraries
- [ ] Multi-language support
- [ ] Offline mode support

---

**Made with ❤️ for the ML learning community**

*Transform the way people learn machine learning through interactive, gamified experiences.*