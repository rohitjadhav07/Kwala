import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Zap } from 'lucide-react';

const PongGame = ({ isMultiplayer = false, onScoreUpdate, gameState, timeLeft }) => {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  
  const gameStateRef = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 3, size: 10 },
    playerPaddle: { x: 20, y: 150, width: 15, height: 100, speed: 8 },
    aiPaddle: { x: 765, y: 150, width: 15, height: 100, speed: 6 },
    canvas: { width: 800, height: 400 }
  });

  const resetBall = useCallback(() => {
    const state = gameStateRef.current;
    state.ball.x = state.canvas.width / 2;
    state.ball.y = state.canvas.height / 2;
    state.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    state.ball.dy = (Math.random() - 0.5) * 6;
  }, []);

  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setGameRunning(true);
    resetBall();
  }, [resetBall]);

  const updateGame = useCallback(() => {
    if (!gameRunning || gameOver) return;
    
    const state = gameStateRef.current;
    const { ball, playerPaddle, aiPaddle, canvas } = state;
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top/bottom walls
    if (ball.y <= ball.size || ball.y >= canvas.height - ball.size) {
      ball.dy = -ball.dy;
    }
    
    // Ball collision with paddles
    if (
      ball.x <= playerPaddle.x + playerPaddle.width &&
      ball.y >= playerPaddle.y &&
      ball.y <= playerPaddle.y + playerPaddle.height &&
      ball.dx < 0
    ) {
      ball.dx = -ball.dx;
      ball.dx *= 1.05; // Increase speed slightly
      const hitPos = (ball.y - playerPaddle.y) / playerPaddle.height;
      ball.dy = (hitPos - 0.5) * 10;
    }
    
    if (
      ball.x >= aiPaddle.x - ball.size &&
      ball.y >= aiPaddle.y &&
      ball.y <= aiPaddle.y + aiPaddle.height &&
      ball.dx > 0
    ) {
      ball.dx = -ball.dx;
      ball.dx *= 1.05;
      const hitPos = (ball.y - aiPaddle.y) / aiPaddle.height;
      ball.dy = (hitPos - 0.5) * 10;
    }
    
    // AI paddle movement
    const aiCenter = aiPaddle.y + aiPaddle.height / 2;
    if (aiCenter < ball.y - 35) {
      aiPaddle.y += aiPaddle.speed;
    } else if (aiCenter > ball.y + 35) {
      aiPaddle.y -= aiPaddle.speed;
    }
    
    // Keep AI paddle in bounds
    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));
    
    // Scoring
    if (ball.x < 0) {
      setAiScore(prev => prev + 1);
      resetBall();
    } else if (ball.x > canvas.width) {
      setPlayerScore(prev => {
        const newScore = prev + 1;
        onScoreUpdate?.(newScore * 10); // 10 points per goal
        return newScore;
      });
      resetBall();
    }
    
    // Check win condition (first to 5 in single player, or time limit in multiplayer)
    if (!isMultiplayer && (playerScore >= 5 || aiScore >= 5)) {
      setGameOver(true);
      setGameRunning(false);
    }
  }, [gameRunning, gameOver, playerScore, aiScore, resetBall, isMultiplayer, onScoreUpdate]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    const { ball, playerPaddle, aiPaddle, canvas: canvasSize } = state;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvasSize.width / 2, 0);
    ctx.lineTo(canvasSize.width / 2, canvasSize.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
    
    // Draw ball
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect to ball
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw scores
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore.toString(), canvasSize.width / 4, 60);
    ctx.fillText(aiScore.toString(), (canvasSize.width * 3) / 4, 60);
  }, [playerScore, aiScore]);

  const handleMouseMove = useCallback((e) => {
    if (!gameRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const state = gameStateRef.current;
    
    state.playerPaddle.y = mouseY - state.playerPaddle.height / 2;
    state.playerPaddle.y = Math.max(0, Math.min(state.canvas.height - state.playerPaddle.height, state.playerPaddle.y));
  }, [gameRunning]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!gameRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchY = touch.clientY - rect.top;
    const state = gameStateRef.current;
    
    state.playerPaddle.y = touchY - state.playerPaddle.height / 2;
    state.playerPaddle.y = Math.max(0, Math.min(state.canvas.height - state.playerPaddle.height, state.playerPaddle.y));
  }, [gameRunning]);

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
        background: 'rgba(0, 212, 255, 0.1)',
        borderRadius: '8px'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#00d4ff' }}>🏓 Pong</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            {isMultiplayer ? `Score: ${playerScore * 10}` : `${playerScore} - ${aiScore}`}
          </p>
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
        height={400}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{
          border: '2px solid #00d4ff',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.9)',
          cursor: 'none',
          touchAction: 'none'
        }}
      />

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

        <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>
          Move your mouse or finger to control the left paddle
          <br />
          {isMultiplayer ? 'Score as many goals as possible!' : 'First to 5 goals wins!'}
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
          border: '2px solid #00d4ff',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <Trophy size={48} color="#00d4ff" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#00d4ff' }}>
            {isMultiplayer ? 'Time Up!' : playerScore > aiScore ? 'You Win!' : 'AI Wins!'}
          </h3>
          <p>Final Score: {playerScore} - {aiScore}</p>
          {isMultiplayer && <p>Total Points: {playerScore * 10}</p>}
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

export default PongGame;