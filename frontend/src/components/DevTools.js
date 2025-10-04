import React, { useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { Settings, Zap, Database } from 'lucide-react';

const DevTools = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {isOpen && (
        <div style={{
          background: 'rgba(15, 15, 35, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          minWidth: '250px'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#00d4ff' }}>
            <Database size={16} style={{ marginRight: '0.5rem' }} />
            Dev Tools
          </h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Current Network:</strong><br />
            <span style={{ color: '#00d4ff' }}>
              {chain?.name || 'Unknown'} (ID: {chain?.id || 'N/A'})
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Quick Actions:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                onClick={() => switchNetwork?.(1337)} // Hardhat
              >
                Switch to Hardhat
              </button>
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                onClick={() => switchNetwork?.(11155111)} // Sepolia
              >
                Switch to Sepolia
              </button>
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#b0b0b0' }}>
            💡 Make sure you have the local Hardhat node running:<br />
            <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>
              npx hardhat node
            </code>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)'
        }}
      >
        <Settings size={20} color="white" />
      </button>
    </div>
  );
};

export default DevTools;