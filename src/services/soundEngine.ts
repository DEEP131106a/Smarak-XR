/**
 * Procedural Web Audio API sound synthesizer for authentic Indian heritage soundscapes.
 * Generates an evocative Tanpura drone and resonant bronze temple bell chimes
 * without relying on external large audio files.
 */

class HeritageSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isDronePlaying: boolean = false;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays an authentic bronze temple bell chime with rich metallic overtones
   */
  public playTempleBell(frequency = 587.33, duration = 3.5) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.connect(this.ctx.destination);

    // Exponential decay envelope for bronze bell
    masterGain.gain.setValueAtTime(0.35, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Overtones for Indian temple bell (fundamental, octave, minor third, fifth, tenth)
    const partials = [
      { ratio: 1.0, gain: 1.0 },
      { ratio: 1.48, gain: 0.6 },
      { ratio: 2.02, gain: 0.5 },
      { ratio: 2.76, gain: 0.3 },
      { ratio: 3.98, gain: 0.2 },
    ];

    partials.forEach((p) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * p.ratio, now);

      pGain.gain.setValueAtTime(p.gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.001, now + duration * (1 / (p.ratio * 0.7)));

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * Starts an ambient Indian Tanpura drone in C (Sa - Pa - Sa' - Sa)
   */
  public startTanpuraDrone() {
    if (this.isDronePlaying) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.connect(this.ctx.destination);
    master.gain.setValueAtTime(0.001, now);
    master.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.09, now + 2.0);
    this.droneGain = master;

    // Tanpura string frequencies based on C3 (130.81 Hz):
    // String 1: Pa (G3 - 196 Hz)
    // String 2: Sa' (C4 - 261.63 Hz)
    // String 3: Sa' (C4 - 261.63 Hz slightly detuned)
    // String 4: Kharaj Sa (C3 - 130.81 Hz)
    const strings = [
      { freq: 196.0, detune: 2 },
      { freq: 261.63, detune: -4 },
      { freq: 261.63, detune: 5 },
      { freq: 130.81, detune: 0 },
    ];

    this.droneOscillators = [];

    strings.forEach((s) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(s.freq, now);
      osc.detune.setValueAtTime(s.detune, now);

      // Low pass filter to warm the acoustic timbre
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.Q.setValueAtTime(3.0, now);

      // Gentle LFO tremolo for the vibrating silk thread (Javari) effect
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.4 + Math.random() * 0.3, now);
      lfoGain.gain.setValueAtTime(25, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      osc.connect(filter);
      filter.connect(master);

      osc.start(now);
      this.droneOscillators.push(osc);
    });

    this.isDronePlaying = true;
  }

  public stopTanpuraDrone() {
    if (!this.isDronePlaying || !this.droneGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
    setTimeout(() => {
      this.droneOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.droneOscillators = [];
      this.isDronePlaying = false;
    }, 1300);
  }

  public toggleDrone(): boolean {
    if (this.isDronePlaying) {
      this.stopTanpuraDrone();
      return false;
    } else {
      this.startTanpuraDrone();
      return true;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.09, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isDronePlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundEngine = new HeritageSoundEngine();
