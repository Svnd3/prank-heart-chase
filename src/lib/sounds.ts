// Lightweight WebAudio sound effects — no asset files needed.

let ctx: AudioContext | null = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

export const playWhoosh = () => {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(700, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.18);
  gain.gain.setValueAtTime(0.001, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.25);
};

export const playHeartbreak = () => {
  const ac = getCtx();
  if (!ac) return;
  const notes = [523.25, 392.0, 311.13, 246.94]; // C5, G4, Eb4, B3 — descending sad
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const start = ac.currentTime + i * 0.18;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.55);
  });
};
