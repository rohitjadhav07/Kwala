// AI Image Generation Service
// This service handles AI image generation using various APIs

class AIImageService {
  constructor() {
    this.openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.stabilityApiKey = process.env.REACT_APP_STABILITY_AI_API_KEY;
    this.pinataJWT = process.env.REACT_APP_PINATA_JWT;
    this.pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    this.pinataSecretKey = process.env.REACT_APP_PINATA_SECRET_KEY;
    
    // API endpoints
    this.openaiURL = 'https://api.openai.com/v1/images/generations';
    this.stabilityURL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
  }

  // Generate image using real AI APIs
  async generateImage(prompt, selectedClass) {
    const enhancedPrompt = this.enhancePrompt(prompt, selectedClass);
    
    try {
      // Try Stability AI first (preferred for gaming art)
      if (this.stabilityApiKey && this.stabilityApiKey !== 'your_stability_ai_api_key_here') {
        console.log('🎨 Generating with Stability AI...');
        return await this.generateWithStabilityAI(enhancedPrompt, selectedClass);
      }
      
      // Try OpenAI DALL-E as fallback
      if (this.openaiApiKey && this.openaiApiKey !== 'your_openai_api_key_here') {
        console.log('🤖 Generating with OpenAI DALL-E...');
        return await this.generateWithOpenAI(enhancedPrompt, selectedClass);
      }
      
      // Fallback to demo if no API keys
      console.log('💡 No API keys found, using demo generation...');
      return await this.generateDemoImage(enhancedPrompt, selectedClass);
      
    } catch (error) {
      console.error('❌ AI Image generation error:', error);
      
      // Try the other API if one fails
      if (error.message.includes('Stability AI') && this.openaiApiKey && this.openaiApiKey !== 'your_openai_api_key_here') {
        console.log('🔄 Stability AI failed, trying OpenAI...');
        try {
          return await this.generateWithOpenAI(enhancedPrompt, selectedClass);
        } catch (openaiError) {
          console.error('❌ OpenAI also failed:', openaiError);
        }
      }
      
      // Always fallback to demo on error
      console.log('🎭 Falling back to demo generation...');
      return await this.generateDemoImage(enhancedPrompt, selectedClass);
    }
  }

  // Generate with OpenAI DALL-E
  async generateWithOpenAI(prompt, selectedClass) {
    const response = await fetch(this.openaiURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download the image to get blob for IPFS upload
    const imageBlob = await this.downloadImage(imageUrl);
    
    return {
      imageUrl: imageUrl,
      imageBlob: imageBlob,
      prompt: prompt,
      stats: this.generateStatsFromPrompt(prompt, selectedClass),
      rarity: this.determineRarity(prompt)
    };
  }

  // Generate with Stability AI (optimized for gaming characters)
  async generateWithStabilityAI(prompt, selectedClass) {
    // Add negative prompts to improve quality
    const negativePrompts = [
      "blurry", "low quality", "distorted", "deformed", "ugly", "bad anatomy", 
      "extra limbs", "missing limbs", "floating limbs", "disconnected limbs",
      "malformed hands", "poor hands", "mangled fingers", "bad fingers",
      "extra fingers", "liquid fingers", "poorly drawn hands", "mutated hands",
      "oversaturated", "low resolution", "bad art", "beginner", "amateur",
      "distorted face", "ugly face", "bad face"
    ].join(", ");

    const requestBody = {
      text_prompts: [
        {
          text: prompt,
          weight: 1
        },
        {
          text: negativePrompts,
          weight: -1
        }
      ],
      cfg_scale: 8, // Higher for better prompt adherence
      height: 1024,
      width: 1024,
      steps: 40, // More steps for better quality
      samples: 1,
      sampler: "K_DPM_2_ANCESTRAL", // Good for detailed art
      style_preset: "fantasy-art" // Perfect for gaming characters
    };

    console.log('🎨 Stability AI Request:', {
      prompt: prompt.substring(0, 100) + '...',
      cfg_scale: requestBody.cfg_scale,
      steps: requestBody.steps,
      style_preset: requestBody.style_preset
    });

    const response = await fetch(this.stabilityURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stabilityApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Stability AI HTTP ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`Stability AI error: ${errorMessage}`);
    }

    const data = await response.json();
    
    if (!data.artifacts || !data.artifacts[0]) {
      throw new Error('Stability AI returned no image data');
    }

    const imageBase64 = data.artifacts[0].base64;
    const imageBlob = this.base64ToBlob(imageBase64, 'image/png');
    const imageUrl = URL.createObjectURL(imageBlob);
    
    console.log('✅ Stability AI generation successful');
    
    return {
      imageUrl: imageUrl,
      imageBlob: imageBlob,
      prompt: prompt,
      stats: this.generateStatsFromPrompt(prompt, selectedClass),
      rarity: this.determineRarity(prompt)
    };
  }

