/* ==========================================================================
   PETUALANGAN PINTAR - STATE MANAGEMENT (Local Storage & Reactive Data)
   Tracks student progress, stars, levels unlocked, stats, and achievements
   ========================================================================== */

const STORAGE_KEY = 'PETUALANGAN_PINTAR_DATA_V1';

const DEFAULT_STATE = {
  profile: {
    name: 'Petualang Cilik',
    avatar: '👦',
    gender: 'boy',
    joinedDate: new Date().toISOString()
  },
  stars: 0,
  levels: {
    kata: {
      huruf: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      cari: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      cocok: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      susun: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      quiz: { unlocked: true, stars: 0, highestScore: 0, completed: false }
    },
    angka: {
      mengenal: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      hitung: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      urut: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      tambah: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      kurang: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      tangkap: { unlocked: true, stars: 0, highestScore: 0, completed: false },
      quiz: { unlocked: true, stars: 0, highestScore: 0, completed: false }
    }
  },
  achievements: [
    'langkah_pertama' // First achievement granted on start
  ],
  stats: {
    totalWordsRead: 0,
    totalMathSolved: 0,
    totalGamesPlayed: 0,
    quizzesPassed: 0,
    pikoTaps: 0
  },
  settings: {
    bgmVolume: 0.4,
    bgmEnabled: true,
    sfxVolume: 0.8,
    sfxEnabled: true,
    voiceEnabled: true
  }
};

class StateManager {
  constructor() {
    this.data = this.load();
    this.listeners = [];
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with DEFAULT_STATE to safeguard newly added fields
        return {
          ...DEFAULT_STATE,
          ...parsed,
          profile: { ...DEFAULT_STATE.profile, ...parsed.profile },
          levels: {
            kata: { ...DEFAULT_STATE.levels.kata, ...(parsed.levels ? parsed.levels.kata : {}) },
            angka: { ...DEFAULT_STATE.levels.angka, ...(parsed.levels ? parsed.levels.angka : {}) }
          },
          stats: { ...DEFAULT_STATE.stats, ...parsed.stats },
          settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : DEFAULT_STATE.achievements
        };
      }
    } catch (e) {
      console.warn("Error reading localStorage, reverting to defaults:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
    } catch (e) {
      console.error("Error saving state:", e);
    }
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.data);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  // --- Profile Helpers ---
  setProfile(name, avatar) {
    if (name) this.data.profile.name = name.trim();
    if (avatar) this.data.profile.avatar = avatar;
    this.save();
  }

  // --- Star & Progress Helpers ---
  addStars(amount) {
    const gained = Math.max(0, parseInt(amount, 10) || 0);
    this.data.stars += gained;
    this.save();

    // Check star thresholds for achievements
    if (this.data.stars >= 50) {
      this.unlockAchievement('bintang_50');
    }
    if (this.data.stars >= 100) {
      this.unlockAchievement('bintang_100');
    }
    return this.data.stars;
  }

  completeLevel(world, topicId, starsEarned = 3, score = 100) {
    if (!this.data.levels[world] || !this.data.levels[world][topicId]) return;

    const current = this.data.levels[world][topicId];
    current.completed = true;
    current.stars = Math.max(current.stars, starsEarned);
    current.highestScore = Math.max(current.highestScore, score);

    this.data.stats.totalGamesPlayed++;

    if (world === 'kata') {
      this.data.stats.totalWordsRead += 5;
    } else if (world === 'angka') {
      this.data.stats.totalMathSolved += 5;
    }

    // Auto unlock the next topic in world
    const keys = Object.keys(this.data.levels[world]);
    const currentIndex = keys.indexOf(topicId);
    if (currentIndex >= 0 && currentIndex + 1 < keys.length) {
      const nextKey = keys[currentIndex + 1];
      this.data.levels[world][nextKey].unlocked = true;
    }

    this.save();
  }

  incrementPikoTap() {
    this.data.stats.pikoTaps++;
    if (this.data.stats.pikoTaps >= 5) {
      this.unlockAchievement('sahabat_piko');
    }
    this.save();
  }

  // --- Achievements Helpers ---
  unlockAchievement(achievementId) {
    if (!this.data.achievements.includes(achievementId)) {
      this.data.achievements.push(achievementId);
      this.save();

      // Trigger achievement popup event
      if (window.achievementsEngine) {
        window.achievementsEngine.showUnlockModal(achievementId);
      }
    }
  }

  hasAchievement(achievementId) {
    return this.data.achievements.includes(achievementId);
  }

  // --- Summary Progress Calculations ---
  getProgressStats() {
    // Calculate Kata completion
    const kataKeys = Object.keys(this.data.levels.kata);
    const kataDone = kataKeys.filter(k => this.data.levels.kata[k].completed).length;
    const kataPercent = Math.round((kataDone / kataKeys.length) * 100);

    // Calculate Angka completion
    const angkaKeys = Object.keys(this.data.levels.angka);
    const angkaDone = angkaKeys.filter(k => this.data.levels.angka[k].completed).length;
    const angkaPercent = Math.round((angkaDone / angkaKeys.length) * 100);

    // Total stars from levels
    let levelStars = 0;
    kataKeys.forEach(k => levelStars += this.data.levels.kata[k].stars);
    angkaKeys.forEach(k => levelStars += this.data.levels.angka[k].stars);

    return {
      kataPercent,
      angkaPercent,
      kataDone,
      kataTotal: kataKeys.length,
      angkaDone,
      angkaTotal: angkaKeys.length,
      levelStars,
      totalStars: this.data.stars,
      achievementsUnlocked: this.data.achievements.length
    };
  }

  // --- Settings ---
  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
  }

  resetAllProgress() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
}

// Global Singleton Instance
window.stateManager = new StateManager();
