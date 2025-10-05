import { useState, useEffect, useCallback } from 'react';
import kwalaService from '../services/kwalaService';

export const useKwala = () => {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null,
    workspaceId: null,
    activeWorkflows: []
  });

  const [workflows, setWorkflows] = useState({});

  // Fetch Kwala status
  const fetchStatus = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));
      const statusData = await kwalaService.getStatus();
      
      setStatus({
        connected: statusData.connected || false,
        loading: false,
        error: statusData.error || null,
        workspaceId: statusData.workspaceId || null,
        activeWorkflows: statusData.activeWorkflows || []
      });
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: error.message,
        workspaceId: null,
        activeWorkflows: []
      });
    }
  }, []);

  // Fetch workflow status
  const getWorkflowStatus = useCallback(async (workflowName) => {
    try {
      const workflowStatus = await kwalaService.getWorkflowStatus(workflowName);
      setWorkflows(prev => ({
        ...prev,
        [workflowName]: workflowStatus
      }));
      return workflowStatus;
    } catch (error) {
      console.error(`Error fetching ${workflowName} status:`, error);
      return { status: 'error', error: error.message };
    }
  }, []);

  // Trigger workflow
  const triggerWorkflow = useCallback(async (workflowName, parameters = {}) => {
    try {
      const result = await kwalaService.triggerWorkflow(workflowName, parameters);
      
      // Refresh workflow status after triggering
      setTimeout(() => {
        getWorkflowStatus(workflowName);
      }, 1000);
      
      return result;
    } catch (error) {
      console.error(`Error triggering ${workflowName}:`, error);
      return { status: 'error', error: error.message };
    }
  }, [getWorkflowStatus]);

  // Initialize on mount
  useEffect(() => {
    fetchStatus();
    
    // Fetch status of key workflows
    const keyWorkflows = ['quest-automation', 'nft-evolution', 'cross-chain-tournaments'];
    keyWorkflows.forEach(workflow => {
      getWorkflowStatus(workflow);
    });
  }, [fetchStatus, getWorkflowStatus]);

  return {
    status,
    workflows,
    fetchStatus,
    getWorkflowStatus,
    triggerWorkflow
  };
};

export const useKwalaQuests = (playerAddress) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuests = useCallback(async () => {
    if (!playerAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      const questData = await kwalaService.getPlayerQuests(playerAddress);
      
      if (questData.error) {
        setError(questData.error);
      } else {
        setQuests(questData.quests || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playerAddress]);

  const completeQuest = useCallback(async (questId) => {
    if (!playerAddress) return;
    
    try {
      const result = await kwalaService.completeQuest(playerAddress, questId);
      
      if (result.status === 'triggered') {
        // Refresh quests after completion
        setTimeout(fetchQuests, 2000);
      }
      
      return result;
    } catch (error) {
      console.error('Error completing quest:', error);
      return { status: 'error', error: error.message };
    }
  }, [playerAddress, fetchQuests]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    loading,
    error,
    fetchQuests,
    completeQuest
  };
};

export const useKwalaCharacters = () => {
  const checkEvolution = useCallback(async (tokenId, owner) => {
    try {
      return await kwalaService.checkEvolutionEligibility(tokenId, owner);
    } catch (error) {
      console.error('Error checking evolution:', error);
      return { eligibility: { eligible: false }, error: error.message };
    }
  }, []);

  const triggerEvolution = useCallback(async (tokenId, owner) => {
    try {
      return await kwalaService.triggerEvolution(tokenId, owner);
    } catch (error) {
      console.error('Error triggering evolution:', error);
      return { status: 'error', error: error.message };
    }
  }, []);

  return {
    checkEvolution,
    triggerEvolution
  };
};

export const useKwalaTournaments = () => {
  const [tournamentTypes, setTournamentTypes] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTournamentTypes = useCallback(async () => {
    try {
      setLoading(true);
      const typesData = await kwalaService.getTournamentTypes();
      setTournamentTypes(typesData.types || {});
    } catch (error) {
      console.error('Error fetching tournament types:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTournament = useCallback(async (type) => {
    try {
      return await kwalaService.createTournament(type);
    } catch (error) {
      console.error('Error creating tournament:', error);
      return { status: 'error', error: error.message };
    }
  }, []);

  useEffect(() => {
    fetchTournamentTypes();
  }, [fetchTournamentTypes]);

  return {
    tournamentTypes,
    loading,
    createTournament,
    fetchTournamentTypes
  };
};