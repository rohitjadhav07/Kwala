import React, { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Zap, TrendingUp, Star, Sword, Plus, Loader } from 'lucide-react';
import CharacterCard from '../components/CharacterCard';
import { useSimpleCharacters } from '../hooks/useSimpleCharacters';
import { useDemoCharacters } from '../hooks/useDemoCharacters';

const Characters = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [demoMode, setDemoMode] = useState(true); // Start in demo mode
  
  // Always call both hooks to avoid conditional hook usage
  const demoHook = useDemoCharacters();
  const contractHook = useSimpleCharacters();
  
  // Select which hook data to use based on mode
  const { 
    characters, 
    loading, 
    mintCharacter, 
    addExperience, 
    evolveCharacter,
    isMinting,
    isAddingExp,
    isEvolving
  } = demoMode ? demoHook : contractHook;
  
  const [selectedClass, setSelectedClass] = useState('warrior');

  const handleMintCharacter = () => {
    mintCharacter(selectedClass);
  };

  const handleAddExperience = (tokenId) => {
    addExperience(tokenId);
  };

  const handleEvolveCharacter = (tokenId) => {
    evolveCharacter(tokenId);
  };

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

  if (!isConnected) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to view and manage your ChainQuest characters.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your characters from the blockchain...</p>
      </div>
    );
  }



  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1>Your Characters</h1>
            <p>Manage your NFT characters across multiple blockchains</p>
          </div>
          
          {/* Demo Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: demoMode ? '#00d4ff' : '#b0b0b0' }}>
              {demoMode ? '🎮 Demo Mode' : '⛓️ Live Mode'}
            </span>
            <button
              className={`btn ${demoMode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDemoMode(!demoMode)}
              style={{ padding: '0.5rem 1rem' }}
            >
              {demoMode ? 'Switch to Live' : 'Switch to Demo'}
            </button>
          </div>
        </div>
        
        {demoMode && (
          <div style={{ 
            background: 'rgba(0, 212, 255, 0.1)', 
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <strong>🎮 Demo Mode Active</strong><br />
            You're in demo mode! All interactions are simulated. Switch to Live Mode to interact with real smart contracts.
          </div>
        )}
      </div>

      <div className="character-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onAddExperience={handleAddExperience}
            onEvolveCharacter={handleEvolveCharacter}
            isAddingExp={isAddingExp}
            isEvolving={isEvolving}
            chainName={demoMode ? 'Demo' : chain?.name}
          />
        ))}

        {/* Mint New Character Card */}
        <div className="character-card" style={{ 
          border: '2px dashed rgba(0, 212, 255, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>
            {isMinting ? <Loader className="spinner" /> : <Plus />}
          </div>
          <h3>Mint New Character</h3>
          <p style={{ textAlign: 'center', margin: '1rem 0', opacity: 0.7 }}>
            Create a new NFT character that will evolve automatically with Kwala automation
          </p>
          
          {/* Class Selection */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {['warrior', 'mage', 'rogue'].map((cls) => (
              <button
                key={cls}
                className={`btn ${selectedClass === cls ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedClass(cls)}
                style={{ padding: '0.5rem' }}
              >
                {getClassEmoji(cls)}
              </button>
            ))}
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleMintCharacter}
            disabled={isMinting}
          >
            {isMinting ? (
              <>
                <Loader size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
                Minting...
              </>
            ) : (
              <>
                <Star size={16} style={{ marginRight: '0.5rem' }} />
                Mint {selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Kwala Automation Status */}
      <div className="dashboard-card" style={{ marginTop: '3rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Zap size={24} />
          </div>
          <div className="card-title">Kwala Evolution Automation</div>
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
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>Active Monitoring</span>
          </div>
          <p>
            Your characters are being monitored 24/7 by Kwala automation. They will automatically:
          </p>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            <li>Evolve when experience requirements are met</li>
            <li>Receive stat bonuses based on achievements</li>
            <li>Update metadata and visuals across all chains</li>
            <li>Participate in time-based evolution events</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Characters;