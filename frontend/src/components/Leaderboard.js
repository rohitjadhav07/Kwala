import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, Zap } from 'lucide-react';
import { useAccount } from 'wagmi';

const Leaderboard = ({ newScore }) => {
  const { address } = useAccount();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);

  // Initialize leaderboard with demo data
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('chainquest-leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      // Demo leaderboard data
      const demoData = [
        { address: '0x1234...5678', score: 2450, username: 'DragonSlayer', rank: 1 },
        { address: '0x9876...4321', score: 2100, username: 'MysticMage', rank: 2 },
        { address: '0x5555...9999', score: 1890, username: 'ShadowNinja', rank: 3 },
        { address: '0x7777...1111', score: 1650, username: 'FireWarrior', rank: 4 },
        { address: '0x3333...7777', score: 1420, username: 'IceQueen', rank: 5 },
        { address: '0x8888...2222', score: 1200, username: 'ThunderBolt', rank: 6 },
        { address: '0x4444...8888', score: 980, username: 'StarGazer', rank: 7 },
        { address: '0x6666...3333', score: 750, username: 'MoonWalker', rank: 8 },
      ];
      setLeaderboard(demoData);
      localStorage.setItem('chainquest-leaderboard', JSON.stringify(demoData));
    }
  }, []);

  // Update leaderboard when new score is achieved
  useEffect(() => {
    if (newScore && address) {
      const updatedLeaderboard = [...leaderboard];
      const existingPlayerIndex = updatedLeaderboard.findIndex(p => p.address === address);
      
      const playerEntry = {
        address,
        score: newScore,
        username: `Player_${address.slice(-4)}`,
        timestamp: Date.now()
      };

      if (existingPlayerIndex >= 0) {
        // Update existing player if new score is higher
        if (newScore > updatedLeaderboard[existingPlayerIndex].score) {
          updatedLeaderboard[existingPlayerIndex] = playerEntry;
        }
      } else {
        // Add new player
        updatedLeaderboard.push(playerEntry);
      }

      // Sort by score and update ranks
      updatedLeaderboard.sort((a, b) => b.score - a.score);
      updatedLeaderboard.forEach((player, index) => {
        player.rank = index + 1;
      });

      // Keep top 50 players
      const topPlayers = updatedLeaderboard.slice(0, 50);
      
      setLeaderboard(topPlayers);
      localStorage.setItem('chainquest-leaderboard', JSON.stringify(topPlayers));
      
      // Find user's rank
      const userIndex = topPlayers.findIndex(p => p.address === address);
      setUserRank(userIndex >= 0 ? userIndex + 1 : null);
    }
  }, [newScore, address, leaderboard]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown size={24} color="#FFD700" />;
      case 2: return <Medal size={24} color="#C0C0C0" />;
      case 3: return <Medal size={24} color="#CD7F32" />;
      default: return <Trophy size={20} color="#00d4ff" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#00d4ff';
    }
  };

  const getRewardForRank = (rank) => {
    if (rank === 1) return '1000 CQT + Legendary NFT';
    if (rank <= 3) return '500 CQT + Epic NFT';
    if (rank <= 10) return '200 CQT + Rare NFT';
    if (rank <= 25) return '100 CQT';
    return '50 CQT';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '2rem',
      backdropFilter: 'blur(20px)',
      maxHeight: '600px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1rem'
      }}>
        <Trophy size={32} color="#00d4ff" />
        <div>
          <h2 style={{ margin: 0, color: '#00d4ff' }}>Arena Leaderboard</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
            Top players earn weekly rewards!
          </p>
        </div>
      </div>

      {/* User's Current Rank */}
      {userRank && (
        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {getRankIcon(userRank)}
            <div>
              <div style={{ fontWeight: 'bold', color: '#00d4ff' }}>Your Rank: #{userRank}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Reward: {getRewardForRank(userRank)}
              </div>
            </div>
          </div>
          <Star size={24} color="#00d4ff" />
        </div>
      )}

      {/* Leaderboard List */}
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto',
        paddingRight: '10px'
      }}>
        {leaderboard.slice(0, 10).map((player, index) => (
          <div
            key={player.address}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              marginBottom: '0.5rem',
              background: player.address === address 
                ? 'rgba(0, 212, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${player.address === address 
                ? 'rgba(0, 212, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${getRankColor(player.rank)}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                minWidth: '40px', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {getRankIcon(player.rank)}
              </div>
              
              <div>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: getRankColor(player.rank),
                  fontSize: '1.1rem'
                }}>
                  {player.username}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  opacity: 0.7,
                  fontFamily: 'monospace'
                }}>
                  {player.address}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: '#00ff88'
              }}>
                {player.score.toLocaleString()}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7,
                color: getRankColor(player.rank)
              }}>
                {getRewardForRank(player.rank)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Info */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <Zap size={16} color="#00ff88" />
          <strong style={{ color: '#00ff88' }}>Weekly Rewards</strong>
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          Rewards are distributed every Sunday based on leaderboard rankings.
          Keep playing to climb higher and earn bigger rewards!
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;