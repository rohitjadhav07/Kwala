import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useDemoCharacters() {
  const { address, isConnected } = useAccount();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo character data
  const demoCharacters = [
    {
      id: '1',
      name: 'Thorin Ironshield',
      class: 'warrior',
      level: 12,
      evolutionStage: 3,
      experience: 2340,
      stats: {
        strength: 45,
        defense: 38,
        speed: 22,
        magic: 15
      },
      battlePower: 1440
    },
    {
      id: '2', 
      name: 'Luna Starweaver',
      class: 'mage',
      level: 8,
      evolutionStage: 2,
      experience: 890,
      stats: {
        strength: 18,
        defense: 20,
        speed: 28,
        magic: 52
      },
      battlePower: 944
    }
  ];

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        setCharacters(demoCharacters);
        setLoading(false);
      }, 1000);
    } else {
      setCharacters([]);
      setLoading(false);
    }
  }, [isConnected, address]);

  const mintCharacter = (characterClass) => {
    const newCharacter = {
      id: (characters.length + 1).toString(),
      name: `${characterClass.charAt(0).toUpperCase() + characterClass.slice(1)} #${characters.length + 1}`,
      class: characterClass,
      level: 1,
      evolutionStage: 1,
      experience: 0,
      stats: {
        strength: characterClass === 'warrior' ? 25 : characterClass === 'mage' ? 8 : 15,
        defense: characterClass === 'warrior' ? 20 : characterClass === 'mage' ? 10 : 12,
        speed: characterClass === 'warrior' ? 10 : characterClass === 'mage' ? 12 : 25,
        magic: characterClass === 'warrior' ? 5 : characterClass === 'mage' ? 30 : 8
      },
      battlePower: 200
    };
    
    setCharacters(prev => [...prev, newCharacter]);
    return Promise.resolve();
  };

  const addExperience = (tokenId) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === tokenId) {
        const newExp = parseInt(char.experience) + 100;
        const newLevel = Math.floor(newExp / 100) + 1;
        return {
          ...char,
          experience: newExp,
          level: newLevel,
          battlePower: char.battlePower + 50
        };
      }
      return char;
    }));
    return Promise.resolve();
  };

  const evolveCharacter = (tokenId) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === tokenId) {
        const newStage = Math.min(parseInt(char.evolutionStage) + 1, 5);
        return {
          ...char,
          evolutionStage: newStage,
          level: char.level + 5,
          stats: {
            strength: char.stats.strength + 10,
            defense: char.stats.defense + 8,
            speed: char.stats.speed + 6,
            magic: char.stats.magic + 12
          },
          battlePower: char.battlePower + 200
        };
      }
      return char;
    }));
    return Promise.resolve();
  };

  return {
    characters,
    loading,
    mintCharacter,
    addExperience,
    evolveCharacter,
    isMinting: false,
    isAddingExp: false,
    isEvolving: false,
    refetch: () => {}
  };
}