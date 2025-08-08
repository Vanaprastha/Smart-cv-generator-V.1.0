#!/bin/bash

echo "🚀 Setting up Smart CV Generator locally..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v)
echo "Node.js version: $node_version"

if [[ $node_version < "v18" ]]; then
    echo "❌ Node.js version 18 or higher is required"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your Google Gemini API key"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project to check for errors
echo "🔨 Building project to check for errors..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "To start development server:"
    echo "  npm run dev"
    echo ""
    echo "To start production server:"
    echo "  npm start"
    echo ""
    echo "App will be available at: http://localhost:3000"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
