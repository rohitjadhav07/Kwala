import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Sword, Trophy, Users, Zap, Clock, Star, Gamepad2, Target, Play, X } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import { useMultiplayerArena } from '../hooks/useMultiplayerArena';
import ArenaGame from '../components/ArenaGame';
import Leaderboard from '../components/Leaderboard';

const Arena = () => {
  const { address, isConnected } = useAccount();
  const { tournaments, activeBattles, loading } = useTournaments();
  const {
    gameState,
    currentMatch,
    playerScore,
    opponentScore,
    timeLeft,
    matchHistory,
    findMatch,
    playerAction,
    leaveMatch,
    returnToMenu
  } = useMultiplayerArena();
  const [latestScore, setLatestScore] = useState(null);
  const [activeTab, setActiveTab] = useState('multiplayer'); // multiplayer, game, tournaments, leaderboard

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
        <p>Play games, compete in tournaments, and climb the leaderboard!</p>
      </div>

      {/* Arena Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1rem'
      }}>
        <button
          className={`btn ${activeTab === 'multiplayer' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('multiplayer')}
        >
          <Users size={16} style={{ marginRight: '0.5rem' }} />
          1v1 Battles
        </button>
        <button
          className={`btn ${activeTab === 'game' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('game')}
        >
          <Gamepad2 size={16} style={{ marginRight: '0.5rem' }} />
          Solo Arena
        </button>
        <button
          className={`btn ${activeTab === 'leaderboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={16} style={{ marginRight: '0.5rem' }} />
          Leaderboard
        </button>
        <button
          className={`btn ${activeTab === 'tournaments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('tournaments')}
        >
          <Sword size={16} style={{ marginRight: '0.5rem' }} />
          Tournaments
        </button>
      </div>

      {/* Multiplayer Battles Tab */}
      {activeTab === 'multiplayer' && (
        <div>
          {gameState === 'menu' && (
            <div>
              <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                  <div className="card-icon">
                    <Users size={24} />
                  </div>
                  <div className="card-title">Real-Time 1v1 Battles</div>
                </div>
                <div className="card-content">
                  <p>Challenge other players to real-time battles! Score more points than your opponent in 60 seconds to win rewards.</p>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem',
                    margin: '1.5rem 0'
                  }}>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '12px' }}>
                      <h4 style={{ color: '#00ff88' }}>🏆 Win Rewards</h4>
                      <p>50 XP + 0.01 MATIC</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '12px' }}>
                      <h4 style={{ color: '#00d4ff' }}>⚡ Fast Matches</h4>
                      <p>60 second battles</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '12px' }}>
                      <h4 style={{ color: '#ff6b35' }}>🎯 Skill Based</h4>
                      <p>Click accuracy matters</p>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={findMatch}
                    style={{ 
                      width: '100%', 
                      fontSize: '1.2rem', 
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #00ff88, #00cc66)'
                    }}
                  >
                    <Play size={20} style={{ marginRight: '0.5rem' }} />
                    Find Match
                  </button>
                </div>
              </div>

              {/* Match History */}
              {matchHistory.length > 0 && (
                <div className="dashboard-card">
                  <div className="card-header">
                    <div className="card-icon">
                      <Clock size={24} />
                    </div>
                    <div className="card-title">Recent Matches</div>
                  </div>
                  <div className="card-content">
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {matchHistory.slice(0, 5).map((match) => (
                        <div 
                          key={match.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: match.won ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 107, 53, 0.1)',
                            borderRadius: '8px',
                            border: `1px solid ${match.won ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 107, 53, 0.3)'}`
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 'bold', color: match.won ? '#00ff88' : '#ff6b35' }}>
                              {match.won ? '🏆 Victory' : '💀 Defeat'}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>
                              vs {match.opponent.name}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold' }}>
                              {match.playerScore} - {match.opponentScore}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#b0b0b0' }}>
                              {new Date(match.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'searching' && (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ width: '60px', height: '60px', margin: '0 auto 2rem' }}></div>
              <h2>Finding Opponent...</h2>
              <p>Searching for players with similar skill level</p>
              <button 
                className="btn btn-secondary"
                onClick={leaveMatch}
                style={{ marginTop: '2rem' }}
              >
                Cancel Search
              </button>
            </div>
          )}

          {gameState === 'playing' && currentMatch && (
            <div>
              {/* Match Header */}
              <div className="dashboard-card" style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>You</div>
                    <div style={{ fontSize: '2rem', color: '#00ff88' }}>{playerScore}</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>Time Left</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentMatch.opponent.name}</div>
                    <div style={{ fontSize: '2rem', color: '#ff6b35' }}>{opponentScore}</div>
                  </div>
                </div>
              </div>

              {/* Game Area */}
              <div className="dashboard-card" style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  height: '400px', 
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 136, 0.1))',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'crosshair'
                }}
                onClick={playerAction}
                >
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <Target size={48} style={{ marginBottom: '1rem' }} />
                    <h3>Click to Score Points!</h3>
                    <p>The faster you click, the more points you earn</p>
                  </div>
                  
                  {/* Animated background effects */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(0, 255, 136, 0.3), transparent 50%)`,
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={leaveMatch}
                  style={{ flex: 1 }}
                >
                  <X size={16} style={{ marginRight: '0.5rem' }} />
                  Forfeit Match
                </button>
              </div>
            </div>
          )}

          {gameState === 'finished' && currentMatch && (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {playerScore > opponentScore ? '🏆' : '💀'}
              </div>
              <h2 style={{ color: playerScore > opponentScore ? '#00ff88' : '#ff6b35' }}>
                {playerScore > opponentScore ? 'Victory!' : 'Defeat!'}
              </h2>
              <div style={{ 
                fontSize: '2rem', 
                margin: '1rem 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem'
              }}>
                <span style={{ color: '#00ff88' }}>{playerScore}</span>
                <span>-</span>
                <span style={{ color: '#ff6b35' }}>{opponentScore}</span>
              </div>
              <p style={{ marginBottom: '2rem' }}>
                vs {currentMatch.opponent.name} (Level {currentMatch.opponent.level})
              </p>
              
              {playerScore > opponentScore && (
                <div style={{ 
                  padding: '1rem',
                  background: 'rgba(0, 255, 136, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '2rem'
                }}>
                  <h4 style={{ color: '#00ff88' }}>Rewards Earned:</h4>
                  <p>{currentMatch.reward}</p>
                </div>
              )}

              <button 
                className="btn btn-primary"
                onClick={returnToMenu}
                style={{ marginRight: '1rem' }}
              >
                Return to Menu
              </button>
              <button 
                className="btn btn-secondary"
                onClick={findMatch}
              >
                Find Another Match
              </button>
            </div>
          )}
        </div>
      )}

      {/* Arena Game Tab */}
      {activeTab === 'game' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>🎯 Arena Challenge</h2>
            <ArenaGame onScoreUpdate={setLatestScore} />
            
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(0, 212, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 212, 255, 0.2)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#00d4ff' }}>How to Play:</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Click on targets to earn points</li>
                <li>Golden targets give 5x points but disappear faster</li>
                <li>Build combos for score multipliers</li>
                <li>Higher scores = better leaderboard position</li>
                <li>Weekly rewards based on final ranking</li>
              </ul>
            </div>
          </div>
          
          <div>
            <Leaderboard newScore={latestScore} />
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Leaderboard newScore={latestScore} />
        </div>
      )}

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <div>

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
      )}
    </div>
  );
};

export default Arena;