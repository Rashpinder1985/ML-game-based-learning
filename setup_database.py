#!/usr/bin/env python3
"""
Database setup script for ML Learning Platform
Creates tables and initial data for local PostgreSQL database
"""

import os
import sys
import asyncio
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from sqlalchemy import create_engine, text
from backend.app.core.config import settings
from backend.app.core.database import Base
from backend.app.models import Lesson, Progress, Submission, Job, User

async def setup_database():
    """Set up the database with tables and initial data"""
    
    print("🚀 Setting up ML Learning Platform Database...")
    print(f"📊 Database URL: {settings.DATABASE_URL}")
    
    # Create engine
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {version}")
        
        # Create all tables
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Verify tables were created
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"📋 Created tables: {', '.join(tables)}")
        
        # Insert sample lessons
        print("📚 Inserting sample lessons...")
        with engine.connect() as conn:
            # Check if lessons already exist
            result = conn.execute(text("SELECT COUNT(*) FROM lessons"))
            count = result.fetchone()[0]
            
            if count == 0:
                # Insert sample lessons
                lessons_data = [
                    {
                        'title': 'Introduction to Machine Learning',
                        'description': 'Learn the basics of ML and its applications',
                        'content': '# Introduction to Machine Learning\n\nMachine Learning is...',
                        'difficulty': 'beginner',
                        'module': 'Module 1',
                        'estimated_time': 30
                    },
                    {
                        'title': 'Linear Regression',
                        'description': 'Understand the fundamentals of linear regression',
                        'content': '# Linear Regression\n\nLinear regression is...',
                        'difficulty': 'intermediate',
                        'module': 'Module 1',
                        'estimated_time': 45
                    },
                    {
                        'title': 'Classification with Decision Trees',
                        'description': 'Learn to build decision tree classifiers',
                        'content': '# Decision Trees\n\nDecision trees are...',
                        'difficulty': 'intermediate',
                        'module': 'Module 2',
                        'estimated_time': 60
                    }
                ]
                
                for lesson_data in lessons_data:
                    conn.execute(text("""
                        INSERT INTO lessons (title, description, content, difficulty, module, estimated_time, created_at, updated_at)
                        VALUES (:title, :description, :content, :difficulty, :module, :estimated_time, NOW(), NOW())
                    """), lesson_data)
                
                conn.commit()
                print("✅ Sample lessons inserted!")
            else:
                print(f"ℹ️  Lessons already exist ({count} lessons found)")
        
        print("\n🎉 Database setup completed successfully!")
        print("\n📋 Summary:")
        print(f"   • Database: ml_learning")
        print(f"   • Tables created: lessons, progress, submissions, jobs")
        print(f"   • Sample data: 3 lessons inserted")
        print("\n🚀 You can now run the backend server!")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(setup_database())