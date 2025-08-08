#!/bin/bash

echo "🚀 Deploying Smart CV Generator to Vercel"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the project directory?"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Please create it first."
    exit 1
fi

# Get API key from .env.local
API_KEY=$(grep "GOOGLE_GENERATIVE_AI_API_KEY=" .env.local | cut -d '=' -f2)
if [ -z "$API_KEY" ] || [ "$API_KEY" = "your_api_key_here" ]; then
    echo "❌ Please set your Google Gemini API key in .env.local"
    exit 1
fi

echo "✅ Environment check passed"

# Build locally first to check for errors
echo "🔨 Testing local build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful"

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variable in Vercel dashboard:"
    echo "   GOOGLE_GENERATIVE_AI_API_KEY = $API_KEY"
    echo ""
    echo "2. Visit your Vercel dashboard to:"
    echo "   - Configure custom domain"
    echo "   - Set up analytics"
    echo "   - Monitor performance"
    echo ""
    echo "3. Test your deployed application"
else
    echo "❌ Deployment failed. Check the errors above."
    exit 1
fi
