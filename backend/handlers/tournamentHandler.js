const { ethers } = require('ethers');

// Tournament types and configurations
const tournamentTypes = {
  'weekly_championship': {
    name: 'Weekly Championship',
    duration: '7d',
    maxParticipants: 64,
    entryFee: 50,
    prizePool: 1000,
    format: 'elimination'
  },
  'daily_skirmish': {
    name: 'Daily Skirmish',
    duration: '4h',
    maxParticipants: 16,
    entryFee: 10,
    prizePool: 100,
    format: 'round_robin'
  },
  'cross_chain_grand_prix': {
    name: 'Cross-Chain Grand Prix',
    duration: '30d',
    maxParticipants: 256,
    entryFee: 200,
    prizePool: 10000,
    format: 'swiss'
  }
};

// Prize distribution percentages
const prizeDistribution = {
  1: 0.50, // 1st place gets 50%
  2: 0.25, // 2nd place gets 25%
  3: 0.15, // 3rd place gets 15%
  4: 0.10  // 4th place gets 10%
};

// Handle tournament events from Kwala webhooks
async function handleTournamentEvent(data) {
  try {
    const { type, ...eventData } = data;
    
    console.log(`🏆 Processing tournament event: ${type}`);
    
    switch (type) {
      case 'created':
        return await handleTournamentCreation(eventData);
      case 'battle_completed':
        return await handleBattleCompletion(eventData);
      case 'completed':
        return await handleTournamentCompletion(eventData);
      default:
        throw new Error(`Unknown tournament event type: ${type}`);
    }
  } catch (error) {
    console.error('Error handling tournament event:', error);
    throw error;
  }
}

// Handle tournament creation
async function handleTournamentCreation(data) {
  try {
    const { tournamentId, tournamentType, prizePool, registrationDeadline, timestamp } = data;
    
    const config = tournamentTypes[tournamentType];
    if (!config) {
      throw new Error(`Unknown tournament type: ${tournamentType}`);
    }

    const tournament = {
      id: tournamentId,
      type: tournamentType,
      name: config.name,
      status: 'registration_open',
      prizePool: prizePool || config.prizePool,
      maxParticipants: config.maxParticipants,
      entryFee: config.entryFee,
      format: config.format,
      registrationDeadline,
      createdAt: timestamp,
      participants: [],
      brackets: null,
      currentRound: 0
    };

    // Store tournament in database
    await storeTournament(tournament);
    
    // Notify players about new tournament
    await notifyPlayersAboutTournament(tournament);
    
    console.log(`✅ Tournament created: ${tournament.name} (ID: ${tournamentId})`);
    
    return {
      tournamentId,
      status: 'created',
      tournament
    };
  } catch (error) {
    console.error('Error handling tournament creation:', error);
    throw error;
  }
}

// Handle battle completion
async function handleBattleCompletion(data) {
  try {
    const { battleId, winner, loser, tournamentId, timestamp } = data;
    
    console.log(`⚔️ Battle completed: ${winner} defeated ${loser}`);
    
    // Update tournament brackets
    const tournament = await getTournament(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament not found: ${tournamentId}`);
    }

    // Record battle result
    const battleResult = {
      id: battleId,
      tournamentId,
      winner,
      loser,
      timestamp,
      round: tournament.currentRound
    };

    await storeBattleResult(battleResult);
    
    // Update player stats
    await updatePlayerStats(winner, 'win');
    await updatePlayerStats(loser, 'loss');
    
    // Check if round is complete
    const roundComplete = await checkRoundCompletion(tournamentId);
    
    let result = {
      battleId,
      tournamentId,
      winner,
      loser,
      roundComplete
    };

    if (roundComplete) {
      // Advance to next round or complete tournament
      const advanceResult = await advanceTournament(tournamentId);
      result = { ...result, ...advanceResult };
    }
    
    return result;
  } catch (error) {
    console.error('Error handling battle completion:', error);
    throw error;
  }
}

// Handle tournament completion
async function handleTournamentCompletion(data) {
  try {
    const { tournamentId, winners, totalPrizes, timestamp } = data;
    
    console.log(`🎉 Tournament completed: ${tournamentId}`);
    
    // Calculate and distribute prizes
    const prizeDistributionResult = await distributePrizes(tournamentId, winners, totalPrizes);
    
    // Update tournament status
    await updateTournamentStatus(tournamentId, 'completed', timestamp);
    
    // Award achievements
    const achievements = await awardTournamentAchievements(winners);
    
    // Update leaderboards
    await updateGlobalLeaderboard(winners);
    
    return {
      tournamentId,
      status: 'completed',
      winners,
      prizeDistribution: prizeDistributionResult,
      achievements,
      completedAt: timestamp
    };
  } catch (error) {
    console.error('Error handling tournament completion:', error);
    throw error;
  }
}

// Create tournament automatically
async function createAutomaticTournament(type) {
  try {
    const config = tournamentTypes[type];
    if (!config) {
      throw new Error(`Unknown tournament type: ${type}`);
    }

    const tournamentId = generateTournamentId();
    const registrationDeadline = new Date();
    registrationDeadline.setHours(registrationDeadline.getHours() + 24); // 24 hours to register

    const tournamentData = {
      tournamentId,
      tournamentType: type,
      prizePool: config.prizePool,
      registrationDeadline: registrationDeadline.toISOString(),
      timestamp: new Date().toISOString()
    };

    return await handleTournamentCreation(tournamentData);
  } catch (error) {
    console.error('Error creating automatic tournament:', error);
    throw error;
  }
}

// Cross-chain matchmaking
async function performCrossChainMatchmaking(tournamentId, playerChain, playerStats) {
  try {
    console.log(`🔗 Performing cross-chain matchmaking for tournament ${tournamentId}`);
    
    // Get all registered players from all chains
    const allPlayers = await getAllTournamentPlayers(tournamentId);
    
    // Filter out players from same chain (for cross-chain requirement)
    const crossChainPlayers = allPlayers.filter(p => p.chain !== playerChain);
    
    // Find best match based on stats
    const bestMatch = findBestMatch(playerStats, crossChainPlayers);
    
    if (bestMatch) {
      return {
        matched: true,
        player1: { chain: playerChain, stats: playerStats },
        player2: bestMatch,
        estimatedBattleTime: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
      };
    }
    
    return {
      matched: false,
      reason: 'No suitable cross-chain opponent found',
      waitingPlayers: crossChainPlayers.length
    };
  } catch (error) {
    console.error('Error in cross-chain matchmaking:', error);
    throw error;
  }
}

// Helper functions
function generateTournamentId() {
  return `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function findBestMatch(playerStats, opponents) {
  if (opponents.length === 0) return null;
  
  // Simple matchmaking based on total stats
  const playerTotal = Object.values(playerStats).reduce((sum, stat) => sum + stat, 0);
  
  let bestMatch = null;
  let smallestDifference = Infinity;
  
  for (const opponent of opponents) {
    const opponentTotal = Object.values(opponent.stats).reduce((sum, stat) => sum + stat, 0);
    const difference = Math.abs(playerTotal - opponentTotal);
    
    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestMatch = opponent;
    }
  }
  
  return bestMatch;
}

// Mock database functions
async function storeTournament(tournament) {
  console.log('💾 Storing tournament:', tournament);
  return true;
}

async function getTournament(tournamentId) {
  // Mock tournament data
  return {
    id: tournamentId,
    currentRound: 1,
    status: 'in_progress',
    participants: []
  };
}

async function storeBattleResult(result) {
  console.log('💾 Storing battle result:', result);
  return true;
}

async function updatePlayerStats(playerAddress, result) {
  console.log(`📊 Updating player stats: ${playerAddress} - ${result}`);
  return true;
}

async function checkRoundCompletion(tournamentId) {
  // Mock round completion check
  return Math.random() > 0.7; // 30% chance round is complete
}

async function advanceTournament(tournamentId) {
  console.log(`⏭️ Advancing tournament: ${tournamentId}`);
  return { advanced: true, newRound: 2 };
}

async function distributePrizes(tournamentId, winners, totalPrizes) {
  console.log(`💰 Distributing prizes for tournament: ${tournamentId}`);
  
  const distribution = {};
  winners.forEach((winner, index) => {
    const place = index + 1;
    const percentage = prizeDistribution[place] || 0;
    distribution[winner] = Math.floor(totalPrizes * percentage);
  });
  
  return distribution;
}

async function updateTournamentStatus(tournamentId, status, timestamp) {
  console.log(`📝 Updating tournament status: ${tournamentId} -> ${status}`);
  return true;
}

async function awardTournamentAchievements(winners) {
  console.log('🏆 Awarding tournament achievements to:', winners);
  return ['Tournament Winner', 'Champion'];
}

async function updateGlobalLeaderboard(winners) {
  console.log('📈 Updating global leaderboard with winners:', winners);
  return true;
}

async function notifyPlayersAboutTournament(tournament) {
  console.log('📢 Notifying players about new tournament:', tournament.name);
  return true;
}

async function getAllTournamentPlayers(tournamentId) {
  // Mock player data from multiple chains
  return [
    { address: '0x123...', chain: 'ethereum', stats: { attack: 100, defense: 90 } },
    { address: '0x456...', chain: 'polygon', stats: { attack: 95, defense: 105 } },
    { address: '0x789...', chain: 'bsc', stats: { attack: 110, defense: 85 } }
  ];
}

module.exports = {
  handleTournamentEvent,
  createAutomaticTournament,
  performCrossChainMatchmaking,
  tournamentTypes
};