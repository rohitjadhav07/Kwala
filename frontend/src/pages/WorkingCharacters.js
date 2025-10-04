import React, { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Star, Zap, TrendingUp, Loader, RefreshCw } from 'lucide-react';
import { useBasicContract } from '../hooks/useBasicContract';

const WorkingCharacters = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { 
    characters, 
    loading, 
    mintCharacter, 
    addExperience, 
    fetchCharacters,
    isReady,
    contractAddress,
    chainId
  } = useBasicContract();
  
  const [selectedClass, setSelectedClass] = useState('warrior');
  const [minting, setMinting] = useState(false);
  const [addingExp, setAddingExp] = useState(null);

  const handleMintCharacter = async () => {
    setMinting(true);
    try {
      await mintCharacter(selectedClass);
    } finally {
      setMinting(false);
    }
  };

  const handleAddExperience = async (tokenId) => {
    setAddingExp(tokenId);
    try {
      await addExperience(tokenId);
    } finally {
      setAddingExp(null);
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
        <p>Please connect your wallet to interact with ChainQuest characters.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>ChainQuest Characters</h1>
        <p>Mint and manage your NFT characters on the blockchain</p>
        
        {/* Debug Info */}
        <div style={{ 
          background: 'rgba(0, 212, 255, 0.1)', 
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem',
          fontSize: '0.875rem'
        }}>
          <strong>Debug Info:</strong><br />
          Chain: {chain?.name} (ID: {chainId})<br />
          Contract: {contractAddress}<br />
          Contract Ready: {isReady ? '✅' : '❌'}<br />
          Wallet: {address}<br />
          Characters Found: {characters.length}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-secondary"
          onClick={fetchCharacters}
          disabled={loading}
        >
          <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
          Refresh Characters
        </button>
        
        {chainId !== 1337 && (
          <div style={{ 
            padding: '0.5rem 1rem', 
            background: 'rgba(255, 107, 107, 0.2)',
            borderRadius: '8px',
            color: '#ff6b6b'
          }}>
            ⚠️ Switch to Localhost (Chain ID: 1337) to interact with contracts
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading characters from blockchain...</p>
        </div>
      )}

      <div className="character-grid">
        {/* Existing Characters */}
        {characters.map((character) => (
          <div key={character.id} className="character-card">
            <div className="character-avatar">
              {getClassEmoji(character.class)}
            </div>
            
            <div className="character-name">{character.name}</div>
            <div className="character-class">
              Level {character.level} {character.class}
            </div>
            
            {/* Stats */}
            <div className="character-stats">
              <div className="stat-item">
                <span>⚔️ STR</span>
                <span>{character.stats.strength}</span>
              </div>
              <div className="stat-item">
                <span>🛡️ DEF</span>
                <span>{character.stats.defense}</span>
              </div>
              <div className="stat-item">
                <span>⚡ SPD</span>
                <span>{character.stats.speed}</span>
              </div>
              <div className="stat-item">
                <span>🔮 MAG</span>
                <span>{character.stats.magic}</span>
              </div>
            </div>

            {/* Experience */}
            <div style={{ 
              margin: '1rem 0',
              padding: '0.5rem',
              background: 'rgba(0, 212, 255, 0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <strong>Experience: {character.experience}</strong>
            </div>

            {/* Action Button */}
            <button 
              className="btn btn-primary"
              onClick={() => handleAddExperience(character.id)}
              disabled={addingExp === character.id || !isReady}
              style={{ width: '100%' }}
            >
              {addingExp === character.id ? (
                <>
                  <Loader size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
                  Adding XP...
                </>
              ) : (
                <>
                  <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
                  Add 100 XP
                </>
              )}
            </button>
          </div>
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
            {minting ? <Loader className="spinner" /> : '+'}
          </div>
          
          <h3>Mint New Character</h3>
          <p style={{ textAlign: 'center', margin: '1rem 0', opacity: 0.7 }}>
            Create a new NFT character on the blockchain
          </p>
          
          {/* Class Selection */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {['warrior', 'mage', 'rogue'].map((cls) => (
              <button
                key={cls}
                className={`btn ${selectedClass === cls ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedClass(cls)}
                style={{ padding: '0.5rem 1rem' }}
              >
                {getClassEmoji(cls)} {cls}
              </button>
            ))}
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleMintCharacter}
            disabled={minting || !isReady}
          >
            {minting ? (
              <>
                <Loader size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
                Minting...
              </>
            ) : (
              <>
                <Star size={16} style={{ marginRight: '0.5rem' }} />
                Mint {selectedClass}
              </>
            )}
          </button>

          {!isReady && (
            <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Contract not ready. Make sure you're on the right network.
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="dashboard-card" style={{ marginTop: '3rem' }}>
        <h3>🚀 How to Use</h3>
        <ol style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Make sure you're connected to <strong>Localhost (Chain ID: 1337)</strong></li>
          <li>Make sure the Hardhat node is running: <code>npx hardhat node</code></li>
          <li>Import the test account into MetaMask:
            <br />
            <code style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem' }}>
              0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
            </code>
          </li>
          <li>Click "Mint Character" to create your first NFT</li>
          <li>Click "Add 100 XP" to train your characters</li>
          <li>Watch the blockchain transactions in your wallet!</li>
        </ol>
      </div>
    </div>
  );
};

export default WorkingCharacters;