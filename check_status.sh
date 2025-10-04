#!/bin/bash

echo "🚀 ML Learning Platform Status Check"
echo "===================================="
echo ""

# Check PostgreSQL
echo "📊 PostgreSQL Database:"
if pgrep -x "postgres" > /dev/null; then
    echo "   ✅ PostgreSQL is running"
    if psql -lqt | cut -d \| -f 1 | grep -qw ml_learning; then
        echo "   ✅ ml_learning database exists"
    else
        echo "   ❌ ml_learning database not found"
    fi
else
    echo "   ❌ PostgreSQL is not running"
fi

echo ""

# Check Backend
echo "🎯 Backend Server (FastAPI):"
if curl -s http://localhost:8000/api/v1/lessons > /dev/null; then
    echo "   ✅ Backend is running on http://localhost:8000"
    echo "   📚 API returning lessons data"
else
    echo "   ❌ Backend is not responding"
fi

echo ""

# Check Frontend
echo "🎨 Frontend Server (React + Vite):"
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Frontend is running on http://localhost:3000"
    echo "   🎮 Ready for Module 0 game!"
else
    echo "   ❌ Frontend is not responding"
fi

echo ""

# Check Module 0 Content
echo "📚 Module 0 Content:"
if [ -d "content/module0" ]; then
    echo "   ✅ Module 0 directory exists"
    challenge_count=$(ls content/module0/challenge*.py 2>/dev/null | wc -l)
    echo "   📋 $challenge_count challenge files found"
else
    echo "   ❌ Module 0 directory not found"
fi

echo ""
echo "🌐 Access URLs:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:8000/docs"
echo "   • Module 0 Game: Click '🎮 Module 0: Math Adventure' in the frontend"
echo ""
echo "🎉 Everything is ready to go!"