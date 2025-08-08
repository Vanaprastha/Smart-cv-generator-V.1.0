#!/bin/bash

echo "🔒 Fixing npm security vulnerabilities..."
echo "========================================"

# Check current vulnerabilities
echo "📋 Current vulnerabilities:"
npm audit

echo ""
echo "🔧 Attempting to fix vulnerabilities..."

# Try automatic fix first
npm audit fix

# If there are still issues, try force fix
echo ""
echo "🔨 Applying force fix for remaining issues..."
npm audit fix --force

# Check if vulnerabilities are resolved
echo ""
echo "📋 Checking remaining vulnerabilities:"
npm audit

# Update to latest compatible versions
echo ""
echo "📦 Updating to latest compatible versions..."
npm update

echo ""
echo "✅ Vulnerability fix completed!"
echo ""
echo "If there are still critical vulnerabilities, they might be:"
echo "1. In dev dependencies (not affecting production)"
echo "2. Requiring manual package updates"
echo "3. False positives"
