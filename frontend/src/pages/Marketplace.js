import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ShoppingCart, TrendingUp, Zap, Star, Filter } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';

const Marketplace = () => {
  const { address, isConnected } = useAccount();
  const { listings, loading, buyNFT } = useMarketplace();
  const [filter, setFilter] = useState('all');

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return '#ff6b35';
      case 'epic': return '#9b59b6';
      case 'rare': return '#3498db';
      case 'common': return '#95a5a6';
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

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    if (filter === 'class') return true; // Would implement class filtering
    if (filter === 'rarity') return listing.rarity === 'legendary' || listing.rarity === 'epic';
    if (filter === 'chain') return true; // Would implement chain filtering
    return true;
  });

  if (!isConnected) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to browse and trade NFT characters across multiple chains.</p>
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
        <h1>Cross-Chain Marketplace</h1>
        <p>Trade NFT characters seamlessly across multiple blockchains</p>
      </div>

      {/* Kwala Trading Automation */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Zap size={24} />
          </div>
          <div className="card-title">Kwala Trading Automation</div>
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
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>Cross-Chain Trading Active</span>
          </div>
          <p>
            Kwala handles all cross-chain complexities automatically. Trade characters between 
            Ethereum, Polygon, BSC, and Arbitrum with instant settlement and automated price discovery.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={20} />
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All Items
        </button>
        <button 
          className={`btn ${filter === 'rarity' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('rarity')}
        >
          High Rarity
        </button>
        <button 
          className={`btn ${filter === 'trending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('trending')}
        >
          <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
          Trending
        </button>
        <button 
          className={`btn ${filter === 'ending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('ending')}
        >
          Ending Soon
        </button>
      </div>

      {/* Marketplace Grid */}
      <div className="character-grid">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="character-card" style={{ 
            border: `2px solid ${getRarityColor(listing.rarity)}40`,
            background: `linear-gradient(135deg, ${getRarityColor(listing.rarity)}10, rgba(255,255,255,0.05))`
          }}>
            {/* Rarity Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: getRarityColor(listing.rarity),
              color: 'white',
              textTransform: 'uppercase'
            }}>
              {listing.rarity}
            </div>

            <div className="character-avatar" style={{
              background: `linear-gradient(135deg, ${getRarityColor(listing.rarity)}, ${getRarityColor(listing.rarity)}80)`
            }}>
              {getClassEmoji(listing.class)}
            </div>
            
            <div className="character-name">{listing.name}</div>
            <div className="character-class">
              Level {listing.level} {listing.class.charAt(0).toUpperCase() + listing.class.slice(1)}
            </div>
            
            {/* Evolution Stage */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.5rem',
              margin: '0.5rem 0'
            }}>
              <Star size={16} color="#00d4ff" />
              <span>Evolution Stage {listing.evolutionStage}</span>
            </div>

            {/* Stats */}
            <div className="character-stats">
              <div className="stat-item">
                <span>⚔️ STR</span>
                <span>{listing.stats.strength}</span>
              </div>
              <div className="stat-item">
                <span>🛡️ DEF</span>
                <span>{listing.stats.defense}</span>
              </div>
              <div className="stat-item">
                <span>⚡ SPD</span>
                <span>{listing.stats.speed}</span>
              </div>
              <div className="stat-item">
                <span>🔮 MAG</span>
                <span>{listing.stats.magic}</span>
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
              <span>Battle Power: {listing.battlePower.toLocaleString()}</span>
            </div>

            {/* Chain */}
            <div className="chain-indicator" style={{ marginBottom: '1rem' }}>
              <div 
                className="chain-dot" 
                style={{ background: getChainColor(listing.chain) }}
              ></div>
              {listing.chain.charAt(0).toUpperCase() + listing.chain.slice(1)}
            </div>

            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00d4ff' }}>
                {listing.price}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#b0b0b0' }}>
                {listing.priceUSD}
              </div>
            </div>

            {/* Time Left */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '1rem',
              color: '#ff6b6b',
              fontSize: '0.875rem'
            }}>
              ⏰ {listing.timeLeft} left
            </div>

            {/* Action Button */}
            <button className="btn btn-primary" style={{ width: '100%' }}>
              <ShoppingCart size={16} style={{ marginRight: '0.5rem' }} />
              Buy Now
            </button>

            {/* Seller Info */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#b0b0b0'
            }}>
              Seller: {listing.seller}
            </div>
          </div>
        ))}
      </div>

      {/* Trading Features */}
      <div className="dashboard-card" style={{ marginTop: '3rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="card-title">Cross-Chain Trading Features</div>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4>🌐 Multi-Chain Support</h4>
              <p>Trade seamlessly between Ethereum, Polygon, BSC, and Arbitrum networks.</p>
            </div>
            <div>
              <h4>⚡ Instant Settlement</h4>
              <p>Kwala handles all cross-chain complexities for immediate transaction completion.</p>
            </div>
            <div>
              <h4>📊 Dynamic Pricing</h4>
              <p>Automated price discovery based on character rarity, stats, and market demand.</p>
            </div>
            <div>
              <h4>🔒 Secure Escrow</h4>
              <p>Smart contract escrow ensures safe trading with automatic fund release.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;