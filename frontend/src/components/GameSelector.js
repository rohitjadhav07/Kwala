import React from 'react';
import { Gamepad2, Target, Zap, Trophy } from 'lucide-react';

const GameSelector = ({ selectedGame, onGameSelect, isMultiplayer = false }) => {
  const games = [
    {
      id: 'clicker',
      name: 'Target Clicker',
      icon: '🎯',
      description: 'Click targets as fast as you can!',
      difficulty: 'Easy',
      color: '#00ff88'
    },
    {
      id: 'snake',
      name: 'Snake',
      icon: '🐍',
      description: 'Classic snake game - eat food and grow!',
      difficulty: 'Medium',
      color: '#00d4ff'
    },
    {
      id: 'tetris',
      name: 'Tetris',
      icon: '🧩',
      description: 'Clear lines by arranging falling blocks!',
      difficulty: 'Hard',
      color: '#8b00ff'
    },
    {
      id: 'pong',
      name: 'Pong',
      icon: '🏓',
      description: 'Classic paddle game - beat the AI!',
      difficulty: 'Medium',
      color: '#ff6b35'
    },
    {
      id: 'flappy',
      name: 'Flappy Bird',
      icon: '🐦',
      description: 'Navigate through pipes without crashing!',
      difficulty: 'Hard',
      color: '#FFD700'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#00ff88';
      case 'Medium': return '#FFD700';
      case 'Hard': return '#ff6b35';
      default: return '#00d4ff';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>
          {isMultiplayer ? '🎮 Choose Your Battle Game' : '🎯 Select Game Mode'}
        </h3>
        <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
          {isMultiplayer 
            ? 'Pick a game to compete against other players in real-time!'
            : 'Choose a game to play solo and improve your skills!'
          }
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onGameSelect(game.id)}
            style={{
              padding: '1.5rem',
              background: selectedGame === game.id 
                ? `linear-gradient(135deg, ${game.color}20, ${game.color}10)`
                : 'rgba(255, 255, 255, 0.05)',
              border: selectedGame === game.id 
                ? `2px solid ${game.color}` 
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (selectedGame !== game.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedGame !== game.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {/* Game Icon */}
            <div style={{
              fontSize: '3rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              {game.icon}
            </div>

            {/* Game Info */}
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: selectedGame === game.id ? game.color : '#ffffff'
              }}>
                {game.name}
              </h4>
              
              <p style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '0.9rem', 
                color: '#b0b0b0',
                lineHeight: '1.4'
              }}>
                {game.description}
              </p>

              {/* Difficulty Badge */}
              <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                background: getDifficultyColor(game.difficulty),
                color: '#000',
                marginBottom: '1rem'
              }}>
                {game.difficulty}
              </div>

              {/* Multiplayer Features */}
              {isMultiplayer && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  color: '#b0b0b0'
                }}>
                  <span>⚡ Real-time</span>
                  <span>🏆 Ranked</span>
                  <span>💰 Rewards</span>
                </div>
              )}
            </div>

            {/* Selection Indicator */}
            {selectedGame === game.id && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: game.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#000',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
            )}

            {/* Hover Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${game.color}20, transparent)`,
              transition: 'left 0.5s ease',
              pointerEvents: 'none'
            }} />
          </div>
        ))}
      </div>

      {/* Game Stats Preview */}
      {selectedGame && (
        <div style={{
          padding: '1rem',
          background: 'rgba(0, 212, 255, 0.1)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem' }}>
            <div>
              <Gamepad2 size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <span>Controls: {selectedGame === 'clicker' ? 'Mouse/Touch' : 'Keyboard + Mouse'}</span>
            </div>
            <div>
              <Target size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <span>Scoring: Points based</span>
            </div>
            <div>
              <Trophy size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <span>Rewards: XP + MATIC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelector;