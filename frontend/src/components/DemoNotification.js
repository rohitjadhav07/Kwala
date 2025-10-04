import React, { useState } from 'react';
import { X, Play, Code } from 'lucide-react';

const DemoNotification = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
      zIndex: 1000,
      maxWidth: '600px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <Play size={24} />
      <div style={{ flex: 1 }}>
        <strong>🎮 ChainQuest Demo is Live!</strong><br />
        <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          Try minting characters, adding experience, and evolving them. 
          All interactions are simulated for the demo.
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default DemoNotification;