// Web Audio API Procedural Audio Engine for "A Birthday Journey for Annissa"
// Generates an aesthetic, slow, romantic piano & music-box arrangement of "Happy Birthday to You"

class AudioManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isMuted: boolean = false
  private volume: number = 0.65
  private isPlayingBgm: boolean = false
  private bgmTimeouts: number[] = []
  private audioEl: HTMLAudioElement | null = null

  constructor() {
    // Check if an external custom audio file is present
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio()
        audio.src = '/assets/audio/happy-birthday.mp3'
        audio.loop = true
        audio.volume = this.volume
        this.audioEl = audio
      } catch {
        // Safe fallback to Web Audio procedural synthesis
      }
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime)
    }
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime)
    }
    if (this.audioEl) {
      this.audioEl.muted = this.isMuted
    }
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  // Play a soft, warm romantic felt-piano note
  public playPianoNote(freq: number, duration: number = 2.5, velocity: number = 0.3) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(freq, now)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(freq * 2, now) // Gentle 1st octave harmonic

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(freq * 3.5, now)
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(velocity * 0.45, now + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + duration)
    osc2.stop(now + duration)
  }

  // Play a delicate, music-box / celesta chime tone
  public playMusicBoxNote(freq: number, duration: number = 2.0, velocity: number = 0.18) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(velocity * 0.3, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + duration)
  }

  // Aesthetic romantic arrangement of "Happy Birthday to You" (Key of F Major, 66 BPM, Waltz feel)
  private playHappyBirthdaySong() {
    if (!this.isPlayingBgm) return

    // Frequencies (Hz)
    const F2 = 87.31, A2 = 110.00, Bb2 = 116.54, C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61
    const G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63, D4 = 293.66, E4 = 329.63
    const F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33
    const E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00

    const schedule = (delayMs: number, fn: () => void) => {
      const tid = window.setTimeout(() => {
        if (this.isPlayingBgm) fn()
      }, delayMs)
      this.bgmTimeouts.push(tid)
    }

    // === PHRASE 1: "Hap-py birth-day to you..." ===
    // "Hap-"
    schedule(0, () => this.playPianoNote(C4, 0.7, 0.28))
    // "-py"
    schedule(380, () => this.playPianoNote(C4, 0.7, 0.30))
    // "birth-" (Bass F + chord + D4)
    schedule(760, () => {
      this.playPianoNote(F2, 3.2, 0.26)
      this.playPianoNote(C3, 2.5, 0.18)
      this.playPianoNote(A3, 2.5, 0.18)
      this.playPianoNote(D4, 1.2, 0.32)
      this.playMusicBoxNote(D5, 1.5, 0.14)
    })
    // "-day"
    schedule(1420, () => {
      this.playPianoNote(F3, 1.5, 0.16)
      this.playPianoNote(C4, 1.2, 0.30)
    })
    // "to"
    schedule(2000, () => {
      this.playPianoNote(A2, 2.5, 0.22)
      this.playPianoNote(C4, 1.8, 0.18)
      this.playPianoNote(F4, 1.4, 0.34)
      this.playMusicBoxNote(F5, 1.8, 0.15)
    })
    // "you..." (C/E chord)
    schedule(2750, () => {
      this.playPianoNote(C3, 3.5, 0.24)
      this.playPianoNote(G3, 2.8, 0.18)
      this.playPianoNote(E4, 2.8, 0.32)
    })
    // Dreamy little harp arpeggio
    schedule(3700, () => this.playMusicBoxNote(G4, 1.8, 0.14))
    schedule(4100, () => this.playMusicBoxNote(C5, 2.0, 0.16))

    // === PHRASE 2: "Hap-py birth-day to you..." ===
    // "Hap-"
    schedule(4800, () => this.playPianoNote(C4, 0.7, 0.28))
    // "-py"
    schedule(5180, () => this.playPianoNote(C4, 0.7, 0.30))
    // "birth-" (C3 bass + G3 + D4)
    schedule(5560, () => {
      this.playPianoNote(C3, 3.0, 0.25)
      this.playPianoNote(G3, 2.5, 0.18)
      this.playPianoNote(D4, 1.2, 0.32)
      this.playMusicBoxNote(D5, 1.5, 0.14)
    })
    // "-day"
    schedule(6220, () => {
      this.playPianoNote(E3, 1.8, 0.16)
      this.playPianoNote(C4, 1.2, 0.30)
    })
    // "to"
    schedule(6800, () => {
      this.playPianoNote(C3, 2.5, 0.22)
      this.playPianoNote(Bb3, 2.0, 0.18)
      this.playPianoNote(G4, 1.4, 0.34)
      this.playMusicBoxNote(G5, 1.8, 0.16)
    })
    // "you..." (Resolving to F major)
    schedule(7550, () => {
      this.playPianoNote(F2, 3.8, 0.26)
      this.playPianoNote(C3, 3.0, 0.20)
      this.playPianoNote(A3, 3.0, 0.20)
      this.playPianoNote(F4, 3.0, 0.32)
    })
    schedule(8500, () => this.playMusicBoxNote(A4, 1.8, 0.14))
    schedule(8900, () => this.playMusicBoxNote(F5, 2.0, 0.16))

    // === PHRASE 3: "Hap-py birth-day dear An-nis-sa..." (Romantic Climax) ===
    // "Hap-"
    schedule(9600, () => this.playPianoNote(C4, 0.7, 0.28))
    // "-py"
    schedule(9980, () => this.playPianoNote(C4, 0.7, 0.30))
    // "birth-" (Soaring high C5 on warm F bass!)
    schedule(10360, () => {
      this.playPianoNote(F2, 3.8, 0.28)
      this.playPianoNote(C3, 3.0, 0.20)
      this.playPianoNote(F3, 3.0, 0.20)
      this.playPianoNote(C5, 2.0, 0.38)
      this.playMusicBoxNote(C5, 2.2, 0.20)
    })
    // "-day" (Dm7 with A4)
    schedule(11150, () => {
      this.playPianoNote(D3, 2.5, 0.24)
      this.playPianoNote(F3, 2.0, 0.18)
      this.playPianoNote(A4, 1.6, 0.34)
      this.playMusicBoxNote(A5, 1.8, 0.16)
    })
    // "dear" (F4)
    schedule(11850, () => {
      this.playPianoNote(D4, 1.6, 0.22)
      this.playPianoNote(F4, 1.4, 0.30)
    })
    // "An-" (E4)
    schedule(12500, () => {
      this.playPianoNote(C4, 1.4, 0.20)
      this.playPianoNote(E4, 1.3, 0.30)
    })
    // "-nis-sa..." (Bb major 7 warmth with D4)
    schedule(13100, () => {
      this.playPianoNote(Bb2, 3.5, 0.26)
      this.playPianoNote(F3, 3.0, 0.20)
      this.playPianoNote(D4, 3.0, 0.34)
      this.playMusicBoxNote(D5, 2.0, 0.16)
    })
    // Celestial bell echo
    schedule(14100, () => this.playMusicBoxNote(F5, 2.0, 0.15))
    schedule(14550, () => this.playMusicBoxNote(A5, 2.2, 0.18))

    // === PHRASE 4: "Hap-py birth-day to you..." ===
    // "Hap-" (Bb4)
    schedule(15200, () => {
      this.playPianoNote(Bb4, 0.7, 0.32)
      this.playMusicBoxNote(Bb4, 1.0, 0.16)
    })
    // "-py" (Bb4)
    schedule(15580, () => {
      this.playPianoNote(Bb4, 0.7, 0.32)
      this.playMusicBoxNote(Bb4, 1.0, 0.16)
    })
    // "birth-" (F/C with A4)
    schedule(15960, () => {
      this.playPianoNote(C3, 3.2, 0.24)
      this.playPianoNote(F3, 2.5, 0.18)
      this.playPianoNote(A4, 1.8, 0.34)
      this.playMusicBoxNote(A5, 1.8, 0.16)
    })
    // "-day" (F4)
    schedule(16700, () => {
      this.playPianoNote(C4, 1.5, 0.18)
      this.playPianoNote(F4, 1.4, 0.30)
    })
    // "to" (G4)
    schedule(17350, () => {
      this.playPianoNote(C3, 2.8, 0.22)
      this.playPianoNote(G3, 2.0, 0.18)
      this.playPianoNote(G4, 1.6, 0.34)
      this.playMusicBoxNote(G5, 1.8, 0.16)
    })
    // "you..." (Final lush F add9 chord)
    schedule(18100, () => {
      this.playPianoNote(F2, 4.5, 0.30)
      this.playPianoNote(C3, 4.0, 0.22)
      this.playPianoNote(A3, 4.0, 0.22)
      this.playPianoNote(F4, 4.0, 0.34)
      this.playMusicBoxNote(C5, 3.0, 0.18)
    })

    // === GENTLE OUTRO / INTERLUDE ARPEGGIO ===
    schedule(19200, () => this.playMusicBoxNote(G4, 2.0, 0.14))
    schedule(19600, () => this.playMusicBoxNote(A4, 2.0, 0.16))
    schedule(20000, () => this.playMusicBoxNote(C5, 2.2, 0.18))
    schedule(20400, () => this.playMusicBoxNote(E5, 2.2, 0.18))
    schedule(20800, () => this.playMusicBoxNote(F5, 2.5, 0.20))

    // Dreamy soft waltz bridge before next loop
    schedule(21800, () => {
      this.playPianoNote(D3, 2.5, 0.18)
      this.playPianoNote(F3, 2.0, 0.14)
      this.playPianoNote(A3, 2.0, 0.14)
    })
    schedule(23000, () => {
      this.playPianoNote(Bb2, 2.5, 0.18)
      this.playPianoNote(F3, 2.0, 0.14)
      this.playPianoNote(D4, 2.0, 0.14)
    })
    schedule(24200, () => {
      this.playPianoNote(C3, 2.5, 0.18)
      this.playPianoNote(G3, 2.0, 0.14)
      this.playPianoNote(E4, 2.0, 0.14)
    })

    // Loop after 26 seconds
    schedule(26000, () => {
      if (this.isPlayingBgm) {
        this.playHappyBirthdaySong()
      }
    })
  }

  public startBGM() {
    if (this.isPlayingBgm) return
    this.isPlayingBgm = true

    // Try external audio file first if user provided an mp3
    if (this.audioEl && this.audioEl.src) {
      this.audioEl.play().catch(() => {
        // Fall back gracefully to synthesized piano arrangement
        this.initContext()
        this.playHappyBirthdaySong()
      })
    } else {
      this.initContext()
      this.playHappyBirthdaySong()
    }
  }

  public stopBGM() {
    this.isPlayingBgm = false
    this.bgmTimeouts.forEach((tid) => clearTimeout(tid))
    this.bgmTimeouts = []

    if (this.audioEl) {
      try {
        this.audioEl.pause()
      } catch {
        // ignore
      }
    }
  }

  public toggleBGM(): boolean {
    if (this.isPlayingBgm) {
      this.stopBGM()
    } else {
      this.startBGM()
    }
    return this.isPlayingBgm
  }

  public isBGMPlaying(): boolean {
    return this.isPlayingBgm
  }

  // SFX: Magical sparkle / shimmer
  public playSparkle() {
    if (this.isMuted) return
    this.initContext()
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playPianoNote(freq, 1.2, 0.15)
      }, idx * 60)
    })
  }

  // SFX: Candle blow out whoosh & bell
  public playCandleBlow() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime
    const bufferSize = this.ctx.sampleRate * 0.8
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.8)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    noise.start(now)
    noise.stop(now + 0.8)

    // Gentle sparkle bell chime after blowing
    setTimeout(() => {
      this.playSparkle()
    }, 700)
  }

  // SFX: Envelope seal snap / wax stamp break
  public playSealBreak() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.12)

    // Delicate fairy bell as envelope unfolds
    setTimeout(() => {
      this.playSparkle()
    }, 150)
  }

  // Backward compatibility alias methods
  public playPartyPopper() {
    this.playCandleBlow()
  }

  public playLetterOpen() {
    this.playSealBreak()
  }

  public playWindBlow() {
    this.playCandleBlow()
  }

  public playPhotoClick() {
    this.playSparkle()
  }

  public playChime() {
    this.playSparkle()
  }
}

export const audio = new AudioManager()
