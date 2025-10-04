# ChainQuest AI & IPFS Setup Guide

This guide will help you set up real AI image generation and IPFS storage for ChainQuest.

## 🤖 AI Image Generation APIs

### Option 1: Stability AI (Recommended for Gaming)

1. **Sign up**: Go to [platform.stability.ai](https://platform.stability.ai)
2. **Get API Key**: 
   - Go to Account settings → API Keys
   - Generate new API key
   - Copy the key (starts with `sk-`)
3. **Add Credits**: Purchase credits for image generation
4. **Cost**: ~$0.01-0.02 per image (very affordable!)
5. **Benefits**: 
   - Excellent for fantasy/gaming art
   - Built-in style presets
   - High quality character generation
   - More cost-effective than alternatives

### Option 2: OpenAI DALL-E (Alternative)

1. **Sign up for OpenAI**: Go to [platform.openai.com](https://platform.openai.com)
2. **Get API Key**: 
   - Navigate to API Keys section
   - Create a new secret key
   - Copy the key (starts with `sk-`)
3. **Add Credits**: Add at least $5 to your account for image generation
4. **Cost**: ~$0.02-0.04 per image (1024x1024)

## 📁 IPFS Storage Setup

### Option 1: Pinata (Recommended)

1. **Sign up**: Go to [pinata.cloud](https://pinata.cloud)
2. **Get API Keys**:
   - Go to API Keys section
   - Create new key with pinning permissions
   - Copy API Key, Secret Key, and JWT
3. **Free Tier**: 1GB storage, 100 requests/month
4. **Paid Plans**: Start at $20/month for more storage

### Option 2: Web3.Storage (Alternative)

1. **Sign up**: Go to [web3.storage](https://web3.storage)
2. **Get Token**: Create API token in account settings
3. **Free Tier**: Generous free storage limits

## 🔧 Environment Setup

1. **Copy Environment File**:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. **Add Your API Keys**:
   ```env
   # AI Image Generation (Stability AI recommended)
   REACT_APP_STABILITY_AI_API_KEY=sk-your-stability-key-here
   REACT_APP_OPENAI_API_KEY=sk-your-openai-key-here

   # IPFS Storage (Pinata)
   REACT_APP_PINATA_JWT=your-pinata-jwt-here
   REACT_APP_PINATA_API_KEY=your-pinata-api-key-here
   REACT_APP_PINATA_SECRET_KEY=your-pinata-secret-key-here

   # Web3 Storage (Alternative)
   REACT_APP_WEB3_STORAGE_TOKEN=your-web3-storage-token-here
   ```

3. **Restart Development Server**:
   ```bash
   npm start
   ```

## 🎨 How It Works

### With API Keys:
1. **User enters prompt** → "A mystical fire mage with glowing staff"
2. **AI generates image** → OpenAI DALL-E creates unique artwork
3. **Upload to IPFS** → Pinata stores image permanently
4. **Mint NFT** → Smart contract references IPFS metadata
5. **Result** → Truly unique, on-chain NFT with real AI art

### Without API Keys (Demo Mode):
1. **User enters prompt** → Same input
2. **Generate procedural art** → SVG-based character with prompt-influenced stats
3. **Simulate IPFS** → Demo IPFS hashes
4. **Mint NFT** → Same contract interaction
5. **Result** → Functional demo with procedural graphics

## 💰 Cost Estimation

### For 100 Character Mints:
- **Stability AI**: ~$1-2 (image generation) 💰
- **Pinata IPFS**: ~$0 (within free tier)
- **Gas Fees**: ~$5-20 (depending on network)
- **Total**: ~$6-22 for 100 unique AI-generated NFTs

**Stability AI is more cost-effective and produces better gaming art!**

## 🔒 Security Notes

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** for production use
- **Monitor usage** to avoid unexpected charges

## 🚀 Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. **Add environment variables** in your hosting platform
2. **Set up monitoring** for API usage and costs
3. **Implement rate limiting** to prevent abuse
4. **Add error handling** for API failures
5. **Consider caching** to reduce API calls

## 🆘 Troubleshooting

### Common Issues:

1. **"AI generation failed"**:
   - Check API key is correct
   - Verify account has credits
   - Check network connectivity

2. **"IPFS upload failed"**:
   - Verify Pinata credentials
   - Check file size limits
   - Ensure proper permissions

3. **"Demo mode active"**:
   - API keys not set or invalid
   - App falls back to demo generation
   - Check environment variables

### Getting Help:

- **OpenAI**: [help.openai.com](https://help.openai.com)
- **Pinata**: [docs.pinata.cloud](https://docs.pinata.cloud)
- **ChainQuest**: Check console logs for detailed error messages

## 🚀 Quick Stability AI Setup

Since you're using Stability AI, here's the fastest way to get started:

1. **Get Stability AI Key**:
   ```bash
   # Go to https://platform.stability.ai
   # Sign up and get your API key
   ```

2. **Add to Environment**:
   ```bash
   # In frontend/.env
   REACT_APP_STABILITY_AI_API_KEY=sk-your-actual-key-here
   ```

3. **Test Generation**:
   - Restart your app: `npm start`
   - Go to AI Mint page
   - Enter prompt: "A powerful fire mage with glowing staff"
   - Click Generate Character
   - You should see: "🎨 Stability AI Active (Fantasy Art Optimized)"

4. **Expected Results**:
   - High-quality fantasy character art
   - Perfect for gaming NFTs
   - Cost: ~$0.01-0.02 per generation
   - Style: Fantasy art optimized with negative prompts

## 🎨 Stability AI Advantages for ChainQuest

- **Fantasy Art Optimized**: Built-in fantasy-art style preset
- **Negative Prompts**: Automatically removes low-quality artifacts
- **Cost Effective**: Much cheaper than alternatives
- **High Quality**: 40 steps + K_DPM_2_ANCESTRAL sampler
- **Gaming Perfect**: Ideal for character generation

---

**Ready to create truly unique AI-generated NFTs with Stability AI!** 🎨✨