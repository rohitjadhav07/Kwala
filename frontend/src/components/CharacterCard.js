import React, { useState } from 'react';
import { TrendingUp, Zap, Sword, Star, Loader } from 'lucide-react';

const CharacterCard = ({ 
  character, 
  onAddExperience, 
  onEvolveCharacter, 
  isAddingExp, 
  isEvolving,
  chainName 
}) => {
  const [showStats, setShowStats] = useState(false);

  const getClassEmoji = (characterClass) => {
    switch (characterClass) {
      case 'warrior': return '⚔️';
      case 'mage': return '🔮';
      case 'rogue': return '🗡️';
      default: return '🎮';
    }
  };

  const getChainColor = (chainName) => {
    switch (chainName?.toLowerCase()) {
      case 'ethereum': return '#627eea';
      case 'polygon': return '#8247e5';
      case 'bsc': return '#f3ba2f';
      case 'arbitrum': return '#28a0f0';
      default: return '#00d4ff';
    }
  };

  const getEvolutionRequirement = (stage) => {
    const requirements = { 1: 100, 2: 500, 3: 1500, 4: 5000 };
    return requirements[stage] || 10000;
  };

  const nextEvolution = getEvolutionRequirement(parseInt(character.evolutionStage));
  const canEvolve = parseInt(character.experience) >= nextEvolution && parseInt(character.evolutionStage) < 5;

  return (
    <div className="character-card" style={{ position: 'relative' }}>
      {/* Glow effect for evolved characters */}
      {parseInt(character.evolutionStage) > 2 && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: 'linear-gradient(45deg, #00d4ff, #ff6b35, #00d4ff)',
          borderRadius: '18px',
          zIndex: -1,
          animation: 'glow 2s ease-in-out infinite alternate'
        }} />
      )}

      <div className="character-avatar" onClick={() => setShowStats(!showStats)} style={{ cursor: 'pointer' }}>
        {getClassEmoji(character.class)}
      </div>
      
      <div className="character-name">{character.name}</div>
      <div className="character-class">
        Level {character.level} {character.class.charAt(0).toUpperCase() + character.class.slice(1)}
      </div>
      
      {/* Evolution Progress */}
      <div style={{ margin: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Evolution Stage {character.evolutionStage}</span>
          <span>{character.experience}/{nextEvolution} XP</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min((parseInt(character.experience) / nextEvolution) * 100, 100)}%`,
              background: canEvolve ? '#00ff88' : 'linear-gradient(90deg, #00d4ff, #0099cc)'
            }}
          ></div>
        </div>
        {canEvolve && (
          <div style={{ color: '#00ff88', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            ✨ Ready to evolve!
          </div>
        )}
      </div>

      {/* Stats - Toggle visibility */}
      <div className="character-stats" style={{ 
        maxHeight: showStats ? '200px' : '120px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease'
      }}>
        <div className="stat-item">
          <span>⚔️ Strength</span>
          <span>{character.stats.strength}</span>
        </div>
        <div className="stat-item">
          <span>🛡️ Defense</span>
          <span>{character.stats.defense}</span>
        </div>
        <div className="stat-item">
          <span>⚡ Speed</span>
          <span>{character.stats.speed}</span>
        </div>
        <div className="stat-item">
          <span>🔮 Magic</span>
          <span>{character.stats.magic}</span>
        </div>
      </div>

      {/* Battle Power */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '0.5rem',
        margin: '1rem 0',
        padding: '0.5rem',
        background: 'rgba(0, 212, 255, 0.1)',
        borderRadius: '8px'
      }}>
        <Sword size={16} />
        <span>Battle Power: {character.battlePower.toLocaleString()}</span>
      </div>

      {/* Chain Indicator */}
      <div className="chain-indicator" style={{ marginBottom: '1rem' }}>
        <div 
          className="chain-dot" 
          style={{ background: getChainColor(chainName) }}
        ></div>
        {chainName || 'Demo'}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ flex: 1 }}
          onClick={() => onAddExperience(character.id)}
          disabled={isAddingExp}
        >
          {isAddingExp ? (
            <Loader size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
          ) : (
            <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
          )}
          Train (+100 XP)
        </button>
        <button 
          className={`btn ${canEvolve ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => onEvolveCharacter(character.id)}
          disabled={!canEvolve || isEvolving}
        >
          {isEvolving ? (
            <Loader size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
          ) : (
            <Zap size={16} style={{ marginRight: '0.5rem' }} />
          )}
          {canEvolve ? 'Evolve!' : 'Evolve'}
        </button>
      </div>

      <style jsx>{`
        @keyframes glow {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CharacterCard;