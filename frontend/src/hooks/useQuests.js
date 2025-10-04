import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useQuests() {
  const { address, isConnected } = useAccount();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const questTemplates = [
    {
      id: 1,
      title: "First Steps",
      description: "Mint your first NFT character to begin your journey",
      type: "daily",
      chain: "polygon",
      target: 1,
      progress: 0,
      reward: "100 XP + 50 MATIC",
      timeLeft: "23h 45m",
      status: "active",
      autoTracked: true
    },
    {
      id: 2,
      title: "Arena Warrior",
      description: "Score 500+ points in the Arena game",
      type: "daily",
      chain: "multi",
      target: 500,
      progress: 0,
      reward: "200 XP + Rare Item Box",
      timeLeft: "23h 45m",
      status: "active",
      autoTracked: true
    },
    {
      id: 3,
      title: "Marketplace Explorer",
      description: "Browse and purchase an NFT from the marketplace",
      type: "daily",
      chain: "ethereum",
      target: 1,
      progress: 0,
      reward: "150 XP + 0.01 ETH",
      timeLeft: "23h 45m",
      status: "active",
      autoTracked: true
    },
    {
      id: 4,
      title: "Cross-Chain Master",
      description: "Complete transactions on 3 different blockchains",
      type: "weekly",
      chain: "multi",
      target: 3,
      progress: 1,
      reward: "1000 XP + Legendary Character",
      timeLeft: "6d 12h",
      status: "active",
      autoTracked: true
    },
    {
      id: 5,
      title: "Tournament Champion",
      description: "Win 5 arena battles in a row",
      type: "achievement",
      chain: "multi",
      target: 5,
      progress: 2,
      reward: "500 XP + Champion Title",
      timeLeft: "No limit",
      status: "active",
      autoTracked: true
    },
    {
      id: 6,
      title: "NFT Collector",
      description: "Own 10 different NFT characters",
      type: "achievement",
      chain: "multi",
      target: 10,
      progress: 3,
      reward: "2000 XP + Collector Badge",
      timeLeft: "No limit",
      status: "active",
      autoTracked: true
    },
    {
      id: 7,
      title: "Evolution Master",
      description: "Evolve a character to stage 5",
      type: "weekly",
      chain: "polygon",
      target: 1,
      progress: 0,
      reward: "800 XP + Evolution Catalyst",
      timeLeft: "6d 12h",
      status: "active",
      autoTracked: true
    },
    {
      id: 8,
      title: "Welcome Bonus",
      description: "Connect your wallet and explore ChainQuest",
      type: "daily",
      chain: "multi",
      target: 1,
      progress: 1,
      reward: "50 XP + Welcome Package",
      timeLeft: "Completed",
      status: "completed",
      autoTracked: true
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        setQuests(questTemplates);
        setLoading(false);
      }, 1000);
    } else {
      setQuests([]);
      setLoading(false);
    }
  }, [isConnected, address]);

  const completeQuest = (questId) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, status: 'completed', progress: quest.target }
        : quest
    ));
  };

  const updateQuestProgress = (questId, progress) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { 
            ...quest, 
            progress: Math.min(progress, quest.target),
            status: progress >= quest.target ? 'completed' : 'active'
          }
        : quest
    ));
  };

  return {
    quests,
    loading,
    completeQuest,
    updateQuestProgress,
    refetch: () => {}
  };
}