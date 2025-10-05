const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

class KwalaService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  // Get Kwala connection status
  async getStatus() {
    try {
      const response = await fetch(`${this.baseURL}/kwala/status`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching Kwala status:', error);
      return { connected: false, error: error.message };
    }
  }

  // Get active workflows
  async getWorkflows() {
    try {
      const response = await fetch(`${this.baseURL}/kwala/workflows`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return { workflows: [], error: error.message };
    }
  }

  // Get workflow status
  async getWorkflowStatus(workflowName) {
    try {
      const response = await fetch(`${this.baseURL}/kwala/workflows/${workflowName}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching workflow status:', error);
      return { status: 'error', error: error.message };
    }
  }

  // Trigger workflow
  async triggerWorkflow(workflowName, parameters = {}) {
    try {
      const response = await fetch(`${this.baseURL}/kwala/workflows/${workflowName}/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parameters })
      });
      return await response.json();
    } catch (error) {
      console.error('Error triggering workflow:', error);
      return { status: 'error', error: error.message };
    }
  }

  // Get workflow history
  async getWorkflowHistory(workflowName, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/kwala/workflows/${workflowName}/history?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching workflow history:', error);
      return { executions: [], error: error.message };
    }
  }

  // Quest-related methods
  async getPlayerQuests(playerAddress) {
    try {
      const response = await fetch(`${this.baseURL}/quests/${playerAddress}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching player quests:', error);
      return { quests: [], error: error.message };
    }
  }

  async completeQuest(player, questId) {
    try {
      const response = await fetch(`${this.baseURL}/quests/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player, questId })
      });
      return await response.json();
    } catch (error) {
      console.error('Error completing quest:', error);
      return { status: 'error', error: error.message };
    }
  }

  // Character-related methods
  async checkEvolutionEligibility(tokenId, owner) {
    try {
      const response = await fetch(`${this.baseURL}/characters/${tokenId}/evolution/check?owner=${owner}`);
      return await response.json();
    } catch (error) {
      console.error('Error checking evolution eligibility:', error);
      return { eligibility: { eligible: false }, error: error.message };
    }
  }

  async triggerEvolution(tokenId, owner) {
    try {
      const response = await fetch(`${this.baseURL}/characters/${tokenId}/evolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner })
      });
      return await response.json();
    } catch (error) {
      console.error('Error triggering evolution:', error);
      return { status: 'error', error: error.message };
    }
  }

  // Tournament-related methods
  async createTournament(type) {
    try {
      const response = await fetch(`${this.baseURL}/tournaments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating tournament:', error);
      return { status: 'error', error: error.message };
    }
  }

  async getTournamentTypes() {
    try {
      const response = await fetch(`${this.baseURL}/tournaments/types`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tournament types:', error);
      return { types: {}, error: error.message };
    }
  }
}

export default new KwalaService();