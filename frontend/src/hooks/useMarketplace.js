import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useMarketplace() {
  const { address, isConnected } = useAccount();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const marketplaceListings = [
    {
      id: 1,
      name: "Legendary Fire Dragon",
      class: "warrior",
      level: 25,
      evolutionStage: 5,
      price: "2.5 ETH",
      priceUSD: "$4,250",
      seller: "0x1234...5678",
      chain: "ethereum",
      stats: { strength: 95, defense: 88, speed: 72, magic: 45 },
      battlePower: 7500,
      rarity: "legendary",
      timeLeft: "2d 14h"
    },
    {
      id: 2,
      name: "Mystic Void Walker",
      class: "mage",
      level: 18,
      evolutionStage: 4,
      price: "850 MATIC",
      priceUSD: "$680",
      seller: "0x9876...4321",
      chain: "polygon",
      stats: { strength: 35, defense: 42, speed: 68, magic: 92 },
      battlePower: 4284,
      rarity: "epic",
      timeLeft: "1d 8h"
    },
    {
      id: 3,
      name: "Shadow Assassin Elite",
      class: "rogue",
      level: 22,
      evolutionStage: 4,
      price: "15 BNB",
      priceUSD: "$3,600",
      seller: "0x5555...9999",
      chain: "bsc",
      stats: { strength: 78, defense: 55, speed: 95, magic: 38 },
      battlePower: 5852,
      rarity: "epic",
      timeLeft: "5h 32m"
    },
    {
      id: 4,
      name: "Crystal Sage",
      class: "mage",
      level: 15,
      evolutionStage: 3,
      price: "0.8 ETH",
      priceUSD: "$1,360",
      seller: "0x7777...1111",
      chain: "arbitrum",
      stats: { strength: 28, defense: 35, speed: 45, magic: 78 },
      battlePower: 2790,
      rarity: "rare",
      timeLeft: "3d 22h"
    },
    {
      id: 5,
      name: "Iron Berserker",
      class: "warrior",
      level: 12,
      evolutionStage: 2,
      price: "200 MATIC",
      priceUSD: "$160",
      seller: "0x3333...7777",
      chain: "polygon",
      stats: { strength: 52, defense: 48, speed: 32, magic: 18 },
      battlePower: 1800,
      rarity: "common",
      timeLeft: "12h 15m"
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        setListings(marketplaceListings);
        setLoading(false);
      }, 1000);
    } else {
      setListings([]);
      setLoading(false);
    }
  }, [isConnected, address]);

  const buyNFT = (listingId) => {
    setListings(prev => prev.filter(listing => listing.id !== listingId));
    return Promise.resolve();
  };

  const listNFT = (nftData) => {
    const newListing = {
      id: Date.now(),
      ...nftData,
      seller: address,
      timeLeft: "7d 0h"
    };
    setListings(prev => [newListing, ...prev]);
    return Promise.resolve();
  };

  return {
    listings,
    loading,
    buyNFT,
    listNFT,
    refetch: () => {}
  };
}