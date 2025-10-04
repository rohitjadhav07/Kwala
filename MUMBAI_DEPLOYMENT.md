# 🚀 Mumbai Testnet Deployment Guide

## Prerequisites

### 1. Get Mumbai MATIC Tokens
- Visit: https://faucet.polygon.technology/
- Select "Mumbai" network
- Enter your wallet address
- Get free testnet MATIC

### 2. Add Private Key to .env
```bash
# In contracts/.env
PRIVATE_KEY=your_actual_private_key_without_0x_prefix
```

### 3. Deploy Contracts
```bash
cd contracts
npm run deploy:mumbai
```

## Expected Output
```
🚀 Deploying ChainQuest contracts...
Deploying contracts with account: 0x...
Account balance: 1000000000000000000

📦 Deploying ChainQuestCharacter...
✅ ChainQuestCharacter deployed to: 0x...

📦 Deploying QuestManager...
✅ QuestManager deployed to: 0x...

📦 Deploying TournamentManager...
✅ TournamentManager deployed to: 0x...
```

## After Deployment

### 1. Update Contract Addresses
Copy the deployed addresses and update `frontend/src/config/contracts.js`:

```javascript
mumbai: {
  ChainQuestCharacter: "0x...", // Your deployed address
  QuestManager: "0x...",        // Your deployed address
  TournamentManager: "0x..."    // Your deployed address
},
80001: {
  ChainQuestCharacter: "0x...", // Same addresses
  QuestManager: "0x...",
  TournamentManager: "0x..."
}
```

### 2. Update Kwala Workflows
In `kwala-workflows/*.yaml` files, replace contract addresses:
- Replace `0x...` placeholders with your actual deployed addresses
- Set chain to "mumbai" or "polygon"

### 3. Test the Application
1. Connect MetaMask to Mumbai testnet
2. Visit your deployed frontend
3. Try minting a character
4. Test training and evolution

## Mumbai Testnet Details
- **Chain ID**: 80001
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Block Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/

## Verification (Optional)
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```