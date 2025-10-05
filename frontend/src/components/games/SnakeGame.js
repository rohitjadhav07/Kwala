import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

const SnakeGame = ({ isMultiplayer = false, onScoreUpdate, gameState, timeLeft }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  
  const gridSize = 20;
  const tileCount = 20;

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: 1 });
    setGameOver(false);
    setScore(0);
    setGameRunning(true);
  }, [generateFood]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ff88' : '#00cc66';
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      
      if (index === 0) {
        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 3, 3);
        ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 5, 3, 3);
      }
    });
    
    // Draw food
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Add glow effect to food
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameRunning) return;
    
    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;
      
      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }
      
      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }
      
      newSnake.unshift(head);
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          onScoreUpdate?.(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food, gameOver, gameRunning, generateFood, onScoreUpdate]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;
    
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameRunning, gameOver]);

  // Draw game
  useEffect(() => {
    drawGame();
  }, [drawGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

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
        background: 'rgba(0, 255, 136, 0.1)',
        borderRadius: '8px'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#00ff88' }}>🐍 Snake Game</h3>
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
        width={tileCount * gridSize}
        height={tileCount * gridSize}
        style={{
          border: '2px solid #00d4ff',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.8)'
        }}
      />

      {/* Controls */}
      <div style={{ marginTop: '1rem' }}>
        {!gameRunning && !isMultiplayer && (
          <button 
            className="btn btn-primary"
            onClick={resetGame}
            style={{ marginBottom: '1rem' }}
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        )}

        {/* Mobile Controls */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '0.5rem',
          maxWidth: '200px',
          margin: '1rem auto'
        }}>
          <div></div>
          <button 
            className="btn btn-secondary"
            onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
            disabled={!gameRunning}
          >
            <ArrowUp size={16} />
          </button>
          <div></div>
          
          <button 
            className="btn btn-secondary"
            onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
            disabled={!gameRunning}
          >
            <ArrowLeft size={16} />
          </button>
          <div></div>
          <button 
            className="btn btn-secondary"
            onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
            disabled={!gameRunning}
          >
            <ArrowRight size={16} />
          </button>
          
          <div></div>
          <button 
            className="btn btn-secondary"
            onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
            disabled={!gameRunning}
          >
            <ArrowDown size={16} />
          </button>
          <div></div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>
          Use arrow keys or buttons to control the snake
        </div>
      </div>

      {gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid #ff6b35',
          textAlign: 'center'
        }}>
          <Trophy size={48} color="#ff6b35" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#ff6b35' }}>Game Over!</h3>
          <p>Final Score: {score}</p>
          {!isMultiplayer && (
            <button className="btn btn-primary" onClick={resetGame}>
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;