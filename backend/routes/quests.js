const express = require('express');
const router = express.Router();
const { generateDailyQuests, questTemplates } = require('../handlers/questHandler');

// Get available quests for a player
router.get('/:playerAddress', async (req, res) => {
  try {
    const { playerAddress } = req.params;
    
    if (!playerAddress || !playerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid player address' });
    }
    
    const quests = await generateDailyQuests(playerAddress);
    
    res.json({
      player: playerAddress,
      quests,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get quests',
      message: error.message
    });
  }
});

// Get quest templates
router.get('/', (req, res) => {
  res.json({
    templates: questTemplates,
    timestamp: new Date().toISOString()
  });
});

// Manually trigger quest completion (for testing)
router.post('/complete', async (req, res) => {
  try {
    const { player, questId } = req.body;
    
    if (!player || !questId) {
      return res.status(400).json({ error: 'Missing player or questId' });
    }
    
    // Trigger Kwala workflow for quest completion
    const kwalaClient = require('../services/kwalaClient');
    const result = await kwalaClient.triggerWorkflow('quest-automation', {
      player,
      questId,
      action: 'complete'
    });
    
    res.json({
      status: 'triggered',
      player,
      questId,
      kwalaResult: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to complete quest',
      message: error.message
    });
  }
});

module.exports = router;