// src/audio/lofiBaseballAudio.ts

/**
 * Ambient Lofi Ballpark Audio Engine
 * Uses Web Audio API synthesize:
 * - Vinyl record crackle & surface dust
 * - Soft warm Hammond-organ lofi minor 7th chords
 * - Distant ballpark crowd rumble
 */
class LofiBaseballAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private organInterval: number | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private crowdSource: AudioBufferSourceNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate synthetic vinyl crackle noise
  private createVinylCrackleNode(): AudioBufferSourceNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Sporadic dust pops and steady pinkish hiss
      if (Math.random() < 0.0006) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.015;
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter to warm vinyl frequencies
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    return source;
  }

  // Play a soft mellow ballpark organ chord (e.g. Cmaj7 / Am9)
  private playBallparkChord() {
    if (!this.ctx || !this.masterGain) return;
    const notes = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G
    ];

    const chord = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    chord.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Soft gentle swell and long warm release
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 6);
    });
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Start vinyl
    this.vinylSource = this.createVinylCrackleNode();
    if (this.vinylSource) {
      this.vinylSource.start();
    }

    // Play first chord immediately
    this.playBallparkChord();

    // Schedule ambient chords every 6 seconds
    this.organInterval = window.setInterval(() => {
      if (this.isPlaying) {
        this.playBallparkChord();
      }
    }, 6500);
  }

  public stop() {
    this.isPlaying = false;
    if (this.organInterval) {
      clearInterval(this.organInterval);
      this.organInterval = null;
    }
    if (this.vinylSource) {
      try {
        this.vinylSource.stop();
      } catch {
        // ignore
      }
      this.vinylSource = null;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const lofiBaseballAudio = new LofiBaseballAudioManager();
