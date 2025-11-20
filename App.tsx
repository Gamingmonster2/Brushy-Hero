import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tooth } from './components/Tooth';
import { GameHud } from './components/GameHud';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { BrushCursor } from './components/BrushCursor';
import { ParticleSystem } from './components/ParticleSystem';
import { ToothData, GameStatus, GermType, Particle } from './types';
import { playBubble, playSparkle, initAudio } from './utils/sound';

const TOTAL_TEETH = 10; // Per jaw
const GERM_TYPES: GermType[] = ['🦠', '👾', '🤢', '🍬'];

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [brushColor, setBrushColor] = useState<string>('#14b8a6'); // Default teal-500

  // Refs for intervals and touch handling
  const gameLoopRef = useRef<number | null>(null);
  const germSpawnerRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]); // Sync ref for animation loop if needed, mainly used state here

  // Initialize Teeth
  const initializeTeeth = () => {
    const newTeeth: ToothData[] = [];
    for (let i = 0; i < TOTAL_TEETH * 2; i++) {
      newTeeth.push({
        id: i,
        position: i < TOTAL_TEETH ? 'upper' : 'lower',
        germ: null,
        isClean: true,
      });
    }
    setTeeth(newTeeth);
  };

  // Start Game
  const startGame = (seconds: number) => {
    initAudio(); // Initialize Audio Context on user interaction
    initializeTeeth();
    setScore(0);
    setStreak(0);
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setGameStatus('playing');
    setParticles([]);
  };

  // Stop Game
  const stopGame = useCallback(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (germSpawnerRef.current) clearInterval(germSpawnerRef.current);
    setGameStatus('finished');
  }, []);

  // Spawner Logic
  const spawnGerm = useCallback(() => {
    setTeeth((prevTeeth) => {
      const cleanTeethIndices = prevTeeth
        .map((t, i) => (t.germ === null ? i : -1))
        .filter((i) => i !== -1);

      if (cleanTeethIndices.length === 0) return prevTeeth;

      const randomIndex = cleanTeethIndices[Math.floor(Math.random() * cleanTeethIndices.length)];
      const randomGerm = GERM_TYPES[Math.floor(Math.random() * GERM_TYPES.length)];

      const newTeeth = [...prevTeeth];
      newTeeth[randomIndex] = {
        ...newTeeth[randomIndex],
        germ: randomGerm,
        isClean: false,
      };
      return newTeeth;
    });
  }, []);

  // Game Loops
  useEffect(() => {
    if (gameStatus === 'playing') {
      // Timer
      gameLoopRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Spawner
      germSpawnerRef.current = window.setInterval(() => {
        if (Math.random() > 0.3) {
          spawnGerm();
        }
      }, 800);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (germSpawnerRef.current) clearInterval(germSpawnerRef.current);
    };
  }, [gameStatus, stopGame, spawnGerm]);

  // Particle Helper
  const addParticles = (x: number, y: number, type: 'bubble' | 'sparkle') => {
    const id = Date.now() + Math.random();
    const newParticle: Particle = { id, x, y, type };
    setParticles((prev) => [...prev, newParticle]);

    // Auto remove after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  // Cleaning Logic
  const handleClean = (id: number, x: number, y: number) => {
    if (gameStatus !== 'playing') return;

    // Visual & Audio feedback for brushing
    if (Math.random() > 0.5) {
        addParticles(x, y, 'bubble');
        // Play bubble sound occasionally so it's not overwhelming
        if (Math.random() > 0.6) playBubble();
    }

    setTeeth((prevTeeth) => {
      const tooth = prevTeeth[id];
      if (tooth.germ) {
        // Successfully cleaned a germ
        addParticles(x, y, 'sparkle');
        playSparkle(); // Play success sound for germ
        
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
        
        const newTeeth = [...prevTeeth];
        newTeeth[id] = { ...tooth, germ: null, isClean: true };
        return newTeeth;
      }
      return prevTeeth;
    });
  };

  // Reset
  const resetGame = () => {
    setGameStatus('idle');
  };

  // Touch/Mouse Handling for "Swiping"
  // We use document.elementFromPoint to simulate hover on touch devices
  const handleGlobalMove = useCallback((clientX: number, clientY: number) => {
    if (gameStatus !== 'playing') return;
    
    const element = document.elementFromPoint(clientX, clientY);
    if (element) {
      // We look for a data-tooth-id attribute
      const toothId = element.getAttribute('data-tooth-id');
      if (toothId) {
        handleClean(parseInt(toothId), clientX, clientY);
      }
    }
  }, [gameStatus]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling
      // e.preventDefault(); // Done via CSS touch-action: none
      const touch = e.touches[0];
      handleGlobalMove(touch.clientX, touch.clientY);
    };

    if (gameStatus === 'playing') {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStatus, handleGlobalMove]);

  const activeGermsCount = teeth.filter(t => t.germ !== null).length;
  const cleanPercent = Math.round(((TOTAL_TEETH * 2 - activeGermsCount) / (TOTAL_TEETH * 2)) * 100);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none select-none">
        <div className="absolute top-10 left-10 text-6xl">🫧</div>
        <div className="absolute bottom-20 right-20 text-6xl">🪥</div>
        <div className="absolute top-1/2 left-20 text-4xl">🖐️</div>
        <div className="absolute top-20 right-1/3 text-5xl">🦷</div>
      </div>

      {/* Brush Cursor */}
      <BrushCursor color={brushColor} />

      {/* Screens */}
      {gameStatus === 'idle' && (
        <StartScreen 
            onStart={startGame} 
            brushColor={brushColor} 
            setBrushColor={setBrushColor} 
        />
      )}
      
      {gameStatus === 'finished' && (
        <GameOverScreen 
          score={score} 
          cleanPercent={cleanPercent} 
          onRestart={resetGame} 
        />
      )}

      {/* Game Area */}
      {gameStatus !== 'idle' && (
        <>
          <GameHud 
            score={activeGermsCount} 
            timeLeft={timeLeft} 
            streak={streak} 
            isActive={gameStatus === 'playing'}
          />
          
          <div className="relative w-full max-w-4xl aspect-video max-h-[600px] flex items-center justify-center p-4">
            <div className="w-full h-full bg-[#ff8a80] rounded-[50px] shadow-inner border-b-8 border-[#e57373] relative overflow-hidden flex flex-col justify-between p-4 md:p-8">
              
              {/* Throat/Uvula */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-900 rounded-full opacity-40 blur-xl pointer-events-none"></div>

              {/* Upper Jaw */}
              <div className="flex justify-center gap-1 md:gap-3 h-1/3 items-start z-10">
                {teeth.filter(t => t.position === 'upper').map(t => (
                  <Tooth 
                    key={t.id} 
                    data={t} 
                    onClean={handleClean} 
                  />
                ))}
              </div>

              {/* Tongue */}
              <div className="h-1/4 bg-red-400 rounded-t-[100px] w-1/2 mx-auto opacity-90 shadow-inner flex items-center justify-center z-0 transform translate-y-4">
                 <div className="w-2 h-20 bg-red-500 rounded-full opacity-20"></div>
              </div>

              {/* Lower Jaw */}
              <div className="flex justify-center gap-1 md:gap-3 h-1/3 items-end z-10">
                 {teeth.filter(t => t.position === 'lower').map(t => (
                  <Tooth 
                    key={t.id} 
                    data={t} 
                    onClean={handleClean} 
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Particles Overlay */}
      <ParticleSystem particles={particles} />
    </div>
  );
}