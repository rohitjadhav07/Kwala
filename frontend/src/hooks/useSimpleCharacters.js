import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead, useNetwork } from 'wagmi';
import { CONTRACT_ADDRESSES, CHARACTER_ABI } from '../config/contracts';

export function useSimpleCharacters() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

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
  });

  // Mint character function
  const { write: mintCharacter, isLoading: isMinting } = useContractWrite({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'mintCharacter',
    onSuccess: () => {
      setTimeout(() => {
        refetchIds();
      }, 2000);
    },
  });

  // Add experience function
  const { write: addExperience, isLoading: isAddingExp } = useContractWrite({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'addExperience',
    onSuccess: () => {
      setTimeout(() => {
        refetchIds();
      }, 2000);
    },
  });

  // Evolve character function
  const { write: evolveCharacter, isLoading: isEvolving } = useContractWrite({
    address: getContractAddress(),
    abi: CHARACTER_ABI,
    functionName: 'evolveCharacter',
    onSuccess: () => {
      setTimeout(() => {
        refetchIds();
      }, 2000);
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
      
      // For now, create mock data based on the IDs we have
      const mockCharacters = characterIds.map((id, index) => {
        const classes = ['warrior', 'mage', 'rogue'];
        const characterClass = classes[index % 3];
        
        return {
          id: id.toString(),
          name: `${characterClass.charAt(0).toUpperCase() + characterClass.slice(1)} #${id}`,
          class: characterClass,
          level: Math.floor(Math.random() * 10) + 1,
          evolutionStage: Math.floor(Math.random() * 3) + 1,
          experience: Math.floor(Math.random() * 1000),
          stats: {
            strength: Math.floor(Math.random() * 50) + 20,
            defense: Math.floor(Math.random() * 50) + 20,
            speed: Math.floor(Math.random() * 50) + 20,
            magic: Math.floor(Math.random() * 50) + 20,
          },
          battlePower: Math.floor(Math.random() * 2000) + 500,
        };
      });

      setCharacters(mockCharacters);
      setLoading(false);
    };

    fetchCharacterDetails();
  }, [characterIds]);

  const handleMintCharacter = (characterClass) => {
    if (!address) return;
    const tokenURI = `https://chainquest-metadata.vercel.app/${characterClass}/default.json`;
    mintCharacter?.({
      args: [address, characterClass, tokenURI],
    });
  };

  const handleAddExperience = (tokenId) => {
    addExperience?.({
      args: [tokenId, 100],
    });
  };

  const handleEvolveCharacter = (tokenId) => {
    evolveCharacter?.({
      args: [tokenId],
    });
  };

  return {
    characters,
    loading,
    mintCharacter: handleMintCharacter,
    addExperience: handleAddExperience,
    evolveCharacter: handleEvolveCharacter,
    isMinting,
    isAddingExp,
    isEvolving,
    refetch: refetchIds,
  };
}