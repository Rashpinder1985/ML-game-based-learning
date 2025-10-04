#!/usr/bin/env python3
"""
Simple database setup script for ML Learning Platform
"""

import os
import sys
from pathlib import Path

# Add backend to Python path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from sqlalchemy import create_engine, text
from backend.app.core.config import settings

def setup_database():
    """Set up the database with tables"""
    
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
        
        # Create tables using SQL
        print("📋 Creating database tables...")
        
        create_tables_sql = """
        -- Create lessons table
        CREATE TABLE IF NOT EXISTS lessons (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            content TEXT NOT NULL,
            difficulty VARCHAR(50) DEFAULT 'beginner',
            module VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create submissions table
        CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            lesson_id INTEGER REFERENCES lessons(id),
            user_id INTEGER REFERENCES users(id),
            code TEXT NOT NULL,
            language VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            result JSONB,
            error_message TEXT,
            job_id VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create jobs table
        CREATE TABLE IF NOT EXISTS jobs (
            id VARCHAR(255) PRIMARY KEY,
            submission_id INTEGER REFERENCES submissions(id),
            status VARCHAR(50) DEFAULT 'pending',
            result JSONB,
            error_message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create progress table
        CREATE TABLE IF NOT EXISTS progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            lesson_id INTEGER REFERENCES lessons(id),
            status VARCHAR(50) DEFAULT 'not_started',
            score INTEGER DEFAULT 0,
            attempts INTEGER DEFAULT 0,
            best_submission_id INTEGER REFERENCES submissions(id),
            progress_metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        
        with engine.connect() as conn:
            conn.execute(text(create_tables_sql))
            conn.commit()
        
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
                        'content': '# Introduction to Machine Learning\n\nMachine Learning is a subset of artificial intelligence that focuses on algorithms that can learn from data.',
                        'difficulty': 'beginner',
                        'module': 'Module 1',
                        'estimated_time': 30
                    },
                    {
                        'title': 'Linear Regression',
                        'description': 'Understand the fundamentals of linear regression',
                        'content': '# Linear Regression\n\nLinear regression is a statistical method used to model the relationship between variables.',
                        'difficulty': 'intermediate',
                        'module': 'Module 1',
                        'estimated_time': 45
                    },
                    {
                        'title': 'Classification with Decision Trees',
                        'description': 'Learn to build decision tree classifiers',
                        'content': '# Decision Trees\n\nDecision trees are a powerful machine learning algorithm for both classification and regression tasks.',
                        'difficulty': 'intermediate',
                        'module': 'Module 2',
                        'estimated_time': 60
                    }
                ]
                
                for lesson_data in lessons_data:
                    conn.execute(text("""
                        INSERT INTO lessons (title, description, content, difficulty, module, created_at, updated_at)
                        VALUES (:title, :description, :content, :difficulty, :module, NOW(), NOW())
                    """), lesson_data)
                
                conn.commit()
                print("✅ Sample lessons inserted!")
            else:
                print(f"ℹ️  Lessons already exist ({count} lessons found)")
        
        print("\n🎉 Database setup completed successfully!")
        print("\n📋 Summary:")
        print(f"   • Database: ml_learning")
        print(f"   • Tables created: lessons, users, submissions, jobs, progress")
        print(f"   • Sample data: 3 lessons inserted")
        print("\n🚀 You can now run the backend server!")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    setup_database()