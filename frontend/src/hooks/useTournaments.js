import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useTournaments() {
  const { address, isConnected } = useAccount();
  const [tournaments, setTournaments] = useState([]);
  const [activeBattles, setActiveBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  const tournamentTemplates = [
    {
      id: 1,
      name: "Weekly Championship",
      type: "weekly",
      prizePool: "5000 CQT",
      participants: 32,
      maxParticipants: 64,
      status: "registration",
      timeLeft: "2d 14h",
      entryFee: "50 CQT",
      chains: ["ethereum", "polygon", "bsc"],
      autoManaged: true
    },
    {
      id: 2,
      name: "Daily Skirmish",
      type: "daily",
      prizePool: "500 CQT",
      participants: 16,
      maxParticipants: 32,
      status: "active",
      timeLeft: "3h 45m",
      entryFee: "10 CQT",
      chains: ["polygon", "arbitrum"],
      autoManaged: true
    },
    {
      id: 3,
      name: "Cross-Chain Grand Prix",
      type: "special",
      prizePool: "15000 CQT + Legendary NFTs",
      participants: 128,
      maxParticipants: 256,
      status: "upcoming",
      timeLeft: "7d 12h",
      entryFee: "100 CQT",
      chains: ["ethereum", "polygon", "bsc", "arbitrum"],
      autoManaged: true
    }
  ];

  const battleTemplates = [
    {
      id: 1,
      player1: { name: "Thorin Ironshield", class: "warrior", power: 1440, chain: "ethereum" },
      player2: { name: "Luna Starweaver", class: "mage", power: 944, chain: "polygon" },
      status: "in_progress",
      tournamentId: 2,
      estimatedTime: "2m 15s"
    },
    {
      id: 2,
      player1: { name: "Shadow Whisper", class: "rogue", power: 1200, chain: "bsc" },
      player2: { name: "Fire Drake", class: "warrior", power: 1350, chain: "arbitrum" },
      status: "waiting",
      tournamentId: 1,
      estimatedTime: "5m 30s"
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        setTournaments(tournamentTemplates);
        setActiveBattles(battleTemplates);
        setLoading(false);
      }, 1000);
    } else {
      setTournaments([]);
      setActiveBattles([]);
      setLoading(false);
    }
  }, [isConnected, address]);

  const registerForTournament = (tournamentId, characterId) => {
    setTournaments(prev => prev.map(tournament => 
      tournament.id === tournamentId 
        ? { ...tournament, participants: tournament.participants + 1 }
        : tournament
    ));
    return Promise.resolve();
  };

  const simulateBattle = (battleId) => {
    setActiveBattles(prev => prev.map(battle => 
      battle.id === battleId 
        ? { ...battle, status: 'completed', winner: Math.random() > 0.5 ? battle.player1 : battle.player2 }
        : battle
    ));
  };

  return {
    tournaments,
    activeBattles,
    loading,
    registerForTournament,
    simulateBattle,
    refetch: () => {}
  };
}