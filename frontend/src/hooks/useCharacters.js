import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useChainQuestContracts } from './useContracts';

export function useCharacters() {
  const { address } = useAccount();
  const { characterContract } = useChainQuestContracts();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharacters = async () => {
    if (!address || !characterContract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get character IDs owned by user
      const characterIds = await characterContract.read.getCharactersByOwner([address]);
      
      if (characterIds.length === 0) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      // Fetch details for each character
      const characterDetails = await Promise.all(
        characterIds.map(async (tokenId) => {
          try {
            const stats = await characterContract.read.characterStats([tokenId]);
            const battlePower = await characterContract.read.getBattlePower([tokenId]);
            const tokenURI = await characterContract.read.tokenURI([tokenId]);

            return {
              id: tokenId.toString(),
              name: `${stats[6].charAt(0).toUpperCase() + stats[6].slice(1)} #${tokenId}`, // stats[6] is characterClass
              class: stats[6], // characterClass
              level: stats[0].toString(), // level
              evolutionStage: stats[7].toString(), // evolutionStage
              experience: stats[1].toString(), // experience
              stats: {
                strength: stats[2].toString(), // strength
                defense: stats[3].toString(), // defense
                speed: stats[4].toString(), // speed
                magic: stats[5].toString() // magic
              },
              battlePower: battlePower.toString(),
              tokenURI,
              lastActivityTime: stats[8].toString() // lastActivityTime
            };
          } catch (err) {
            console.error(`Error fetching character ${tokenId}:`, err);
            return null;
          }
        })
      );

      // Filter out failed fetches
      const validCharacters = characterDetails.filter(char => char !== null);
      setCharacters(validCharacters);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const mintCharacter = async (characterClass) => {
    if (!characterContract || !address) {
      throw new Error('Contract not available or wallet not connected');
    }

    try {
      const tokenURI = `https://chainquest-metadata.vercel.app/${characterClass}/default.json`;
      const hash = await characterContract.write.mintCharacter([address, characterClass, tokenURI]);
      
      // Wait for transaction confirmation
      // Note: In a real app, you'd want to wait for the transaction to be mined
      console.log('Transaction hash:', hash);
      
      // Refresh characters after a short delay
      setTimeout(() => {
        fetchCharacters();
      }, 2000);
      
      return { hash };
    } catch (err) {
      console.error('Error minting character:', err);
      throw err;
    }
  };

  const addExperience = async (tokenId, experience) => {
    if (!characterContract) {
      throw new Error('Contract not available');
    }

    try {
      const hash = await characterContract.write.addExperience([tokenId, experience]);
      console.log('Transaction hash:', hash);
      
      // Refresh characters after a short delay
      setTimeout(() => {
        fetchCharacters();
      }, 2000);
      
      return { hash };
    } catch (err) {
      console.error('Error adding experience:', err);
      throw err;
    }
  };

  const evolveCharacter = async (tokenId) => {
    if (!characterContract) {
      throw new Error('Contract not available');
    }

    try {
      const hash = await characterContract.write.evolveCharacter([tokenId]);
      console.log('Transaction hash:', hash);
      
      // Refresh characters after a short delay
      setTimeout(() => {
        fetchCharacters();
      }, 2000);
      
      return { hash };
    } catch (err) {
      console.error('Error evolving character:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [address, characterContract]);

  return {
    characters,
    loading,
    error,
    mintCharacter,
    addExperience,
    evolveCharacter,
    refetch: fetchCharacters
  };
}