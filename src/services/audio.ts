// Procedural Web Audio API sound generator for authentic ballpark audio without external files

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazily init AudioContext on first user interaction
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Authentic wooden bat crack
  public playBatCrack(isSolid: boolean = true): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Noise impulse (the transient click of the wood)
    const bufferSize = ctx.sampleRate * 0.04;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isSolid ? 1800 : 1200, t);
    filter.Q.setValueAtTime(3.5, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(t);

    // Resonant wooden pop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isSolid ? 480 : 320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

    oscGain.gain.setValueAtTime(0.8, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Signature Baltimore Chop sound: violent downward dirt thud followed by rising bounce whoosh
  public playBaltimoreChop(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Dirt plate smash: heavy low-frequency thump
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(160, t);
    thud.frequency.exponentialRampToValueAtTime(45, t + 0.15);

    thudGain.gain.setValueAtTime(0.9, t);
    thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(t);
    thud.stop(t + 0.22);

    // Bat bounce snap
    this.playBatCrack(false);

    // Towering bounce whistle
    setTimeout(() => {
      const c = this.getContext();
      if (!c) return;
      const t2 = c.currentTime;
      const whistle = c.createOscillator();
      const whistleGain = c.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(260, t2);
      whistle.frequency.exponentialRampToValueAtTime(820, t2 + 0.35);

      whistleGain.gain.setValueAtTime(0.3, t2);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.35);

      whistle.connect(whistleGain);
      whistleGain.connect(c.destination);
      whistle.start(t2);
      whistle.stop(t2 + 0.36);
    }, 80);
  }

  // Classic ballpark organ "CHARGE!" cheer
  public playOrganCharge(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    // Notes: G4, C5, E5, G5, E5, G5
    const notes = [
      { f: 392.00, d: 0.14 },
      { f: 523.25, d: 0.14 },
      { f: 659.25, d: 0.14 },
      { f: 783.99, d: 0.28 },
      { f: 659.25, d: 0.14 },
      { f: 783.99, d: 0.55 },
    ];

    let start = ctx.currentTime + 0.05;
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.d);

      start += note.d + 0.03;
    }
  }

  // Casino slot reel tick
  public playSlotTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600 + Math.random() * 150, t);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Casino Jackpot Bell fanfare
  public playJackpotChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50];
    const t = ctx.currentTime;
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.22, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.55);
    });
  }

  // Vending coin & prize drop
  public playVendingDispense(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Coin insertion clink
    const clink = ctx.createOscillator();
    const clinkGain = ctx.createGain();
    clink.type = 'sine';
    clink.frequency.setValueAtTime(1400, t);
    clinkGain.gain.setValueAtTime(0.25, t);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    clink.connect(clinkGain);
    clinkGain.connect(ctx.destination);
    clink.start(t);
    clink.stop(t + 0.09);

    // Mechanical drop clunk
    setTimeout(() => {
      const c = this.getContext();
      if (!c) return;
      const t2 = c.currentTime;
      const drop = c.createOscillator();
      const dropGain = c.createGain();
      drop.type = 'triangle';
      drop.frequency.setValueAtTime(220, t2);
      drop.frequency.exponentialRampToValueAtTime(80, t2 + 0.18);
      dropGain.gain.setValueAtTime(0.35, t2);
      dropGain.gain.exponentialRampToValueAtTime(0.01, t2 + 0.2);
      drop.connect(dropGain);
      dropGain.connect(c.destination);
      drop.start(t2);
      drop.stop(t2 + 0.22);
    }, 150);
  }

  // Holographic refractor card shimmer
  public playRefractorShine(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.linearRampToValueAtTime(1318.51, t + 0.25); // E6

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Strikeout or Ball call
  public playUmpireCall(isStrike: boolean): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isStrike ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(isStrike ? 240 : 440, t);
    osc.frequency.exponentialRampToValueAtTime(isStrike ? 160 : 540, t + 0.18);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Subtle tactile UI button click
  public playButtonClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Card whoosh / inspection sound
  public playCardWhoosh(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(740, t + 0.08);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  // Authentic Topps-style foil wrapper rip sound
  public playPackRip(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // 1. Transient tear rip noise
    const duration = 0.32;
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Modulated noise with crackles
      const crackle = Math.random() > 0.88 ? 2.2 : 0.8;
      data[i] = (Math.random() * 2 - 1) * crackle * Math.exp(-i / (bufferSize * 0.7));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.linearRampToValueAtTime(3200, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.75, t);
    gain.gain.linearRampToValueAtTime(0.9, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);

    // 2. High-metallic foil snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(880, t + 0.04);
    snapOsc.frequency.exponentialRampToValueAtTime(220, t + 0.16);

    snapGain.gain.setValueAtTime(0.35, t + 0.04);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(t + 0.04);
    snapOsc.stop(t + 0.2);
  }

  // Soft foil crinkle on pack touch
  public playFoilCrinkle(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dur = 0.12;
    const bufSize = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.4 * (1 - i / bufSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(2800, t);
    filt.Q.setValueAtTime(1.8, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(ctx.destination);
    src.start(t);
  }
  // ==========================================
  // RETRO 8-BIT CHIPTUNE BALLPARK AUDIO
  // ==========================================

  // Retro 8-bit Baltimore Chop: fast downward sweep followed by high bounce arpeggio
  public playRetro8BitChop(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Fast dirt smash sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);

    // High 8-bit bounce arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const nOsc = ctx.createOscillator();
      const nGain = ctx.createGain();
      const start = t + 0.09 + idx * 0.05;
      nOsc.type = 'triangle';
      nOsc.frequency.setValueAtTime(freq, start);
      nGain.gain.setValueAtTime(0.22, start);
      nGain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
      nOsc.connect(nGain);
      nGain.connect(ctx.destination);
      nOsc.start(start);
      nOsc.stop(start + 0.09);
    });
  }

  // Retro 8-bit Home Run fanfare (8-bit celebratory victory melody)
  public playRetro8BitHomeRun(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Notes: C5, E5, G5, high C6, G5, high C6
    const melody = [
      { f: 523.25, d: 0.1 },
      { f: 659.25, d: 0.1 },
      { f: 783.99, d: 0.1 },
      { f: 1046.50, d: 0.25 },
      { f: 783.99, d: 0.1 },
      { f: 1046.50, d: 0.35 }
    ];

    let offset = 0;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t + offset);
      gain.gain.setValueAtTime(0.18, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + offset);
      osc.stop(t + offset + note.d + 0.02);
      offset += note.d * 0.95;
    });
  }

  // Retro 8-bit Strikeout buzzer & descending whiff
  public playRetro8BitStrikeout(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.22);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  // Retro Ballpark Organ "Da-Da-Da-Dat-Da-DAH... CHARGE!"
  public playRetro8BitOrganCharge(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    // C4, E4, G4, C5, G4, C5
    const notes = [
      { f: 261.63, d: 0.12 },
      { f: 329.63, d: 0.12 },
      { f: 392.00, d: 0.12 },
      { f: 523.25, d: 0.18 },
      { f: 392.00, d: 0.12 },
      { f: 523.25, d: 0.38 }
    ];
    let offset = 0;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(n.f, t + offset);
      gain.gain.setValueAtTime(0.15, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + offset);
      osc.stop(t + offset + n.d + 0.02);
      offset += n.d * 0.85;
    });
  }
}

export const soundManager = new SoundEngine();


