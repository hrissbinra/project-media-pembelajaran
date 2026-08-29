/* ==========================================================================
   PETUALANGAN PINTAR - DUNIA ANGKA (Berhitung Dasar SD Kelas 1)
   6+ Interactive Sub-modules: Mengenal Angka, Hitung Benda, Urutkan Angka, 
   Penjumlahan, Pengurangan, Tangkap Angka, Quiz Berhitung
   ========================================================================== */

const NUMBER_ITEMS = [
  { num: 1, name: 'Satu', icon: '🍎' },
  { num: 2, name: 'Dua', icon: '⚽' },
  { num: 3, name: 'Tiga', icon: '⭐' },
  { num: 4, name: 'Empat', icon: '🌸' },
  { num: 5, name: 'Lima', icon: '🐱' },
  { num: 6, name: 'Enam', icon: '🚗' },
  { num: 7, name: 'Tujuh', icon: '🎈' },
  { num: 8, name: 'Delapan', icon: '🍓' },
  { num: 9, name: 'Sembilan', icon: '🦆' },
  { num: 10, name: 'Sepuluh', icon: '🍭' }
];

class DuniaAngkaManager {
  constructor() {
    this.currentTopic = null;
    this.currentNumberIndex = 0;
    this.tapCount = 0;
    this.hitungRound = 1;
    this.urutRound = 1;
    this.tambahRound = 1;
    this.kurangRound = 1;
    this.arcadeScore = 0;
    this.arcadeActive = false;
    this.arcadeTimer = null;
    this.arcadeBasketX = 50; // percentage
    this.quizScore = 0;
    this.quizIndex = 0;
    this.quizQuestions = [];
  }

  startActivity(topicId) {
    this.currentTopic = topicId;
    this.stopArcade();
    const arena = document.getElementById('angka-activity-arena');
    if (!arena) return;

    switch (topicId) {
      case 'mengenal':
        this.initMengenalAngka(0);
        break;
      case 'hitung':
        this.initHitungBenda(1);
        break;
      case 'urut':
        this.initUrutkanAngka(1);
        break;
      case 'tambah':
        this.initPenjumlahan(1);
        break;
      case 'kurang':
        this.initPengurangan(1);
        break;
      case 'tangkap':
        this.initTangkapAngka();
        break;
      case 'quiz':
        this.initQuizBerhitung();
        break;
    }
  }