  // Download image from URL to blob
  async downloadImage(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }
    return await response.blob();
  }

  // Convert base64 to blob
  base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Enhance the user prompt with class-specific details (optimized for Stability AI)
  enhancePrompt(userPrompt, selectedClass) {
    const classEnhancements = {
      warrior: {
        base: "epic fantasy warrior character",
        equipment: "gleaming plate armor with intricate engravings, ornate longsword and shield, detailed battle helm",
        pose: "heroic battle stance, confident warrior posture, ready for combat",
        environment: "epic battlefield background with dramatic sky",
        style: "detailed metallic textures, dramatic cinematic lighting, heroic composition"
      },
      mage: {
        base: "mystical fantasy wizard character", 
        equipment: "flowing magical robes with arcane symbols, ornate staff with glowing crystal orb, ancient spell tome",
        pose: "powerful spellcasting gesture, magical energy swirling around hands and staff",
        environment: "mystical tower library with floating books and magical artifacts",
        style: "ethereal magical lighting, glowing particle effects, mystical runes, magical aura"
      },
      rogue: {
        base: "stealthy fantasy assassin character",
        equipment: "dark leather armor with metal studs, twin curved daggers, hooded shadow cloak",
        pose: "crouched stealth position, ready to strike from shadows",
        environment: "dark medieval alleyway with moonlight and shadows",
        style: "dramatic chiaroscuro lighting, deep shadows, moonbeams, mysterious atmosphere"
      }
    };

    const enhancement = classEnhancements[selectedClass] || classEnhancements.warrior;
    
    // Build enhanced prompt optimized for Stability AI
    let enhancedPrompt = userPrompt || enhancement.base;
    
    // Add class-specific details if user prompt is short or generic
    if (!userPrompt || userPrompt.length < 30) {
      enhancedPrompt += `, ${enhancement.equipment}, ${enhancement.pose}`;
    }
    
    // Add environment if prompt doesn't specify one
    if (!enhancedPrompt.toLowerCase().includes('background') && !enhancedPrompt.toLowerCase().includes('environment')) {
      enhancedPrompt += `, ${enhancement.environment}`;
    }
    
    // Add Stability AI optimized style modifiers
    enhancedPrompt += `, ${enhancement.style}, fantasy art, concept art, detailed character design, high quality, masterpiece, trending on artstation, digital painting, sharp focus, illustration`;
    
    return enhancedPrompt;
  }

  // Demo image generation with procedural graphics
  generateDemoImage(prompt, selectedClass) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate unique character based on prompt hash
        const promptHash = this.hashString(prompt + selectedClass + Date.now());
        const character = this.generateCharacterFromHash(promptHash, selectedClass);
        
        // Convert SVG to blob
        const svgBlob = new Blob([character.svgContent], { type: 'image/svg+xml' });
        
        resolve({
          imageUrl: character.imageUrl,
          imageBlob: svgBlob,
          prompt: this.enhancePrompt(prompt, selectedClass),
          stats: character.stats,
          rarity: character.rarity
        });
      }, 2000); // Simulate API delay
    });
  }

  // Generate character from hash for consistency
  generateCharacterFromHash(hash, selectedClass) {
    const colors = {
      warrior: ['#ff6b35', '#f7931e', '#ffcc02', '#e74c3c'],
      mage: ['#667eea', '#764ba2', '#f093fb', '#9b59b6'],
      rogue: ['#4b6cb7', '#182848', '#2d1b69', '#34495e']
    };

    const classColors = colors[selectedClass] || colors.warrior;
    const colorIndex = hash % classColors.length;
    const primaryColor = classColors[colorIndex];
    const secondaryColor = classColors[(colorIndex + 1) % classColors.length];

    // Generate stats based on hash
    const baseStats = {
      warrior: { strength: 80, defense: 75, speed: 50, magic: 30 },
      mage: { strength: 30, defense: 40, speed: 60, magic: 85 },
      rogue: { strength: 60, defense: 45, speed: 85, magic: 45 }
    };

    const stats = { ...baseStats[selectedClass] };
    Object.keys(stats).forEach(stat => {
      const variance = (hash % 21) - 10; // -10 to +10 variance
      stats[stat] = Math.max(10, Math.min(100, stats[stat] + variance));
    });

    // Determine rarity based on total stats
    const totalStats = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
    let rarity = 'common';
    if (totalStats > 280) rarity = 'legendary';
    else if (totalStats > 260) rarity = 'epic';
    else if (totalStats > 240) rarity = 'rare';

    // Generate SVG character
    const svgContent = this.generateCharacterSVG(selectedClass, primaryColor, secondaryColor, hash);
    
    return {
      imageUrl: `data:image/svg+xml,${encodeURIComponent(svgContent)}`,
      svgContent: svgContent,
      stats,
      rarity
    };
  }

  // Generate detailed SVG character
  generateCharacterSVG(selectedClass, primaryColor, secondaryColor, hash) {
    const patterns = hash % 3;
    const accessories = (hash % 5) + 1;
    
    const classElements = {
      warrior: {
        weapon: '<path d="M180 60 L190 50 L200 60 L190 180 L180 180 Z" fill="#silver" stroke="#333" stroke-width="2"/>',
        armor: '<rect x="85" y="80" width="30" height="40" fill="url(#metalGrad)" stroke="#333" stroke-width="2" rx="5"/>',
        helmet: '<path d="M75 40 Q100 25 125 40 L125 70 L75 70 Z" fill="url(#metalGrad)" stroke="#333" stroke-width="2"/>'
      },
      mage: {
        staff: '<line x1="170" y1="30" x2="170" y2="180" stroke="#8B4513" stroke-width="6"/><circle cx="170" cy="30" r="8" fill="url(#magicGrad)" stroke="#333" stroke-width="2"/>',
        robe: '<path d="M70 100 Q100 95 130 100 L135 180 L65 180 Z" fill="url(#robeGrad)" stroke="#333" stroke-width="2"/>',
        hat: '<path d="M80 40 Q100 20 120 40 Q110 35 100 35 Q90 35 80 40 Z" fill="url(#magicGrad)" stroke="#333" stroke-width="2"/>'
      },
      rogue: {
        dagger: '<path d="M175 70 L185 65 L190 75 L185 120 L175 120 Z" fill="#666" stroke="#333" stroke-width="2"/>',
        cloak: '<path d="M60 90 Q100 85 140 90 L145 180 L55 180 Z" fill="url(#cloakGrad)" stroke="#333" stroke-width="2"/>',
        hood: '<path d="M70 35 Q100 20 130 35 L125 65 L75 65 Z" fill="url(#cloakGrad)" stroke="#333" stroke-width="2"/>'
      }
    };

    const elements = classElements[selectedClass] || classElements.warrior;

    return `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#C0C0C0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#808080;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="magicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#9B59B6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8E44AD;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3498DB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2980B9;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="cloakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2C3E50;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#34495E;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="400" fill="url(#primaryGrad)" opacity="0.1"/>
        
        <!-- Character Body -->
        <ellipse cx="100" cy="140" rx="25" ry="40" fill="url(#primaryGrad)" stroke="#333" stroke-width="2"/>
        
        <!-- Character Head -->
        <circle cx="100" cy="60" r="25" fill="#FDBCB4" stroke="#333" stroke-width="2"/>
        
        <!-- Class-specific elements -->
        ${elements.helmet || elements.hat || elements.hood || ''}
        ${elements.armor || elements.robe || elements.cloak || ''}
        ${elements.weapon || elements.staff || elements.dagger || ''}
        
        <!-- Character Features -->
        <circle cx="92" cy="55" r="2" fill="#333"/>
        <circle cx="108" cy="55" r="2" fill="#333"/>
        <path d="M95 65 Q100 70 105 65" stroke="#333" stroke-width="2" fill="none"/>
        
        <!-- Magical Aura (for all classes) -->
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#primaryGrad)" stroke-width="2" opacity="0.3" filter="url(#glow)"/>
        
        <!-- Class Symbol -->
        <text x="200" y="350" text-anchor="middle" fill="url(#primaryGrad)" font-size="60" font-family="Arial" filter="url(#glow)">
          ${selectedClass === 'warrior' ? '⚔️' : selectedClass === 'mage' ? '🔮' : '🗡️'}
        </text>
      </svg>
    `;
  }

  // Simple hash function for consistency
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Upload to IPFS using Pinata
  async uploadToIPFS(imageBlob, metadata) {
    try {
      // Try real IPFS upload if API keys are available
      if (this.pinataJWT && this.pinataJWT !== 'your_pinata_jwt_token_here') {
        return await this.uploadToPinata(imageBlob, metadata);
      }
      
      // Fallback to demo upload
      console.log('No Pinata credentials, using demo IPFS...');
      return await this.simulateIPFSUpload(metadata);
      
    } catch (error) {
      console.error('IPFS upload failed:', error);
      // Fallback to demo on error
      return await this.simulateIPFSUpload(metadata);
    }
  }

  // Real Pinata IPFS upload
  async uploadToPinata(imageBlob, metadata) {
    console.log('Uploading to Pinata IPFS...');
    
    // Upload image first
    const imageFormData = new FormData();
    imageFormData.append('file', imageBlob, 'character.png');
    imageFormData.append('pinataMetadata', JSON.stringify({
      name: `${metadata.name} - Image`,
      keyvalues: {
        type: 'character-image',
        class: metadata.class
      }
    }));

    const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.pinataJWT}`
      },
      body: imageFormData
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json();
      throw new Error(`Pinata image upload failed: ${errorData.error?.details || 'Unknown error'}`);
    }

    const imageResult = await imageResponse.json();
    const imageIPFS = `https://ipfs.io/ipfs/${imageResult.IpfsHash}`;
    
    // Update metadata with IPFS image URL
    const updatedMetadata = {
      ...metadata,
      image: imageIPFS,
      external_url: `https://chainquest.game/character/${Date.now()}`,
      animation_url: null,
      background_color: null
    };

    // Upload metadata
    const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.pinataJWT}`
      },
      body: JSON.stringify({
        pinataContent: updatedMetadata,
        pinataMetadata: {
          name: `${metadata.name} - Metadata`,
          keyvalues: {
            type: 'character-metadata',
            class: metadata.class
          }
        }
      })
    });

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json();
      throw new Error(`Pinata metadata upload failed: ${errorData.error?.details || 'Unknown error'}`);
    }

    const metadataResult = await metadataResponse.json();
    
    return {
      imageIPFS: imageIPFS,
      metadataIPFS: `https://ipfs.io/ipfs/${metadataResult.IpfsHash}`,
      imageHash: imageResult.IpfsHash,
      metadataHash: metadataResult.IpfsHash
    };
  }

  // Simulate IPFS upload for demo
  async simulateIPFSUpload(metadata) {
    console.log('Simulating IPFS upload...');
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic IPFS hashes
    const imageHash = `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`;
    const metadataHash = `QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm6nYV8h`;
    
    return {
      imageIPFS: `https://ipfs.io/ipfs/${imageHash}`,
      metadataIPFS: `https://ipfs.io/ipfs/${metadataHash}`,
      imageHash,
      metadataHash
    };
  }

  // Generate stats based on prompt analysis
  generateStatsFromPrompt(prompt, selectedClass) {
    const baseStats = {
      warrior: { strength: 80, defense: 75, speed: 50, magic: 30 },
      mage: { strength: 30, defense: 40, speed: 60, magic: 85 },
      rogue: { strength: 60, defense: 45, speed: 85, magic: 45 }
    };

    const stats = { ...baseStats[selectedClass] };
    
    // Analyze prompt for stat modifiers
    const promptLower = prompt.toLowerCase();
    
    // Strength modifiers
    if (promptLower.includes('strong') || promptLower.includes('powerful') || promptLower.includes('mighty')) {
      stats.strength += 10;
    }
    if (promptLower.includes('muscular') || promptLower.includes('buff')) {
      stats.strength += 5;
    }
    
    // Defense modifiers
    if (promptLower.includes('armor') || promptLower.includes('shield') || promptLower.includes('protected')) {
      stats.defense += 10;
    }
    if (promptLower.includes('heavy') || promptLower.includes('tank')) {
      stats.defense += 5;
    }
    
    // Speed modifiers
    if (promptLower.includes('fast') || promptLower.includes('quick') || promptLower.includes('agile')) {
      stats.speed += 10;
    }
    if (promptLower.includes('nimble') || promptLower.includes('swift')) {
      stats.speed += 5;
    }
    
    // Magic modifiers
    if (promptLower.includes('magical') || promptLower.includes('mystical') || promptLower.includes('arcane')) {
      stats.magic += 10;
    }
    if (promptLower.includes('glowing') || promptLower.includes('ethereal')) {
      stats.magic += 5;
    }
    
    // Ensure stats don't exceed 100
    Object.keys(stats).forEach(stat => {
      stats[stat] = Math.min(100, Math.max(10, stats[stat]));
    });
    
    return stats;
  }

  // Determine rarity based on prompt complexity and keywords
  determineRarity(prompt) {
    const promptLower = prompt.toLowerCase();
    let rarityScore = 0;
    
    // Legendary keywords
    const legendaryKeywords = ['legendary', 'mythical', 'divine', 'godlike', 'ultimate', 'supreme'];
    const epicKeywords = ['epic', 'heroic', 'majestic', 'powerful', 'ancient', 'mystical'];
    const rareKeywords = ['rare', 'unique', 'special', 'enchanted', 'magical'];
    
    legendaryKeywords.forEach(keyword => {
      if (promptLower.includes(keyword)) rarityScore += 3;
    });
    
    epicKeywords.forEach(keyword => {
      if (promptLower.includes(keyword)) rarityScore += 2;
    });
    
    rareKeywords.forEach(keyword => {
      if (promptLower.includes(keyword)) rarityScore += 1;
    });
    
    // Complexity bonus
    if (prompt.length > 100) rarityScore += 1;
    if (prompt.split(' ').length > 15) rarityScore += 1;
    
    if (rarityScore >= 5) return 'legendary';
    if (rarityScore >= 3) return 'epic';
    if (rarityScore >= 1) return 'rare';
    return 'common';
  }
}

export default new AIImageService();