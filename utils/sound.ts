
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
};

export const initAudio = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

export const playBubble = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  // Bubble: rapid pitch ramp up
  osc.frequency.setValueAtTime(200 + Math.random() * 100, t);
  osc.frequency.exponentialRampToValueAtTime(500 + Math.random() * 200, t + 0.1);

  // Soft envelope, lower volume
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(t);
  osc.stop(t + 0.15);
};

export const playSparkle = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Double beep/chime for a "clean" feeling
  [0, 0.1].forEach((offset, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = i === 0 ? 880 : 1760; // High A, High A octave up
    osc.frequency.setValueAtTime(freq, t + offset);

    gain.gain.setValueAtTime(0, t + offset);
    gain.gain.linearRampToValueAtTime(0.05, t + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t + offset);
    osc.stop(t + offset + 0.2);
  });
};

export const playWin = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  // Major Arpeggio: C5, E5, G5, C6
  const notes = [523.25, 659.25, 783.99, 1046.50];
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    const start = t + i * 0.1;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(start);
    osc.stop(start + 0.4);
  });
};

export const playLose = () => {
  const ctx = getCtx();
  const t = ctx.currentTime;
  
  // Descending notes: G4, F#4, F4, E4
  const notes = [392.00, 369.99, 349.23, 329.63];
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    
    const start = t + i * 0.25;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.03, start + 0.05); // Lower volume for sawtooth
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    
    // Lowpass filter to make it sound like a "womp womp"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(start);
    osc.stop(start + 0.5);
  });
};
