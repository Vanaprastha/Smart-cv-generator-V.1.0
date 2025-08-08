#!/bin/bash

echo "🔧 Setting up Smart CV Generator locally..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the project directory?"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local..."
    cat > .env.local << 'EOF'
# Google Gemini AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyCeTqI8bhTGtsYrpG5jzptvOGzNbN6rjPs

# Next.js Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Settings
NEXT_PUBLIC_DEBUG=true
EOF
    echo "✅ .env.local created successfully"
else
    echo "✅ .env.local already exists"
fi

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    echo "📝 Creating .env.example..."
    cat > .env.example << 'EOF'
# Google Gemini AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# Next.js Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Settings
NEXT_PUBLIC_DEBUG=false
EOF
    echo "✅ .env.example created successfully"
else
    echo "✅ .env.example already exists"
fi

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v)
echo "Node.js version: $node_version"

# Fix npm audit issues
echo "🔒 Fixing security vulnerabilities..."
npm audit fix --force

# Install dependencies if node_modules is missing or incomplete
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start development server: npm run dev"
    echo "2. Or start production server: npm start"
    echo "3. Open browser: http://localhost:3000"
    echo ""
    echo "Environment files created:"
    echo "- .env.local (with your API key)"
    echo "- .env.example (template for others)"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
