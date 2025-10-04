import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Target, Trophy, Star, Flame } from 'lucide-react';

const ArenaGame = ({ onScoreUpdate }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState([]);
  const [combo, setCombo] = useState(0);
  const [effects, setEffects] = useState([]);

  // Generate random target
  const generateTarget = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10; // 10-90% from left
    const y = Math.random() * 70 + 15; // 15-85% from top
    const type = Math.random() > 0.8 ? 'bonus' : 'normal';
    const points = type === 'bonus' ? 50 : 10;
    
    return {
      id,
      x,
      y,
      type,
      points,
      timeToLive: type === 'bonus' ? 2000 : 3000
    };
  }, []);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setTargets([]);
    setEffects([]);
  };

  // Hit target
  const hitTarget = (targetId, points, x, y) => {
    setTargets(prev => prev.filter(t => t.id !== targetId));
    
    const comboMultiplier = Math.floor(combo / 5) + 1;
    const finalPoints = points * comboMultiplier;
    
    setScore(prev => prev + finalPoints);
    setCombo(prev => prev + 1);
    
    // Add hit effect
    setEffects(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      points: finalPoints,
      type: 'hit'
    }]);
    
    // Remove effect after animation
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== Date.now()));
    }, 1000);
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameOver');
      onScoreUpdate?.(score);
    }
  }, [gameState, timeLeft, score, onScoreUpdate]);

  // Target generation
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        if (targets.length < 5) {
          setTargets(prev => [...prev, generateTarget()]);
        }
      }, 800 - Math.min(score / 10, 600)); // Faster as score increases
      
      return () => clearInterval(interval);
    }
  }, [gameState, targets.length, score, generateTarget]);

  // Target cleanup
  useEffect(() => {
    if (gameState === 'playing') {
      const cleanup = setInterval(() => {
        setTargets(prev => prev.filter(target => {
          const age = Date.now() - target.id;
          if (age > target.timeToLive) {
            setCombo(0); // Reset combo on miss
            return false;
          }
          return true;
        }));
      }, 100);
      
      return () => clearInterval(cleanup);
    }
  }, [gameState]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 53, 0.1))',
      border: '2px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '20px',
      overflow: 'hidden',
      cursor: gameState === 'playing' ? 'crosshair' : 'default'
    }}>
      {/* Game UI */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Trophy size={20} color="#00d4ff" />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{score}</span>
          </div>
          
          {combo > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              background: 'rgba(255, 107, 53, 0.2)',
              padding: '5px 10px',
              borderRadius: '15px',
              animation: 'pulse 0.5s ease-in-out'
            }}>
              <Flame size={16} color="#ff6b35" />
              <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>x{Math.floor(combo / 5) + 1}</span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Zap size={20} color="#00ff88" />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00ff88' }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Game Area */}
      {gameState === 'waiting' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <Target size={64} color="#00d4ff" style={{ marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '10px' }}>Arena Challenge</h3>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>
            Hit targets to earn points! Bonus targets give 5x points.
            Build combos for multipliers!
          </p>
          <button className="btn btn-primary" onClick={startGame}>
            <Zap size={16} style={{ marginRight: '8px' }} />
            Start Game
          </button>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '30px',
          borderRadius: '20px',
          border: '2px solid #00d4ff'
        }}>
          <Trophy size={64} color="#00d4ff" style={{ marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '10px' }}>Game Over!</h3>
          <p style={{ fontSize: '1.5rem', color: '#00d4ff', marginBottom: '10px' }}>
            Final Score: {score}
          </p>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>
            Max Combo: {combo}
          </p>
          <button className="btn btn-primary" onClick={startGame}>
            <Zap size={16} style={{ marginRight: '8px' }} />
            Play Again
          </button>
        </div>
      )}

      {/* Targets */}
      {targets.map(target => (
        <div
          key={target.id}
          onClick={() => hitTarget(target.id, target.points, target.x, target.y)}
          style={{
            position: 'absolute',
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: target.type === 'bonus' ? '60px' : '40px',
            height: target.type === 'bonus' ? '60px' : '40px',
            borderRadius: '50%',
            background: target.type === 'bonus' 
              ? 'radial-gradient(circle, #ff6b35, #ff4757)'
              : 'radial-gradient(circle, #00d4ff, #0099cc)',
            border: `3px solid ${target.type === 'bonus' ? '#ff6b35' : '#00d4ff'}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: `targetPulse 0.5s ease-in-out infinite alternate, targetFade ${target.timeToLive}ms linear`,
            boxShadow: `0 0 20px ${target.type === 'bonus' ? '#ff6b35' : '#00d4ff'}`,
            transform: 'translate(-50%, -50%)',
            zIndex: 5
          }}
        >
          {target.type === 'bonus' ? (
            <Star size={24} color="white" />
          ) : (
            <Target size={20} color="white" />
          )}
        </div>
      ))}

      {/* Hit Effects */}
      {effects.map(effect => (
        <div
          key={effect.id}
          style={{
            position: 'absolute',
            left: `${effect.x}%`,
            top: `${effect.y}%`,
            transform: 'translate(-50%, -50%)',
            color: '#00ff88',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            animation: 'hitEffect 1s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          +{effect.points}
        </div>
      ))}

      <style jsx>{`
        @keyframes targetPulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes targetFade {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes hitEffect {
          0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(2) translateY(-50px); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default ArenaGame;