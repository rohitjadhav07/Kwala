const express = require('express');
const router = express.Router();
const kwalaClient = require('../services/kwalaClient');
const { handleQuestCompletion } = require('../handlers/questHandler');
const { handleCharacterEvolution } = require('../handlers/characterHandler');
const { handleTournamentEvent } = require('../handlers/tournamentHandler');

// Middleware to verify Kwala webhook signatures
const verifyKwalaWebhook = (req, res, next) => {
  const signature = req.headers['x-kwala-signature'];
  
  if (!signature) {
    return res.status(401).json({ error: 'Missing webhook signature' });
  }

  const isValid = kwalaClient.verifyWebhookSignature(req.body, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  next();
};

// Quest completion webhook
router.post('/quest-completed', verifyKwalaWebhook, async (req, res) => {
  try {
    console.log('🎯 Quest completion webhook received:', req.body);
    
    const { player, questId, rewards, chain } = req.body;
    
    // Handle quest completion
    const result = await handleQuestCompletion({
      player,
      questId,
      rewards,
      chain,
      timestamp: new Date().toISOString()
    });

    // Respond to Kwala
    res.json({ 
      status: 'success', 
      processed: true,
      result 
    });

    console.log('✅ Quest completion processed successfully');
  } catch (error) {
    console.error('❌ Error processing quest completion:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Character evolution webhook
router.post('/evolution', verifyKwalaWebhook, async (req, res) => {
  try {
    console.log('🧬 Character evolution webhook received:', req.body);
    
    const { tokenId, owner, oldLevel, newLevel, chain } = req.body;
    
    // Handle character evolution
    const result = await handleCharacterEvolution({
      tokenId,
      owner,
      oldLevel,
      newLevel,
      chain,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      status: 'success', 
      processed: true,
      result 
    });

    console.log('✅ Character evolution processed successfully');
  } catch (error) {
    console.error('❌ Error processing character evolution:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Tournament event webhook
router.post('/tournament-created', verifyKwalaWebhook, async (req, res) => {
  try {
    console.log('🏆 Tournament creation webhook received:', req.body);
    
    const { tournamentId, type, prizePool, registrationDeadline } = req.body;
    
    // Handle tournament creation
    const result = await handleTournamentEvent({
      type: 'created',
      tournamentId,
      tournamentType: type,
      prizePool,
      registrationDeadline,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      status: 'success', 
      processed: true,
      result 
    });

    console.log('✅ Tournament creation processed successfully');
  } catch (error) {
    console.error('❌ Error processing tournament creation:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Battle result webhook
router.post('/battle-result', verifyKwalaWebhook, async (req, res) => {
  try {
    console.log('⚔️ Battle result webhook received:', req.body);
    
    const { battleId, winner, loser, tournamentId } = req.body;
    
    // Handle battle result
    const result = await handleTournamentEvent({
      type: 'battle_completed',
      battleId,
      winner,
      loser,
      tournamentId,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      status: 'success', 
      processed: true,
      result 
    });

    console.log('✅ Battle result processed successfully');
  } catch (error) {
    console.error('❌ Error processing battle result:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Tournament completion webhook
router.post('/tournament-completed', verifyKwalaWebhook, async (req, res) => {
  try {
    console.log('🎉 Tournament completion webhook received:', req.body);
    
    const { tournamentId, winners, totalPrizes } = req.body;
    
    // Handle tournament completion
    const result = await handleTournamentEvent({
      type: 'completed',
      tournamentId,
      winners,
      totalPrizes,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      status: 'success', 
      processed: true,
      result 
    });

    console.log('✅ Tournament completion processed successfully');
  } catch (error) {
    console.error('❌ Error processing tournament completion:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// NFT activity webhook (simplified)
router.post('/nft-activity', (req, res) => {
  try {
    console.log('🎨 NFT activity webhook received:', req.body);
    
    const { message, from, to, tokenId } = req.body;
    
    // Simple processing - just log the activity
    console.log(`NFT Transfer: Token ${tokenId} from ${from} to ${to}`);
    
    // You can add your game logic here:
    // - Award quest completion
    // - Trigger character evolution
    // - Create tournaments
    // - Update leaderboards
    
    res.json({ 
      status: 'success', 
      message: 'NFT activity processed',
      timestamp: new Date().toISOString(),
      data: {
        tokenId,
        from,
        to,
        processed: true
      }
    });
    
  } catch (error) {
    console.error('❌ Error processing NFT activity:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Generic webhook for testing
router.post('/test', (req, res) => {
  console.log('🧪 Test webhook received:', req.body);
  res.json({ 
    status: 'success', 
    message: 'Test webhook received',
    timestamp: new Date().toISOString(),
    payload: req.body
  });
});

module.exports = router;