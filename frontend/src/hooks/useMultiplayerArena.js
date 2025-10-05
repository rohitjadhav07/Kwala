import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useQuests } from './useQuests';

export function useMultiplayerArena() {
  const { address, isConnected } = useAccount();
  const { trackArenaScore, trackBattleWin, trackBattleLoss } = useQuests();
  
  const [gameState, setGameState] = useState('menu'); // menu, searching, preparing, playing, finished
  const [selectedGame, setSelectedGame] = useState('clicker');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isHost, setIsHost] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);
  
  const gameLoopRef = useRef(null);
  const matchTimerRef = useRef(null);
  const currentMatchRef = useRef(null);

  // Load match history
  useEffect(() => {
    if (address) {
      const savedHistory = localStorage.getItem(`arena_history_${address}`);
      if (savedHistory) {
        setMatchHistory(JSON.parse(savedHistory));
      }
    }
  }, [address]);

  // Save match history
  const saveMatchHistory = (match) => {
    if (address) {
      const newHistory = [match, ...matchHistory.slice(0, 9)]; // Keep last 10 matches
      setMatchHistory(newHistory);
      localStorage.setItem(`arena_history_${address}`, JSON.stringify(newHistory));
    }
  };

  // Simulate matchmaking
  const findMatch = (gameType = selectedGame) => {
    if (!isConnected) return;
    
    setSelectedGame(gameType);
    setGameState('searching');
    
    // Simulate finding an opponent (2-5 seconds)
    const searchTime = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
      const opponents = [
        { name: 'CryptoWarrior', address: '0x1234...5678', level: 15 + Math.floor(Math.random() * 20) },
        { name: 'BlockchainMage', address: '0x9876...4321', level: 10 + Math.floor(Math.random() * 25) },
        { name: 'DeFiRogue', address: '0x5555...9999', level: 20 + Math.floor(Math.random() * 15) },
        { name: 'NFTCollector', address: '0x7777...1111', level: 12 + Math.floor(Math.random() * 18) },
        { name: 'MetaversePro', address: '0x3333...7777', level: 18 + Math.floor(Math.random() * 22) }
      ];
      
      const opponent = opponents[Math.floor(Math.random() * opponents.length)];
      
      const gameNames = {
        clicker: 'Target Clicker Battle',
        snake: 'Snake Showdown',
        tetris: 'Tetris Duel',
        pong: 'Pong Championship',
        flappy: 'Flappy Bird Race'
      };

      const newMatch = {
        id: Date.now(),
        opponent,
        gameType: gameType,
        startTime: Date.now(),
        gameMode: gameNames[gameType] || '1v1 Battle',
        reward: '50 XP + 0.01 MATIC'
      };
      
      setCurrentMatch(newMatch);
      currentMatchRef.current = newMatch;
      
      setGameState('preparing');
      setPlayerScore(0);
      setOpponentScore(0);
      setTimeLeft(60);
      setIsHost(Math.random() > 0.5);
      
      // Give players 3 seconds to prepare
      setTimeout(() => {
        setGameState('playing');
        startGameLoop();
      }, 3000);
    }, searchTime);
  };

  // Start the game loop
  const startGameLoop = () => {
    // Start match timer
    matchTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Only end match if we have a current match
          if (currentMatchRef.current) {
            endMatch();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate opponent scoring
    gameLoopRef.current = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance opponent scores
        const points = Math.floor(Math.random() * 50) + 10;
        setOpponentScore(prev => prev + points);
      }
    }, 2000);
  };

  // Player action (clicking, key press, etc.)
  const playerAction = () => {
    if (gameState !== 'playing') return;
    
    const points = Math.floor(Math.random() * 100) + 25; // 25-125 points per action
    setPlayerScore(prev => prev + points);
  };

  // End the match
  const endMatch = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (matchTimerRef.current) {
      clearInterval(matchTimerRef.current);
      matchTimerRef.current = null;
    }

    // Check if currentMatch exists before accessing its properties
    const matchToEnd = currentMatchRef.current || currentMatch;
    if (!matchToEnd) {
      console.warn('endMatch called but currentMatch is null');
      setGameState('menu');
      return;
    }

    const won = playerScore > opponentScore;
    const matchResult = {
      id: matchToEnd.id,
      opponent: matchToEnd.opponent,
      playerScore,
      opponentScore,
      won,
      duration: 60 - timeLeft,
      timestamp: Date.now(),
      reward: won ? matchToEnd.reward : 'Better luck next time!'
    };

    // Track quest progress
    trackArenaScore(playerScore);
    if (won) {
      trackBattleWin();
      
      // Award tokens for winning
      const currentTokens = parseInt(localStorage.getItem(`cqt_tokens_${address}`) || '0');
      const newTokens = currentTokens + 50; // 50 CQT tokens for winning
      localStorage.setItem(`cqt_tokens_${address}`, newTokens.toString());
      
      // Show reward notification
      console.log(`🏆 Victory! Earned 50 CQT tokens. Total: ${newTokens} CQT`);
    } else {
      trackBattleLoss();
      
      // Small consolation prize for participation
      const currentTokens = parseInt(localStorage.getItem(`cqt_tokens_${address}`) || '0');
      const newTokens = currentTokens + 10; // 10 CQT tokens for participation
      localStorage.setItem(`cqt_tokens_${address}`, newTokens.toString());
      
      console.log(`💪 Good effort! Earned 10 CQT tokens. Total: ${newTokens} CQT`);
    }

    saveMatchHistory(matchResult);
    setGameState('finished');
  };

  // Leave match
  const leaveMatch = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (matchTimerRef.current) {
      clearInterval(matchTimerRef.current);
      matchTimerRef.current = null;
    }
    
    setGameState('menu');
    setCurrentMatch(null);
    currentMatchRef.current = null;
    setPlayerScore(0);
    setOpponentScore(0);
    setTimeLeft(60);
  };

  // Return to menu
  const returnToMenu = () => {
    // Clear any running intervals
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (matchTimerRef.current) {
      clearInterval(matchTimerRef.current);
      matchTimerRef.current = null;
    }
    
    setGameState('menu');
    setCurrentMatch(null);
    currentMatchRef.current = null;
    setPlayerScore(0);
    setOpponentScore(0);
    setTimeLeft(60);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (matchTimerRef.current) clearInterval(matchTimerRef.current);
    };
  }, []);

  return {
    gameState,
    selectedGame,
    setSelectedGame,
    currentMatch,
    playerScore,
    setPlayerScore,
    opponentScore,
    timeLeft,
    isHost,
    matchHistory,
    findMatch,
    playerAction,
    leaveMatch,
    returnToMenu,
    endMatch
  };
}