import React, { useEffect, useState } from 'react';
import { playWin, playLose } from '../utils/sound';

interface GameOverProps {
  score: number; // Total score (germs busted) from parent state logic, passed as prop
  cleanPercent: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverProps> = ({ score, cleanPercent, onRestart }) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  // Sound Effect & Score Animation
  useEffect(() => {
    // Play Sound
    if (cleanPercent > 70) {
        playWin();
    } else {
        playLose();
    }

    // Animate Score
    let start = 0;
    const duration = 1000;
    const increment = score / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayedScore(score);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score, cleanPercent]);

  let title = "Good Effort!";
  let message = "Keep practicing for a perfect smile.";
  let emoji = "👍";
  let colorClass = "text-blue-500";

  if (cleanPercent === 100) {
    title = "Sparkling Clean!";
    message = "Wow! Not a single spot missed!";
    emoji = "👑";
    colorClass = "text-yellow-500";
  } else if (cleanPercent > 70) {
    title = "Great Job!";
    message = "Your teeth are looking shiny.";
    emoji = "😁";
    colorClass = "text-green-500";
  } else {
    title = "Oops!";
    message = "The sugar bugs won this time. Try again!";
    emoji = "🥴";
    colorClass = "text-orange-500";
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full animate-[floatUp_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
        <h1 className={`text-4xl font-display mb-2 ${colorClass}`}>{title}</h1>
        <p className="text-gray-600 mb-8 font-medium">{message}</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="flex justify-between mb-3 items-center">
                <span className="text-gray-500 font-bold uppercase text-sm">Germs Busted</span>
                <span className="text-3xl font-black text-gray-800">{displayedScore}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                 <div className="bg-teal-500 h-2 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-sm">Cleanliness</span>
                <span className={`text-3xl font-black ${cleanPercent === 100 ? 'text-yellow-500' : 'text-gray-800'}`}>
                    {cleanPercent}%
                </span>
            </div>
        </div>

        <button 
            onClick={onRestart}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        >
            Brush Again
        </button>
      </div>
    </div>
  );
};