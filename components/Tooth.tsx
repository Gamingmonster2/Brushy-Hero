import React from 'react';
import { ToothData } from '../types';

interface ToothProps {
  data: ToothData;
  onClean: (id: number, x: number, y: number) => void;
}

export const Tooth: React.FC<ToothProps> = ({ data, onClean }) => {
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }
    onClean(data.id, clientX, clientY);
  };

  const isUpper = data.position === 'upper';

  return (
    <div
      data-tooth-id={data.id}
      onMouseEnter={(e) => handleInteraction(e)}
      onTouchStart={(e) => handleInteraction(e)}
      className="relative flex items-center justify-center w-10 md:w-14 lg:w-16 h-16 md:h-24 lg:h-28 transition-transform duration-100 select-none active:scale-95"
    >
      <svg 
        viewBox="0 0 100 120" 
        className={`w-full h-full drop-shadow-md ${isUpper ? 'rotate-180' : ''}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 
           Tooth Shape: 
           Double root at top (0,0) area
           Rounded crown at bottom (0,120) area
           Slight indentation in crown for molar look
        */}
        <path
          d="M20 10 
             Q 20 0 35 5 
             L 50 0 
             L 65 5 
             Q 80 0 80 10 
             L 85 80 
             Q 85 110 50 110 
             Q 15 110 15 80 
             Z"
          fill={data.germ ? '#FEF9C3' : '#FFFFFF'} // Yellow-100 if dirty
          stroke={data.germ ? '#FDE047' : '#E2E8F0'} // Yellow-300 vs Slate-200
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Shine reflection */}
        {!data.germ && (
            <path 
                d="M30 30 Q 35 60 30 90" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                opacity="0.6"
            />
        )}
        
        {/* Cavity visual if very dirty (optional later, for now just yellow) */}
      </svg>

      {/* Germ Overlay - Position needs to be corrected since tooth might be rotated */}
      {data.germ && (
        <div className={`absolute inset-0 flex items-center justify-center z-20 ${isUpper ? 'rotate-180' : ''}`}>
          <div className="animate-shake text-2xl md:text-4xl filter drop-shadow-sm">
            {data.germ}
          </div>
        </div>
      )}
    </div>
  );
};