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
  private melodyTimer: number | null = null;
  private melodyStep = 0;

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

  private playMelodyNote(frequency: number, duration = 2.6) {
    if (!this.ctx || !this.droneGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();
    const secondHarmonic = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();
    const breath = this.ctx.createBufferSource();
    const breathFilter = this.ctx.createBiquadFilter();
    const breathGain = this.ctx.createGain();
    const breathBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const breathData = breathBuffer.getChannelData(0);
    for (let index = 0; index < breathData.length; index += 1) {
      breathData[index] = (Math.random() * 2 - 1) * 0.16;
    }

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);
    secondHarmonic.type = 'sine';
    secondHarmonic.frequency.setValueAtTime(frequency * 2, now);
    vibrato.frequency.setValueAtTime(5.2, now);
    vibratoGain.gain.setValueAtTime(2.8, now);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.detune);
    vibratoGain.connect(secondHarmonic.detune);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1250, now);
    filter.Q.setValueAtTime(0.45, now);
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.027, now + 0.4);
    noteGain.gain.setValueAtTime(0.027, now + duration * 0.52);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    breath.buffer = breathBuffer;
    breath.loop = false;
    breathFilter.type = 'bandpass';
    breathFilter.frequency.setValueAtTime(1900, now);
    breathFilter.Q.setValueAtTime(0.6, now);
    breathGain.gain.setValueAtTime(0.0001, now);
    breathGain.gain.linearRampToValueAtTime(0.012, now + 0.22);
    breathGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(filter);
    secondHarmonic.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.droneGain);
    breath.connect(breathFilter);
    breathFilter.connect(breathGain);
    breathGain.connect(this.droneGain);
    oscillator.start(now);
    secondHarmonic.start(now);
    vibrato.start(now);
    breath.start(now);
    oscillator.stop(now + duration + 0.1);
    secondHarmonic.stop(now + duration + 0.1);
    vibrato.stop(now + duration + 0.1);
  }

  /**
   * Starts a soft bansuri-inspired instrumental phrase over a quiet pad.
   */
  public startTanpuraDrone() {
    if (this.isDronePlaying) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.connect(this.ctx.destination);
    master.gain.setValueAtTime(0.001, now);
    master.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.045, now + 2.0);
    this.droneGain = master;

    const strings = [
      { freq: 130.81, detune: 0 },
      { freq: 196.0, detune: 2 },
    ];

    this.droneOscillators = [];

    strings.forEach((s) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(s.freq, now);
      osc.detune.setValueAtTime(s.detune, now);

      // Low pass filter to warm the acoustic timbre
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, now);
      filter.Q.setValueAtTime(0.7, now);

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
    const melody = [261.63, 293.66, 329.63, 392, 440, 392, 329.63, 293.66];
    this.melodyStep = 0;
    this.playMelodyNote(melody[0]);
    this.melodyTimer = window.setInterval(() => {
      this.playMelodyNote(melody[this.melodyStep % melody.length]);
      this.melodyStep += 1;
    }, 2800);
  }

  public stopTanpuraDrone() {
    if (!this.isDronePlaying || !this.droneGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
    if (this.melodyTimer !== null) {
      window.clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
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
      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.045, this.ctx.currentTime);
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
