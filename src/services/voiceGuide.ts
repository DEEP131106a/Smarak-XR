/**
 * Web Speech API Voice Guide for Indian Heritage audio narration in English & Hindi.
 */

type VoiceGuideStateListener = (state: {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  lang: 'en' | 'hi';
}) => void;

class VoiceGuideService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private isPaused = false;
  private currentText = '';
  private currentLang: 'en' | 'hi' = 'en';
  private listeners: VoiceGuideStateListener[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(fn: VoiceGuideStateListener) {
    this.listeners.push(fn);
    this.notify();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const state = {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentText: this.currentText,
      lang: this.currentLang,
    };
    this.listeners.forEach((l) => l(state));
  }

  public speak(text: string, lang: 'en' | 'hi' = 'en') {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    this.stop();

    this.currentText = text;
    this.currentLang = lang;
    this.currentUtterance = new SpeechSynthesisUtterance(text);

    // Pick best available voice for language
    const voices = this.synth.getVoices();
    if (lang === 'hi') {
      this.currentUtterance.lang = 'hi-IN';
      const hiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('Hindi'));
      if (hiVoice) this.currentUtterance.voice = hiVoice;
      this.currentUtterance.rate = 0.95;
    } else {
      this.currentUtterance.lang = 'en-IN';
      const inVoice =
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;
      if (inVoice) this.currentUtterance.voice = inVoice;
      this.currentUtterance.rate = 0.98;
    }

    this.currentUtterance.pitch = 1.0;

    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentText = '';
      this.notify();
    };

    this.currentUtterance.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    this.synth.speak(this.currentUtterance);
  }

  public pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentText = '';
    this.notify();
  }

  public togglePlay(text: string, lang: 'en' | 'hi' = 'en') {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.speak(text, lang);
    }
  }
}

export const voiceGuide = new VoiceGuideService();
