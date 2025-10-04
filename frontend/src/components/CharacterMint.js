import React, { useState, useEffect } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useNetwork } from 'wagmi';
import { parseEther } from 'viem';
import aiImageService from '../services/aiImageService';
import { CONTRACT_ADDRESSES, CHARACTER_ABI } from '../config/contracts';
import { Wand2, Sparkles, Download, RefreshCw, Palette, Zap, Upload, AlertCircle } from 'lucide-react';
import AICharacterGenerator from './AICharacterGenerator';

const CharacterMint = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [selectedClass, setSelectedClass] = useState('warrior');
  const [generatedCharacter, setGeneratedCharacter] = useState(null);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [ipfsData, setIpfsData] = useState(null);

  // Contract configuration for minting (Polygon/MATIC)
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.CHARACTER;
  const MINT_FEE = parseEther('0.1'); // 0.1 MATIC

  const { config, error: prepareError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CHARACTER_ABI,
    functionName: 'mintCharacter',
    args: ipfsData && generatedCharacter ? [
      address,
      ipfsData.metadataIPFS,
      selectedClass === 'warrior' ? 0 : selectedClass === 'mage' ? 1 : 2,
      [
        BigInt(generatedCharacter?.metadata?.stats?.strength || 50),
        BigInt(generatedCharacter?.metadata?.stats?.defense || 50),
        BigInt(generatedCharacter?.metadata?.stats?.speed || 50),
        BigInt(generatedCharacter?.metadata?.stats?.magic || 50)
      ]
    ] : undefined,
    enabled: Boolean(ipfsData && generatedCharacter && address && isConnected),
    value: MINT_FEE
  });

  const { data, write, error: writeError, isLoading: isWriting } = useContractWrite(config);
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: data?.hash,
  });

  const characterClasses = [
    { id: 'warrior', name: 'Warrior', emoji: '⚔️', description: 'Strong melee fighter with high defense' },
    { id: 'mage', name: 'Mage', emoji: '🔮', description: 'Magical spellcaster with powerful abilities' },
    { id: 'rogue', name: 'Rogue', emoji: '🗡️', description: 'Agile assassin with stealth and speed' }
  ];

  const handleCharacterGenerated = (characterData) => {
    setGeneratedCharacter(characterData);
  };

  const mintCharacter = async () => {
    if (!generatedCharacter || !isConnected || !address) {
      console.error('Missing requirements:', { generatedCharacter: !!generatedCharacter, isConnected, address });
      return;
    }

    try {
      // Step 1: Upload to IPFS
      setUploadingToIPFS(true);
      
      const metadata = {
        ...generatedCharacter.metadata,
        external_url: `https://chainquest.game/character/${Date.now()}`,
        animation_url: null,
        background_color: null
      };

      // Use the image blob if available, otherwise create one from the URL
      let imageBlob = generatedCharacter.imageBlob;
      if (!imageBlob && generatedCharacter.imageUrl) {
        // Convert data URL to blob for demo images
        if (generatedCharacter.imageUrl.startsWith('data:')) {
          const response = await fetch(generatedCharacter.imageUrl);
          imageBlob = await response.blob();
        } else {
          // Download external image
          const response = await fetch(generatedCharacter.imageUrl);
          imageBlob = await response.blob();
        }
      }

      console.log('📤 Uploading to IPFS...');
      const ipfsResult = await aiImageService.uploadToIPFS(
        imageBlob,
        metadata
      );
      
      setIpfsData(ipfsResult);
      setUploadingToIPFS(false);
      console.log('✅ IPFS upload complete:', ipfsResult);

      // Wait a moment for the config to update
      setTimeout(() => {
        // Step 2: Mint on blockchain
        setMinting(true);
        
        // Check for preparation errors
        if (prepareError) {
          throw new Error(`Contract preparation failed: ${prepareError.message}`);
        }
        
        if (writeError) {
          throw new Error(`Contract write error: ${writeError.message}`);
        }
        
        if (!write) {
          throw new Error('Contract write function not available. Please check your wallet connection and network.');
        }
        
        console.log('🔗 Initiating blockchain transaction...', {
          contract: CONTRACT_ADDRESS,
          fee: '0.1 MATIC',
          metadata: ipfsResult.metadataIPFS
        });
        
        // This should trigger the wallet popup
        write?.();
      }, 1000);

    } catch (error) {
      console.error('❌ Minting failed:', error);
      setMinting(false);
      setUploadingToIPFS(false);
      alert(`Minting failed: ${error.message}`);
    }
  };

  // Handle transaction states
  useEffect(() => {
    if (isConfirmed) {
      console.log('🎉 Transaction confirmed!');
      setMintSuccess(true);
      setMinting(false);
      
      // Reset after showing success
      setTimeout(() => {
        setMintSuccess(false);
        setGeneratedCharacter(null);
        setIpfsData(null);
      }, 5000);
    }
  }, [isConfirmed]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      console.error('❌ Write error:', writeError);
      setMinting(false);
      alert(`Transaction failed: ${writeError.message}`);
    }
  }, [writeError]);

  // Log preparation errors
  useEffect(() => {
    if (prepareError) {
      console.error('⚠️ Prepare error:', prepareError);
    }
  }, [prepareError]);

  if (!isConnected) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Connect Your Wallet</h2>
        <p>Connect your wallet to mint AI-generated NFT characters.</p>
      </div>
    );
  }

  // Check if on correct network (Polygon)
  const isCorrectNetwork = chain?.id === 137 || chain?.id === 80001 || chain?.id === 80002; // Polygon Mainnet, Mumbai, or Amoy
  
  if (!isCorrectNetwork) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <AlertCircle size={48} color="#ff6b35" style={{ marginBottom: '1rem' }} />
        <h2>Wrong Network</h2>
        <p style={{ marginBottom: '1rem' }}>
          Please switch to Polygon network to mint characters.
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Current network: {chain?.name || 'Unknown'}<br />
          Required: Polygon (MATIC)
        </p>
      </div>
    );
  }

  if (mintSuccess) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 212, 255, 0.2))',
        border: '2px solid rgba(0, 255, 136, 0.5)',
        borderRadius: '20px',
        animation: 'glow 2s ease-in-out infinite'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ color: '#00ff88', marginBottom: '1rem' }}>Character Minted Successfully!</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Your AI-generated {generatedCharacter?.metadata?.name} has been minted to the blockchain!
        </p>
        <div style={{
          display: 'inline-block',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <img 
            src={generatedCharacter?.imageUrl} 
            alt="Minted Character"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '12px'
            }}
          />
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Check your wallet or the marketplace to see your new NFT!
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Wand2 size={32} color="#ff6b35" />
          AI Character Mint
        </h1>
        <p>Create unique NFT characters with AI-generated artwork and mint them to the blockchain</p>
      </div>

      {/* Character Class Selection */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Palette size={24} />
          </div>
          <div className="card-title">Choose Character Class</div>
        </div>
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {characterClasses.map((charClass) => (
              <div
                key={charClass.id}
                onClick={() => setSelectedClass(charClass.id)}
                style={{
                  padding: '1.5rem',
                  background: selectedClass === charClass.id 
                    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedClass === charClass.id 
                    ? '2px solid #00d4ff' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedClass !== charClass.id) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClass !== charClass.id) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {charClass.emoji}
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#00d4ff' }}>
                  {charClass.name}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                  {charClass.description}
                </p>
                {selectedClass === charClass.id && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Character Generator */}
      <AICharacterGenerator 
        selectedClass={selectedClass}
        onGenerate={handleCharacterGenerated}
      />

      {/* Minting Section */}
      {generatedCharacter && (
        <div className="dashboard-card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div className="card-icon">
              <Zap size={24} />
            </div>
            <div className="card-title">Mint to Blockchain</div>
          </div>
          <div className="card-content">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 2fr', 
              gap: '2rem',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={generatedCharacter.imageUrl} 
                  alt="Generated Character"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '12px',
                    border: '2px solid rgba(0, 212, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)'
                  }}
                />
              </div>
              
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#00d4ff' }}>
                  {generatedCharacter.metadata.name}
                </h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#ff6b35' }}>Attributes:</h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '0.5rem' 
                  }}>
                    {generatedCharacter.metadata.attributes.map((attr, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <strong>{attr.trait_type}:</strong> {attr.value}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>Minting Details:</h4>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    <p>• Image and metadata stored permanently on IPFS</p>
                    <p>• NFT minted on Polygon network (fast & cheap)</p>
                    <p>• Minting fee: 0.1 MATIC (~$0.05-0.08)</p>
                    <p>• Gas fee: ~0.01 MATIC (~$0.01)</p>
                    <p>• Character tradeable immediately after mint</p>
                    <p>• Usable in all ChainQuest games</p>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={mintCharacter}
                  disabled={minting || uploadingToIPFS || isConfirming || !generatedCharacter}
                  style={{
                    width: '100%',
                    background: (minting || uploadingToIPFS || isConfirming || !generatedCharacter)
                      ? 'linear-gradient(135deg, #666, #888)' 
                      : 'linear-gradient(135deg, #00ff88, #00cc66)',
                    fontSize: '1.1rem',
                    padding: '1rem'
                  }}
                >
                  {uploadingToIPFS ? (
                    <>
                      <Upload size={20} className="spinner" style={{ marginRight: '0.5rem' }} />
                      Uploading to IPFS...
                    </>
                  ) : minting || isConfirming ? (
                    <>
                      <RefreshCw size={20} className="spinner" style={{ marginRight: '0.5rem' }} />
                      {isConfirming ? 'Confirming Transaction...' : 'Waiting for Wallet...'}
                    </>
                  ) : (
                    <>
                      <Download size={20} style={{ marginRight: '0.5rem' }} />
                      Mint NFT Character (0.1 MATIC)
                    </>
                  )}
                </button>

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '8px',
                    fontSize: '0.8rem'
                  }}>
                    <h4>Debug Info:</h4>
                    <p>Connected: {isConnected ? '✅' : '❌'}</p>
                    <p>Address: {address || 'None'}</p>
                    <p>Network: {chain?.name || 'Unknown'} ({chain?.id})</p>
                    <p>Contract: {CONTRACT_ADDRESS}</p>
                    <p>Generated Character: {generatedCharacter ? '✅' : '❌'}</p>
                    <p>IPFS Data: {ipfsData ? '✅' : '❌'}</p>
                    <p>Config Ready: {config ? '✅' : '❌'}</p>
                    <p>Write Function: {write ? '✅' : '❌'}</p>
                    {prepareError && <p style={{color: '#ff6b35'}}>Prepare Error: {prepareError.message}</p>}
                    {writeError && <p style={{color: '#ff6b35'}}>Write Error: {writeError.message}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minting Info */}
      <div className="dashboard-card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <Sparkles size={24} />
          </div>
          <div className="card-title">AI-Powered NFT Creation</div>
        </div>
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div>
              <h4>🎨 Unique Artwork</h4>
              <p>Each character is generated using advanced AI algorithms, ensuring every NFT is completely unique and one-of-a-kind.</p>
            </div>
            <div>
              <h4>⛓️ On-Chain Storage</h4>
              <p>Images and metadata are stored on IPFS and referenced on-chain, making your NFTs truly decentralized and permanent.</p>
            </div>
            <div>
              <h4>🎮 Game Integration</h4>
              <p>Minted characters can be used in arena battles, quests, and tournaments with stats based on their AI-generated attributes.</p>
            </div>
            <div>
              <h4>💰 Instant Trading</h4>
              <p>Your minted characters appear immediately in the marketplace and can be traded with other players across multiple chains.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterMint;