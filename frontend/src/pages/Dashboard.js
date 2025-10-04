import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Users, Map, Sword, Trophy, Zap, Star, TrendingUp, Activity } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { useDemoCharacters } from '../hooks/useDemoCharacters';

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { characters, loading: charactersLoading } = useDemoCharacters();
  const [stats, setStats] = useState({
    characters: 0,
    activeQuests: 0,
    battlesWon: 0,
    totalRewards: 0,
    level: 1,
    experience: 0
  });

  useEffect(() => {
    if (isConnected && address && characters.length > 0) {
      // Calculate real stats from characters
      const totalExperience = characters.reduce((sum, char) => sum + parseInt(char.experience), 0);
      const averageLevel = Math.floor(characters.reduce((sum, char) => sum + parseInt(char.level), 0) / characters.length);
      
      setStats({
        characters: characters.length,
        activeQuests: Math.floor(Math.random() * 5) + 2, // Simulated for now
        battlesWon: Math.floor(totalExperience / 50), // Estimate battles from XP
        totalRewards: totalExperience * 2, // Estimate rewards
        level: averageLevel,
        experience: totalExperience
      });
    } else if (isConnected && address && !charactersLoading) {
      // No characters yet
      setStats({
        characters: 0,
        activeQuests: 0,
        battlesWon: 0,
        totalRewards: 0,
        level: 1,
        experience: 0
      });
    }
  }, [isConnected, address, characters, charactersLoading]);

  if (!isConnected) {
    return (
      <div className="dashboard">
        <div className="dashboard-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <h2>Welcome to ChainQuest!</h2>
          <p>Connect your wallet to start your cross-chain gaming adventure.</p>
          <div style={{ marginTop: '2rem' }}>
            <h3>🎮 What is ChainQuest?</h3>
            <p>
              ChainQuest is a revolutionary cross-chain RPG powered by Kwala automation. 
              Battle across multiple blockchains, evolve your NFT characters automatically, 
              and participate in tournaments without worrying about complex backend infrastructure.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <h4>🚀 Get Started:</h4>
              <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '1rem auto' }}>
                <li>Connect your wallet above</li>
                <li>Go to Characters page and mint your first NFT character</li>
                <li>Train your character to gain experience</li>
                <li>Watch it evolve automatically via Kwala automation</li>
                <li>Participate in cross-chain tournaments</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Welcome back, Adventurer!</h1>
        <p>Your cross-chain gaming dashboard</p>
        {chain && (
          <div className="chain-indicator" style={{ marginTop: '1rem' }}>
            <div className={`chain-dot chain-${chain.name.toLowerCase()}`}></div>
            Connected to {chain.name} (ID: {chain.id})
          </div>
        )}
        
        {/* Contract Status */}
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(0, 255, 136, 0.1)',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          <strong>Demo Status:</strong> ✅ Ready<br />
          <strong>Mode:</strong> Interactive Demo
        </div>
      </div>

      <div className="dashboard">
        <StatsCard
          icon={Star}
          title={`Level ${stats.level}`}
          value={`${stats.experience}/3000 XP`}
          subtitle="Player Experience"
          color="#ffe66d"
          trend={12}
        />
        
        <StatsCard
          icon={Users}
          title="Characters"
          value={stats.characters}
          subtitle="NFT Collection"
          color="#00d4ff"
          trend={stats.characters > 0 ? 25 : 0}
        />
        
        <StatsCard
          icon={Map}
          title="Active Quests"
          value={stats.activeQuests}
          subtitle="Auto-tracked by Kwala"
          color="#4ecdc4"
        />
        
        <StatsCard
          icon={Sword}
          title="Battles Won"
          value={stats.battlesWon}
          subtitle="Cross-chain victories"
          color="#ff6b6b"
          trend={8}
        />
        
        <StatsCard
          icon={Trophy}
          title="Total Rewards"
          value={`${stats.totalRewards.toLocaleString()} CQT`}
          subtitle="Tokens earned"
          color="#00ff88"
          trend={15}
        />
        
        <StatsCard
          icon={Activity}
          title="Battle Power"
          value={characters.reduce((sum, char) => sum + parseInt(char.battlePower || 0), 0).toLocaleString()}
          subtitle="Combined strength"
          color="#9b59b6"
        />
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Recent Activity</h2>
        <div className="quest-list">
          <div className="quest-card">
            <div className="quest-info">
              <h3>🎉 Character Evolution</h3>
              <div className="quest-description">Your Warrior "Thorin" evolved to Stage 3!</div>
              <div className="quest-reward">+500 XP, +15 Strength</div>
            </div>
            <div style={{ color: '#00ff88' }}>2 hours ago</div>
          </div>
          
          <div className="quest-card">
            <div className="quest-info">
              <h3>⚔️ Battle Victory</h3>
              <div className="quest-description">Won tournament match on Polygon network</div>
              <div className="quest-reward">+200 CQT, +100 XP</div>
            </div>
            <div style={{ color: '#00ff88' }}>5 hours ago</div>
          </div>
          
          <div className="quest-card">
            <div className="quest-info">
              <h3>📋 Quest Completed</h3>
              <div className="quest-description">"Defeat 10 Goblins" auto-completed via Kwala</div>
              <div className="quest-reward">+150 CQT, +75 XP</div>
            </div>
            <div style={{ color: '#00ff88' }}>1 day ago</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;