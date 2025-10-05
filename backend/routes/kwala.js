const express = require('express');
const router = express.Router();
const kwalaClient = require('../services/kwalaClient');

// Get Kwala connection status
router.get('/status', async (req, res) => {
  try {
    const workflows = await kwalaClient.getActiveWorkflows();
    
    res.json({
      connected: !!process.env.KWALA_API_KEY,
      workspaceId: process.env.KWALA_WORKSPACE_ID || null,
      activeWorkflows: workflows.workflows || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get Kwala status',
      message: error.message
    });
  }
});

// Get specific workflow status
router.get('/workflows/:workflowName', async (req, res) => {
  try {
    const { workflowName } = req.params;
    const status = await kwalaClient.getWorkflowStatus(workflowName);
    
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get workflow status',
      message: error.message
    });
  }
});

// Trigger workflow manually
router.post('/workflows/:workflowName/trigger', async (req, res) => {
  try {
    const { workflowName } = req.params;
    const { parameters } = req.body;
    
    const result = await kwalaClient.triggerWorkflow(workflowName, parameters);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to trigger workflow',
      message: error.message
    });
  }
});

// Get workflow execution history
router.get('/workflows/:workflowName/history', async (req, res) => {
  try {
    const { workflowName } = req.params;
    const { limit } = req.query;
    
    const history = await kwalaClient.getWorkflowHistory(workflowName, limit);
    
    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get workflow history',
      message: error.message
    });
  }
});

// Get all active workflows
router.get('/workflows', async (req, res) => {
  try {
    const workflows = await kwalaClient.getActiveWorkflows();
    
    res.json(workflows);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get workflows',
      message: error.message
    });
  }
});

module.exports = router;