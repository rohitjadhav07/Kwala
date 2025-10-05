const { ethers } = require('ethers');

// Character evolution thresholds and bonuses
const evolutionThresholds = {
  1: { xp: 0, name: 'Novice' },
  2: { xp: 1000, name: 'Apprentice' },
  3: { xp: 3000, name: 'Journeyman' },
  4: { xp: 6000, name: 'Expert' },
  5: { xp: 10000, name: 'Master' },
  6: { xp: 15000, name: 'Grandmaster' },
  7: { xp: 25000, name: 'Legend' },
  8: { xp: 40000, name: 'Mythic' },
  9: { xp: 60000, name: 'Transcendent' },
  10: { xp: 100000, name: 'Eternal' }
};

const characterClasses = {
  'warrior': {
    baseStats: { attack: 100, defense: 120, speed: 80, magic: 60 },
    growthRates: { attack: 1.2, defense: 1.3, speed: 1.0, magic: 0.8 }
  },
  'mage': {
    baseStats: { attack: 70, defense: 80, speed: 90, magic: 140 },
    growthRates: { attack: 0.9, defense: 0.8, speed: 1.1, magic: 1.4 }
  },
  'archer': {
    baseStats: { attack: 110, defense: 90, speed: 130, magic: 70 },
    growthRates: { attack: 1.3, defense: 0.9, speed: 1.3, magic: 0.9 }
  }
};

// Handle character evolution from Kwala webhook
async function handleCharacterEvolution(data) {
  try {
    const { tokenId, owner, oldLevel, newLevel, chain, timestamp } = data;
    
    console.log(`🧬 Processing character evolution: Token ${tokenId} from level ${oldLevel} to ${newLevel}`);
    
    // Get character data
    const character = await getCharacterData(tokenId);
    if (!character) {
      throw new Error(`Character not found: ${tokenId}`);
    }

    // Calculate new stats
    const newStats = calculateEvolutionStats(character, oldLevel, newLevel);
    
    // Generate evolution rewards
    const rewards = calculateEvolutionRewards(oldLevel, newLevel);
    
    // Update character metadata
    const updatedMetadata = {
      ...character.metadata,
      level: newLevel,
      stats: newStats,
      evolutionHistory: [
        ...(character.metadata.evolutionHistory || []),
        {
          fromLevel: oldLevel,
          toLevel: newLevel,
          timestamp,
          statsGained: {
            attack: newStats.attack - character.metadata.stats.attack,
            defense: newStats.defense - character.metadata.stats.defense,
            speed: newStats.speed - character.metadata.stats.speed,
            magic: newStats.magic - character.metadata.stats.magic
          }
        }
      ]
    };

    const result = {
      tokenId,
      owner,
      oldLevel,
      newLevel,
      oldStats: character.metadata.stats,
      newStats,
      rewards,
      evolutionName: evolutionThresholds[newLevel]?.name || 'Unknown',
      timestamp,
      chain,
      transactionHash: null
    };

    // Update blockchain (in production)
    if (process.env.NODE_ENV !== 'development') {
      // const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
      // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      // const contract = new ethers.Contract(contractAddress, abi, wallet);
      // const tx = await contract.evolveCharacter(tokenId, newLevel, newStats);
      // result.transactionHash = tx.hash;
    }

    // Store evolution in database
    await storeCharacterEvolution(result);
    
    // Update character metadata
    await updateCharacterMetadata(tokenId, updatedMetadata);
    
    // Check for special evolution achievements
    await checkEvolutionAchievements(owner, newLevel);
    
    return result;
  } catch (error) {
    console.error('Error handling character evolution:', error);
    throw error;
  }
}

