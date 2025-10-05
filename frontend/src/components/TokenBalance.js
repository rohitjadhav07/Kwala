import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Coins, TrendingUp } from 'lucide-react';

const TokenBalance = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [recentEarnings, setRecentEarnings] = useState(0);

  useEffect(() => {
    if (address) {
      const currentBalance = parseInt(localStorage.getItem(`cqt_tokens_${address}`) || '0');
      setBalance(currentBalance);
    }
  }, [address]);

  // Check for balance updates every second
  useEffect(() => {
    if (!address) return;
    
    const interval = setInterval(() => {
      const currentBalance = parseInt(localStorage.getItem(`cqt_tokens_${address}`) || '0');
      if (currentBalance !== balance) {
        const earned = currentBalance - balance;
        if (earned > 0) {
          setRecentEarnings(earned);
          setTimeout(() => setRecentEarnings(0), 3000); // Clear after 3 seconds
        }
        setBalance(currentBalance);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [address, balance]);

  if (!address) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      position: 'relative'
    }}>
      <Coins size={24} color="#FFD700" />
      <div>
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          color: '#FFD700' 
        }}>
          {balance.toLocaleString()} CQT
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#b0b0b0' 
        }}>
          ChainQuest Tokens
        </div>
      </div>

      {recentEarnings > 0 && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: '#00ff88',
          color: '#000',
          padding: '0.25rem 0.5rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          animation: 'bounce 0.5s ease-in-out'
        }}>
          <TrendingUp size={12} />
          +{recentEarnings}
        </div>
      )}
    </div>
  );
};

export default TokenBalance;