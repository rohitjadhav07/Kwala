import React, { useState } from 'react';
import { Wand2, Sparkles, Download, RefreshCw, Palette, Upload } from 'lucide-react';
import aiImageService from '../services/aiImageService';

const AICharacterGenerator = ({ onGenerate, selectedClass }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);

  // AI prompt templates based on character class
  const getClassPrompt = (characterClass) => {
    const basePrompts = {
      warrior: "Epic fantasy warrior with gleaming armor, sword and shield, heroic pose, digital art, highly detailed",
      mage: "Mystical wizard with flowing robes, magical staff, arcane energy, fantasy art, ethereal lighting",
      rogue: "Stealthy assassin with dark hood, twin daggers, shadowy atmosphere, fantasy art, mysterious"
    };
    return basePrompts[characterClass] || basePrompts.warrior;
  };

  // Generate AI character image using the AI service
  const generateCharacterImage = async () => {
    setGenerating(true);
    
    try {
      const finalPrompt = prompt || getClassPrompt(selectedClass);
      
      // Generate image using AI service
      const aiResult = await aiImageService.generateImage(finalPrompt, selectedClass);
      
      // Create complete character data
      const generatedData = {
        imageUrl: aiResult.imageUrl,
        imageBlob: aiResult.imageBlob, // Include the blob for IPFS upload
        metadata: {
          name: `${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)} #${Date.now().toString().slice(-4)}`,
          description: aiResult.prompt,
          class: selectedClass,
          attributes: [
            { trait_type: "Class", value: selectedClass },
            { trait_type: "Rarity", value: aiResult.rarity || "Common" },
            { trait_type: "Strength", value: aiResult.stats?.strength || 50 },
            { trait_type: "Defense", value: aiResult.stats?.defense || 50 },
            { trait_type: "Speed", value: aiResult.stats?.speed || 50 },
            { trait_type: "Magic", value: aiResult.stats?.magic || 50 },
            { trait_type: "Generation", value: "AI" }
          ],
          generated_at: new Date().toISOString(),
          prompt: finalPrompt,
          stats: aiResult.stats || {
            strength: 50,
            defense: 50,
            speed: 50,
            magic: 50
          }
        }
      };
      
      setGeneratedImage(generatedData.imageUrl);
      setImageMetadata(generatedData.metadata);
      
      // Call parent component with generated data
      onGenerate?.(generatedData);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const regenerateImage = () => {
    setGeneratedImage(null);
    setImageMetadata(null);
    generateCharacterImage();
  };

  return (
    <div className="ai-generator" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '2rem',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 70%, rgba(0, 212, 255, 0.1), transparent 50%)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: -1
      }} />

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <Wand2 size={32} color="#ff6b35" />
        <div>
          <h3 style={{ margin: 0, color: '#ff6b35' }}>AI Character Generator</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
            Create unique NFT characters with AI-generated artwork
          </p>
        </div>
      </div>

      {/* Prompt Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: 'bold',
          color: '#00d4ff'
        }}>
          <Palette size={16} style={{ marginRight: '0.5rem' }} />
          Describe Your Character:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`e.g., "A mystical ${selectedClass} with glowing eyes and ethereal armor, standing in a magical forest"`}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '0.9rem',
            resize: 'vertical'
          }}
        />
        <div style={{ 
          fontSize: '0.8rem', 
          opacity: 0.7, 
          marginTop: '0.5rem' 
        }}>
          Leave empty to use default {selectedClass} template
        </div>
      </div>

      {/* Generated Image Preview */}
      {generatedImage && (
        <div style={{ 
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            border: '2px solid rgba(0, 212, 255, 0.3)'
          }}>
            <img 
              src={generatedImage} 
              alt="Generated Character"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)'
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#00d4ff' }}>
                {imageMetadata?.name}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
                {imageMetadata?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {!generatedImage ? (
          <button
            className="btn btn-primary"
            onClick={generateCharacterImage}
            disabled={generating}
            style={{ 
              background: generating 
                ? 'linear-gradient(135deg, #666, #888)' 
                : 'linear-gradient(135deg, #ff6b35, #f7931e)',
              minWidth: '200px'
            }}
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="spinner" style={{ marginRight: '0.5rem' }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
                Generate Character
              </>
            )}
          </button>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              onClick={regenerateImage}
              disabled={generating}
            >
              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
              Regenerate
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onGenerate?.({
                  imageUrl: generatedImage,
                  metadata: imageMetadata
                });
              }}
              style={{ 
                background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                minWidth: '150px'
              }}
            >
              <Download size={16} style={{ marginRight: '0.5rem' }} />
              Use This Character
            </button>
          </>
        )}
      </div>

      {/* AI Features Info */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(255, 107, 53, 0.1)',
        border: '1px solid rgba(255, 107, 53, 0.2)',
        borderRadius: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} color="#ff6b35" />
          <strong style={{ color: '#ff6b35' }}>AI-Powered NFT Generation</strong>
        </div>
        
        {/* Service Status */}
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: aiImageService.stabilityApiKey && aiImageService.stabilityApiKey !== 'your_stability_ai_api_key_here' ? '#00ff88' : '#ff6b35'
            }}></div>
            <span>
              {aiImageService.stabilityApiKey && aiImageService.stabilityApiKey !== 'your_stability_ai_api_key_here' 
                ? '🎨 Stability AI Active (Fantasy Art Optimized)' 
                : '🎭 Demo Mode (Set REACT_APP_STABILITY_AI_API_KEY for real AI)'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: aiImageService.openaiApiKey && aiImageService.openaiApiKey !== 'your_openai_api_key_here' ? '#00ff88' : '#666'
            }}></div>
            <span style={{ opacity: aiImageService.openaiApiKey && aiImageService.openaiApiKey !== 'your_openai_api_key_here' ? 1 : 0.6 }}>
              {aiImageService.openaiApiKey && aiImageService.openaiApiKey !== 'your_openai_api_key_here' 
                ? '🤖 OpenAI DALL-E (Backup)' 
                : '🤖 OpenAI DALL-E (Not configured)'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: aiImageService.pinataJWT && aiImageService.pinataJWT !== 'your_pinata_jwt_token_here' ? '#00ff88' : '#ff6b35'
            }}></div>
            <span>
              {aiImageService.pinataJWT && aiImageService.pinataJWT !== 'your_pinata_jwt_token_here' 
                ? '📁 Pinata IPFS Active' 
                : '💾 Demo IPFS (Set REACT_APP_PINATA_JWT for real storage)'}
            </span>
          </div>
        </div>
        
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          Each character is uniquely generated using AI based on your prompt. 
          The artwork and metadata are stored on-chain, making every NFT truly one-of-a-kind!
          {(!aiImageService.stabilityApiKey || aiImageService.stabilityApiKey === 'your_stability_ai_api_key_here') && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255, 107, 53, 0.2)', borderRadius: '8px' }}>
              📖 <strong>Setup Guide:</strong> Check <code>frontend/API_SETUP_GUIDE.md</code> to enable Stability AI generation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICharacterGenerator;