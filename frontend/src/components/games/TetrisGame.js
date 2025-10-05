import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, ArrowDown, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

const TetrisGame = ({ isMultiplayer = false, onScoreUpdate, gameState, timeLeft }) => {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState(() => Array(20).fill().map(() => Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  const TETROMINOS = {
    I: { shape: [[1, 1, 1, 1]], color: '#00d4ff' },
    O: { shape: [[1, 1], [1, 1]], color: '#ffff00' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#8b00ff' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000ff' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff8c00' }
  };

  const TETROMINO_KEYS = Object.keys(TETROMINOS);

  const createPiece = useCallback(() => {
    const randomKey = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
    const tetromino = TETROMINOS[randomKey];
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      x: Math.floor(10 / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0
    };
  }, []);

  const rotatePiece = (piece) => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  const isValidMove = (piece, board, dx = 0, dy = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= 10 || newY >= 20) return false;
          if (newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  };

  const placePiece = (piece, board) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    return newBoard;
  };

  const clearLines = (board) => {
    const newBoard = [];
    let linesCleared = 0;
    
    for (let y = 0; y < board.length; y++) {
      if (board[y].every(cell => cell !== 0)) {
        linesCleared++;
      } else {
        newBoard.push([...board[y]]);
      }
    }
    
    // Add empty lines at the top
    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(0));
    }
    
    return { board: newBoard, linesCleared };
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 25;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x]) {
          ctx.fillStyle = board[y][x];
          ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const drawX = (currentPiece.x + x) * cellSize;
            const drawY = (currentPiece.y + y) * cellSize;
            ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
          }
        }
      }
    }
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 10; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, 20 * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= 20; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(10 * cellSize, y * cellSize);
      ctx.stroke();
    }
  }, [board, currentPiece]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || !gameRunning) return;
    
    if (isValidMove(currentPiece, board, 0, 1)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      // Place piece and create new one
      const newBoard = placePiece(currentPiece, board);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => {
        const points = linesCleared * 100 * level + (linesCleared === 4 ? 300 : 0);
        const newScore = prev + points;
        onScoreUpdate?.(newScore);
        return newScore;
      });
      
      // Check for game over
      if (currentPiece.y <= 1) {
        setGameOver(true);
        setGameRunning(false);
        return;
      }
      
      setCurrentPiece(nextPiece);
      setNextPiece(createPiece());
    }
  }, [currentPiece, board, gameOver, gameRunning, nextPiece, createPiece, level, onScoreUpdate]);

  const movePiece = (dx, dy = 0) => {
    if (!currentPiece || !gameRunning) return;
    
    if (isValidMove(currentPiece, board, dx, dy)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const rotatePieceHandler = () => {
    if (!currentPiece || !gameRunning) return;
    
    const rotated = rotatePiece(currentPiece);
    if (isValidMove(rotated, board)) {
      setCurrentPiece(rotated);
    }
  };

  const resetGame = useCallback(() => {
    setBoard(Array(20).fill().map(() => Array(10).fill(0)));
    setCurrentPiece(createPiece());
    setNextPiece(createPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setGameRunning(true);
    setDropTime(1000);
  }, [createPiece]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;
    
    const gameInterval = setInterval(dropPiece, dropTime);
    return () => clearInterval(gameInterval);
  }, [dropPiece, dropTime, gameRunning, gameOver]);

  // Update level and speed
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    setLevel(newLevel);
    setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
  }, [lines]);

  // Draw game
  useEffect(() => {
    drawGame();
  }, [drawGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
        case ' ':
          rotatePieceHandler();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, movePiece, dropPiece, rotatePieceHandler]);

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
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
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
            <h3 style={{ margin: 0, color: '#00d4ff' }}>🧩 Tetris</h3>
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
          width={250}
          height={500}
          style={{
            border: '2px solid #00d4ff',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.9)'
          }}
        />

        {/* Mobile Controls */}
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

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '0.5rem',
            maxWidth: '300px',
            margin: '1rem auto'
          }}>
            <button 
              className="btn btn-secondary"
              onClick={() => movePiece(-1)}
              disabled={!gameRunning}
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={rotatePieceHandler}
              disabled={!gameRunning}
            >
              <RotateCw size={16} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => movePiece(1)}
              disabled={!gameRunning}
            >
              <ArrowRight size={16} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={dropPiece}
              disabled={!gameRunning}
            >
              <ArrowDown size={16} />
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>
            Arrow keys to move, Space/Up to rotate
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div style={{ minWidth: '150px' }}>
        <div style={{
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#00d4ff' }}>Stats</h4>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            <div>Lines: {lines}</div>
            <div>Level: {level}</div>
            <div>Score: {score}</div>
          </div>
        </div>

        {/* Next Piece Preview */}
        {nextPiece && (
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#00d4ff' }}>Next</h4>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              position: 'relative'
            }}>
              {/* Simple next piece preview */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                background: nextPiece.color,
                borderRadius: '2px'
              }} />
            </div>
          </div>
        )}
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
          <h3 style={{ color: '#00d4ff' }}>Game Over!</h3>
          <p>Final Score: {score}</p>
          <p>Lines Cleared: {lines}</p>
          <p>Level Reached: {level}</p>
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

export default TetrisGame;