#!/bin/bash

echo "🚀 Deploying ChainQuest Backend with Kwala Integration"

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found. Please run from project root."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Backend deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - KWALA_API_KEY"
echo "   - KWALA_WORKSPACE_ID" 
echo "   - KWALA_WEBHOOK_SECRET"
echo "   - POLYGON_AMOY_RPC"
echo "   - CHARACTER_CONTRACT_ADDRESS"
echo ""
echo "2. Create Kwala workspace at https://kwala.com"
echo "3. Upload simplified YAML workflows:"
echo "   - kwala-workflows/cross-chain-tournaments-simple.yaml"
echo "   - kwala-workflows/quest-automation-simple.yaml"
echo "   - kwala-workflows/nft-evolution-simple.yaml"
echo ""
echo "4. Update frontend .env with backend URL"
echo ""
echo "🎉 Your ChainQuest backend is ready for Kwala integration!"