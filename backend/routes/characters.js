const express = require('express');
const router = express.Router();
const { checkEvolutionEligibility, evolutionThresholds, characterClasses } = require('../handlers/characterHandler');

// Get evolution thresholds
router.get('/evolution/thresholds', (req, res) => {
  res.json({
    thresholds: evolutionThresholds,
    timestamp: new Date().toISOString()
  });
});

// Get character classes
router.get('/classes', (req, res) => {
  res.json({
    classes: characterClasses,
    timestamp: new Date().toISOString()
  });
});

// Check evolution eligibility
router.get('/:tokenId/evolution/check', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { owner } = req.query;
    
    if (!tokenId || !owner) {
      return res.status(400).json({ error: 'Missing tokenId or owner' });
    }
    
    const eligibility = await checkEvolutionEligibility(tokenId, owner);
    
    res.json({
      tokenId,
      owner,
      eligibility,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check evolution eligibility',
      message: error.message
    });
  }
});

// Trigger character evolution
router.post('/:tokenId/evolve', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { owner } = req.body;
    
    if (!tokenId || !owner) {
      return res.status(400).json({ error: 'Missing tokenId or owner' });
    }
    
    // Trigger Kwala workflow for character evolution
    const kwalaClient = require('../services/kwalaClient');
    const result = await kwalaClient.triggerWorkflow('nft-evolution', {
      tokenId,
      owner,
      action: 'evolve'
    });
    
    res.json({
      status: 'triggered',
      tokenId,
      owner,
      kwalaResult: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to trigger evolution',
      message: error.message
    });
  }
});

module.exports = router;