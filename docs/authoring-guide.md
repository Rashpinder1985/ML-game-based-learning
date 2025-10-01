# Lesson Authoring Guide

This guide explains how to create and manage lessons for the ML Learning Platform.

## Lesson Structure

Each lesson consists of:

- **Title**: Clear, descriptive name
- **Description**: Brief overview of what students will learn
- **Content**: The code template/starting point
- **Difficulty**: beginner, intermediate, advanced
- **Module**: Organizational grouping (e.g., "Module 1", "Data Structures")

## Creating a New Lesson

### 1. Database Method

Add lessons directly to the database:

```python
from app.models.lesson import Lesson
from app.core.database import SessionLocal

db = SessionLocal()

lesson = Lesson(
    title="Your Lesson Title",
    description="What students will learn",
    content="# Your code template here\nprint('Hello, World!')",
    difficulty="beginner",  # or "intermediate", "advanced"
    module="Module 1"
)

db.add(lesson)
db.commit()
```

### 2. Using the API

```bash
curl -X POST "http://localhost:8000/api/v1/lessons" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Lesson Title",
    "description": "What students will learn",
    "content": "# Your code template here\nprint(\"Hello, World!\")",
    "difficulty": "beginner",
    "module": "Module 1"
  }'
```

## Content Guidelines

### Code Templates

- Provide a starting template that compiles/runs
- Include comments explaining the task
- Use clear variable names
- Add hints in comments

**Good Example:**
```python
# Task: Create a function that calculates the area of a rectangle
# Hint: Area = length × width

def calculate_area(length, width):
    # TODO: Implement the calculation
    pass

# Test your function
result = calculate_area(5, 3)
print(f"Area: {result}")  # Should print: Area: 15
```

**Bad Example:**
```python
# Do something
def func(a, b):
    pass
```

### Difficulty Levels

#### Beginner
- Basic syntax and concepts
- Simple data types
- Basic control flow
- Clear, step-by-step instructions

**Example Topics:**
- Variables and data types
- Basic functions
- Simple loops
- String manipulation

#### Intermediate
- More complex data structures
- Object-oriented concepts
- Error handling
- Algorithm implementation

**Example Topics:**
- Lists and dictionaries
- Classes and objects
- File I/O
- Sorting algorithms

#### Advanced
- Complex algorithms
- Design patterns
- Performance optimization
- Advanced language features

**Example Topics:**
- Recursion
- Dynamic programming
- Concurrency
- Machine learning basics

## Testing Your Lessons

### 1. Manual Testing

1. Start the platform: `make up`
2. Access the frontend: http://localhost:3000
3. Select your lesson
4. Try different code solutions
5. Verify the runner works correctly

### 2. Automated Testing

Create test cases for your lesson:

```python
def test_lesson_solution():
    code = """
def calculate_area(length, width):
    return length * width

result = calculate_area(5, 3)
print(f"Area: {result}")
"""
    
    # Submit to runner and verify result
    # (Implementation depends on your testing setup)
```

## Best Practices

### Content Quality

1. **Clear Instructions**: Explain what students should do
2. **Progressive Difficulty**: Build on previous concepts
3. **Real Examples**: Use practical, relatable examples
4. **Error Handling**: Include common mistakes and how to fix them

### Code Quality

1. **Readable Code**: Use clear variable names and comments
2. **Consistent Style**: Follow language conventions
3. **Error Prevention**: Anticipate common student mistakes
4. **Performance**: Consider execution time limits

### Educational Value

1. **Learning Objectives**: Each lesson should have clear goals
2. **Prerequisites**: Specify what students need to know first
3. **Assessment**: Include ways to verify understanding
4. **Feedback**: Provide helpful hints and explanations

## Module Organization

### Module 1: Python Basics
- Introduction to Python
- Variables and Data Types
- Control Flow
- Functions
- Lists and Dictionaries

### Module 2: Object-Oriented Programming
- Classes and Objects
- Inheritance
- Polymorphism
- Encapsulation

### Module 3: Data Structures and Algorithms
- Stacks and Queues
- Trees and Graphs
- Sorting Algorithms
- Search Algorithms

### Module 4: Advanced Topics
- File I/O
- Exception Handling
- Regular Expressions
- Testing

## Content Management

### Updating Lessons

1. **Edit in Database**: Direct database modification
2. **API Updates**: Use PUT endpoint
3. **Version Control**: Track changes in git

### Lesson Metadata

Track additional information:

```python
lesson.metadata = {
    "estimated_time": "15 minutes",
    "prerequisites": ["variables", "functions"],
    "learning_objectives": [
        "Understand recursion",
        "Implement factorial function"
    ],
    "tags": ["recursion", "algorithms", "math"]
}
```

## Quality Assurance

### Review Checklist

- [ ] Lesson compiles and runs without errors
- [ ] Instructions are clear and complete
- [ ] Difficulty level is appropriate
- [ ] Code follows best practices
- [ ] Hints are helpful but not too revealing
- [ ] Learning objectives are met
- [ ] Module organization makes sense

### Testing Checklist

- [ ] Test with different skill levels
- [ ] Verify error messages are helpful
- [ ] Check execution time limits
- [ ] Test edge cases
- [ ] Validate output format

## Troubleshooting

### Common Issues

1. **Code doesn't run**: Check syntax and imports
2. **Timeout errors**: Optimize code or increase limits
3. **Memory issues**: Reduce complexity or increase limits
4. **Security errors**: Review code for dangerous operations

### Debug Tools

```bash
# Check runner logs
docker-compose logs runner

# Test code execution manually
curl -X POST "http://localhost:8001/execute" \
  -H "Content-Type: application/json" \
  -d '{"job_id": "test", "code": "print(\"test\")", "language": "python"}'
```

## Resources

### Documentation
- [Python Official Docs](https://docs.python.org/3/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)

### Tools
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Community
- [Python Community](https://www.python.org/community/)
- [FastAPI Community](https://github.com/tiangolo/fastapi)
- [React Community](https://reactjs.org/community/support.html)