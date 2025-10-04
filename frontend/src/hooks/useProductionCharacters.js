import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESSES, CHARACTER_ABI } from '../config/contracts';

export function useProductionCharacters() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get contract address for current chain
  const getContractAddress = () => {
    let chainKey = 'hardhat';
    if (chain?.id === 1337) {
      chainKey = 'localhost';
    } else if (chain?.name) {
      chainKey = chain.name.toLowerCase();
    }
    const addresses = CONTRACT_ADDRESSES[chainKey] || CONTRACT_ADDRESSES.hardhat;
    return addresses.ChainQuestCharacter;
  };

  // Read character IDs owned by user
  const { data: characterIds, refetch: refetchIds } = useContractRead({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'getCharactersByOwner',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // Contract write hooks
  const { 
    data: mintData, 
    write: mintWrite, 
    isLoading: isMinting 
  } = useContractWrite({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'mintCharacter',
  });

  const { 
    data: expData, 
    write: expWrite, 
    isLoading: isAddingExp 
  } = useContractWrite({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'addExperience',
  });

  const { 
    data: evolveData, 
    write: evolveWrite, 
    isLoading: isEvolving 
  } = useContractWrite({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'evolveCharacter',
  });

  // Wait for transactions
  const { isLoading: isMintWaiting } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: () => {
      setTimeout(() => refetchIds(), 2000);
    },
  });

  const { isLoading: isExpWaiting } = useWaitForTransaction({
    hash: expData?.hash,
    onSuccess: () => {
      setTimeout(() => refetchIds(), 2000);
    },
  });

  const { isLoading: isEvolveWaiting } = useWaitForTransaction({
    hash: evolveData?.hash,
    onSuccess: () => {
      setTimeout(() => refetchIds(), 2000);
    },
  });

  // Fetch character details when IDs change
  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (!characterIds || characterIds.length === 0) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // For production, you would fetch real data from contracts
        // For now, create enhanced mock data based on the IDs
        const mockCharacters = characterIds.map((id, index) => {
          const classes = ['warrior', 'mage', 'rogue'];
          const characterClass = classes[index % 3];
          const level = Math.floor(Math.random() * 15) + 1;
          const evolutionStage = Math.min(Math.floor(level / 5) + 1, 5);
          const experience = level * 100 + Math.floor(Math.random() * 100);
          
          return {
            id: id.toString(),
            name: `${characterClass.charAt(0).toUpperCase() + characterClass.slice(1)} #${id}`,
            class: characterClass,
            level,
            evolutionStage,
            experience,
            stats: {
              strength: Math.floor(Math.random() * 30) + (characterClass === 'warrior' ? 40 : 20),
              defense: Math.floor(Math.random() * 30) + (characterClass === 'warrior' ? 35 : 15),
              speed: Math.floor(Math.random() * 30) + (characterClass === 'rogue' ? 40 : 15),
              magic: Math.floor(Math.random() * 30) + (characterClass === 'mage' ? 50 : 10),
            },
            battlePower: Math.floor(Math.random() * 1500) + 500 + (level * 50),
          };
        });

        setCharacters(mockCharacters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [characterIds]);

  const mintCharacter = (characterClass) => {
    if (!address) return;
    const tokenURI = `https://chainquest-metadata.vercel.app/${characterClass}/default.json`;
    mintWrite?.({
      args: [address, characterClass, tokenURI],
    });
  };

  const addExperience = (tokenId) => {
    expWrite?.({
      args: [tokenId, 100],
    });
  };

  const evolveCharacter = (tokenId) => {
    evolveWrite?.({
      args: [tokenId],
    });
  };

  return {
    characters,
    loading,
    error,
    mintCharacter,
    addExperience,
    evolveCharacter,
    isMinting: isMinting || isMintWaiting,
    isAddingExp: isAddingExp || isExpWaiting,
    isEvolving: isEvolving || isEvolveWaiting,
    refetch: refetchIds,
    contractAddress: getContractAddress(),
    isReady: !!address && !!chain,
  };
}