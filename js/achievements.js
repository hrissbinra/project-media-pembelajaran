/* ==========================================================================
   PETUALANGAN PINTAR - ACHIEVEMENTS & BADGES SYSTEM
   Trophy Room, Badge Unlocks, Confetti Celebrations, and Certificate
   ========================================================================== */

const ACHIEVEMENTS_DATA = [
  {
    id: 'langkah_pertama',
    icon: '🌟',
    title: 'Langkah Pertama',
    desc: 'Memulai petualangan belajar di Petualangan Pintar!'
  },
  {
    id: 'sahabat_piko',
    icon: '🤝',
    title: 'Sahabat Piko',
    desc: 'Menyapa dan mengetuk Piko sebanyak 5 kali.'
  },
  {
    id: 'penjelajah_huruf',
    icon: '🔤',
    title: 'Penjelajah Huruf',
    desc: 'Mengenal dan mendengarkan 10 huruf pertama di Dunia Kata.'
  },
  {
    id: 'master_alfabet',
    icon: '👑',
    title: 'Master Alfabet',
    desc: 'Membuka seluruh huruf A sampai Z dengan lengkap.'
  },
  {
    id: 'pemburu_huruf',
    icon: '🎈',
    title: 'Pemburu Huruf',
    desc: 'Menemukan huruf yang tepat di permainan Cari Huruf.'
  },
  {
    id: 'susun_kata_hebat',
    icon: '🧩',
    title: 'Jago Susun Kata',
    desc: 'Berhasil menyusun huruf menjadi kata yang sempurna.'
  },
  {
    id: 'bintang_membaca',
    icon: '📖',
    title: 'Bintang Membaca',
    desc: 'Menyelesaikan Quiz Membaca di Dunia Kata!'
  },
  {
    id: 'hitung_benda_ahli',
    icon: '🍎',
    title: 'Ahli Hitung Benda',
    desc: 'Menghitung benda dengan teliti dan benar.'
  },
  {
    id: 'pakar_angka',
    icon: '🔢',
    title: 'Pakar Angka 1-20',
    desc: 'Mengenal konsep angka 1 sampai 20 di Dunia Angka.'
  },
  {
    id: 'jago_tambah_kurang',
    icon: '➕',
    title: 'Jago Tambah Kurang',
    desc: 'Menyelesaikan tantangan penjumlahan & pengurangan.'
  },
  {
    id: 'penangkap_angka',
    icon: '🧺',
    title: 'Penangkap Angka',
    desc: 'Menangkap angka yang benar di game arcade Tangkap Angka!'
  },
  {
    id: 'bintang_50',
    icon: '⭐',
    title: 'Kolektor 50 Bintang',
    desc: 'Mengumpulkan 50 bintang emas dari berbagai permainan.'
  },
  {
    id: 'bintang_100',
    icon: '🏆',
    title: 'Bintang Gemilang 100',
    desc: 'Mengumpulkan 100 bintang emas! Kamu luar biasa!'
  }
];

class AchievementsEngine {
  constructor() {
    this.badges = ACHIEVEMENTS_DATA;
  }

  getBadge(id) {
    return this.badges.find(b => b.id === id);
  }

  renderTrophyGrid(containerId = 'achievements-grid-container') {
    const container = document.getElementById(containerId);
    if (!container || !window.stateManager) return;

    const unlockedList = window.stateManager.data.achievements;
    let html = '';

    this.badges.forEach(badge => {
      const isUnlocked = unlockedList.includes(badge.id);
      html += `
        <div class="badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon-box">
            ${badge.icon}
          </div>
          <div class="badge-title">${badge.title}</div>
          <div class="badge-desc">${badge.desc}</div>
          <div style="font-size: 0.75rem; font-weight: 800; color: ${isUnlocked ? '#16a34a' : '#94a3b8'}; margin-top: 4px;">
            ${isUnlocked ? '✓ Terbuka' : '🔒 Terkunci'}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  showUnlockModal(badgeId) {
    const badge = this.getBadge(badgeId);
    if (!badge) return;

    if (window.audioEngine) {
      window.audioEngine.playBadge();
    }

    if (window.app && window.app.fireConfetti) {
      window.app.fireConfetti();
    }

    const modal = document.getElementById('modal-achievement');
    if (modal) {
      document.getElementById('modal-badge-icon').textContent = badge.icon;
      document.getElementById('modal-badge-title').textContent = badge.title;
      document.getElementById('modal-badge-desc').textContent = badge.desc;
      modal.classList.add('active');
    }
  }

  closeUnlockModal() {
    const modal = document.getElementById('modal-achievement');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // Generate Certificate Data for Print/Display
  showCertificate() {
    if (!window.stateManager) return;
    const profile = window.stateManager.data.profile;
    const stars = window.stateManager.data.stars;
    const stats = window.stateManager.getProgressStats();

    const certModal = document.getElementById('modal-certificate');
    if (certModal) {
      document.getElementById('cert-student-name').textContent = profile.name || 'Siswa Pintar';
      document.getElementById('cert-avatar').textContent = profile.avatar;
      document.getElementById('cert-stars').textContent = `${stars} ⭐`;
      document.getElementById('cert-date').textContent = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      certModal.classList.add('active');
    }
  }

  closeCertificate() {
    const certModal = document.getElementById('modal-certificate');
    if (certModal) {
      certModal.classList.remove('active');
    }
  }
}

// Global Singleton Instance
window.achievementsEngine = new AchievementsEngine();
