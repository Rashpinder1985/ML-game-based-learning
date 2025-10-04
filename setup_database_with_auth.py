#!/usr/bin/env python3
"""
Enhanced database setup script with authentication and analytics tables.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, text
from app.core.database import Base, get_db
from app.core.config import settings
from app.models import *

def setup_database():
    print("🚀 Setting up ML Learning Platform Database with Authentication...")
    print(f"📊 Database URL: {settings.DATABASE_URL}")
    
    # Create engine
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            db_version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {db_version}")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return False
    
    try:
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Get created tables
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"📋 Created tables: {', '.join(tables)}")
        
        print("📚 Inserting sample lessons...")
        sample_lessons = [
            {
                "title": "Introduction to Machine Learning",
                "description": "Learn the basics of ML and its applications",
                "content": "# Introduction to Machine Learning\n\nMachine Learning is a subset of artificial intelligence that focuses on algorithms that can learn from data.",
                "difficulty": "beginner",
                "module": "Module 1",
                "is_active": True,
            },
            {
                "title": "Linear Regression",
                "description": "Understand the fundamentals of linear regression",
                "content": "# Linear Regression\n\nLinear regression is a statistical method used to model the relationship between variables.",
                "difficulty": "intermediate",
                "module": "Module 1",
                "is_active": True,
            },
            {
                "title": "Classification with Decision Trees",
                "description": "Learn to build decision tree classifiers",
                "content": "# Decision Trees\n\nDecision trees are a powerful machine learning algorithm for both classification and regression tasks.",
                "difficulty": "intermediate",
                "module": "Module 2",
                "is_active": True,
            },
        ]

        insert_stmt = text(
            """
            INSERT INTO lessons (title, description, content, difficulty, module, is_active)
            SELECT :title, :description, :content, :difficulty, :module, :is_active
            WHERE NOT EXISTS (
                SELECT 1 FROM lessons WHERE title = :title
            )
            """
        )

        with engine.begin() as conn:
            for lesson in sample_lessons:
                conn.execute(insert_stmt, lesson)
        
        print("✅ Sample lessons inserted!")
        print("🎉 Database setup completed successfully!")
        print("📋 Summary:")
        print(f"   • Database: ml_learning")
        print(f"   • Tables created: {', '.join(tables)}")
        print("   • Sample data: 3 lessons inserted")
        print("🚀 You can now run the backend server with authentication!")
        
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

if __name__ == "__main__":
    success = setup_database()
    sys.exit(0 if success else 1)
