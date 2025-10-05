import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Zap } from 'lucide-react';

const FlappyGame = ({ isMultiplayer = false, onScoreUpdate, gameState, timeLeft }) => {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const gameStateRef = useRef({
    bird: { x: 100, y: 200, velocity: 0, size: 20 },
    pipes: [],
    canvas: { width: 800, height: 600 },
    gravity: 0.6,
    jumpStrength: -12,
    pipeWidth: 80,
    pipeGap: 200,
    pipeSpeed: 3
  });

  const createPipe = useCallback((x) => {
    const state = gameStateRef.current;
    const minHeight = 50;
    const maxHeight = state.canvas.height - state.pipeGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
      x: x,
      topHeight: topHeight,
      bottomY: topHeight + state.pipeGap,
      bottomHeight: state.canvas.height - (topHeight + state.pipeGap),
      passed: false
    };
  }, []);

  const resetGame = useCallback(() => {
    const state = gameStateRef.current;
    state.bird = { x: 100, y: 200, velocity: 0, size: 20 };
    state.pipes = [
      createPipe(state.canvas.width),
      createPipe(state.canvas.width + 300),
      createPipe(state.canvas.width + 600)
    ];
    setScore(0);
    setGameOver(false);
    setGameRunning(true);
  }, [createPipe]);

  const jump = useCallback(() => {
    if (!gameRunning) return;
    const state = gameStateRef.current;
    state.bird.velocity = state.jumpStrength;
  }, [gameRunning]);

  const checkCollision = useCallback(() => {
    const state = gameStateRef.current;
    const { bird, pipes, canvas } = state;
    
    // Check ground and ceiling collision
    if (bird.y + bird.size >= canvas.height || bird.y <= 0) {
      return true;
    }
    
    // Check pipe collision
    for (const pipe of pipes) {
      if (
        bird.x + bird.size > pipe.x &&
        bird.x < pipe.x + state.pipeWidth
      ) {
        if (
          bird.y < pipe.topHeight ||
          bird.y + bird.size > pipe.bottomY
        ) {
          return true;
        }
      }
    }
    
    return false;
  }, []);

  const updateGame = useCallback(() => {
    if (!gameRunning || gameOver) return;
    
    const state = gameStateRef.current;
    const { bird, pipes } = state;
    
    // Update bird physics
    bird.velocity += state.gravity;
    bird.y += bird.velocity;
    
    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= state.pipeSpeed;
      
      // Check if bird passed pipe
      if (!pipe.passed && bird.x > pipe.x + state.pipeWidth) {
        pipe.passed = true;
        setScore(prev => {
          const newScore = prev + 1;
          onScoreUpdate?.(newScore * 10); // 10 points per pipe
          return newScore;
        });
      }
      
      // Remove pipes that are off screen
      if (pipe.x + state.pipeWidth < 0) {
        pipes.splice(i, 1);
      }
    }
    
    // Add new pipes
    const lastPipe = pipes[pipes.length - 1];
    if (lastPipe && lastPipe.x < state.canvas.width - 300) {
      pipes.push(createPipe(state.canvas.width));
    }
    
    // Check collision
    if (checkCollision()) {
      setGameOver(true);
      setGameRunning(false);
    }
  }, [gameRunning, gameOver, createPipe, checkCollision, onScoreUpdate]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    const { bird, pipes, canvas: canvasSize } = state;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + Date.now() * 0.01) % (canvasSize.width + 100);
      const y = 50 + i * 30;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw pipes
    ctx.fillStyle = '#228B22';
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 3;
    
    for (const pipe of pipes) {
      // Top pipe
      ctx.fillRect(pipe.x, 0, state.pipeWidth, pipe.topHeight);
      ctx.strokeRect(pipe.x, 0, state.pipeWidth, pipe.topHeight);
      
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, state.pipeWidth, pipe.bottomHeight);
      ctx.strokeRect(pipe.x, pipe.bottomY, state.pipeWidth, pipe.bottomHeight);
      
      // Pipe caps
      ctx.fillStyle = '#32CD32';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, state.pipeWidth + 10, 30);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, state.pipeWidth + 10, 30);
      ctx.fillStyle = '#228B22';
    }
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    
    // Bird body
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Bird eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + 8, bird.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird beak
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.size, bird.y);
    ctx.lineTo(bird.x + bird.size + 10, bird.y - 3);
    ctx.lineTo(bird.x + bird.size + 10, bird.y + 3);
    ctx.closePath();
    ctx.fill();
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score.toString(), canvasSize.width / 2, 50);
    
    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvasSize.height - 50, canvasSize.width, 50);
    
    // Ground pattern
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < canvasSize.width; i += 20) {
      ctx.fillRect(i, canvasSize.height - 50, 10, 50);
    }
  }, [score]);

  const handleClick = useCallback(() => {
    if (gameOver && !isMultiplayer) {
      resetGame();
    } else {
      jump();
    }
  }, [gameOver, isMultiplayer, resetGame, jump]);

  const handleKeyPress = useCallback((e) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;
    
    const gameInterval = setInterval(() => {
      updateGame();
      drawGame();
    }, 16); // ~60 FPS
    
    return () => clearInterval(gameInterval);
  }, [updateGame, drawGame, gameRunning, gameOver]);

  // Initial draw
  useEffect(() => {
    drawGame();
  }, [drawGame]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Auto-start for multiplayer
  useEffect(() => {
    if (isMultiplayer && gameState === 'playing' && !gameRunning && !gameOver) {
      resetGame();
    }
  }, [isMultiplayer, gameState, gameRunning, gameOver, resetGame]);

  // End game when time runs out in multiplayer
  useEffect(() => {
    if (isMultiplayer && timeLeft === 0) {
      setGameRunning(false);
      setGameOver(true);
    }
  }, [isMultiplayer, timeLeft]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '1rem',
        background: 'rgba(255, 215, 0, 0.1)',
        borderRadius: '8px'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#FFD700' }}>🐦 Flappy Bird</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Score: {score}</p>
        </div>
        {isMultiplayer && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff6b35' }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleClick}
        style={{
          border: '2px solid #FFD700',
          borderRadius: '8px',
          cursor: 'pointer',
          touchAction: 'manipulation'
        }}
      />

      <div style={{ marginTop: '1rem' }}>
        {!gameRunning && !isMultiplayer && (
          <button 
            className="btn btn-primary"
            onClick={resetGame}
            style={{ 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)'
            }}
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        )}

        <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>
          Click or press Space to flap your wings!
          <br />
          Avoid the pipes and try to get the highest score!
        </div>
      </div>

      {gameOver && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid #FFD700',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <Trophy size={48} color="#FFD700" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#FFD700' }}>Game Over!</h3>
          <p>Final Score: {score}</p>
          <p>Points Earned: {score * 10}</p>
          {!isMultiplayer && (
            <button 
              className="btn btn-primary" 
              onClick={resetGame}
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
            >
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FlappyGame;