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
      price: "150 MATIC",
      priceUSD: "$120",
      seller: "0x1234...5678",
      chain: "polygon",
      stats: { strength: 95, defense: 88, speed: 72, magic: 45 },
      battlePower: 7500,
      rarity: "legendary",
      timeLeft: "2d 14h",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Mystic Void Walker",
      class: "mage",
      level: 18,
      evolutionStage: 4,
      price: "75 MATIC",
      priceUSD: "$60",
      seller: "0x9876...4321",
      chain: "polygon",
      stats: { strength: 35, defense: 42, speed: 68, magic: 92 },
      battlePower: 4284,
      rarity: "epic",
      timeLeft: "1d 8h",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "Shadow Assassin Elite",
      class: "rogue",
      level: 22,
      evolutionStage: 4,
      price: "90 MATIC",
      priceUSD: "$72",
      seller: "0x5555...9999",
      chain: "polygon",
      stats: { strength: 78, defense: 55, speed: 95, magic: 38 },
      battlePower: 5852,
      rarity: "epic",
      timeLeft: "5h 32m",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 4,
      name: "Crystal Sage",
      class: "mage",
      level: 15,
      evolutionStage: 3,
      price: "45 MATIC",
      priceUSD: "$36",
      seller: "0x7777...1111",
      chain: "polygon",
      stats: { strength: 28, defense: 35, speed: 45, magic: 78 },
      battlePower: 2790,
      rarity: "rare",
      timeLeft: "3d 22h",
      image: "https://images.unsplash.com/photo-1578662015879-c0d6c5d87bc4?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 5,
      name: "Iron Berserker",
      class: "warrior",
      level: 12,
      evolutionStage: 2,
      price: "25 MATIC",
      priceUSD: "$20",
      seller: "0x3333...7777",
      chain: "polygon",
      stats: { strength: 52, defense: 48, speed: 32, magic: 18 },
      battlePower: 1800,
      rarity: "common",
      timeLeft: "12h 15m",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 6,
      name: "Celestial Archer",
      class: "rogue",
      level: 20,
      evolutionStage: 3,
      price: "55 MATIC",
      priceUSD: "$44",
      seller: "0x8888...2222",
      chain: "polygon",
      stats: { strength: 65, defense: 45, speed: 88, magic: 52 },
      battlePower: 4200,
      rarity: "rare",
      timeLeft: "6h 45m",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 7,
      name: "Storm Elementalist",
      class: "mage",
      level: 30,
      evolutionStage: 6,
      price: "200 MATIC",
      priceUSD: "$160",
      seller: "0x4444...6666",
      chain: "polygon",
      stats: { strength: 40, defense: 55, speed: 75, magic: 98 },
      battlePower: 8900,
      rarity: "legendary",
      timeLeft: "4d 12h",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 8,
      name: "Frost Guardian",
      class: "warrior",
      level: 16,
      evolutionStage: 3,
      price: "18 MATIC",
      priceUSD: "$14.40",
      seller: "0x9999...3333",
      chain: "polygon",
      stats: { strength: 58, defense: 72, speed: 38, magic: 25 },
      battlePower: 2890,
      rarity: "common",
      timeLeft: "18h 30m",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center"
    },

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