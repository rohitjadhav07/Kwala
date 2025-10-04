# 🚀 Polygon Amoy Testnet Deployment Guide

## 🎯 Why Amoy for Kwala Hackathon?

✅ **Latest Polygon Testnet**: Amoy replaced Mumbai as the official testnet
✅ **Full Kwala Support**: Complete automation protocol support
✅ **Better Performance**: Faster, more reliable than Mumbai
✅ **Modern Features**: Latest Polygon improvements
✅ **Hackathon Ready**: Perfect for cross-chain automation demos

## 📋 Current Deployment Status

### ✅ Successfully Deployed
- **ChainQuestCharacter**: `0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D`
- **Network**: Polygon Amoy (Chain ID: 80002)
- **Explorer**: https://amoy.polygonscan.com/address/0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D

### 🔄 Pending Deployment (Need More MATIC)
- **QuestManager**: Waiting for deployment
- **TournamentManager**: Waiting for deployment

## 🚀 Complete Deployment Steps

### 1. Get More MATIC Tokens
- **Faucet**: https://faucet.polygon.technology/
- **Network**: Select "Amoy" (not Mumbai!)
- **Address**: `0xBae1C46A4886610C99a7d328C69F3fD3BA2656b8`
- **Amount**: Request maximum available

### 2. Deploy Remaining Contracts
```bash
cd contracts
npx hardhat run scripts/deploy.js --network amoy
```

### 3. Update Contract Addresses
After successful deployment, update `frontend/src/config/contracts.js`:
```javascript
amoy: {
  ChainQuestCharacter: "0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D", // ✅ DEPLOYED
  QuestManager: "0x...", // Update with deployed address
  TournamentManager: "0x..." // Update with deployed address
}
```

### 4. Configure MetaMask for Amoy
Add Amoy network to MetaMask:
- **Network Name**: Polygon Amoy
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Chain ID**: 80002
- **Currency Symbol**: MATIC
- **Block Explorer**: https://amoy.polygonscan.com

### 5. Update Kwala Workflows
Replace contract addresses in `kwala-workflows/*.yaml` files:
- Use deployed contract addresses
- Set chain to "polygon-amoy"
- Update event monitoring contracts

## 🎮 Testing on Amoy

### Frontend Testing
1. Connect MetaMask to Amoy network
2. Visit your deployed frontend
3. Try minting a character (should work with deployed contract!)
4. Test character interactions

### Contract Verification
```bash
npx hardhat verify --network amoy 0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D
```

## 🤖 Kwala Integration

### Workspace Setup
1. Create Kwala workspace at https://kwala.com
2. Upload updated YAML workflows
3. Configure for Polygon Amoy network
4. Test automation triggers

### Automation Features
- ✅ **Quest Automation**: Monitor quest completion on Amoy
- ✅ **NFT Evolution**: Character evolution triggers
- ✅ **Cross-Chain**: Ready for multi-chain expansion
- ✅ **Tournament Management**: Automated battle system

## 🏆 Hackathon Advantages

### Innovation Points
- **Latest Technology**: Using newest Polygon testnet
- **Real Automation**: Actual Kwala integration on live testnet
- **Production Ready**: Modern infrastructure and tooling
- **Cross-Chain Ready**: Foundation for multi-chain gaming

### Demo Scenarios
1. **Live Character Minting**: Real blockchain transactions
2. **Automated Evolution**: Kwala triggers on actual events
3. **Cross-Chain Potential**: Ready for mainnet deployment
4. **Real-Time Updates**: Live blockchain event monitoring

## 🔗 Important Links

- **Amoy Explorer**: https://amoy.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/
- **Deployed Contract**: https://amoy.polygonscan.com/address/0x0aF5DACFe9DeAAf38413D55CeC0F16a850ED162D
- **Kwala Docs**: https://docs.kwala.com
- **Polygon Amoy Docs**: https://docs.polygon.technology/tools/wallets/metamask/add-polygon-network/

---

**Amoy testnet gives us a competitive edge in the hackathon by using the latest, most reliable Polygon infrastructure! 🚀**