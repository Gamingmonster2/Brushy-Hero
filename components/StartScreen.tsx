import React from 'react';
import { initAudio, playSparkle } from '../utils/sound';

interface StartScreenProps {
  onStart: (duration: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
}

const BRUSH_COLORS = [
  { name: 'Teal', value: '#14b8a6', tailwind: 'bg-teal-500' },
  { name: 'Blue', value: '#3b82f6', tailwind: 'bg-blue-500' },
  { name: 'Purple', value: '#a855f7', tailwind: 'bg-purple-500' },
  { name: 'Pink', value: '#ec4899', tailwind: 'bg-pink-500' },
  { name: 'Orange', value: '#f97316', tailwind: 'bg-orange-500' },
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, brushColor, setBrushColor }) => {
  const handleStart = (duration: number) => {
    initAudio();
    playSparkle();
    onStart(duration);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 z-30 border-4 border-teal-100 animate-[floatUp_0.5s_ease-out]">
      <div className="text-7xl mb-6 animate-bounce">🦷</div>
      <h1 className="text-5xl text-teal-600 mb-3 font-display tracking-tight">Brushy Hero</h1>
      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
        Help keep the teeth healthy! <br/>
        Brush away the sugar bugs before they cause cavities.
      </p>
      
      {/* Color Selection */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-500 uppercase mb-3 tracking-wide">Choose Your Brush</p>
        <div className="flex justify-center gap-4">
            {BRUSH_COLORS.map((c) => (
                <button
                    key={c.name}
                    onClick={() => setBrushColor(c.value)}
                    className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform transform hover:scale-110 ${c.tailwind} ${brushColor === c.value ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : 'border-white'}`}
                    aria-label={`Select ${c.name} brush`}
                />
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => handleStart(30)}
          className="group relative w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all transform hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl group-hover:rotate-12 transition-transform">🚀</span>
          Blitz Mode (30s)
        </button>
        
        <button 
          onClick={() => handleStart(120)}
          className="group relative w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all transform hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl group-hover:rotate-12 transition-transform">⏱️</span>
          Real Routine (2m)
        </button>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
        <span>🖱️ / 👆 Use your cursor or finger as the brush!</span>
      </div>
    </div>
  );
};