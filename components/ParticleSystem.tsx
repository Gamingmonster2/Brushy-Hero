import React from 'react';
import { Particle } from '../types';

interface ParticleSystemProps {
  particles: Particle[];
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ particles }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => {
        // Add random offset to create natural feel
        const randomX = (Math.random() - 0.5) * 20;
        
        return (
            <div
            key={p.id}
            className={`absolute ${p.type === 'bubble' ? 'animate-float-up' : 'animate-pop'}`}
            style={{
                left: p.x + randomX,
                top: p.y,
            }}
            >
            {p.type === 'bubble' ? (
                <div className="w-4 h-4 md:w-6 md:h-6 bg-white/80 rounded-full border border-blue-200 shadow-sm backdrop-blur-sm" />
            ) : (
                <div className="text-2xl md:text-4xl drop-shadow-lg filter contrast-125">🖐️</div>
            )}
            </div>
        );
      })}
    </div>
  );
};