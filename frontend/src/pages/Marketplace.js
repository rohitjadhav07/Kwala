import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ShoppingCart, TrendingUp, Zap, Star, Filter } from 'lucide-react';
import { useMarketplaceContract } from '../hooks/useMarketplaceContract';

const Marketplace = () => {
  const { address, isConnected } = useAccount();
  const { listings, loading, buyNFT, isBuying } = useMarketplaceContract();
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

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedChain, setSelectedChain] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [sortBy, setSortBy] = useState('price_low');

  const filteredListings = listings.filter(listing => {
    // Price filter (convert to USD for comparison)
    const priceUSD = parseFloat(listing.priceUSD.replace('$', ''));
    if (priceUSD < priceRange[0] || priceUSD > priceRange[1]) return false;
    
    // Rarity filter
    if (filter === 'rarity' && !['legendary', 'epic'].includes(listing.rarity)) return false;
    
    // Chain filter
    if (selectedChain !== 'all' && listing.chain !== selectedChain) return false;
    
    // Class filter
    if (selectedClass !== 'all' && listing.class !== selectedClass) return false;
    
    // Trending filter (high battle power)
    if (filter === 'trending' && listing.battlePower < 5000) return false;
    
    // Ending soon filter
    if (filter === 'ending') {
      const timeLeft = listing.timeLeft;
      if (!timeLeft.includes('h') || timeLeft.includes('d')) return false;
    }
    
    return true;
  }).sort((a, b) => {
    const priceA = parseFloat(a.priceUSD.replace('$', ''));
    const priceB = parseFloat(b.priceUSD.replace('$', ''));
    
    switch (sortBy) {
      case 'price_low': return priceA - priceB;
      case 'price_high': return priceB - priceA;
      case 'level': return b.level - a.level;
      case 'battle_power': return b.battlePower - a.battlePower;
      default: return 0;
    }
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

      {/* Enhanced Filters */}
      <div className="marketplace-filters" style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={20} color="#00d4ff" />
          <h3 style={{ margin: 0, color: '#00d4ff' }}>Filters & Sorting</h3>
        </div>
        
        {/* Quick Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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

        {/* Advanced Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Price Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#b0b0b0' }}>
              Price Range (USD)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Chain Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#b0b0b0' }}>
              Blockchain
            </label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Chains</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
              <option value="arbitrum">Arbitrum</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#b0b0b0' }}>
              Character Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Classes</option>
              <option value="warrior">⚔️ Warrior</option>
              <option value="mage">🔮 Mage</option>
              <option value="rogue">🗡️ Rogue</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#b0b0b0' }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="level">Level: High to Low</option>
              <option value="battle_power">Battle Power</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem 0', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.9rem',
          color: '#b0b0b0'
        }}>
          Showing {filteredListings.length} of {listings.length} items
        </div>
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
              background: `linear-gradient(135deg, ${getRarityColor(listing.rarity)}, ${getRarityColor(listing.rarity)}80)`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {listing.image ? (
                <img 
                  src={listing.image} 
                  alt={listing.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: listing.image ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                {getClassEmoji(listing.class)}
              </div>
              {/* Rarity glow effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at center, ${getRarityColor(listing.rarity)}20, transparent 70%)`,
                animation: 'pulse 3s ease-in-out infinite'
              }} />
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
            <button 
              className="btn btn-primary" 
              style={{ 
                width: '100%',
                background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => buyNFT(listing.id)}
            >
              <ShoppingCart size={16} style={{ marginRight: '0.5rem' }} />
              Buy Now
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
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