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
      description: "Mint your first character",
      type: "tutorial",
      target: 1,
      reward: "100 CQT + Starter Pack",
      timeLeft: "No limit",
      autoTracked: true
    },
    {
      id: 2,
      title: "Training Montage",
      description: "Train any character 5 times",
      type: "daily",
      target: 5,
      reward: "200 CQT + 150 XP",
      timeLeft: "18h 32m",
      autoTracked: true
    },
    {
      id: 3,
      title: "Evolution Master",
      description: "Evolve a character to Stage 3",
      type: "achievement",
      target: 1,
      reward: "500 CQT + Rare Item",
      timeLeft: "No limit",
      autoTracked: true
    },
    {
      id: 4,
      title: "Cross-Chain Explorer",
      description: "Use characters on 2 different chains",
      type: "weekly",
      target: 2,
      reward: "750 CQT + Chain Badge",
      timeLeft: "4d 12h",
      autoTracked: true
    },
    {
      id: 5,
      title: "Power Surge",
      description: "Reach 2000+ battle power with any character",
      type: "ongoing",
      target: 2000,
      reward: "1000 CQT + Title",
      timeLeft: "No limit",
      autoTracked: true
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        const questsWithProgress = questTemplates.map(quest => ({
          ...quest,
          progress: Math.floor(Math.random() * quest.target),
          status: Math.random() > 0.7 ? 'completed' : 'active',
          chain: ['ethereum', 'polygon', 'bsc', 'arbitrum'][Math.floor(Math.random() * 4)]
        }));
        setQuests(questsWithProgress);
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