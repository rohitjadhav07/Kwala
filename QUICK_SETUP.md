# 🚀 Quick Setup Guide for ChainQuest

## Step 1: Get Your Private Key
1. Open MetaMask
2. Click on your account → Account Details → Export Private Key
3. Enter your password and copy the private key
4. **IMPORTANT**: Remove the `0x` prefix when adding to .env

## Step 2: Get Free RPC URLs (Optional - we have defaults)
- **Infura**: https://infura.io (free tier gives you RPC URLs)
- **Alchemy**: https://alchemy.com (alternative to Infura)
- Or use the default public RPCs (may be slower)

## Step 3: Get Testnet Tokens (Required)
**Get these tokens for deployment:**

### Sepolia ETH
- https://sepoliafaucet.com/
- https://faucets.chain.link/sepolia

### Mumbai MATIC  
- https://faucet.polygon.technology/
- Select Mumbai network

### BSC Testnet BNB
- https://testnet.bnbchain.org/faucet-smart

## Step 4: Update .env File
Edit `contracts/.env` with your private key:
```
PRIVATE_KEY=your_actual_private_key_without_0x
```

## Step 5: Deploy Contracts
```bash
cd contracts
npm run deploy:sepolia
npm run deploy:mumbai
npm run deploy:bsc-testnet
```

## Step 6: Set Up Kwala
1. Go to https://kwala.com
2. Create account and workspace
3. Upload YAML files from kwala-workflows/
4. Update contract addresses in YAML files
5. Activate workflows

## Step 7: Deploy Frontend
```bash
cd frontend
npm run build
# Deploy to Vercel: https://vercel.com
```

## Need Help?
- Discord: Join Kwala Discord for support
- Issues: Check GitHub issues or create new one