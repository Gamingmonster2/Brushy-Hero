import React, { useEffect, useState } from 'react';

interface BrushCursorProps {
  color: string;
}

export const BrushCursor: React.FC<BrushCursorProps> = ({ color }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [rotation, setRotation] = useState(-45);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      
      if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY - 60; // Offset slightly more for visibility
          setIsHovering(true);
      } else {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
          setIsHovering(true);
      }

      setPosition({ x: clientX, y: clientY });
      
      // Dynamic rotation based on horizontal movement
      const rot = -45 + ((e as any).movementX || 0) * 2;
      setRotation(Math.max(-80, Math.min(-10, rot)));
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('touchmove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('touchmove', updatePosition);
    };
  }, []);

  if (!isHovering) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[9999] will-change-transform transition-transform duration-75 ease-out drop-shadow-2xl"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px) translate(-20%, -20%) rotate(${rotation}deg)`
      }}
    >
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Handle Body */}
        <path 
            d="M55 85 C55 90 45 90 45 85 L40 40 C38 35 38 30 42 25 L45 20 L55 20 L58 25 C62 30 62 35 60 40 L55 85 Z" 
            fill={color} 
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
        />
        
        {/* Handle Grip Details */}
        <path d="M45 75 L55 75" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M44 65 L56 65" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M43 55 L57 55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>

        {/* Rubber Neck */}
        <rect x="45" y="15" width="10" height="8" rx="2" fill="#ECEFF1" />

        {/* Brush Head Base */}
        <path d="M42 5 C42 2 58 2 58 5 L56 15 L44 15 L42 5 Z" fill={color} />

        {/* Bristles - Top */}
        <path d="M42 5 L42 0 L46 0 L46 5" fill="#E0F7FA" stroke="#4DD0E1" strokeWidth="0.5" />
        <path d="M47 5 L47 -2 L53 -2 L53 5" fill="#B2EBF2" stroke="#4DD0E1" strokeWidth="0.5" />
        <path d="M54 5 L54 0 L58 0 L58 5" fill="#E0F7FA" stroke="#4DD0E1" strokeWidth="0.5" />
        
        {/* Shine on handle */}
        <path d="M52 30 C54 35 54 40 52 80" stroke="white" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};