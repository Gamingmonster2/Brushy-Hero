import React from 'react';

interface GameHudProps {
  score: number; // Active germs
  timeLeft: number;
  streak: number;
  isActive: boolean;
}

export const GameHud: React.FC<GameHudProps> = ({ score, timeLeft, streak, isActive }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`
      absolute inset-0 w-full h-full pointer-events-none z-30
      transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* Top Left: Germ Counter */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-white/50">
        <span className="text-3xl filter drop-shadow-sm">🦠</span>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">Germs</span>
          <span className={`text-2xl font-black leading-none ${score > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {score}
          </span>
        </div>
      </div>

      {/* Top Right: Streak */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 pointer-events-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-white/50">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">Streak</span>
            <span className="text-2xl font-black text-yellow-500 leading-none">
              {streak}
            </span>
          </div>
          <span className="text-3xl filter drop-shadow-sm">🖐️</span>
      </div>

      {/* Bottom Right: Timer (Smaller) */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 pointer-events-auto bg-white border-4 border-teal-200 rounded-2xl shadow-xl px-4 py-2 flex flex-col items-end min-w-[100px]">
           <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider leading-none mb-1">Time Left</span>
           <span className={`text-2xl font-display font-bold leading-none ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-teal-600'}`}>
            {formatTime(timeLeft)}
          </span>
      </div>
    </div>
  );
};