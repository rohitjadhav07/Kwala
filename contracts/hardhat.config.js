require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_KEY",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.infura.io/v3/YOUR_KEY", 
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 97
    },
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 421614
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      arbitrumSepolia: process.env.ARBISCAN_API_KEY
    }
  }
};