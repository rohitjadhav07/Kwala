import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Map, Clock, Trophy, Zap, CheckCircle, Circle } from 'lucide-react';
import { useQuests } from '../hooks/useQuests';

const Quests = () => {
  const { address, isConnected } = useAccount();
  const { quests, loading, completeQuest, updateQuestProgress } = useQuests();
  const [filter, setFilter] = useState('all');

  const filteredQuests = quests.filter(quest => {
    if (filter === 'all') return true;
    if (filter === 'completed') return quest.status === 'completed';
    return quest.type === filter;
  });

  const getQuestTypeColor = (type) => {
    switch (type) {
      case 'daily': return '#ff6b6b';
      case 'weekly': return '#4ecdc4';
      case 'achievement': return '#ffe66d';
      case 'ongoing': return '#a8e6cf';
      default: return '#00d4ff';
    }
  };

  const getChainColor = (chain) => {
    switch (chain) {
      case 'ethereum': return '#627eea';
      case 'polygon': return '#8247e5';
      case 'bsc': return '#f3ba2f';
      case 'arbitrum': return '#28a0f0';
      case 'multi': return '#00d4ff';
      default: return '#00d4ff';
    }
  };

  if (!isConnected) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to view and track your quests automatically with Kwala.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Quest Hub</h1>
        <p>Your quests are automatically tracked and completed by Kwala automation</p>
      </div>

      {/* Quest Automation Status */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Zap size={24} />
          </div>
          <div className="card-title">Quest Automation</div>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: '#00ff88',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>Auto-Tracking Active</span>
          </div>
          <p>
            Your quests are automatically tracked and completed when requirements are met. 
            Rewards are distributed instantly without any manual intervention required.
          </p>
        </div>
      </div>

      {/* Quest Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All Quests
        </button>
        <button 
          className={`btn ${filter === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('daily')}
        >
          Daily
        </button>
        <button 
          className={`btn ${filter === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`btn ${filter === 'achievement' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('achievement')}
        >
          Achievements
        </button>
        <button 
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Quest List */}
      <div className="quest-list">
        {filteredQuests.map((quest) => (
          <div key={quest.id} className="quest-card">
            <div className="quest-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{quest.title}</h3>
                
                {/* Quest Type Badge */}
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: getQuestTypeColor(quest.type),
                  color: 'white'
                }}>
                  {quest.type.toUpperCase()}
                </span>

                {/* Auto-tracked Badge */}
                {quest.autoTracked && (
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    border: '1px solid rgba(0, 255, 136, 0.3)'
                  }}>
                    <Zap size={12} style={{ marginRight: '0.25rem' }} />
                    AUTO
                  </span>
                )}
              </div>
              
              <div className="quest-description">{quest.description}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                <div className="quest-reward">🏆 {quest.reward}</div>
                
                {/* Chain Indicator */}
                <div className="chain-indicator">
                  <div 
                    className="chain-dot" 
                    style={{ background: getChainColor(quest.chain) }}
                  ></div>
                  {quest.chain === 'multi' ? 'Multi-Chain' : quest.chain.charAt(0).toUpperCase() + quest.chain.slice(1)}
                </div>
                
                {/* Time Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b0b0b0' }}>
                  <Clock size={14} />
                  {quest.timeLeft}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="quest-progress" style={{ minWidth: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Progress</span>
                <span>{quest.progress}/{quest.target}</span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(quest.progress / quest.target) * 100}%`,
                    background: quest.status === 'completed' ? '#00ff88' : 'linear-gradient(90deg, #00d4ff, #0099cc)'
                  }}
                ></div>
              </div>
              
              {/* Status Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                {quest.status === 'completed' ? (
                  <CheckCircle size={24} color="#00ff88" />
                ) : (
                  <Circle size={24} color="#b0b0b0" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quest Generation Info */}
      <div className="dashboard-card" style={{ marginTop: '3rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Map size={24} />
          </div>
          <div className="card-title">Dynamic Quest Generation</div>
        </div>
        <div className="card-content">
          <p>
            Kwala automatically generates personalized quests based on your gameplay patterns and achievements. 
            New daily quests appear every 24 hours, and special event quests are created during tournaments and seasonal events.
          </p>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Daily Reset:</strong><br />
              <span style={{ color: '#00d4ff' }}>00:00 UTC</span>
            </div>
            <div>
              <strong>Weekly Reset:</strong><br />
              <span style={{ color: '#00d4ff' }}>Monday 00:00 UTC</span>
            </div>
            <div>
              <strong>Next Generation:</strong><br />
              <span style={{ color: '#00d4ff' }}>5h 28m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;