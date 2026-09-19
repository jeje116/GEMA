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
  private isChefActive: boolean = false;
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
      this.audio.volume = this.normalVolume;
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

    // If Chef video is currently active, store intent as 'enabled' but keep ambient suppressed
    if (this.isChefActive) {
      this.notify();
      return true;
    }

    const audio = this.getOrCreateAudio();
    if (!audio) return false;

    audio.volume = this.normalVolume;

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
   * User toggles playback button (affects ambient backsound only)
   */
  public toggle(): boolean {
    this.initClientState();
    if (this.userIntent === 'enabled') {
      // User requests mute / disable ambient
      this.userIntent = 'disabled';
      try {
        sessionStorage.setItem('gemaAudioPref', 'false');
      } catch {
        // Ignore
      }
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
      }
      this.notify();
      return false;
    } else {
      // User requests enable ambient
      this.startFromUserGesture();
      return true;
    }
  }

  /**
   * Called when Chef video becomes active in viewport.
   * Completely pauses background ambience so Chef video audio is heard cleanly.
   * Ambient userIntent is strictly preserved and not overwritten.
   */
  public handleChefEnter(): void {
    this.initClientState();
    this.isChefActive = true;
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.notify();
  }

  /**
   * Called when Chef video leaves active viewport.
   * Restores background ambience according to user's intent.
   */
  public handleChefExit(): void {
    this.initClientState();
    this.isChefActive = false;
    if (this.userIntent === 'enabled' && this.audio) {
      this.audio.volume = this.normalVolume;
      this.audio.play().catch((err) => {
        console.warn('Failed to restore ambience audio:', err);
      });
    }
    this.notify();
  }

  public setDucked(ducked: boolean): void {
    if (ducked) {
      this.handleChefEnter();
    } else {
      this.handleChefExit();
    }
  }

  public isSoundtrackPlaying(): boolean {
    return Boolean(this.audio && !this.audio.paused && !this.audio.ended);
  }

  public isChefVideoActive(): boolean {
    return this.isChefActive;
  }

  public getUserIntent(): UserAudioIntent {
    return this.userIntent;
  }

  public getState(): AudioState {
    this.initClientState();
    return {
      isPlaying: this.userIntent === 'enabled',
      userIntent: this.userIntent,
      attenuation: this.isChefActive ? 'ducked' : 'normal',
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

if (typeof window !== 'undefined') {
  (window as unknown as { audioManager: AudioManager }).audioManager = audioManager;
}

