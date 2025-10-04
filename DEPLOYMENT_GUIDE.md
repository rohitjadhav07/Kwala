# ChainQuest Deployment Guide

This guide will help you deploy and run ChainQuest for the Kwala Hacker House hackathon.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- MetaMask or compatible Web3 wallet
- Testnet tokens for deployment

### 1. Clone and Setup
```bash
git clone https://github.com/[your-username]/chainquest
cd chainquest
npm run install-all
```

### 2. Environment Configuration
Create `.env` files in the contracts directory:

```bash
# contracts/.env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
```

### 3. Deploy Smart Contracts

Deploy to Sepolia (Ethereum testnet):
```bash
cd contracts
npm run deploy:sepolia
```

Deploy to Mumbai (Polygon testnet):
```bash
npm run deploy:mumbai
```

Deploy to BSC Testnet:
```bash
npm run deploy:bsc-testnet
```

### 4. Configure Kwala Workflows

1. Create a Kwala workspace at [kwala.com](https://kwala.com)
2. Upload the YAML files from `kwala-workflows/` directory
3. Update contract addresses in the YAML files with your deployed addresses
4. Activate the workflows in your Kwala dashboard

### 5. Start Frontend
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Kwala Workflow Setup

### Required Workflows
1. **Quest Automation** (`quest-automation.yaml`)
   - Monitors quest completion
   - Distributes rewards automatically
   - Generates daily quests

2. **NFT Evolution** (`nft-evolution.yaml`)
   - Tracks character experience
   - Triggers automatic evolution
   - Updates metadata across chains

3. **Cross-Chain Tournaments** (`cross-chain-tournaments.yaml`)
   - Creates tournaments automatically
   - Handles matchmaking
   - Distributes prizes

### Configuration Steps
1. Replace placeholder contract addresses (`0x...`) with your deployed addresses
2. Update RPC endpoints for your preferred providers
3. Set up webhook URLs for notifications (optional)
4. Test workflows with small transactions first

## 🎮 Demo Scenarios

### Scenario 1: New Player Onboarding
1. Connect wallet to the application
2. Mint your first character (automatic via Kwala)
3. Receive welcome quest automatically
4. Complete quest and receive rewards

### Scenario 2: Character Evolution
1. Gain experience through battles/quests
2. Watch character evolve automatically when requirements are met
3. See updated stats and visual changes
4. Receive evolution bonuses

### Scenario 3: Cross-Chain Tournament
1. Register for tournament on any supported chain
2. Get matched with players from other chains
3. Battle automatically executes
4. Receive prizes on your preferred chain

## 🔧 Troubleshooting

### Common Issues

**Contract Deployment Fails**
- Check you have sufficient testnet tokens
- Verify RPC URLs are correct
- Ensure private key is properly formatted

**Kwala Workflows Not Triggering**
- Verify contract addresses in YAML files
- Check event signatures match your contracts
- Ensure workflows are activated in Kwala dashboard

**Frontend Connection Issues**
- Verify you're on the correct network
- Check contract addresses in frontend config
- Ensure MetaMask is connected

### Getting Help
- Join the Kwala Discord for support
- Check the official Kwala documentation
- Review the hackathon resources

## 📊 Testing Checklist

Before submitting, ensure:
- [ ] Contracts deployed on at least 2 testnets
- [ ] Kwala workflows are active and responding
- [ ] Frontend connects to contracts successfully
- [ ] Character minting works
- [ ] Quest system functions
- [ ] Tournament registration works
- [ ] Cross-chain functionality tested
- [ ] Demo video recorded
- [ ] README updated with live links

## 🏆 Submission Requirements

### Required Files
- [ ] Public GitHub repository
- [ ] Kwala YAML workflow scripts
- [ ] Demo video (3-5 minutes)
- [ ] Live Kwala workspace link
- [ ] Updated README with setup instructions

### Demo Video Content
1. Project overview and innovation
2. Kwala automation in action
3. Cross-chain functionality demo
4. User experience walkthrough
5. Technical architecture explanation

## 🌐 Live Links Template

Update your README with these live links:

```markdown
## 🔗 Live Demo Links
- **Frontend**: https://chainquest-demo.vercel.app
- **Kwala Workspace**: https://kwala.com/workspace/[your-workspace-id]
- **Demo Video**: https://youtube.com/watch?v=[your-video-id]
- **Sepolia Contract**: https://sepolia.etherscan.io/address/[contract-address]
- **Mumbai Contract**: https://mumbai.polygonscan.com/address/[contract-address]
```

## 💡 Tips for Winning

1. **Focus on Innovation**: Highlight unique use of Kwala automation
2. **Cross-Chain Excellence**: Demonstrate seamless multi-chain experience
3. **User Experience**: Make complex blockchain interactions simple
4. **Technical Execution**: Show robust, well-tested automation workflows
5. **Real-World Impact**: Explain practical benefits for Web3 gaming

Good luck with your submission! 🚀