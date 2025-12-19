#!/bin/bash
#
# ScamSpot Backend Setup Script
# This script helps you get started quickly

echo "🛡️  ScamSpot Backend Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your API keys (optional)"
    echo "   The backend works without API keys in standalone mode."
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "🎯 Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "The server will run on http://localhost:3000"
echo "Health check: http://localhost:3000/health"
echo ""
echo "📚 See README.md for more information"
