import React, { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { Users, Plus, TrendingUp, Star, Zap, Sword, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Characters = () => {
  const { address, isConnected } = useAccount();

  // Read owned NFTs from contract
  const { data: ownedTokens, isLoading } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Your character contract
    abi: [
      {
        name: 'tokensOfOwner',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256[]' }]
      }
    ],
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    enabled: Boolean(address && isConnected)
  });

  if (!isConnected) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to view and manage your NFT characters.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your characters...</p>
      </div>
    );
  }

  const hasCharacters = ownedTokens && ownedTokens.length > 0;

  if (!hasCharacters) {
    return (
      <div className="fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <h1>My Characters</h1>
          <p>Your NFT character collection and gaming hub</p>
        </div>

        {/* Empty State */}
        <div className="dashboard-card" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 53, 0.1))'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
          <h2 style={{ marginBottom: '1rem', color: '#00d4ff' }}>No Characters Yet</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
            Mint your first AI-generated NFT character to start your ChainQuest adventure!
          </p>
          
          <Link to="/mint">
            <button className="btn btn-primary" style={{ 
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)'
            }}>
              <Plus size={24} style={{ marginRight: '0.5rem' }} />
              Mint Your First Character
            </button>
          </Link>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#00ff88' }}>What You Can Do With Characters:</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              textAlign: 'left'
            }}>
              <div style={{ 
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>Arena Battles</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Use your characters in skill-based arena games to earn ETH rewards based on performance
                </p>
              </div>
              
              <div style={{ 
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                <h4 style={{ color: '#ff6b35', marginBottom: '0.5rem' }}>Automated Quests</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Send characters on quests that complete automatically via Kwala automation
                </p>
              </div>
              
              <div style={{ 
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                <h4 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>Tournaments</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Compete in cross-chain tournaments for major ETH and NFT prizes
                </p>
              </div>
              
              <div style={{ 
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <h4 style={{ color: '#ffe66d', marginBottom: '0.5rem' }}>Trading & Profit</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Trade leveled characters on the marketplace for profit
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="dashboard-card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div className="card-icon">
              <Star size={24} />
            </div>
            <div className="card-title">ChainQuest Gaming Ecosystem</div>
          </div>
          <div className="card-content">
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              <strong>ChainQuest</strong> is a cross-chain gaming ecosystem where NFT characters are your key to earning rewards:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#ff6b35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>1</div>
                <div>
                  <strong>Mint AI Characters</strong> - Create unique NFTs with AI-generated artwork and on-chain stats
                </div>
                <ArrowRight size={20} color="#00d4ff" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#00d4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>2</div>
                <div>
                  <strong>Play & Earn</strong> - Use characters in games to earn real ETH rewards
                </div>
                <ArrowRight size={20} color="#00d4ff" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#00ff88',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>3</div>
                <div>
                  <strong>Auto-Evolution</strong> - Kwala automatically levels up your characters based on activity
                </div>
                <ArrowRight size={20} color="#00d4ff" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#ffe66d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                  fontWeight: 'bold'
                }}>4</div>
                <div>
                  <strong>Trade for Profit</strong> - Sell evolved characters on the marketplace for higher prices
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has characters, show the character management interface
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Characters ({ownedTokens.length})</h1>
        <p>Manage your NFT characters and use them across ChainQuest games</p>
      </div>

      {/* Character Stats Overview */}
      <div className="dashboard" style={{ marginBottom: '2rem' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-title">Total Characters</div>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d4ff' }}>
              {ownedTokens.length}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Ready for battle
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon">
              <Zap size={24} />
            </div>
            <div className="card-title">Active Automation</div>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00ff88' }}>
              24/7
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Kwala monitoring
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-title">Earning Potential</div>
          </div>
          <div className="card-content">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffe66d' }}>
              High
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Based on activity
            </div>
          </div>
        </div>
      </div>

      {/* Character List */}
      <div className="dashboard-card">
        <div className="card-header">
          <div className="card-icon">
            <Sword size={24} />
          </div>
          <div className="card-title">Your Characters</div>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {ownedTokens.map((tokenId) => (
              <div key={tokenId.toString()} style={{
                padding: '1rem',
                background: 'rgba(0, 212, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚔️</div>
                <h4>Character #{tokenId.toString()}</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Ready for adventures
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link to="/arena" style={{ flex: 1 }}>
                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>
                      Use in Arena
                    </button>
                  </Link>
                  <Link to="/quests" style={{ flex: 1 }}>
                    <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>
                      Send Quest
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add More Characters */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/mint">
          <button className="btn btn-primary" style={{ 
            padding: '1rem 2rem',
            fontSize: '1.1rem'
          }}>
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Mint Another Character
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Characters;