  /* --------------------------------------------------------------------------
     1. MENGENAL ANGKA (1 - 10 WITH TAP-TO-COUNT)
     -------------------------------------------------------------------------- */
  initMengenalAngka(index = 0) {
    this.currentNumberIndex = (index + NUMBER_ITEMS.length) % NUMBER_ITEMS.length;
    const item = NUMBER_ITEMS[this.currentNumberIndex];
    this.tapCount = 0;
    const arena = document.getElementById('angka-activity-arena');

    if (window.piko) {
      window.piko.say(`Ini adalah angka ${item.num} (${item.name}). Ketuk setiap ${item.icon} untuk berhitung ya!`, 'idle', true);
    }

    if (this.currentNumberIndex === 9 && window.stateManager) {
      window.stateManager.unlockAchievement('pakar_angka');
    }

    // Generate countable objects
    let objectsHTML = '';
    for (let i = 1; i <= item.num; i++) {
      objectsHTML += `
        <div class="countable-item" id="count-item-${i}" onclick="window.duniaAngka.handleCountItemTap(${i}, ${item.num})">
          ${item.icon}
        </div>
      `;
    }

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Angka ${item.num} dari 10</span>
        <button class="btn-cartoon btn-yellow btn-icon-only" onclick="window.duniaAngka.pronounceCurrentNumber();" title="Dengarkan Angka">
          🔊
        </button>
      </div>

      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px;">
        <span style="font-family: var(--font-display); font-size: 4.8rem; font-weight: 900; color: #16a34a; line-height: 1;">
          ${item.num}
        </span>
        <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: #15803d;">
          ${item.name}
        </span>
      </div>

      <div class="interactive-scene-box" style="min-height: 160px; max-height: 240px; overflow-y: auto;">
        ${objectsHTML}
      </div>

      <p style="font-weight: 700; color: #64748b; font-size: 0.95rem; text-align: center;">
        Ketuk benda di atas untuk menghitung sampai <strong style="color: #16a34a;">${item.num}</strong>!
      </p>

      <div style="display: flex; justify-content: space-between; width: 100%; gap: 12px; margin-top: auto;">
        <button class="btn-cartoon btn-primary" onclick="window.duniaAngka.prevNumber();" style="flex: 1;">
          ◀ Sebelumnya
        </button>
        <button class="btn-cartoon btn-green" onclick="window.duniaAngka.nextNumber();" style="flex: 1;">
          Berikutnya ▶
        </button>
      </div>
    `;

    if (window.stateManager) {
      window.stateManager.completeLevel('angka', 'mengenal', 3, 100);
    }
  }

  handleCountItemTap(index, total) {
    const el = document.getElementById('count-item-${index}');
    if (el && !el.classList.contains('counted')) {
      el.classList.add('counted');
      if (window.audioEngine) {
        window.audioEngine.spellNumber(index);
        window.audioEngine.playPop();
      }
      this.tapCount++;

      if (this.tapCount === total) {
        if (window.audioEngine) window.audioEngine.playCorrect();
        if (window.piko) window.piko.say('Hebat! Semuanya ada ${total}!', 'happy', false);
        if (window.stateManager) window.stateManager.addStars(5);
      }
    }
  }

  pronounceCurrentNumber() {
    const item = NUMBER_ITEMS[this.currentNumberIndex];
    if (window.audioEngine) {
      window.audioEngine.spellNumber(item.num, item.name);
    }
  }

  nextNumber() {
    if (window.audioEngine) window.audioEngine.playClick();
    this.initMengenalAngka(this.currentNumberIndex + 1);
  }

  prevNumber() {
    if (window.audioEngine) window.audioEngine.playClick();
    this.initMengenalAngka(this.currentNumberIndex - 1);
  }

  /* --------------------------------------------------------------------------
     2. HITUNG BENDA (COUNTING OBJECTS SCENE)
     -------------------------------------------------------------------------- */
  initHitungBenda(round = 1) {
    this.hitungRound = round;
    const arena = document.getElementById('angka-activity-arena');

    // Pick random count between 3 and 12
    const targetCount = Math.floor(Math.random() * 8) + 3;
    const itemData = NUMBER_ITEMS[Math.floor(Math.random() * 8)];

    // Generate 3 unique answer choices
    let choices = [targetCount];
    while (choices.length < 3) {
      let r = targetCount + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      if (r > 0 && !choices.includes(r)) {
        choices.push(r);
      }
    }
    choices.sort(() => 0.5 - Math.random());

    if (window.piko) {
      window.piko.say(`Berapa banyak ${itemData.icon} yang ada di kotak? Ayo hitung!`, 'thinking', true);
    }

    let itemsHTML = '';
    for (let i = 1; i <= targetCount; i++) {
      itemsHTML += `
        <div class="countable-item" onclick="this.classList.toggle('counted'); window.audioEngine.playPop();">
          ${itemData.icon}
        </div>
      `;
    }

    let buttonsHTML = choices.map(c => `
      <button class="option-choice-card" onclick="window.duniaAngka.handleHitungAnswer(this, ${targetCount}, ${c})">
        <span class="option-text-large" style="font-size: 2.2rem; color: #0284c7;">${c}</span>
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Soal ${round} dari 4</span>
      </div>

      <div class="game-question-prompt">
        Berapa jumlah benda di bawah ini?
      </div>

      <div class="interactive-scene-box" style="min-height: 160px; max-height: 220px; overflow-y: auto;">
        ${itemsHTML}
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%;">
        ${buttonsHTML}
      </div>
    `;
  }

  handleHitungAnswer(btn, targetCount, selected) {
    if (targetCount === selected) {
      btn.classList.add('correct-flash');
      if (window.audioEngine) {
        window.audioEngine.playCorrect();
        window.audioEngine.speak(`Benar! Jumlahnya ada ${targetCount}!`);
      }
      if (window.piko) {
        window.piko.say(`Tepat sekali! Jumlahnya ${targetCount}! +10 ⭐`, 'happy', false);
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
        window.stateManager.unlockAchievement('hitung_benda_ahli');
      }

      setTimeout(() => {
        if (this.hitungRound < 4) {
          this.initHitungBenda(this.hitungRound + 1);
        } else {
          this.showVictoryModal('Hitung Benda Selesai!', 'Kamu sangat teliti dan jago berhitung!', 3, 40);
          if (window.stateManager) {
            window.stateManager.completeLevel('angka', 'hitung', 3, 100);
          }
        }
      }, 1200);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) {
        window.audioEngine.playIncorrect();
        window.audioEngine.speak('Belum tepat. Coba ketuk dan hitung satu per satu ya!');
      }
      if (window.piko) {
        window.piko.say('Belum tepat. Ketuk bendanya satu per satu untuk berhitung!', 'encourage', false);
      }
      setTimeout(() => btn.classList.remove('wrong-shake'), 500);
    }
  }

  /* --------------------------------------------------------------------------
     3. URUTKAN ANGKA (TRAIN WAGON SEQUENCE PUZZLE)
     -------------------------------------------------------------------------- */
  initUrutkanAngka(round = 1) {
    this.urutRound = round;
    const arena = document.getElementById('angka-activity-arena');

    // Create sequence of 5 numbers (e.g. 3, 4, 5, 6, 7)
    const start = Math.floor(Math.random() * 10) + 1;
    const sequence = [start, start + 1, start + 2, start + 3, start + 4];

    // Pick 1 missing index (index 1, 2, or 3)
    const missingIndex = Math.floor(Math.random() * 3) + 1;
    const missingValue = sequence[missingIndex];

    // Generate 3 choices
    let choices = [missingValue, missingValue + 1, missingValue - 1].sort(() => 0.5 - Math.random());

    if (window.piko) {
      window.piko.say(`Ayo isi gerbong kereta yang kosong dengan angka yang tepat!`, 'idle', true);
    }

    let trainHTML = sequence.map((num, idx) => {
      if (idx === missingIndex) {
        return `
          <div id="missing-wagon" style="width: 54px; height: 60px; background: #fef08a; border: 3px dashed #eab308; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: #ca8a04;">
            ?
          </div>
        `;
      } else {
        return `
          <div style="width: 54px; height: 60px; background: #38bdf8; border: 3px solid #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: white; box-shadow: 0 4px 0 #0369a1;">
            ${num}
          </div>
        `;
      }
    }).join('<div style="font-size: 1.2rem; color: #94a3b8; font-weight: 900;">➔</div>');

    let choicesHTML = choices.map(c => `
      <button class="letter-tile-btn" onclick="window.duniaAngka.handleUrutAnswer(this, ${missingValue}, ${c})" style="font-size: 2.2rem; width: 68px; height: 68px;">
        ${c}
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Kereta ${round} dari 3</span>
      </div>

      <div class="game-question-prompt">
        Angka berapakah yang hilang? 🚂
      </div>

      <div class="interactive-scene-box" style="gap: 6px; padding: 12px 6px;">
        <span style="font-size: 2.4rem;">🚂</span>
        ${trainHTML}
      </div>

      <div style="font-weight: 700; color: #64748b; margin-bottom: 12px;">Pilih angka pengisi gerbong:</div>

      <div style="display: flex; justify-content: center; gap: 16px; width: 100%;">
        ${choicesHTML}
      </div>
    `;
  }

  handleUrutAnswer(btn, missingValue, selected) {
    if (missingValue === selected) {
      const wagon = document.getElementById('missing-wagon');
      if (wagon) {
        wagon.textContent = missingValue;
        wagon.style.background = '#4ade80';
        wagon.style.borderColor = '#16a34a';
        wagon.style.color = 'white';
      }

      if (window.audioEngine) {
        window.audioEngine.playTrainWhistle();
        window.audioEngine.playCorrect();
      }
      if (window.piko) {
        window.piko.say(`Tepat sekali! Gerbong kereta lengkap! +10 ⭐`, 'happy', false);
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
      }

      setTimeout(() => {
        if (this.urutRound < 3) {
          this.initUrutkanAngka(this.urutRound + 1);
        } else {
          this.showVictoryModal('Urutkan Angka Selesai!', 'Kereta angka meluncur dengan ceria!', 3, 30);
          if (window.stateManager) {
            window.stateManager.completeLevel('angka', 'urut', 3, 100);
          }
        }
      }, 1400);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) window.audioEngine.playIncorrect();
      if (window.piko) {
        window.piko.say('Bukan angka itu. Ayo perhatikan urutannya lagi!', 'encourage', true);
      }
      setTimeout(() => btn.classList.remove('wrong-shake'), 500);
    }
  }

  /* --------------------------------------------------------------------------
     4. PENJUMLAHAN DASAR (CONCRETE VISUAL ADDITION)
     -------------------------------------------------------------------------- */
  initPenjumlahan(round = 1) {
    this.tambahRound = round;
    const arena = document.getElementById('angka-activity-arena');

    const num1 = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const num2 = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const total = num1 + num2;
    const icon = ['🍎', '🍓', ' ⭐', '🎈', '🍬'][Math.floor(Math.random() * 5)];

    let choices = [total, total + 1, total - 1].filter(c => c > 0).sort(() => 0.5 - Math.random());

    if (window.piko) {
      window.piko.say(`Ayo gabungkan ${num1} dan ${num2}. Berapa total semuanya?`, 'thinking', true);
    }

    let group1HTML = Array(num1).fill(`<span style="font-size: 2.2rem;">${icon}</span>`).join(' ');
    let group2HTML = Array(num2).fill(`<span style="font-size: 2.2rem;">${icon}</span>`).join(' ');

    let choicesHTML = choices.map(c => `
      <button class="option-choice-card" onclick="window.duniaAngka.handleTambahAnswer(this, ${total}, ${c})">
        <span class="option-text-large" style="font-size: 2.2rem; color: #16a34a;">${c}</span>
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Penjumlahan ${round} dari 4</span>
      </div>

      <div class="game-question-prompt">
        ${num1} + ${num2} = ?
      </div>

      <div class="interactive-scene-box" style="gap: 12px; padding: 12px;">
        <div style="background: white; border: 2px solid #bae6fd; padding: 8px 12px; border-radius: 16px; text-align: center;">
          <div>${group1HTML}</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: #0284c7; margin-top: 4px;">${num1}</div>
        </div>

        <div style="font-size: 2.5rem; font-weight: 900; color: #ea580c;">+</div>

        <div style="background: white; border: 2px solid #bae6fd; padding: 8px 12px; border-radius: 16px; text-align: center;">
          <div>${group2HTML}</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: #0284c7; margin-top: 4px;">${num2}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%;">
        ${choicesHTML}
      </div>
    `;
  }

  handleTambahAnswer(btn, total, selected) {
    if (total === selected) {
      btn.classList.add('correct-flash');
      if (window.audioEngine) {
        window.audioEngine.playCorrect();
        window.audioEngine.speak(`Hebat! Jawabannya ${total}!`);
      }
      if (window.piko) {
        window.piko.say(`Benar sekali! Hasilnya adalah ${total}! +10 ⭐`, 'happy', false);
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
        window.stateManager.unlockAchievement('jago_tambah_kurang');
      }

      setTimeout(() => {
        if (this.tambahRound < 4) {
          this.initPenjumlahan(this.tambahRound + 1);
        } else {
          this.showVictoryModal('Penjumlahan Selesai!', 'Kamu sangat hebat menjumlahkan angka!', 3, 40);
          if (window.stateManager) {
            window.stateManager.completeLevel('angka', 'tambah', 3, 100);
          }
        }
      }, 1200);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) window.audioEngine.playIncorrect();
      if (window.piko) {
        window.piko.say('Belum tepat. Coba hitung semua bendanya bersama-sama ya!', 'encourage', true);
      }
      setTimeout(() => btn.classList.remove('wrong-shake'), 500);
    }
  }

  /* --------------------------------------------------------------------------
     5. PENGURANGAN DASAR (TAP-TO-CROSS-OUT SUBTRACTION)
     -------------------------------------------------------------------------- */
  initPengurangan(round = 1) {
    this.kurangRound = round;
    const arena = document.getElementById('angka-activity-arena');

    const totalItems = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const subtractCount = Math.floor(Math.random() * (totalItems - 2)) + 1; // 1 to totalItems - 1
    const remain = totalItems - subtractCount;
    const icon = '🥕';

    let choices = [remain, remain + 1, remain - 1].filter(c => c >= 0).sort(() => 0.5 - Math.random());

    if (window.piko) {
      window.piko.say(`Piko punya ${totalItems} wortel. Kelinci memakan ${subtractCount} wortel! Ketuk ${subtractCount} wortel untuk mencoretnya!`, 'idle', true);
    }

    let itemsHTML = '';
    for (let i = 1; i <= totalItems; i++) {
      itemsHTML += `
        <div class="countable-item" id="sub-item-${i}" onclick="window.duniaAngka.handleCrossOutItem(${i})">
          ${icon}
        </div>
      `;
    }

    let choicesHTML = choices.map(c => `
      <button class="option-choice-card" onclick="window.duniaAngka.handleKurangAnswer(this, ${remain}, ${c})">
        <span class="option-text-large" style="font-size: 2.2rem; color: #ea580c;">${c}</span>
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Pengurangan ${round} dari 4</span>
      </div>

      <div class="game-question-prompt">
        ${totalItems} - ${subtractCount} = ?
      </div>

      <div class="interactive-scene-box" style="min-height: 140px;">
        ${itemsHTML}
      </div>

      <p style="font-weight: 700; color: #64748b; font-size: 0.95rem; text-align: center;">
        Ketuk <strong style="color: #ea580c;">${subtractCount}</strong> wortel untuk mencoretnya, lalu pilih sisanya!
      </p>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%;">
        ${choicesHTML}
      </div>
    `;
  }

  handleCrossOutItem(id) {
    const el = document.getElementById(`sub-item-${id}`);
    if (el) {
      el.classList.toggle('crossed-out');
      if (window.audioEngine) window.audioEngine.playPop();
    }
  }

  handleKurangAnswer(btn, remain, selected) {
    if (remain === selected) {
      btn.classList.add('correct-flash');
      if (window.audioEngine) {
        window.audioEngine.playCorrect();
        window.audioEngine.speak(`Pintar! Sisanya adalah ${remain}!`);
      }
      if (window.piko) {
        window.piko.say(`Benar! Sisanya ada ${remain}! +10 ⭐`, 'happy', false);
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
      }

      setTimeout(() => {
        if (this.kurangRound < 4) {
          this.initPengurangan(this.kurangRound + 1);
        } else {
          this.showVictoryModal('Pengurangan Selesai!', 'Kamu sangat hebat menyelesaikan soal cerita!', 3, 40);
          if (window.stateManager) {
            window.stateManager.completeLevel('angka', 'kurang', 3, 100);
          }
        }
      }, 1200);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) window.audioEngine.playIncorrect();
      if (window.piko) {
        window.piko.say('Belum tepat. Coba hitung sisa wortel yang belum dicoret ya!', 'encourage', true);
      }
      setTimeout(() => btn.classList.remove('wrong-shake'), 500);
    }
  }

  /* --------------------------------------------------------------------------
     6. TANGKAP ANGKA (MINI ARCADE CATCHING GAME)
     -------------------------------------------------------------------------- */
  initTangkapAngka() {
    this.arcadeScore = 0;
    this.arcadeBasketX = 50;
    const arena = document.getElementById('angka-activity-arena');

    // Target rule: e.g. "Tangkap angka 5!" or "Tangkap angka > 4"
    const targetNumber = Math.floor(Math.random() * 5) + 3;

    if (window.piko) {
      window.piko.say(`Game Tangkap Angka! Tangkap angka "${targetNumber}" ke dalam keranjang ya!`, 'happy', true);
    }

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">🎯 Target: Angka <strong style="color: #0284c7; font-size: 1.3rem;">${targetNumber}</strong></span>
        <div style="font-weight: 800; color: #f59e0b;" id="arcade-score-display">⭐ Skor: 0</div>
      </div>

      <div class="arcade-game-container" id="arcade-play-area">
        <div class="catcher-basket" id="arcade-basket" style="left: 50%;">
          🧺
        </div>
      </div>

      <div class="arcade-controls-row">
        <button class="btn-cartoon btn-primary arcade-arrow-btn" onclick="window.duniaAngka.moveBasket(-20);">
          ◀ Geser Kiri
        </button>
        <button class="btn-cartoon btn-primary arcade-arrow-btn" onclick="window.duniaAngka.moveBasket(20);">
          Geser Kanan ▶
        </button>
      </div>
    `;

    this.startArcadeLoop(targetNumber);
  }

