import React from 'react';
import { Zap, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { useKwala } from '../hooks/useKwala';

const KwalaStatus = ({ compact = false }) => {
  const { status, workflows } = useKwala();

  if (compact) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem',
        background: status.connected ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 107, 53, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${status.connected ? '#00ff88' : '#ff6b35'}`
      }}>
        <Zap size={16} color={status.connected ? '#00ff88' : '#ff6b35'} />
        <span style={{ fontSize: '0.9rem', color: status.connected ? '#00ff88' : '#ff6b35' }}>
          Kwala {status.connected ? 'Active' : 'Offline'}
        </span>
      </div>
    );
  }

  return (
    <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div className="card-icon">
          <Zap size={24} />
        </div>
        <div className="card-title">Kwala Automation Status</div>
      </div>
      
      <div className="card-content">
        {/* Connection Status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1rem',
          padding: '1rem',
          background: status.connected ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 107, 53, 0.1)',
          borderRadius: '8px',
          border: `1px solid ${status.connected ? '#00ff88' : '#ff6b35'}`
        }}>
          {status.loading ? (
            <Clock size={20} color="#00d4ff" />
          ) : status.connected ? (
            <CheckCircle size={20} color="#00ff88" />
          ) : (
            <XCircle size={20} color="#ff6b35" />
          )}
          
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {status.loading ? 'Connecting...' : status.connected ? 'Connected' : 'Disconnected'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {status.loading ? 'Checking Kwala connection...' : 
               status.connected ? `Workspace: ${status.workspaceId || 'Unknown'}` : 
               status.error || 'Unable to connect to Kwala'}
            </div>
          </div>
        </div>

        {/* Active Workflows */}
        {status.connected && (
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#00d4ff' }}>Active Workflows</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {Object.entries(workflows).map(([name, workflow]) => (
                <WorkflowStatus key={name} name={name} workflow={workflow} />
              ))}
              
              {Object.keys(workflows).length === 0 && (
                <div style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  opacity: 0.6,
                  fontStyle: 'italic'
                }}>
                  Loading workflow status...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features List */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#00d4ff' }}>Automation Features</h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <FeatureItem 
              name="Quest Automation" 
              description="Monitors gameplay and completes quests automatically"
              active={status.connected}
            />
            <FeatureItem 
              name="Character Evolution" 
              description="Evolves NFT characters based on achievements"
              active={status.connected}
            />
            <FeatureItem 
              name="Tournament Management" 
              description="Creates and manages cross-chain tournaments"
              active={status.connected}
            />
            <FeatureItem 
              name="Cross-Chain Sync" 
              description="Synchronizes data across multiple blockchains"
              active={status.connected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowStatus = ({ name, workflow }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'paused': return '#ffe66d';
      case 'error': return '#ff6b35';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity size={16} />;
      case 'paused': return <Clock size={16} />;
      case 'error': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0.75rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ color: getStatusColor(workflow.status) }}>
          {getStatusIcon(workflow.status)}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            {name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            {workflow.description || 'Automated workflow'}
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '0.25rem 0.5rem',
        background: getStatusColor(workflow.status),
        color: '#000',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        {workflow.status || 'Unknown'}
      </div>
    </div>
  );
};

const FeatureItem = ({ name, description, active }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem',
    padding: '0.5rem',
    opacity: active ? 1 : 0.5
  }}>
    <div style={{ color: active ? '#00ff88' : '#666' }}>
      {active ? <CheckCircle size={16} /> : <XCircle size={16} />}
    </div>
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{name}</div>
      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{description}</div>
    </div>
  </div>
);

export default KwalaStatus;