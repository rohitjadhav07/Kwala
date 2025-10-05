import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { polygon, bsc, arbitrum, sepolia, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Components
import Header from './components/Header';
import DevTools from './components/DevTools';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Characters from './pages/Characters';
import Quests from './pages/Quests';
import Arena from './pages/Arena';
import Marketplace from './pages/Marketplace';
import CharacterMint from './components/CharacterMint';
import './App.css';

// Define Polygon Amoy testnet
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  network: 'polygon-amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: { http: ['https://rpc-amoy.polygon.technology'] },
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
};

// Define localhost chain (development only)
const localhost = {
  id: 1337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:8545'] },
    default: { http: ['http://127.0.0.1:8545'] },
  },
};

// Configure chains and providers with better RPC if available
const providers = [publicProvider()];

// Add Alchemy provider if API key is available
if (process.env.REACT_APP_ALCHEMY_API_KEY) {
  providers.unshift(alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }));
}

// Configure chains based on environment
const supportedChains = process.env.NODE_ENV === 'production' 
  ? [polygonAmoy, polygon, mainnet, bsc, arbitrum] // Production: no localhost
  : [polygonAmoy, polygon, mainnet, bsc, arbitrum, sepolia, polygonMumbai, localhost]; // Development: include localhost

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
  providers
);

// Configure wallets
const { wallets } = getDefaultWallets({
  appName: 'ChainQuest',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <ErrorBoundary>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <Router>
            <div className="App">
              {/* Animated Background Effects */}
              <div className="stars">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="star" />
                ))}
              </div>
              
              <div className="sparks">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className="spark" 
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 8}s`,
                      animationDuration: `${6 + Math.random() * 4}s`
                    }}
                  />
                ))}
              </div>

              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/characters" element={<Characters />} />
                  <Route path="/mint" element={<CharacterMint />} />
                  <Route path="/quests" element={<Quests />} />
                  <Route path="/arena" element={<Arena />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                </Routes>
              </main>

              <DevTools />
            </div>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </ErrorBoundary>
  );
}

export default App;