# Quick Setup Guide for ChainQuest

## 🚀 Get Started in 5 Minutes

### 1. Environment Setup
Copy the environment file and add your API keys:
```bash
cp .env.example .env
```

### 2. Essential API Keys (Optional but Recommended)

#### For Real IPFS Storage (Pinata - FREE):
1. Go to [pinata.cloud](https://pinata.cloud) 
2. Sign up for free account
3. Go to API Keys → Generate New Key
4. Copy the JWT token to `.env`:
```
REACT_APP_PINATA_JWT=your_jwt_token_here
```

#### For AI Image Generation (Optional):
- **Stability AI**: Get API key from [platform.stability.ai](https://platform.stability.ai)
- **OpenAI**: Get API key from [platform.openai.com](https://platform.openai.com)

### 3. Run the Application
```bash
npm install
npm start
```

### 4. Connect Your Wallet
- Install MetaMask or any Web3 wallet
- Switch to Polygon Amoy testnet
- Get free MATIC from [faucet](https://faucet.polygon.technology/)

### 5. Deploy Contract (Optional)
```bash
cd contracts
npm install
# Add your private key to contracts/.env
npx hardhat run scripts/deploy.js --network amoy
```

## 🎮 Features That Work Without API Keys

- ✅ **Demo AI Generation**: Creates unique SVG characters
- ✅ **Demo IPFS**: Simulates decentralized storage  
- ✅ **Full Blockchain**: Real minting on Polygon
- ✅ **Marketplace**: Browse and trade characters
- ✅ **Arena Battles**: PvP combat system
- ✅ **Quest System**: Complete challenges

## 🔧 Troubleshooting

### Wallet Not Connecting?
- Make sure you're on Polygon Amoy testnet (Chain ID: 80002)
- Try refreshing the page
- Check if MetaMask is unlocked

### Transaction Failing?
- Ensure you have enough MATIC (need ~0.11 MATIC total)
- Check if contract address is correct in `.env`
- Try increasing gas limit

### IPFS Upload Slow?
- Without Pinata API key, it uses demo mode (instant)
- With API key, real IPFS upload takes 2-5 seconds

## 🎯 Ready for Hackathon!

The app works perfectly for demos and hackathons even without API keys. The demo mode creates unique, consistent characters that can be minted as real NFTs on Polygon!