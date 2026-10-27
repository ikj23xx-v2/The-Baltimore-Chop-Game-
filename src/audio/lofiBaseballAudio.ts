// src/audio/lofiBaseballAudio.ts

export type LofiStationId = 'CAMDEN_DUGOUT' | 'RETRO_8BIT_ARCADE' | 'RAIN_DELAY_JAZZ' | 'BLEACHER_GROOVE';

export interface LofiStation {
  id: LofiStationId;
  name: string;
  genre: string;
  tempo: string;
  description: string;
}

export const LOFI_STATIONS: LofiStation[] = [
  { 
    id: 'CAMDEN_DUGOUT', 
    name: 'Camden Dugout Vinyl', 
    genre: 'Mellow Lo-Fi Organ', 
    tempo: '72 BPM', 
    description: 'Warm vinyl dust, minor 7th chord swells & distant Camden crowd' 
  },
  { 
    id: 'RETRO_8BIT_ARCADE', 
    name: '1989 Stadium 8-Bit', 
    genre: 'Chiptune Theme', 
    tempo: '112 BPM', 
    description: 'Classic Nintendo ballpark arpeggios, square-wave organ & arcade fanfares' 
  },
  { 
    id: 'RAIN_DELAY_JAZZ', 
    name: 'Rain Delay Rhodes', 
    genre: 'Coffeehouse Lo-Fi', 
    tempo: '68 BPM', 
    description: 'Soft raindrops, electric piano triads & soothing tape hiss' 
  },
  { 
    id: 'BLEACHER_GROOVE', 
    name: 'Bleacher Charge Grooves', 
    genre: 'Organ Fanfares', 
    tempo: '90 BPM', 
    description: 'Syncopated ballpark rhythms, crowd cheering & high-bounce claps' 
  },
];

class LofiBaseballAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private organInterval: number | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private currentStation: LofiStationId = 'CAMDEN_DUGOUT';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
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
      if (Math.random() < 0.0006) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.015;
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

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

  // Play chords or arpeggios based on the active station
  private playStationAudio() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (this.currentStation === 'RETRO_8BIT_ARCADE') {
      // 8-Bit Nintendo Stadium Chiptune Arpeggios (Take Me Out To The Ball Game vibes)
      const arpeggios = [
        [261.63, 329.63, 392.00, 523.25], // C - E - G - C
        [220.00, 261.63, 329.63, 440.00], // A - C - E - A
        [174.61, 220.00, 261.63, 349.23], // F - A - C - F
        [196.00, 246.94, 293.66, 392.00], // G - B - D - G
      ];
      const seq = arpeggios[Math.floor(Math.random() * arpeggios.length)];
      seq.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.18);

        gain.gain.setValueAtTime(0, now + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.035, now + i * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 0.4);
      });
    } else if (this.currentStation === 'RAIN_DELAY_JAZZ') {
      // Rhodes Electric Piano Minor 9th Chords
      const chords = [
        [261.63, 311.13, 392.00, 466.16, 587.33], // Cm9
        [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
        [174.61, 207.65, 261.63, 311.13, 392.00], // Fm9
      ];
      const chord = chords[Math.floor(Math.random() * chords.length)];
      chord.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 5.5);
      });
    } else if (this.currentStation === 'BLEACHER_GROOVE') {
      // Stadium Organ Charge Fanfare Chords
      const fanfare = [392.00, 523.25, 659.25, 783.99]; // G4 - C5 - E5 - G5
      fanfare.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.7);
      });
    } else {
      // CAMDEN_DUGOUT: Classic Ballpark Hammond Organ Lo-Fi Minor 7th Chords
      const notes = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G
      ];
      const chord = notes[Math.floor(Math.random() * notes.length)];
      chord.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 6);
      });
    }
  }

  public setStation(stationId: LofiStationId) {
    this.currentStation = stationId;
    if (this.isPlaying) {
      this.playStationAudio();
    }
  }

  public getStation(): LofiStationId {
    return this.currentStation;
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

    // Start vinyl crackle
    this.vinylSource = this.createVinylCrackleNode();
    if (this.vinylSource) {
      this.vinylSource.start();
    }

    // Play first chord immediately
    this.playStationAudio();

    // Schedule ambient chords every 5.5 seconds
    const intervalMs = this.currentStation === 'RETRO_8BIT_ARCADE' ? 3800 : 5500;
    this.organInterval = window.setInterval(() => {
      if (this.isPlaying) {
        this.playStationAudio();
      }
    }, intervalMs);
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
