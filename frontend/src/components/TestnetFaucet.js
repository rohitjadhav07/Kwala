import React, { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Droplets, ExternalLink, Copy, CheckCircle } from 'lucide-react';

const TestnetFaucet = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const faucets = [
    {
      name: 'Polygon Faucet',
      url: 'https://faucet.polygon.technology/',
      description: 'Official Polygon faucet - most reliable',
      amount: '0.1 MATIC',
      requirements: 'Twitter account required'
    },
    {
      name: 'Alchemy Faucet',
      url: 'https://www.alchemy.com/faucets/polygon-amoy',
      description: 'Alchemy\'s Polygon Amoy faucet',
      amount: '0.5 MATIC',
      requirements: 'Alchemy account required'
    },
    {
      name: 'QuickNode Faucet',
      url: 'https://faucet.quicknode.com/polygon/amoy',
      description: 'QuickNode faucet for Polygon Amoy',
      amount: '0.1 MATIC',
      requirements: 'No account required'
    }
  ];

  if (chain?.id !== 80002) {
    return null; // Only show on Polygon Amoy
  }

  return (
    <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div className="card-icon">
          <Droplets size={24} />
        </div>
        <div className="card-title">Get Testnet MATIC</div>
      </div>
      <div className="card-content">
        <p style={{ marginBottom: '1rem' }}>
          You need testnet MATIC to mint characters and pay for gas fees. Use these faucets to get free testnet tokens:
        </p>

        {/* Address Display */}
        {address && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            <span style={{ color: '#b0b0b0' }}>Your Address:</span>
            <code style={{ 
              flex: 1, 
              color: '#00d4ff',
              background: 'rgba(0, 212, 255, 0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px'
            }}>
              {address}
            </code>
            <button
              onClick={copyAddress}
              style={{
                background: 'none',
                border: 'none',
                color: copied ? '#00ff88' : '#00d4ff',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        {/* Faucet List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {faucets.map((faucet, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '8px'
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#00d4ff' }}>
                  {faucet.name}
                </h4>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>
                  {faucet.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#b0b0b0' }}>
                  <span>Amount: {faucet.amount}</span>
                  <span>{faucet.requirements}</span>
                </div>
              </div>
              <a
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  marginLeft: '1rem'
                }}
              >
                Get MATIC
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#00ff88' }}>
            💡 Pro Tips:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <li>You need about 0.11 MATIC total (0.1 for minting + 0.01 for gas)</li>
            <li>Faucets have daily limits, try multiple if one doesn't work</li>
            <li>Some faucets require social media verification</li>
            <li>Tokens usually arrive within 1-2 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestnetFaucet;