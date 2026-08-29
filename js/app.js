/* ==========================================================================
   PETUALANGAN PINTAR - MAIN APP CONTROLLER & ROUTER
   Screen Navigation, UI Updates, Confetti Particles, and Modal Management
   ========================================================================== */

class AppController {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.confettiParticles = [];
    this.confettiActive = false;
  }

  init() {
    console.log("Initializing Petualangan Pintar...");

    // Initialize Piko Companion
    if (window.piko) {
      window.piko.init('piko-character-box', 'piko-bubble-text');
    }

    // Bind state changes to top bar and UI
    if (window.stateManager) {
      window.stateManager.onChange((data) => this.updateUI(data));
      this.updateUI(window.stateManager.data);
    }

    // Setup Confetti Engine
    this.initConfetti();

    // Check if user has already set profile before
    const profile = window.stateManager ? window.stateManager.data.profile : null;
    if (profile) {
      if (profile.name && profile.name !== 'Petualang Cilik') {
        const nameInput = document.getElementById('student-name-input');
        if (nameInput) nameInput.value = profile.name;
      }
      if (profile.avatar) {
        const previewEl = document.getElementById('opening-avatar-preview');
        if (previewEl) previewEl.textContent = profile.avatar;
        const matchingOpt = document.querySelector(`.avatar-opt[data-avatar="${profile.avatar}"]`);
        if (matchingOpt) {
          document.querySelectorAll('.avatar-opt').forEach(opt => opt.classList.remove('selected'));
          matchingOpt.classList.add('selected');
        }
      }
    }

    // Auto-detect device and responsive screen size
    this.initDeviceDetection();
  }

  // --- Automatic Device Detection & Layout Adaptation ---
  initDeviceDetection() {
    const updateDeviceClasses = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

      document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'orientation-portrait', 'orientation-landscape');

      if (w < 640) {
        document.body.classList.add('device-mobile');
      } else if (w < 1024) {
        document.body.classList.add('device-tablet');
      } else {
        document.body.classList.add('device-desktop');
      }

      if (w > h) {
        document.body.classList.add('orientation-landscape');
      } else {
        document.body.classList.add('orientation-portrait');
      }

      if (isTouch) {
        document.body.classList.add('touch-enabled');
      }

      // Update fullscreen button icon if in fullscreen
      const fsBtn = document.getElementById('btn-fullscreen');
      if (fsBtn) {
        const isFS = document.fullscreenElement || document.webkitFullscreenElement;
        fsBtn.textContent = isFS ? '🗗' : '⛶';
        fsBtn.title = isFS ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)';
      }
    };

    updateDeviceClasses();
    window.addEventListener('resize', updateDeviceClasses);
    window.addEventListener('orientationchange', updateDeviceClasses);
    document.addEventListener('fullscreenchange', updateDeviceClasses);
    document.addEventListener('webkitfullscreenchange', updateDeviceClasses);
  }

  // --- Toggle Fullscreen Mode (Ideal for Laptop & Tablet) ---
  toggleFullscreen() {
    if (window.audioEngine) window.audioEngine.playClick();

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const elem = document.getElementById('app-container') || document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.warn("Fullscreen request error:", err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.warn("Exit fullscreen error:", err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  // --- Screen Navigation Router ---
  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
      this.currentScreen = screenId;
    }

    if (window.audioEngine) {
      window.audioEngine.playClick();
    }

    // Contextual screen actions
    this.onScreenEnter(screenId);
  }

  onScreenEnter(screenId) {
    if (!window.stateManager) return;
    const data = window.stateManager.data;

    switch (screenId) {
      case 'screen-home':
        this.updateHomeProgress();
        if (window.audioEngine && data.settings.bgmEnabled) {
          window.audioEngine.startBGM();
        }
        if (window.piko) {
          window.piko.say(`Halo ${data.profile.name}! Mau bertualang ke mana hari ini?`, 'happy', true);
        }
        break;

      case 'screen-dunia-kata':
        this.renderKataLevels();
        if (window.piko) {
          window.piko.say('Selamat datang di Dunia Kata! Pilih petualangan membacamu!', 'idle', true);
        }
        break;

      case 'screen-dunia-angka':
        this.renderAngkaLevels();
        if (window.piko) {
          window.piko.say('Selamat datang di Dunia Angka! Ayo bermain dan berhitung bersama Piko!', 'idle', true);
        }
        break;

      case 'screen-achievements':
        if (window.achievementsEngine) {
          window.achievementsEngine.renderTrophyGrid();
        }
        break;

      case 'screen-profile':
        this.renderProfileStats();
        break;

      case 'screen-settings':
        this.renderSettingsValues();
        break;
    }
  }

  // --- Profile Registration Flow ---
  saveProfileAndStart() {
    const nameInput = document.getElementById('student-name-input');
    const selectedAvatar = document.querySelector('.avatar-opt.selected');

    const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Petualang Cilik';
    const avatar = selectedAvatar ? selectedAvatar.getAttribute('data-avatar') : '👦';

    if (window.stateManager) {
      window.stateManager.setProfile(name, avatar);
    }

    if (window.audioEngine) {
      window.audioEngine.init();
      if (window.stateManager.data.settings.bgmEnabled) {
        window.audioEngine.startBGM();
      }
    }

    this.showScreen('screen-home');
  }

  selectAvatar(el) {
    document.querySelectorAll('.avatar-opt').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');

    const avatar = el.getAttribute('data-avatar');
    const previewEl = document.getElementById('opening-avatar-preview');
    if (previewEl && avatar) {
      previewEl.textContent = avatar;
      previewEl.style.transform = 'scale(1.3) rotate(8deg)';
      setTimeout(() => {
        if (previewEl) {
          previewEl.style.transform = 'scale(1) rotate(0deg)';
        }
      }, 180);
    }

    if (window.audioEngine) window.audioEngine.playPop();
  }

  // --- Dynamic Level Maps Rendering ---
  renderKataLevels() {
    const data = window.stateManager.data.levels.kata;
    const topics = [
      { id: 'huruf', title: 'Mengenal Huruf A-Z', desc: 'Kartu fonetik & suara alfabet', icon: '🔤', bg: '#e0f2fe', color: '#0284c7' },
      { id: 'cari', title: 'Cari Huruf', desc: 'Mencari balon huruf tersembunyi', icon: '🎈', bg: '#fce7f3', color: '#be185d' },
      { id: 'cocok', title: 'Cocokkan Gambar', desc: 'Hubungkan gambar dengan kata', icon: '🖼️', bg: '#fef3c7', color: '#b45309' },
      { id: 'susun', title: 'Susun Kata', desc: 'Susun huruf menjadi kata yang tepat', icon: '🧩', bg: '#ede9fe', color: '#6d28d9' },
      { id: 'quiz', title: 'Quiz Membaca', desc: 'Uji kemampuan membacamu!', icon: '📝', bg: '#dcfce7', color: '#15803d' }
    ];

    const listEl = document.getElementById('kata-levels-list');
    if (!listEl) return;

    let html = '';
    topics.forEach((t) => {
      const lvl = data[t.id] || { unlocked: true, stars: 0, completed: false };
      const isLocked = !lvl.unlocked;

      let starsHTML = '';
      for (let i = 1; i <= 3; i++) {
        starsHTML += `<span class="${i <= lvl.stars ? 'star-filled' : 'star-empty'}">⭐</span>`;
      }

      html += `
        <div class="level-topic-card ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : `window.app.openKataActivity('${t.id}')`}">
          <div class="topic-badge-icon" style="background: ${t.bg}; color: ${t.color};">
            ${isLocked ? '🔒' : t.icon}
          </div>
          <div class="topic-details">
            <div class="topic-title">${t.title}</div>
            <div class="topic-subtitle">${t.desc}</div>
            <div class="topic-stars-status">
              ${starsHTML}
            </div>
          </div>
          <div class="world-arrow-btn">➔</div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  renderAngkaLevels() {
    const data = window.stateManager.data.levels.angka;
    const topics = [
      { id: 'mengenal', title: 'Mengenal Angka 1-10', desc: 'Ketuk benda untuk berhitung', icon: '🔢', bg: '#dcfce7', color: '#15803d' },
      { id: 'hitung', title: 'Hitung Benda', desc: 'Hitung jumlah benda lucu di layar', icon: '🍎', bg: '#fee2e2', color: '#b91c1c' },
      { id: 'urut', title: 'Urutkan Angka', desc: 'Lengkapi gerbong kereta angka', icon: '🚂', bg: '#e0f2fe', color: '#0284c7' },
      { id: 'tambah', title: 'Penjumlahan', desc: 'Belajar menjumlahkan benda konkret', icon: '➕', bg: '#fef3c7', color: '#b45309' },
      { id: 'kurang', title: 'Pengurangan', desc: 'Coret benda dan hitung sisanya', icon: '➖', bg: '#ffedd5', color: '#c2410c' },
      { id: 'tangkap', title: 'Tangkap Angka', desc: 'Mini arcade tangkap angka keranjang', icon: '🧺', bg: '#ede9fe', color: '#6d28d9' },
      { id: 'quiz', title: 'Quiz Berhitung', desc: 'Uji kemampuan matematikamu!', icon: '📝', bg: '#fce7f3', color: '#be185d' }
    ];

    const listEl = document.getElementById('angka-levels-list');
    if (!listEl) return;

    let html = '';
    topics.forEach((t) => {
      const lvl = data[t.id] || { unlocked: true, stars: 0, completed: false };
      const isLocked = !lvl.unlocked;

      let starsHTML = '';
      for (let i = 1; i <= 3; i++) {
        starsHTML += `<span class="${i <= lvl.stars ? 'star-filled' : 'star-empty'}">⭐</span>`;
      }

      html += `
        <div class="level-topic-card ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : `window.app.openAngkaActivity('${t.id}')`}">
          <div class="topic-badge-icon" style="background: ${t.bg}; color: ${t.color};">
            ${isLocked ? '🔒' : t.icon}
          </div>
          <div class="topic-details">
            <div class="topic-title">${t.title}</div>
            <div class="topic-subtitle">${t.desc}</div>
            <div class="topic-stars-status">
              ${starsHTML}
            </div>
          </div>
          <div class="world-arrow-btn">➔</div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  // --- Open Game Arena ---
  openKataActivity(topicId) {
    this.showScreen('screen-kata-play');
    if (window.duniaKata) {
      window.duniaKata.startActivity(topicId);
    }
  }

  openAngkaActivity(topicId) {
    this.showScreen('screen-angka-play');
    if (window.duniaAngka) {
      window.duniaAngka.startActivity(topicId);
    }
  }

  // --- Update Top Bar & Home Stats ---
  updateUI(data) {
    // Star Counters
    document.querySelectorAll('.star-count-text').forEach(el => {
      el.textContent = data.stars;
    });

    // Avatar Badges
    document.querySelectorAll('.avatar-badge').forEach(el => {
      el.textContent = data.profile.avatar || '👦';
    });

    // Student Names
    document.querySelectorAll('.user-name-display').forEach(el => {
      el.textContent = data.profile.name || 'Petualang Cilik';
    });
  }

  updateHomeProgress() {
    if (!window.stateManager) return;
    const stats = window.stateManager.getProgressStats();

    const kataBar = document.getElementById('home-progress-kata');
    if (kataBar) kataBar.style.width = `${stats.kataPercent}%`;

    const angkaBar = document.getElementById('home-progress-angka');
    if (angkaBar) angkaBar.style.width = `${stats.angkaPercent}%`;

    const kataDesc = document.getElementById('home-desc-kata');
    if (kataDesc) kataDesc.textContent = `${stats.kataDone}/${stats.kataTotal} Level Selesai (${stats.kataPercent}%)`;

    const angkaDesc = document.getElementById('home-desc-angka');
    if (angkaDesc) angkaDesc.textContent = `${stats.angkaDone}/${stats.angkaTotal} Level Selesai (${stats.angkaPercent}%)`;
  }

  renderProfileStats() {
    if (!window.stateManager) return;
    const data = window.stateManager.data;
    const stats = window.stateManager.getProgressStats();

    document.getElementById('prof-avatar-big').textContent = data.profile.avatar;
    document.getElementById('prof-name-big').textContent = data.profile.name;
    document.getElementById('prof-stars-total').textContent = `${data.stars} ⭐`;
    document.getElementById('prof-kata-percent').textContent = `${stats.kataPercent}%`;
    document.getElementById('prof-angka-percent').textContent = `${stats.angkaPercent}%`;
    document.getElementById('prof-games-played').textContent = `${data.stats.totalGamesPlayed} Kali`;
    document.getElementById('prof-achievements-count').textContent = `${stats.achievementsUnlocked} / 12 Lencana`;
  }

  renderSettingsValues() {
    if (!window.stateManager) return;
    const settings = window.stateManager.data.settings;

    const bgmToggle = document.getElementById('setting-bgm-toggle');
    if (bgmToggle) bgmToggle.checked = settings.bgmEnabled;

    const sfxToggle = document.getElementById('setting-sfx-toggle');
    if (sfxToggle) sfxToggle.checked = settings.sfxEnabled;

    const voiceToggle = document.getElementById('setting-voice-toggle');
    if (voiceToggle) voiceToggle.checked = settings.voiceEnabled;
  }

  toggleBGM(enabled) {
    if (window.stateManager) {
      window.stateManager.updateSettings({ bgmEnabled: enabled });
    }
    if (window.audioEngine) {
      if (enabled) window.audioEngine.startBGM();
      else window.audioEngine.stopBGM();
    }
  }

  toggleSFX(enabled) {
    if (window.stateManager) {
      window.stateManager.updateSettings({ sfxEnabled: enabled });
    }
    if (window.audioEngine) {
      window.audioEngine.setSFXVolume(enabled ? 0.8 : 0);
    }
  }

  toggleVoice(enabled) {
    if (window.stateManager) {
      window.stateManager.updateSettings({ voiceEnabled: enabled });
    }
  }

  confirmResetProgress() {
    if (confirm("Apakah kamu yakin ingin mengulang semua bintang dan petualangan dari awal?")) {
      if (window.stateManager) {
        window.stateManager.resetAllProgress();
      }
      this.showScreen('screen-splash');
    }
  }

  closeLevelVictoryModal() {
    const modal = document.getElementById('modal-level-complete');
    if (modal) modal.classList.remove('active');

    // Return to the corresponding world map
    if (this.currentScreen === 'screen-kata-play') {
      this.showScreen('screen-dunia-kata');
    } else if (this.currentScreen === 'screen-angka-play') {
      this.showScreen('screen-dunia-angka');
    }
  }

  /* --------------------------------------------------------------------------
     CONFETTI PARTICLE CELEBRATION ENGINE
     -------------------------------------------------------------------------- */
  initConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.resizeConfettiCanvas();
    window.addEventListener('resize', () => this.resizeConfettiCanvas());
  }

  resizeConfettiCanvas() {
    if (!this.confettiCanvas) return;
    const container = document.getElementById('app-container');
    if (container) {
      this.confettiCanvas.width = container.clientWidth;
      this.confettiCanvas.height = container.clientHeight;
    }
  }

  fireConfetti() {
    if (!this.confettiCanvas || !this.confettiCtx) return;
    this.resizeConfettiCanvas();
    this.confettiParticles = [];

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#fde047'];
    const count = 75;

    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: this.confettiCanvas.width / 2 + (Math.random() * 40 - 20),
        y: this.confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 18,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.45,
        alpha: 1
      });
    }

    if (!this.confettiActive) {
      this.confettiActive = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiActive || !this.confettiCtx) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.009;

      this.confettiCtx.save();
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.globalAlpha = Math.max(0, p.alpha);
      this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.confettiCtx.restore();

      if (p.y > this.confettiCanvas.height || p.alpha <= 0) {
        this.confettiParticles.splice(i, 1);
      }
    }

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiActive = false;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }
}

// Instantiate and bind onload
window.app = new AppController();
window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
