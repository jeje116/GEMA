'use client';

export type UserAudioIntent = 'enabled' | 'disabled';
export type AttenuationState = 'normal' | 'ducked';

export interface AudioState {
  isPlaying: boolean;
  userIntent: UserAudioIntent;
  attenuation: AttenuationState;
  volume: number;
}

type AudioListener = (state: AudioState) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private userIntent: UserAudioIntent = 'disabled';
  private attenuation: AttenuationState = 'normal';
  private listeners: Set<AudioListener> = new Set();
  
  // Volume targets
  public readonly normalVolume: number = 0.30;
  public readonly duckedVolume: number = 0.05;
  public readonly fadeDurationMs: number = 600;

  private isClientInitialized = false;

  constructor() {
    this.initClientState();
  }

  public initClientState(): void {
    if (this.isClientInitialized || typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('gemaAudioPref');
      // Default to disabled until explicit user gesture (Gateway click or AudioControl play)
      // This prevents stale cross-session localStorage from silently muting a fresh Gateway experience
      this.userIntent = saved === 'true' ? 'enabled' : 'disabled';
    } catch {
      this.userIntent = 'disabled';
    }
    this.isClientInitialized = true;
  }

  public getOrCreateAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    this.initClientState();
    if (!this.audio) {
      this.audio = new Audio('/media/audio/stillness-in-the-atrium-gema.mp3');
      this.audio.loop = true;
      this.audio.volume = this.attenuation === 'ducked' ? this.duckedVolume : this.normalVolume;
      this.audio.preload = 'auto';

      const updateEvents = ['play', 'playing', 'pause', 'waiting', 'canplay', 'ended', 'volumechange'];
      updateEvents.forEach((evt) => {
        this.audio?.addEventListener(evt, () => this.notify());
      });
      this.audio.addEventListener('error', (e) => {
        console.warn('GEMA audio error:', e);
        this.notify();
      });
    }
    return this.audio;
  }

  /**
   * Smoothly transitions audio volume to the target over fadeDurationMs
   */
  private rampVolume(targetVolume: number): void {
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    if (this.fadeTimer !== null) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }

    const startVolume = audio.volume;
    const volumeDelta = targetVolume - startVolume;
    if (Math.abs(volumeDelta) < 0.01) {
      audio.volume = targetVolume;
      this.notify();
      return;
    }

    const stepIntervalMs = 25;
    const totalSteps = Math.max(1, Math.floor(this.fadeDurationMs / stepIntervalMs));
    let currentStep = 0;

    this.fadeTimer = window.setInterval(() => {
      currentStep++;
      const progress = Math.min(1, currentStep / totalSteps);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const newVol = Math.max(0, Math.min(1, startVolume + volumeDelta * ease));
      
      if (this.audio) {
        this.audio.volume = newVol;
      }

      if (progress >= 1) {
        if (this.fadeTimer !== null) {
          window.clearInterval(this.fadeTimer);
          this.fadeTimer = null;
        }
        if (this.audio) {
          this.audio.volume = targetVolume;
        }
        this.notify();
      }
    }, stepIntervalMs);
  }

  private fadeTimer: number | null = null;

  /**
   * User explicitly enables or starts audio (e.g. Gateway enter gesture or audio toggle ON)
   */
  public async startFromUserGesture(): Promise<boolean> {
    this.initClientState();
    this.userIntent = 'enabled';
    try {
      sessionStorage.setItem('gemaAudioPref', 'true');
    } catch {
      // Ignore
    }

    const audio = this.getOrCreateAudio();
    if (!audio) return false;

    const targetVol = this.attenuation === 'ducked' ? this.duckedVolume : this.normalVolume;
    audio.volume = targetVol;

    try {
      await audio.play();
      this.notify();
      return true;
    } catch (err: unknown) {
      const domErr = err as DOMException;
      console.warn('Audio play request could not be completed:', domErr?.name, domErr?.message);
      this.notify();
      return false;
    }
  }

  /**
   * User toggles playback button
   */
  public toggle(): boolean {
    this.initClientState();
    const currentState = this.getState();
    if (currentState.isPlaying) {
      // Actual audio is playing → user requests mute / disable
      this.userIntent = 'disabled';
      try {
        sessionStorage.setItem('gemaAudioPref', 'false');
      } catch {
        // Ignore
      }
      if (this.audio) {
        this.audio.pause();
      }
      this.notify();
      return false;
    } else {
      // Audio is not playing → user requests play / enable
      this.startFromUserGesture();
      return true;
    }
  }

  /**
   * System ducking: ducks or restores volume smoothly
   * CRITICAL INVARIANT: NEVER overwrites or reactivates disabled userIntent!
   */
  public setDucked(ducked: boolean): void {
    const newAttenuation: AttenuationState = ducked ? 'ducked' : 'normal';
    if (this.attenuation === newAttenuation) return;

    this.attenuation = newAttenuation;

    // If audio is disabled by user intent, do NOT play or resume
    if (this.userIntent === 'disabled') {
      // Keep state tracked, but don't play
      this.notify();
      return;
    }

    // User intent is enabled; if audio is playing, smoothly ramp volume
    const targetVol = ducked ? this.duckedVolume : this.normalVolume;
    this.rampVolume(targetVol);
  }

  public getState(): AudioState {
    this.initClientState();
    const isPlaying = Boolean(
      this.userIntent === 'enabled' &&
      this.audio &&
      !this.audio.paused &&
      !this.audio.ended
    );
    return {
      isPlaying,
      userIntent: this.userIntent,
      attenuation: this.attenuation,
      volume: this.audio ? this.audio.volume : this.normalVolume,
    };
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

// Module-level singleton preserved across Next.js internal page & locale navigations
export const audioManager = new AudioManager();
