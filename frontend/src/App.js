import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { polygon, bsc, arbitrum, sepolia, polygonMumbai } from 'wagmi/chains';

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
import { publicProvider } from 'wagmi/providers/public';
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
import './App.css';

// Define localhost chain
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

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [localhost, polygonAmoy, mainnet, polygon, bsc, arbitrum, sepolia, polygonMumbai],
  [publicProvider()]
);

// Configure wallets
const { wallets } = getDefaultWallets({
  appName: 'ChainQuest',
  projectId: 'your-project-id', // Get from WalletConnect
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
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/characters" element={<Characters />} />
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