  moveBasket(delta) {
    this.arcadeBasketX = Math.max(10, Math.min(90, this.arcadeBasketX + delta));
    const basket = document.getElementById('arcade-basket');
    if (basket) {
      basket.style.left = `${this.arcadeBasketX}%`;
    }
  }

  startArcadeLoop(targetNumber) {
    this.arcadeActive = true;
    const playArea = document.getElementById('arcade-play-area');
    if (!playArea) return;

    let itemsCaught = 0;
    let spawnInterval = setInterval(() => {
      if (!this.arcadeActive) {
        clearInterval(spawnInterval);
        return;
      }

      // Spawn falling number
      const isTarget = Math.random() > 0.45;
      const numValue = isTarget ? targetNumber : Math.floor(Math.random() * 9) + 1;
      const posX = Math.floor(Math.random() * 70) + 15;

      const itemEl = document.createElement('div');
      itemEl.className = 'falling-item';
      itemEl.textContent = numValue;
      itemEl.style.left = `${posX}%`;
      itemEl.style.top = '0px';
      playArea.appendChild(itemEl);

      let posY = 0;
      let dropTimer = setInterval(() => {
        if (!this.arcadeActive) {
          clearInterval(dropTimer);
          itemEl.remove();
          return;
        }

        posY += 4;
        itemEl.style.top = `${posY}px`;

        // Check catch collision near bottom (approx 260px)
        if (posY >= 250 && posY <= 290) {
          const basketMin = this.arcadeBasketX - 18;
          const basketMax = this.arcadeBasketX + 18;
          if (posX >= basketMin && posX <= basketMax) {
            clearInterval(dropTimer);
            itemEl.remove();

            if (numValue === targetNumber) {
              this.arcadeScore += 10;
              itemsCaught++;
              if (window.audioEngine) window.audioEngine.playCorrect();
              const scoreText = document.getElementById('arcade-score-display');
              if (scoreText) scoreText.textContent = `⭐ Skor: ${this.arcadeScore}`;

              if (itemsCaught >= 4) {
                this.stopArcade();
                if (window.stateManager) {
                  window.stateManager.addStars(40);
                  window.stateManager.unlockAchievement('penangkap_angka');
                  window.stateManager.completeLevel('angka', 'tangkap', 3, 100);
                }
                this.showVictoryModal('Tangkap Angka Berhasil!', 'Keranjangmu penuh dengan angka yang tepat!', 3, 40);
              }
            } else {
              if (window.audioEngine) window.audioEngine.playIncorrect();
            }
          }
        }

        if (posY > 310) {
          clearInterval(dropTimer);
          itemEl.remove();
        }
      }, 40);

    }, 1600);

    this.arcadeTimer = spawnInterval;
  }

