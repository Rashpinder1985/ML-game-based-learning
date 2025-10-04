# Contributing to ML Learning Platform

Thank you for your interest in contributing to the ML Learning Platform! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions
- **Bug Reports** - Report issues and bugs
- **Feature Requests** - Suggest new features or improvements
- **Code Contributions** - Submit code changes and improvements
- **Documentation** - Improve or add documentation
- **Testing** - Add tests or improve test coverage
- **Design** - UI/UX improvements and new designs

## 🚀 Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/ml-learning-platform.git
cd ml-learning-platform
```

### 2. Set Up Development Environment
```bash
# Backend setup
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# Frontend setup
cd ../frontend
npm install
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/your-bug-fix
```

## 📋 Development Guidelines

### Code Style

#### Python (Backend)
- Follow [PEP 8](https://pep8.org/) style guidelines
- Use type hints for function parameters and return values
- Maximum line length: 88 characters (Black formatter)
- Use meaningful variable and function names

```python
def calculate_user_xp(user_id: int, challenge_id: int) -> int:
    """Calculate XP earned by user for completing a challenge."""
    # Implementation here
    pass
```

#### TypeScript/React (Frontend)
- Use TypeScript strict mode
- Follow ESLint configuration
- Use functional components with hooks
- Prefer arrow functions for components

```typescript
interface UserProps {
  userId: number;
  onUpdate: (user: User) => void;
}

const UserComponent: React.FC<UserProps> = ({ userId, onUpdate }) => {
  // Component implementation
};
```

### Git Commit Messages
Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add user authentication system
fix: resolve challenge completion bug
docs: update API documentation
test: add unit tests for auth service
refactor: simplify user dashboard component
```

### Testing
- Write tests for new features
- Ensure existing tests pass
- Aim for >80% test coverage

#### Backend Testing
```bash
cd backend
pytest tests/ -v --cov=app
```

#### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description** - What happened vs. what you expected
2. **Steps to Reproduce** - Detailed steps to recreate the issue
3. **Environment** - OS, browser, Python/Node versions
4. **Screenshots** - If applicable
5. **Logs** - Any error messages or console output

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 95]
- Python: [e.g. 3.11.0]
- Node: [e.g. 18.0.0]

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

When requesting features, please include:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other solutions you've considered
4. **Use Cases** - Who would benefit from this feature?

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🔧 Code Contributions

### Pull Request Process

1. **Create Branch** - From main branch
2. **Make Changes** - Follow coding guidelines
3. **Add Tests** - Ensure good test coverage
4. **Update Documentation** - Update relevant docs
5. **Submit PR** - With clear description

### Pull Request Template
```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

**Screenshots** (if applicable)

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Code Review Process
- All PRs require at least one review
- Address feedback promptly
- Keep PRs focused and small
- Update PR description if needed

## 📚 Documentation

### Types of Documentation
- **API Documentation** - Backend API endpoints
- **User Guides** - How to use the platform
- **Developer Guides** - Setup and development
- **Architecture Docs** - System design and decisions

### Documentation Standards
- Use clear, concise language
- Include code examples
- Keep documentation up-to-date
- Use proper markdown formatting

## 🎮 Module 0 Contributions

### Adding New Challenges
1. Create challenge component in `frontend/src/components/Module0/challenges/`
2. Add challenge data to `Module0Game.tsx`
3. Include mathematical concept and AI/ML connection
4. Add tests for challenge logic

### Challenge Guidelines
- **Narrative Hook** - Engaging story introduction
- **Mathematical Focus** - Clear math concept
- **AI/ML Connection** - How it relates to machine learning
- **Progressive Difficulty** - Appropriate challenge level
- **Clear Instructions** - Easy to understand requirements

## 🧪 Testing Guidelines

### Backend Testing
```python
# Test structure
def test_user_registration():
    """Test user registration with valid data."""
    # Arrange
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpass123"
    }
    
    # Act
    response = client.post("/api/v1/register", json=user_data)
    
    # Assert
    assert response.status_code == 200
    assert "id" in response.json()
```

### Frontend Testing
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';

test('renders login form', () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
  
  expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
});
```

## 🔒 Security

### Security Guidelines
- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security issues privately

### Security Reporting
For security vulnerabilities, please email: security@mllearningplatform.com

## 🏷️ Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 📞 Getting Help

### Communication Channels
- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Discord** - Real-time chat and community
- **Email** - Direct contact for sensitive issues

### Community Guidelines
- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experiences
- Follow the code of conduct

## 🎉 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** - List of all contributors
- **Release Notes** - Mention in relevant releases
- **Community Hall of Fame** - Outstanding contributors

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to the ML Learning Platform! 🚀**

*Together, we're making machine learning education more accessible and engaging for everyone.*