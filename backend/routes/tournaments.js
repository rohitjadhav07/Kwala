const express = require('express');
const router = express.Router();
const { createAutomaticTournament, tournamentTypes } = require('../handlers/tournamentHandler');

// Get tournament types
router.get('/types', (req, res) => {
  res.json({
    types: tournamentTypes,
    timestamp: new Date().toISOString()
  });
});

// Create tournament manually
router.post('/create', async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!type || !tournamentTypes[type]) {
      return res.status(400).json({ 
        error: 'Invalid tournament type',
        availableTypes: Object.keys(tournamentTypes)
      });
    }
    
    const result = await createAutomaticTournament(type);
    
    res.json({
      status: 'created',
      tournament: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create tournament',
      message: error.message
    });
  }
});

// Trigger tournament workflow
router.post('/trigger/:workflowType', async (req, res) => {
  try {
    const { workflowType } = req.params;
    const parameters = req.body;
    
    const kwalaClient = require('../services/kwalaClient');
    const result = await kwalaClient.triggerWorkflow('cross-chain-tournaments', {
      action: workflowType,
      ...parameters
    });
    
    res.json({
      status: 'triggered',
      workflowType,
      parameters,
      kwalaResult: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to trigger tournament workflow',
      message: error.message
    });
  }
});

module.exports = router;