#!/bin/bash

echo "🚀 Starting ML Learning Platform (Local Setup)"
echo "=============================================="

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting PostgreSQL..."
    brew services start postgresql@15
    sleep 3
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw ml_learning; then
    echo "📊 Creating ml_learning database..."
    createdb ml_learning
    echo "📋 Setting up database schema..."
    python3 setup_db_simple.py
fi

echo ""
echo "🎯 Starting Backend Server (FastAPI)..."
echo "   • API Documentation: http://localhost:8000/docs"
echo "   • API Endpoint: http://localhost:8000/api/v1/lessons"
echo ""

# Start backend in background
cd backend && python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "🎨 Starting Frontend Server (React + Vite)..."
echo "   • Frontend URL: http://localhost:3000"
echo "   • Module 0 Game: http://localhost:3000 (click '🎮 Module 0: Math Adventure')"
echo ""

# Start frontend in background
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting up..."
echo ""
echo "📋 Summary:"
echo "   • Backend PID: $BACKEND_PID"
echo "   • Frontend PID: $FRONTEND_PID"
echo "   • Database: PostgreSQL (local)"
echo ""
echo "🌐 Open your browser and go to: http://localhost:3000"
echo ""
echo "🛑 To stop the servers, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user to stop
wait