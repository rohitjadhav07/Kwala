import { useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';

// Simple ABI for basic functions
const SIMPLE_ABI = [
  "function mintCharacter(address to, string memory characterClass, string memory tokenURI) public returns (uint256)",
  "function getCharactersByOwner(address owner) external view returns (uint256[] memory)",
  "function characterStats(uint256 tokenId) public view returns (uint256 level, uint256 experience, uint256 strength, uint256 defense, uint256 speed, uint256 magic, string memory characterClass, uint256 evolutionStage, uint256 lastActivityTime)",
  "function addExperience(uint256 tokenId, uint256 experience) external",
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)"
];

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Hardhat localhost

export function useBasicContract() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== 'undefined' && isConnected) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, SIMPLE_ABI, signer);
          setContract(contractInstance);
          console.log('Contract initialized:', CONTRACT_ADDRESS);
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      }
    };

    initContract();
  }, [isConnected]);

  // Fetch characters
  const fetchCharacters = async () => {
    if (!contract || !address) return;

    try {
      setLoading(true);
      console.log('Fetching characters for:', address);
      
      // Get balance first
      const balance = await contract.balanceOf(address);
      console.log('Character balance:', balance.toString());

      if (balance.eq(0)) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      // Get character IDs
      const characterIds = await contract.getCharactersByOwner(address);
      console.log('Character IDs:', characterIds.map(id => id.toString()));

      // Fetch details for each character
      const characterDetails = [];
      for (let i = 0; i < characterIds.length; i++) {
        try {
          const tokenId = characterIds[i];
          const stats = await contract.characterStats(tokenId);
          
          characterDetails.push({
            id: tokenId.toString(),
            name: `${stats.characterClass} #${tokenId}`,
            class: stats.characterClass,
            level: stats.level.toString(),
            experience: stats.experience.toString(),
            evolutionStage: stats.evolutionStage.toString(),
            stats: {
              strength: stats.strength.toString(),
              defense: stats.defense.toString(),
              speed: stats.speed.toString(),
              magic: stats.magic.toString()
            }
          });
        } catch (err) {
          console.error(`Error fetching character ${characterIds[i]}:`, err);
        }
      }

      setCharacters(characterDetails);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mint character
  const mintCharacter = async (characterClass) => {
    if (!contract || !address) {
      alert('Contract not ready or wallet not connected');
      return;
    }

    try {
      console.log('Minting character:', characterClass);
      const tokenURI = `https://example.com/${characterClass}.json`;
      
      const tx = await contract.mintCharacter(address, characterClass, tokenURI);
      console.log('Transaction sent:', tx.hash);
      
      alert(`Minting ${characterClass}... Transaction: ${tx.hash}`);
      
      // Wait for transaction
      await tx.wait();
      alert('Character minted successfully!');
      
      // Refresh characters
      await fetchCharacters();
    } catch (error) {
      console.error('Error minting character:', error);
      alert(`Error minting character: ${error.message}`);
    }
  };

  // Add experience
  const addExperience = async (tokenId) => {
    if (!contract) {
      alert('Contract not ready');
      return;
    }

    try {
      console.log('Adding experience to character:', tokenId);
      const tx = await contract.addExperience(tokenId, 100);
      console.log('Transaction sent:', tx.hash);
      
      alert(`Adding experience... Transaction: ${tx.hash}`);
      
      await tx.wait();
      alert('Experience added successfully!');
      
      // Refresh characters
      await fetchCharacters();
    } catch (error) {
      console.error('Error adding experience:', error);
      alert(`Error adding experience: ${error.message}`);
    }
  };

  // Load characters when contract is ready
  useEffect(() => {
    if (contract && address) {
      fetchCharacters();
    }
  }, [contract, address]);

  return {
    characters,
    loading,
    mintCharacter,
    addExperience,
    fetchCharacters,
    isReady: !!contract,
    contractAddress: CONTRACT_ADDRESS,
    chainId: chain?.id
  };
}