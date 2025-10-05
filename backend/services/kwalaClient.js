const axios = require('axios');
const crypto = require('crypto');

class KwalaClient {
  constructor() {
    this.apiKey = process.env.KWALA_API_KEY;
    this.workspaceId = process.env.KWALA_WORKSPACE_ID;
    this.baseURL = 'https://api.kwala.com/v1';
    this.webhookSecret = process.env.KWALA_WEBHOOK_SECRET;
    
    if (!this.apiKey || !this.workspaceId) {
      console.warn('⚠️ Kwala credentials not configured');
    }
  }

  // Verify webhook signature for security
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) {
      console.warn('⚠️ Webhook secret not configured');
      return false;
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Get workflow status
  async getWorkflowStatus(workflowName) {
    try {
      const response = await axios.get(
        `${this.baseURL}/workspaces/${this.workspaceId}/workflows/${workflowName}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow status:', error.message);
      return { status: 'error', message: error.message };
    }
  }

  // Trigger workflow manually
  async triggerWorkflow(workflowName, parameters = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/workspaces/${this.workspaceId}/workflows/${workflowName}/trigger`,
        {
          parameters,
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error triggering workflow:', error.message);
      return { status: 'error', message: error.message };
    }
  }

  // Get all active workflows
  async getActiveWorkflows() {
    try {
      const response = await axios.get(
        `${this.baseURL}/workspaces/${this.workspaceId}/workflows`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching workflows:', error.message);
      return { workflows: [], error: error.message };
    }
  }

  // Update workflow configuration
  async updateWorkflow(workflowName, config) {
    try {
      const response = await axios.put(
        `${this.baseURL}/workspaces/${this.workspaceId}/workflows/${workflowName}`,
        config,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating workflow:', error.message);
      return { status: 'error', message: error.message };
    }
  }

  // Get workflow execution history
  async getWorkflowHistory(workflowName, limit = 50) {
    try {
      const response = await axios.get(
        `${this.baseURL}/workspaces/${this.workspaceId}/workflows/${workflowName}/executions?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow history:', error.message);
      return { executions: [], error: error.message };
    }
  }
}

module.exports = new KwalaClient();