  stopArcade() {
    this.arcadeActive = false;
    if (this.arcadeTimer) {
      clearInterval(this.arcadeTimer);
      this.arcadeTimer = null;
    }
  }

  /* --------------------------------------------------------------------------
     7. QUIZ BERHITUNG (EVALUATION & STARS)
     -------------------------------------------------------------------------- */
  initQuizBerhitung() {
    this.quizScore = 0;
    this.quizIndex = 0;

    this.quizQuestions = [
      {
        question: 'Berapakah hasil dari: 3 + 2 = ?',
        icon: '➕',
        correct: '5',
        options: ['4', '5', '6', '7']
      },
      {
        question: 'Berapakah sisa dari: 5 - 2 = ?',
        icon: '➖',
        correct: '3',
        options: ['2', '3', '4', '1']
      },
      {
        question: 'Angka berapakah setelah angka 7?',
        icon: '🔢',
        correct: '8',
        options: ['6', '8', '9', '10']
      },
      {
        question: 'Manakah kumpulan benda yang berjumlah 4?',
        icon: '⭐',
        correct: '⭐⭐⭐⭐',
        options: ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']
      },
      {
        question: 'Manakah angka yang lebih besar: 8 atau 3?',
        icon: '👑',
        correct: '8',
        options: ['8', '3', 'Sama besar', 'Nol']
      }
    ].sort(() => 0.5 - Math.random());

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const q = this.quizQuestions[this.quizIndex];
    const arena = document.getElementById('angka-activity-arena');

    if (window.piko) {
      window.piko.say(q.question, 'thinking', true);
    }

    let optionsHTML = q.options.map(opt => `
      <button class="option-choice-card" onclick="window.duniaAngka.handleQuizAnswer(this, '${q.correct}', '${opt}')">
        <span class="option-text-large">${opt}</span>
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Soal Quiz ${this.quizIndex + 1} dari 5</span>
        <div style="font-weight: 800; color: #f59e0b;">⭐ Skor: ${this.quizScore}</div>
      </div>

      <div class="game-question-prompt">
        ${q.question}
      </div>

      <div class="interactive-scene-box" style="min-height: 130px;">
        <div style="font-size: 4.5rem;">${q.icon}</div>
      </div>

      <div class="options-grid-2x2">
        ${optionsHTML}
      </div>
    `;
  }

  handleQuizAnswer(btn, correct, selected) {
    if (correct === selected) {
      this.quizScore += 20;
      btn.classList.add('correct-flash');
      if (window.audioEngine) window.audioEngine.playCorrect();
      if (window.piko) window.piko.say('Hebat! Jawabanmu benar!', 'happy', false);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) window.audioEngine.playIncorrect();
      if (window.piko) window.piko.say('Tidak apa-apa, yuk coba soal selanjutnya!', 'encourage', false);
    }

    setTimeout(() => {
      this.quizIndex++;
      if (this.quizIndex < this.quizQuestions.length) {
        this.renderQuizQuestion();
      } else {
        this.finishQuizBerhitung();
      }
    }, 1000);
  }