// Check if character is eligible for evolution
async function checkEvolutionEligibility(tokenId, owner) {
  try {
    console.log(`🔍 Checking evolution eligibility for token ${tokenId}`);
    
    const character = await getCharacterData(tokenId);
    if (!character) {
      return { eligible: false, reason: 'Character not found' };
    }

    const currentLevel = character.metadata.level || 1;
    const currentXP = character.metadata.experience || 0;
    const nextLevel = currentLevel + 1;
    
    // Check if next level exists
    if (!evolutionThresholds[nextLevel]) {
      return { eligible: false, reason: 'Maximum level reached' };
    }
    
    const requiredXP = evolutionThresholds[nextLevel].xp;
    
    if (currentXP >= requiredXP) {
      const newStats = calculateEvolutionStats(character, currentLevel, nextLevel);
      
      return {
        eligible: true,
        currentLevel,
        newLevel: nextLevel,
        currentXP,
        requiredXP,
        newStats,
        evolutionName: evolutionThresholds[nextLevel].name
      };
    }
    
    return {
      eligible: false,
      reason: 'Insufficient experience',
      currentXP,
      requiredXP,
      xpNeeded: requiredXP - currentXP
    };
  } catch (error) {
    console.error('Error checking evolution eligibility:', error);
    throw error;
  }
}

// Calculate new stats after evolution
function calculateEvolutionStats(character, oldLevel, newLevel) {
  const characterClass = character.metadata.class || 'warrior';
  const classData = characterClasses[characterClass] || characterClasses.warrior;
  
  const currentStats = character.metadata.stats || classData.baseStats;
  const levelDifference = newLevel - oldLevel;
  
  // Calculate stat increases based on class growth rates
  const statIncrease = {
    attack: Math.floor(levelDifference * 10 * classData.growthRates.attack),
    defense: Math.floor(levelDifference * 10 * classData.growthRates.defense),
    speed: Math.floor(levelDifference * 10 * classData.growthRates.speed),
    magic: Math.floor(levelDifference * 10 * classData.growthRates.magic)
  };
  
  return {
    attack: currentStats.attack + statIncrease.attack,
    defense: currentStats.defense + statIncrease.defense,
    speed: currentStats.speed + statIncrease.speed,
    magic: currentStats.magic + statIncrease.magic
  };
}

// Calculate evolution rewards
function calculateEvolutionRewards(oldLevel, newLevel) {
  const levelDifference = newLevel - oldLevel;
  
  return {
    tokens: levelDifference * 100, // 100 tokens per level
    xp: 0, // No additional XP for evolution
    items: generateEvolutionItems(newLevel)
  };
}

// Generate special items for evolution
function generateEvolutionItems(level) {
  const items = [];
  
  // Special items at certain levels
  if (level === 5) {
    items.push({ name: 'Master\'s Emblem', rarity: 'rare' });
  }
  if (level === 7) {
    items.push({ name: 'Legendary Crest', rarity: 'legendary' });
  }
  if (level === 10) {
    items.push({ name: 'Eternal Crown', rarity: 'mythic' });
  }
  
  return items;
}

// Mock database functions
async function getCharacterData(tokenId) {
  // Mock character data - in production, fetch from database or blockchain
  return {
    tokenId,
    metadata: {
      level: 1,
      class: 'warrior',
      experience: 1500,
      stats: {
        attack: 100,
        defense: 120,
        speed: 80,
        magic: 60
      },
      evolutionHistory: []
    }
  };
}

async function storeCharacterEvolution(evolution) {
  console.log('💾 Storing character evolution:', evolution);
  return true;
}

async function updateCharacterMetadata(tokenId, metadata) {
  console.log('📝 Updating character metadata:', { tokenId, metadata });
  return true;
}

async function checkEvolutionAchievements(owner, level) {
  console.log(`🏆 Checking evolution achievements for ${owner} at level ${level}`);
  
  // Award achievements for milestone levels
  const achievements = [];
  
  if (level === 5) {
    achievements.push('Master Trainer');
  }
  if (level === 10) {
    achievements.push('Eternal Champion');
  }
  
  return achievements;
}

module.exports = {
  handleCharacterEvolution,
  checkEvolutionEligibility,
  evolutionThresholds,
  characterClasses
};