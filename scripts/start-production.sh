#!/bin/bash

echo "🚀 Starting Production Server Locally"
echo "======================================"

# Check if build exists
if [ ! -d ".next" ]; then
    echo "❌ No production build found!"
    echo "Please run: npm run build first"
    exit 1
fi

echo "✅ Production build found"

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use"
    echo "Trying to kill existing process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo "🌐 Starting production server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start production server
npm start
