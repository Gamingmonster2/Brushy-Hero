export type GermType = '🦠' | '👾' | '🤢' | '🍬';

export interface ToothData {
  id: number;
  position: 'upper' | 'lower';
  germ: GermType | null;
  isClean: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface Particle {
    id: number;
    x: number;
    y: number;
    type: 'bubble' | 'sparkle';
}