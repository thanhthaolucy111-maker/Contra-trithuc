// Retro 8-bit Arcade Sound Synthesizer via Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public volume: number = 0.5;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = muted ? 0 : this.volume * 0.15;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = this.volume * 0.15;
    }
  }

  // Classic laser blaster shot
  public playShoot(weapon: 'NORMAL' | 'SPREAD' | 'LASER' | 'FIRE' = 'NORMAL') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (weapon === 'NORMAL') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (weapon === 'SPREAD') {
        // High frequency chime burst
        for (let i = 0; i < 3; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1100 + i * 150, now + i * 0.02);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.14);

          gain.gain.setValueAtTime(this.volume * 0.18, now + i * 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.02);
          osc.stop(now + 0.15);
        }
      } else if (weapon === 'LASER') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.2);

        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        // Fireball deep sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // Audio playback safety catch
    }
  }

  // Jump whistle sweep
  public playJump() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.14);

      gain.gain.setValueAtTime(this.volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // 8-bit Noise Explosion
  public playExplosion() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.linearRampToValueAtTime(80, now + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {}
  }

  // Power-up capsule pickup arpeggio
  public playPowerUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [330, 440, 550, 660, 880];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(this.volume * 0.22, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.09);
      });
    } catch {}
  }

  // Correct Knowledge Answer Chime
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C high
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.07);

        gain.gain.setValueAtTime(this.volume * 0.35, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch {}
  }

  // Wrong answer buzz
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  // Victory fanfare
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const melody = [
        { f: 523, d: 0.12 },
        { f: 659, d: 0.12 },
        { f: 783, d: 0.12 },
        { f: 1046, d: 0.35 }
      ];
      let t = this.ctx.currentTime;
      melody.forEach(item => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(this.volume * 0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d + 0.03;
      });
    } catch {}
  }

  // Game over sound
  public playGameOver() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 415, 392, 330, 220];
      let t = this.ctx.currentTime;
      notes.forEach(f => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(this.volume * 0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
        t += 0.18;
      });
    } catch {}
  }

  // Retro Contra 8-bit Action BGM Loop synthesizer
  public startBgm() {
    if (this.isBgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isBgmPlaying = true;

      // Base tempo loop: 140 BPM driving arcade bassline
      const bassNotes = [110, 110, 130.8, 146.8, 110, 110, 164.8, 146.8]; // A2, C3, D3...
      let step = 0;

      const scheduleStep = () => {
        if (!this.isBgmPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;

        if (!this.isMuted) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(bassNotes[step % bassNotes.length], now);

          gain.gain.setValueAtTime(this.volume * 0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);

          // Every 4th beat add metallic pulse snare
          if (step % 2 === 1) {
            const snare = this.ctx.createOscillator();
            const snareGain = this.ctx.createGain();
            snare.type = 'square';
            snare.frequency.setValueAtTime(250, now);
            snare.frequency.exponentialRampToValueAtTime(60, now + 0.08);

            snareGain.gain.setValueAtTime(this.volume * 0.06, now);
            snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            snare.connect(snareGain);
            snareGain.connect(this.ctx.destination);
            snare.start(now);
            snare.stop(now + 0.08);
          }
        }

        step++;
        this.bgmTimer = window.setTimeout(scheduleStep, 170); // ~176 BPM fast-paced action
      };

      scheduleStep();
    } catch {}
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundManager = new SoundManager();