  finishQuizBerhitung() {
    let starsEarned = 1;
    if (this.quizScore >= 80) starsEarned = 3;
    else if (this.quizScore >= 60) starsEarned = 2;

    const bonusStars = this.quizScore / 2;
    if (window.stateManager) {
      window.stateManager.addStars(bonusStars);
      window.stateManager.completeLevel('angka', 'quiz', starsEarned, this.quizScore);
    }

    this.showVictoryModal('Quiz Berhitung Selesai!', `Nilai Quiz: ${this.quizScore}/100! Kamu dapat ${bonusStars} bintang!`, starsEarned, bonusStars);
  }

  showVictoryModal(title, text, stars, earnedStars) {
    if (window.audioEngine) window.audioEngine.playLevelComplete();
    if (window.app && window.app.fireConfetti) window.app.fireConfetti();

    const modal = document.getElementById('modal-level-complete');
    if (modal) {
      document.getElementById('modal-level-title').textContent = title;
      document.getElementById('modal-level-desc').textContent = text;
      document.getElementById('modal-stars-count').textContent = `+${earnedStars} ⭐`;

      let starIcons = '';
      for (let i = 0; i < 3; i++) {
        starIcons += i < stars ? '⭐' : '⚪';
      }
      document.getElementById('modal-stars-display').textContent = starIcons;

      modal.classList.add('active');
    }
  }
}

// Global Singleton Instance
window.duniaAngka = new DuniaAngkaManager();
