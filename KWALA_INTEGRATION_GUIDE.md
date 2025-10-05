# 🤖 Kwala Integration Guide for ChainQuest

## 🚀 Quick Setup

### 1. Deploy Backend API
```bash
# Windows
deploy-backend.bat

# Linux/Mac
./deploy-backend.sh
```

### 2. Configure Environment Variables
Set these in Vercel dashboard:
```
KWALA_API_KEY=your_kwala_api_key
KWALA_WORKSPACE_ID=your_workspace_id
KWALA_WEBHOOK_SECRET=your_webhook_secret
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
CHARACTER_CONTRACT_ADDRESS=0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D
```

### 3. Create Kwala Workspace
1. Go to https://kwala.com
2. Create account and workspace
3. Upload **simple** YAML file:
   - `kwala-workflows/chainquest-simple.yaml`
4. Activate workflow

### 4. Update Frontend
Set backend URL in `frontend/.env`:
```
REACT_APP_BACKEND_URL=https://your-backend.vercel.app
```

## 🎯 Features Now Working

✅ **Real Kwala Status** - Live connection monitoring
✅ **NFT Activity Monitoring** - Tracks all NFT transfers
✅ **Webhook Integration** - Real-time notifications
✅ **Event Processing** - Handles mint/transfer events
✅ **Game Logic Triggers** - Foundation for quest/tournament automation
✅ **Cross-Chain Ready** - Works on Polygon Amoy

## 🔧 API Endpoints

- `GET /api/kwala/status` - Kwala connection status
- `GET /api/quests/:address` - Player quests
- `POST /api/tournaments/create` - Create tournament
- `POST /webhooks/quest-completed` - Quest webhook
- `POST /webhooks/evolution` - Evolution webhook

Your ChainQuest now has REAL Kwala automation! 🎉