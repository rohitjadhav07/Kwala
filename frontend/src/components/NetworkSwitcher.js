import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { AlertCircle, Zap, CheckCircle } from 'lucide-react';

const NetworkSwitcher = () => {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  // Polygon Amoy network configuration
  const polygonAmoy = {
    chainId: '0x13882', // 80002 in hex
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
  };

  // Add Polygon Amoy to MetaMask
  const addPolygonAmoy = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [polygonAmoy],
      });
    } catch (error) {
      console.error('Failed to add Polygon Amoy network:', error);
    }
  };

  // Switch to Polygon Amoy
  const switchToAmoy = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: polygonAmoy.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await addPolygonAmoy();
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  const isCorrectNetwork = chain?.id === 80002; // Polygon Amoy
  const isSupported = chains.some(c => c.id === 80002);

  if (isCorrectNetwork) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <CheckCircle size={16} color="#00ff88" />
        <span style={{ color: '#00ff88' }}>Connected to Polygon Amoy</span>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255, 107, 53, 0.1)',
      border: '1px solid rgba(255, 107, 53, 0.3)',
      borderRadius: '12px',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <AlertCircle size={20} color="#ff6b35" />
        <h4 style={{ margin: 0, color: '#ff6b35' }}>Network Configuration Required</h4>
      </div>
      
      <p style={{ marginBottom: '1rem', color: '#b0b0b0' }}>
        You need to connect to Polygon Amoy testnet to use ChainQuest features.
        Current network: {chain?.name || 'Unknown'} ({chain?.id})
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Auto Switch Button */}
        <button
          className="btn btn-primary"
          onClick={switchToAmoy}
          disabled={isLoading}
          style={{
            background: 'linear-gradient(135deg, #8247e5, #6c3ce0)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Zap size={16} />
          {isLoading ? 'Switching...' : 'Switch to Polygon Amoy'}
        </button>

        {/* Manual Switch Button (if supported by wagmi) */}
        {isSupported && switchNetwork && (
          <button
            className="btn btn-secondary"
            onClick={() => switchNetwork(80002)}
            disabled={isLoading}
          >
            {isLoading && pendingChainId === 80002 ? 'Switching...' : 'Switch Network'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem', 
          background: 'rgba(255, 107, 53, 0.2)', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#ff6b35'
        }}>
          Error: {error.message}
        </div>
      )}

      {/* Manual Instructions */}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#00d4ff' }}>
          Manual Setup Instructions
        </summary>
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <h5>Add Polygon Amoy Manually:</h5>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li><strong>Network Name:</strong> Polygon Amoy Testnet</li>
            <li><strong>RPC URL:</strong> https://rpc-amoy.polygon.technology</li>
            <li><strong>Chain ID:</strong> 80002</li>
            <li><strong>Currency Symbol:</strong> MATIC</li>
            <li><strong>Block Explorer:</strong> https://amoy.polygonscan.com/</li>
          </ul>
          
          <h5 style={{ marginTop: '1rem' }}>Steps:</h5>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Open MetaMask</li>
            <li>Click the network dropdown</li>
            <li>Click "Add Network"</li>
            <li>Enter the details above</li>
            <li>Click "Save"</li>
          </ol>
        </div>
      </details>
    </div>
  );
};

export default NetworkSwitcher;