import { usePublicClient, useWalletClient, useNetwork } from 'wagmi';
import { getContract } from 'viem';
import { CONTRACT_ADDRESSES, CHARACTER_ABI, QUEST_ABI, TOURNAMENT_ABI } from '../config/contracts';

export function useChainQuestContracts() {
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Get contract addresses for current chain
  const getContractAddress = (contractName) => {
    let chainKey = 'hardhat';
    
    if (chain?.id === 1337) {
      chainKey = 'localhost';
    } else if (chain?.id === 80002) {
      chainKey = 'amoy'; // Polygon Amoy testnet
    } else if (chain?.id === 80001) {
      chainKey = 'mumbai'; // Old Mumbai testnet
    } else if (chain?.name) {
      chainKey = chain.name.toLowerCase();
    }
    
    const addresses = CONTRACT_ADDRESSES[chainKey] || CONTRACT_ADDRESSES.hardhat;
    return addresses[contractName];
  };

  // Character contract
  const characterContract = getContract({
    address: getContractAddress('ChainQuestCharacter'),
    abi: CHARACTER_ABI,
    publicClient,
    walletClient,
  });

  // Quest contract
  const questContract = getContract({
    address: getContractAddress('QuestManager'),
    abi: QUEST_ABI,
    publicClient,
    walletClient,
  });

  // Tournament contract
  const tournamentContract = getContract({
    address: getContractAddress('TournamentManager'),
    abi: TOURNAMENT_ABI,
    publicClient,
    walletClient,
  });

  return {
    characterContract,
    questContract,
    tournamentContract,
    chainId: chain?.id,
    chainName: chain?.name,
    publicClient,
    walletClient
  };
}