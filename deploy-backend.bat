@echo off
echo 🚀 Deploying ChainQuest Backend with Kwala Integration

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: backend directory not found. Please run from project root.
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
)

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Backend deployment complete!
echo.
echo 🔧 Next steps:
echo 1. Set environment variables in Vercel dashboard:
echo    - KWALA_API_KEY
echo    - KWALA_WORKSPACE_ID
echo    - KWALA_WEBHOOK_SECRET
echo    - POLYGON_AMOY_RPC
echo    - CHARACTER_CONTRACT_ADDRESS
echo.
echo 2. Create Kwala workspace at https://kwala.com
echo 3. Upload simplified YAML workflows:
echo    - kwala-workflows/cross-chain-tournaments-simple.yaml
echo    - kwala-workflows/quest-automation-simple.yaml
echo    - kwala-workflows/nft-evolution-simple.yaml
echo.
echo 4. Update frontend .env with backend URL
echo.
echo 🎉 Your ChainQuest backend is ready for Kwala integration!