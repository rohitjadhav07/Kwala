import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

// Marketplace contract ABI (simplified)
const MARKETPLACE_ABI = [
  {
    name: 'listNFT',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' }
    ]
  },
  {
    name: 'buyNFT',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'listingId', type: 'uint256' }
    ]
  },
  {
    name: 'getActiveListings',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'listingId', type: 'uint256' },
          { name: 'nftContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'seller', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'isActive', type: 'bool' }
        ]
      }
    ]
  }
];

const CHARACTER_CONTRACT_ABI = [
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'getCharacterStats',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      { name: 'class', type: 'uint8' },
      { name: 'level', type: 'uint256' },
      { name: 'experience', type: 'uint256' },
      { name: 'stats', type: 'uint256[4]' }
    ]
  }
];

export function useMarketplaceContract() {
  const { address, isConnected } = useAccount();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);

  const MARKETPLACE_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Your marketplace contract
  const CHARACTER_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Your character contract

  // Read active listings from contract
  const { data: contractListings, refetch } = useContractRead({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListings',
    enabled: isConnected,
    watch: true
  });

  // Prepare buy transaction
  const { config: buyConfig } = usePrepareContractWrite({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'buyNFT',
    args: selectedListing ? [selectedListing.listingId] : undefined,
    value: selectedListing?.price,
    enabled: Boolean(selectedListing && address)
  });

  const { write: buyNFT, isLoading: isBuying } = useContractWrite(buyConfig);

  // Fetch metadata for each listing
  const fetchListingMetadata = async (listing) => {
    try {
      // Get character stats from contract
      const statsResponse = await fetch(`/api/contract/character-stats/${listing.tokenId}`);
      const stats = await statsResponse.json();

      // Get metadata from tokenURI
      const metadataResponse = await fetch(`/api/metadata/${listing.tokenId}`);
      const metadata = await metadataResponse.json();

      return {
        ...listing,
        name: metadata.name || `Character #${listing.tokenId}`,
        image: metadata.image,
        class: ['warrior', 'mage', 'rogue'][stats.class] || 'warrior',
        level: Number(stats.level),
        stats: {
          strength: Number(stats.stats[0]),
          defense: Number(stats.stats[1]),
          speed: Number(stats.stats[2]),
          magic: Number(stats.stats[3])
        },
        rarity: metadata.attributes?.find(attr => attr.trait_type === 'Rarity')?.value || 'common',
        priceETH: Number(listing.price) / 1e18,
        priceUSD: (Number(listing.price) / 1e18) * 2000 // Approximate ETH price
      };
    } catch (error) {
      console.error('Failed to fetch metadata for listing:', listing.listingId, error);
      return {
        ...listing,
        name: `Character #${listing.tokenId}`,
        image: '/placeholder-character.png',
        class: 'warrior',
        level: 1,
        stats: { strength: 50, defense: 50, speed: 50, magic: 50 },
        rarity: 'common',
        priceETH: Number(listing.price) / 1e18,
        priceUSD: (Number(listing.price) / 1e18) * 2000
      };
    }
  };

  // Process contract listings
  useEffect(() => {
    const processListings = async () => {
      if (!contractListings || !isConnected) {
        setListings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        const processedListings = await Promise.all(
          contractListings
            .filter(listing => listing.isActive)
            .map(fetchListingMetadata)
        );
        
        setListings(processedListings);
      } catch (error) {
        console.error('Failed to process listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    processListings();
  }, [contractListings, isConnected]);

  const handleBuyNFT = (listing) => {
    setSelectedListing(listing);
    if (buyNFT) {
      buyNFT();
    }
  };

  const listNFT = async (tokenId, price) => {
    // This would be implemented with a separate contract write
    // for listing NFTs on the marketplace
    console.log('Listing NFT:', tokenId, 'for', price, 'ETH');
  };

  return {
    listings,
    loading,
    buyNFT: handleBuyNFT,
    listNFT,
    isBuying,
    refetch
  };
}