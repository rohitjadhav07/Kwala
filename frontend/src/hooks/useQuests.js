import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useQuests() {
  const { address, isConnected } = useAccount();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  // Load user progress from localStorage
  useEffect(() => {
    if (address) {
      const savedProgress = localStorage.getItem(`quest_progress_${address}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
  }, [address]);

  // Save progress to localStorage
  const saveProgress = (newProgress) => {
    if (address) {
      localStorage.setItem(`quest_progress_${address}`, JSON.stringify(newProgress));
      setUserProgress(newProgress);
    }
  };

  // Get dynamic quest templates with real progress
  const getQuestTemplates = () => [
    {
      id: 1,
      title: "First Steps",
      description: "Mint your first NFT character to begin your journey",
      type: "daily",
      chain: "polygon",
      target: 1,
      progress: userProgress.charactersOwned || 0,
      reward: "100 XP + 0.05 MATIC",
      timeLeft: "23h 45m",
      status: (userProgress.charactersOwned || 0) >= 1 ? "completed" : "active",
      autoTracked: true
    },
    {
      id: 2,
      title: "Arena Warrior",
      description: "Score 500+ points in the Arena game",
      type: "daily",
      chain: "multi",
      target: 500,
      progress: userProgress.arenaHighScore || 0,
      reward: "200 XP + Rare Item Box",
      timeLeft: "23h 45m",
      status: (userProgress.arenaHighScore || 0) >= 500 ? "completed" : "active",
      autoTracked: true
    },
    {
      id: 3,
      title: "Marketplace Explorer",
      description: "Browse and purchase an NFT from the marketplace",
      type: "daily",
      chain: "polygon",
      target: 1,
      progress: userProgress.marketplacePurchases || 0,
      reward: "150 XP + 0.05 MATIC",
      timeLeft: "23h 45m",
      status: (userProgress.marketplacePurchases || 0) >= 1 ? "completed" : "active",
      autoTracked: true
    },
    {
      id: 4,
      title: "Battle Master",
      description: "Win 5 arena battles in a row",
      type: "weekly",
      chain: "multi",
      target: 5,
      progress: userProgress.battleWinStreak || 0,
      reward: "500 XP + Champion Title",
      timeLeft: "6d 12h",
      status: (userProgress.battleWinStreak || 0) >= 5 ? "completed" : "active",
      autoTracked: true
    },
    {
      id: 5,
      title: "NFT Collector",
      description: "Own 5 different NFT characters",
      type: "achievement",
      chain: "multi",
      target: 5,
      progress: userProgress.charactersOwned || 0,
      reward: "1000 XP + Collector Badge",
      timeLeft: "No limit",
      status: (userProgress.charactersOwned || 0) >= 5 ? "completed" : "active",
      autoTracked: true
    },
    {
      id: 6,
      title: "Trader",
      description: "Complete 3 marketplace transactions",
      type: "weekly",
      chain: "polygon",
      target: 3,
      progress: (userProgress.marketplacePurchases || 0) + (userProgress.marketplaceSales || 0),
      reward: "300 XP + Trading Badge",
      timeLeft: "6d 12h",
      status: ((userProgress.marketplacePurchases || 0) + (userProgress.marketplaceSales || 0)) >= 3 ? "completed" : "active",
      autoTracked: true
    },
    {
      id: 7,
      title: "Welcome Bonus",
      description: "Connect your wallet and explore ChainQuest",
      type: "daily",
      chain: "multi",
      target: 1,
      progress: isConnected ? 1 : 0,
      reward: "50 XP + Welcome Package",
      timeLeft: isConnected ? "Completed" : "Connect wallet",
      status: isConnected ? "completed" : "active",
      autoTracked: true
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        setQuests(getQuestTemplates());
        setLoading(false);
      }, 1000);
    } else {
      setQuests([]);
      setLoading(false);
    }
  }, [isConnected, address, userProgress]);

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

  // Functions to update user progress for different actions
  const trackCharacterMinted = () => {
    const newProgress = {
      ...userProgress,
      charactersOwned: (userProgress.charactersOwned || 0) + 1
    };
    saveProgress(newProgress);
  };

  const trackArenaScore = (score) => {
    const newProgress = {
      ...userProgress,
      arenaHighScore: Math.max(userProgress.arenaHighScore || 0, score)
    };
    saveProgress(newProgress);
  };

  const trackBattleWin = () => {
    const newProgress = {
      ...userProgress,
      battleWinStreak: (userProgress.battleWinStreak || 0) + 1,
      totalBattleWins: (userProgress.totalBattleWins || 0) + 1
    };
    saveProgress(newProgress);
  };

  const trackBattleLoss = () => {
    const newProgress = {
      ...userProgress,
      battleWinStreak: 0 // Reset win streak on loss
    };
    saveProgress(newProgress);
  };

  const trackMarketplacePurchase = () => {
    const newProgress = {
      ...userProgress,
      marketplacePurchases: (userProgress.marketplacePurchases || 0) + 1
    };
    saveProgress(newProgress);
  };

  const trackMarketplaceSale = () => {
    const newProgress = {
      ...userProgress,
      marketplaceSales: (userProgress.marketplaceSales || 0) + 1
    };
    saveProgress(newProgress);
  };

  return {
    quests,
    loading,
    completeQuest,
    updateQuestProgress,
    trackCharacterMinted,
    trackArenaScore,
    trackBattleWin,
    trackBattleLoss,
    trackMarketplacePurchase,
    trackMarketplaceSale,
    userProgress,
    refetch: () => setQuests(getQuestTemplates())
  };
}