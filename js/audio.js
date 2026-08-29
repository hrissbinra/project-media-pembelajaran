/* ==========================================================================
   PETUALANGAN PINTAR - AUDIO ENGINE (Web Audio API & Web Speech API)
   Synthesizer SFX, Cheerful BGM, and Indonesian Voice Narration
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.speechSynth = window.speechSynthesis || null;
    this.idVoice = null;
    this.isInitialized = false;

    // Load available speech voices
    if (this.speechSynth) {
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this.initVoice();
      }
      this.initVoice();
    }
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // BGM Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.isInitialized = true;
      console.log("Audio Engine initialized successfully!");
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initVoice() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices();
    // Prioritize Indonesian voices (id-ID)
    this.idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID')) ||
                   voices.find(v => v.lang.startsWith('id')) ||
                   voices.find(v => v.default) ||
                   voices[0];
  }

  setBGMVolume(volume) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  setSFXVolume(volume) {
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  /* --------------------------------------------------------------------------
     SFX PROCEDURAL SYNTHESIS (Clean, child-friendly cartoon sounds)
     -------------------------------------------------------------------------- */
  playTone(freq, type = 'sine', duration = 0.15, startTime = 0, gainLevel = 0.5) {
    if (!this.ctx || !this.sfxGain) return;
    this.resumeContext();

    const t = this.ctx.currentTime + startTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(gainLevel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // 1. Button Pop / Tap
  playClick() {
    if (!this.ctx) this.init();
    this.playTone(520, 'sine', 0.08, 0, 0.4);
    this.playTone(780, 'triangle', 0.06, 0.03, 0.3);
  }

  // 2. Bubble Pop
  playPop() {
    if (!this.ctx) this.init();
    this.playTone(400, 'sine', 0.04, 0, 0.5);
    this.playTone(900, 'sine', 0.08, 0.02, 0.4);
  }

  // 3. Correct Answer Fanfare / Chime (Joyous)
  playCorrect() {
    if (!this.ctx) this.init();
    const now = 0;
    // Major chord arpeggio: C5, E5, G5, C6
    this.playTone(523.25, 'triangle', 0.2, now, 0.4);
    this.playTone(659.25, 'triangle', 0.2, now + 0.1, 0.45);
    this.playTone(783.99, 'triangle', 0.25, now + 0.2, 0.5);
    this.playTone(1046.50, 'sine', 0.45, now + 0.32, 0.6);
  }

  // 4. Star Collect Ping
  playStar() {
    if (!this.ctx) this.init();
    this.playTone(1046.50, 'sine', 0.15, 0, 0.4);
    this.playTone(1318.51, 'sine', 0.18, 0.08, 0.5);
    this.playTone(1567.98, 'sine', 0.3, 0.16, 0.6);
  }

  // 5. Gentle Retry / Encourage Boing (Never harsh or scary)
  playIncorrect() {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resumeContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.3);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // 6. Level Complete Grand Celebration
  playLevelComplete() {
    if (!this.ctx) this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.35, idx * 0.1, 0.4);
    });
    // Final long chord
    setTimeout(() => {
      this.playTone(1046.50, 'sine', 0.8, 0, 0.5);
      this.playTone(1318.51, 'sine', 0.8, 0, 0.4);
      this.playTone(1567.98, 'sine', 0.8, 0, 0.4);
    }, 650);
  }

  // 7. Achievement / Badge Unlock Chime
  playBadge() {
    if (!this.ctx) this.init();
    const bells = [880, 1174.66, 1318.51, 1760];
    bells.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.4, idx * 0.12, 0.5);
    });
  }

  // 8. Snap / Drag Tile
  playSnap() {
    if (!this.ctx) this.init();
    this.playTone(600, 'triangle', 0.05, 0, 0.3);
  }

  // 9. Train Whistle (For number ordering)
  playTrainWhistle() {
    if (!this.ctx) this.init();
    this.playTone(587.33, 'triangle', 0.3, 0, 0.35);
    this.playTone(739.99, 'triangle', 0.3, 0.02, 0.35);
    this.playTone(587.33, 'triangle', 0.4, 0.35, 0.4);
    this.playTone(739.99, 'triangle', 0.4, 0.37, 0.4);
  }

  /* --------------------------------------------------------------------------
     CHEERFUL BACKGROUND MUSIC (BGM) SYNTHESIZER
     Procedural, cheerful, upbeat adventure loop
     -------------------------------------------------------------------------- */
  startBGM() {
    if (this.bgmPlaying) return;
    if (!this.ctx) this.init();
    this.resumeContext();
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // Melody sequence in C Major / Pentatonic (Upbeat, cheerful)
    // Notes: C4=261.63, D4=293.66, E4=329.63, G4=392.00, A4=440.00, C5=523.25
    const melody = [
      523.25, 0, 392.00, 440.00, 523.25, 659.25, 523.25, 0,
      392.00, 440.00, 523.25, 0, 440.00, 392.00, 329.63, 0,
      523.25, 0, 392.00, 440.00, 523.25, 659.25, 783.99, 659.25,
      523.25, 440.00, 392.00, 0, 523.25, 0, 0, 0
    ];

    const bass = [
      261.63, 261.63, 329.63, 329.63, 392.00, 392.00, 261.63, 261.63,
      220.00, 220.00, 261.63, 261.63, 392.00, 392.00, 261.63, 261.63,
      261.63, 261.63, 329.63, 329.63, 392.00, 392.00, 261.63, 261.63,
      220.00, 220.00, 392.00, 392.00, 261.63, 261.63, 261.63, 261.63
    ];

    const tempo = 220; // ms per step (~136 BPM)

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGain) return;

      const mNote = melody[this.bgmStep % melody.length];
      const bNote = bass[this.bgmStep % bass.length];

      // Play melody note
      if (mNote > 0) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(mNote, t);

        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(g);
        g.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + 0.2);
      }

      // Play bass note every 2 steps
      if (this.bgmStep % 2 === 0 && bNote > 0) {
        const t = this.ctx.currentTime;
        const oscB = this.ctx.createOscillator();
        const gB = this.ctx.createGain();

        oscB.type = 'triangle';
        oscB.frequency.setValueAtTime(bNote * 0.5, t); // Octave lower bass

        gB.gain.setValueAtTime(0.14, t);
        gB.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        oscB.connect(gB);
        gB.connect(this.bgmGain);

        oscB.start(t);
        oscB.stop(t + 0.35);
      }

      this.bgmStep++;
    }, tempo);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  /* --------------------------------------------------------------------------
     INDONESIAN TEXT-TO-SPEECH (TTS) NARRATION
     -------------------------------------------------------------------------- */
  speak(text, onEndCallback = null) {
    if (!this.speechSynth || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      // Cancel ongoing speech
      this.speechSynth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95; // Friendly child pace
      utterance.pitch = 1.2; // Bright cheerful child-like pitch
      utterance.volume = 1.0;

      if (this.idVoice) {
        utterance.voice = this.idVoice;
      }

      if (onEndCallback) {
        utterance.onend = () => onEndCallback();
        utterance.onerror = () => onEndCallback();
      }

      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      if (onEndCallback) onEndCallback();
    }
  }

  // Spell letters phonetically for children
  spellLetter(letter, exampleWord = "") {
    let speakText = `Huruf ${letter}.`;
    if (exampleWord) {
      speakText += ` ${letter} untuk ${exampleWord}!`;
    }
    this.speak(speakText);
  }

  // Pronounce number clearly
  spellNumber(number, countNoun = "") {
    const numberWords = [
      "Nol", "Satu", "Dua", "Tiga", "Empat", "Lima",
      "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh",
      "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
      "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas", "Dua Puluh"
    ];
    const word = numberWords[number] || `${number}`;
    let speakText = `${word}.`;
    if (countNoun) {
      speakText = `${word} ${countNoun}.`;
    }
    this.speak(speakText);
  }
}

// Global Singleton Instance
window.audioEngine = new AudioEngine();
