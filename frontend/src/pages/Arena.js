import React from 'react';
import { useAccount } from 'wagmi';
import { Sword, Trophy, Users, Zap, Clock, Star } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';

const Arena = () => {
  const { address, isConnected } = useAccount();
  const { tournaments, activeBattles, loading, registerForTournament, simulateBattle } = useTournaments();

  const getStatusColor = (status) => {
    switch (status) {
      case 'registration': return '#4ecdc4';
      case 'active': return '#ff6b6b';
      case 'upcoming': return '#ffe66d';
      case 'completed': return '#a8e6cf';
      default: return '#00d4ff';
    }
  };

  const getChainColor = (chain) => {
    switch (chain) {
      case 'ethereum': return '#627eea';
      case 'polygon': return '#8247e5';
      case 'bsc': return '#f3ba2f';
      case 'arbitrum': return '#28a0f0';
      default: return '#00d4ff';
    }
  };

  const getClassEmoji = (characterClass) => {
    switch (characterClass) {
      case 'warrior': return '⚔️';
      case 'mage': return '🔮';
      case 'rogue': return '🗡️';
      default: return '🎮';
    }
  };

  if (!isConnected) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to participate in cross-chain tournaments and battles.</p>
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
        <h1>Battle Arena</h1>
        <p>Compete in automated cross-chain tournaments powered by Kwala</p>
      </div>

      {/* Kwala Tournament Automation */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Zap size={24} />
          </div>
          <div className="card-title">Kwala Tournament Automation</div>
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
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>Auto-Management Active</span>
          </div>
          <p>
            Tournaments are fully automated by Kwala. Registration, matchmaking, battle execution, 
            and prize distribution all happen automatically across multiple blockchains.
          </p>
        </div>
      </div>

      {/* Active Battles */}
      {activeBattles.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2>Live Battles</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {activeBattles.map((battle) => (
              <div key={battle.id} className="battle-arena">
                <div className="vs-container">
                  <div className="fighter">
                    <div className="fighter-avatar">
                      {getClassEmoji(battle.player1.class)}
                    </div>
                    <h3>{battle.player1.name}</h3>
                    <p>{battle.player1.class}</p>
                    <p>Power: {battle.player1.power}</p>
                    <div className="chain-indicator">
                      <div 
                        className="chain-dot" 
                        style={{ background: getChainColor(battle.player1.chain) }}
                      ></div>
                      {battle.player1.chain}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div className="vs-text">VS</div>
                    <div style={{ marginTop: '1rem', color: '#b0b0b0' }}>
                      {battle.status === 'in_progress' ? (
                        <>
                          <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 auto' }}></div>
                          <p>Battle in progress...</p>
                        </>
                      ) : (
                        <>
                          <Clock size={16} />
                          <p>Starting in {battle.estimatedTime}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="fighter">
                    <div className="fighter-avatar">
                      {getClassEmoji(battle.player2.class)}
                    </div>
                    <h3>{battle.player2.name}</h3>
                    <p>{battle.player2.class}</p>
                    <p>Power: {battle.player2.power}</p>
                    <div className="chain-indicator">
                      <div 
                        className="chain-dot" 
                        style={{ background: getChainColor(battle.player2.chain) }}
                      ></div>
                      {battle.player2.chain}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tournament List */}
      <div>
        <h2>Available Tournaments</h2>
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="quest-card">
              <div className="quest-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{tournament.name}</h3>
                  
                  {/* Tournament Type Badge */}
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: getStatusColor(tournament.status),
                    color: 'white'
                  }}>
                    {tournament.status.toUpperCase()}
                  </span>

                  {/* Auto-managed Badge */}
                  {tournament.autoManaged && (
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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={16} color="#00d4ff" />
                    <span>{tournament.prizePool}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} color="#00d4ff" />
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="#00d4ff" />
                    <span>{tournament.timeLeft}</span>
                  </div>
                </div>

                {/* Supported Chains */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {tournament.chains.map((chain) => (
                    <div key={chain} className="chain-indicator">
                      <div 
                        className="chain-dot" 
                        style={{ background: getChainColor(chain) }}
                      ></div>
                      {chain.charAt(0).toUpperCase() + chain.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#b0b0b0' }}>Entry Fee</div>
                  <div style={{ fontWeight: 'bold', color: '#00d4ff' }}>{tournament.entryFee}</div>
                </div>
                
                {tournament.status === 'registration' ? (
                  <button className="btn btn-primary">
                    <Star size={16} style={{ marginRight: '0.5rem' }} />
                    Register
                  </button>
                ) : tournament.status === 'active' ? (
                  <button className="btn btn-secondary" disabled>
                    <Sword size={16} style={{ marginRight: '0.5rem' }} />
                    In Progress
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    <Clock size={16} style={{ marginRight: '0.5rem' }} />
                    Upcoming
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Features */}
      <div className="dashboard-card" style={{ marginTop: '3rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Sword size={24} />
          </div>
          <div className="card-title">Cross-Chain Tournament Features</div>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4>🌐 Multi-Chain Battles</h4>
              <p>Players from different blockchains can compete against each other seamlessly.</p>
            </div>
            <div>
              <h4>🤖 Auto Matchmaking</h4>
              <p>Kwala automatically pairs players based on character stats and experience.</p>
            </div>
            <div>
              <h4>⚡ Instant Execution</h4>
              <p>Battles execute automatically without manual intervention required.</p>
            </div>
            <div>
              <h4>🏆 Auto Rewards</h4>
              <p>Prize distribution happens automatically across all supported chains.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;