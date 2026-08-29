/* ==========================================================================
   PETUALANGAN PINTAR - DUNIA KATA (Membaca Dasar SD Kelas 1)
   5 Interactive Sub-modules: Mengenal Huruf, Cari Huruf, Cocokkan Gambar, Susun Kata, Quiz Membaca
   ========================================================================== */

const ALPHABET_DATA = [
  { letter: 'A', lower: 'a', word: 'Apel', icon: '🍎', syllables: ['A', 'pel'] },
  { letter: 'B', lower: 'b', word: 'Bola', icon: '⚽', syllables: ['Bo', 'la'] },
  { letter: 'C', lower: 'c', word: 'Ceri', icon: '🍒', syllables: ['Ce', 'ri'] },
  { letter: 'D', lower: 'd', word: 'Domba', icon: '🐑', syllables: ['Dom', 'ba'] },
  { letter: 'E', lower: 'e', word: 'Elang', icon: '🦅', syllables: ['E', 'lang'] },
  { letter: 'F', lower: 'f', word: 'Foto', icon: '📷', syllables: ['Fo', 'to'] },
  { letter: 'G', lower: 'g', word: 'Gajah', icon: '🐘', syllables: ['Ga', 'jah'] },
  { letter: 'H', lower: 'h', word: 'Harimau', icon: '🐯', syllables: ['Ha', 'ri', 'mau'] },
  { letter: 'I', lower: 'i', word: 'Ikan', icon: '🐟', syllables: ['I', 'kan'] },
  { letter: 'J', lower: 'j', word: 'Jeruk', icon: '🍊', syllables: ['Je', 'ruk'] },
  { letter: 'K', lower: 'k', word: 'Kucing', icon: '🐱', syllables: ['Ku', 'cing'] },
  { letter: 'L', lower: 'l', word: 'Lemon', icon: '🍋', syllables: ['Le', 'mon'] },
  { letter: 'M', lower: 'm', word: 'Mobil', icon: '🚗', syllables: ['Mo', 'bil'] },
  { letter: 'N', lower: 'n', word: 'Nanas', icon: '🍍', syllables: ['Na', 'nas'] },
  { letter: 'O', lower: 'o', word: 'Obat', icon: '💊', syllables: ['O', 'bat'] },
  { letter: 'P', lower: 'p', word: 'Pisang', icon: '🍌', syllables: ['Pi', 'sang'] },
  { letter: 'Q', lower: 'q', word: 'Quran', icon: '📖', syllables: ['Qur', 'an'] },
  { letter: 'R', lower: 'r', word: 'Roti', icon: '🍞', syllables: ['Ro', 'ti'] },
  { letter: 'S', lower: 's', word: 'Sepatu', icon: '👟', syllables: ['Se', 'pa', 'tu'] },
  { letter: 'T', lower: 't', word: 'Topi', icon: '🧢', syllables: ['To', 'pi'] },
  { letter: 'U', lower: 'u', word: 'Udang', icon: '🦐', syllables: ['U', 'dang'] },
  { letter: 'V', lower: 'v', word: 'Vas', icon: '🏺', syllables: ['Vas'] },
  { letter: 'W', lower: 'w', word: 'Wortel', icon: '🥕', syllables: ['Wor', 'tel'] },
  { letter: 'X', lower: 'x', word: 'Xilofon', icon: '🎵', syllables: ['Xi', 'lo', 'fon'] },
  { letter: 'Y', lower: 'y', word: 'Yoyo', icon: '🪀', syllables: ['Yo', 'yo'] },
  { letter: 'Z', lower: 'z', word: 'Zebra', icon: '🦓', syllables: ['Zeb', 'ra'] }
];

const WORD_PUZZLE_ITEMS = [
  { word: 'BUKU', icon: '📚', meaning: 'Buku' },
  { word: 'BOLA', icon: '⚽', meaning: 'Bola' },
  { word: 'IKAN', icon: '🐟', meaning: 'Ikan' },
  { word: 'APEL', icon: '🍎', meaning: 'Apel' },
  { word: 'TOPI', icon: '🧢', meaning: 'Topi' },
  { word: 'ROTI', icon: '🍞', meaning: 'Roti' },
  { word: 'MEJA', icon: '🪑', meaning: 'Meja' },
  { word: 'KUDA', icon: '🐴', meaning: 'Kuda' },
  { word: 'SAPI', icon: '🐮', meaning: 'Sapi' },
  { word: 'MATA', icon: '👀', meaning: 'Mata' }
];

class DuniaKataManager {
  constructor() {
    this.currentTopic = null;
    this.currentLetterIndex = 0;
    this.quizScore = 0;
    this.quizIndex = 0;
    this.quizQuestions = [];
    this.susunIndex = 0;
    this.susunPlaced = [];
    this.susunLetters = [];
    this.cariRound = 1;
  }

  // --- Start Specific Activity ---
  startActivity(topicId) {
    this.currentTopic = topicId;
    const arena = document.getElementById('kata-activity-arena');
    if (!arena) return;

    switch (topicId) {
      case 'huruf':
        this.initMengenalHuruf(0);
        break;
      case 'cari':
        this.initCariHuruf(1);
        break;
      case 'cocok':
        this.initCocokkanGambar(1);
        break;
      case 'susun':
        this.initSusunKata(0);
        break;
      case 'quiz':
        this.initQuizMembaca();
        break;
    }
  }

  /* --------------------------------------------------------------------------
     1. MENGENAL HURUF (A-Z FLASHCARD)
     -------------------------------------------------------------------------- */
  initMengenalHuruf(index = 0) {
    this.currentLetterIndex = (index + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    const item = ALPHABET_DATA[this.currentLetterIndex];
    const arena = document.getElementById('kata-activity-arena');

    if (window.piko) {
      window.piko.say(`Ayo ucapkan bersama: Huruf ${item.letter}, ${item.letter} untuk ${item.word}!`, 'idle', true);
    }

    // Check achievement for reaching 10th letter
    if (this.currentLetterIndex >= 9 && window.stateManager) {
      window.stateManager.unlockAchievement('penjelajah_huruf');
    }
    if (this.currentLetterIndex === 25 && window.stateManager) {
      window.stateManager.unlockAchievement('master_alfabet');
    }

    let syllablesHTML = item.syllables.map(s => `
      <button class="btn-cartoon btn-yellow" onclick="window.audioEngine.speak('${s}');" style="padding: 6px 14px; font-size: 1.1rem;">
        ${s}
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Huruf ${this.currentLetterIndex + 1} dari 26</span>
        <button class="btn-cartoon btn-orange btn-icon-only" onclick="window.duniaKata.pronounceCurrentLetter();" title="Dengarkan Suara">
          🔊
        </button>
      </div>

      <div class="letter-flashcard-stage" onclick="window.duniaKata.pronounceCurrentLetter();" style="cursor: pointer; width: 100%;">
        <div class="big-letter-display">
          ${item.letter} <span style="font-size: 3.2rem; color: #38bdf8;">${item.lower}</span>
        </div>

        <div style="font-size: 4.8rem; margin: 4px 0; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.15));">
          ${item.icon}
        </div>

        <div class="letter-example-pill">
          ${item.word}
        </div>
      </div>

      <!-- Syllable breakdown -->
      <div style="display: flex; gap: 8px; align-items: center; justify-content: center; margin: 12px 0;">
        <span style="font-weight: 700; color: #64748b; font-size: 0.95rem;">Eja suku kata:</span>
        ${syllablesHTML}
      </div>

      <!-- Nav Controls -->
      <div style="display: flex; justify-content: space-between; width: 100%; gap: 12px; margin-top: auto;">
        <button class="btn-cartoon btn-primary" onclick="window.duniaKata.prevLetter();" style="flex: 1;">
          ◀ Sebelumnya
        </button>
        <button class="btn-cartoon btn-green" onclick="window.duniaKata.nextLetter();" style="flex: 1;">
          Berikutnya ▶
        </button>
      </div>
    `;

    // Award initial completion stars
    if (window.stateManager) {
      window.stateManager.completeLevel('kata', 'huruf', 3, 100);
    }
  }

  pronounceCurrentLetter() {
    const item = ALPHABET_DATA[this.currentLetterIndex];
    if (window.audioEngine) {
      window.audioEngine.spellLetter(item.letter, item.word);
    }
  }

  nextLetter() {
    if (window.audioEngine) window.audioEngine.playClick();
    this.initMengenalHuruf(this.currentLetterIndex + 1);
  }

  prevLetter() {
    if (window.audioEngine) window.audioEngine.playClick();
    this.initMengenalHuruf(this.currentLetterIndex - 1);
  }

  /* --------------------------------------------------------------------------
     2. CARI HURUF (BALLOON HUNT GAME)
     -------------------------------------------------------------------------- */
  initCariHuruf(round = 1) {
    this.cariRound = round;
    const arena = document.getElementById('kata-activity-arena');
    const targetItem = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    const targetLetter = targetItem.letter;

    // Generate random distractors
    let distractors = ALPHABET_DATA.filter(i => i.letter !== targetLetter)
      .sort(() => 0.3 - Math.random())
      .slice(0, 2)
      .map(i => i.letter);

    let balloonLetters = [targetLetter, ...distractors].sort(() => 0.3 - Math.random());

    if (window.piko) {
      window.piko.say(`Ayo bantu Piko mencari semua huruf "${targetLetter}"!`, 'thinking', true);
    }

    let balloonsHTML = balloonLetters.map((letter, idx) => {
      const colors = ['#f472b6', '#38bdf8', '#4ade80', '#facc15', '#a78bfa', '#fb923c'];
      const bg = colors[idx % colors.length];
      return `
        <div class="balloon-item" data-letter="${letter}" onclick="window.duniaKata.handleBalloonClick(this, '${targetLetter}', '${letter}')"
             style="width: 72px; height: 86px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: ${bg}; color: white; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 2rem; font-weight: 900; box-shadow: 0 6px 0 rgba(0,0,0,0.2); cursor: pointer; transition: all 0.15s ease; position: relative;">
          ${letter}
          <div style="position: absolute; bottom: -8px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${bg};"></div>
        </div>
      `;
    }).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Ronde ${round} dari 3</span>
        <div style="background: #e0f2fe; border: 2px solid #38bdf8; border-radius: var(--border-radius-pill); padding: 4px 12px; font-weight: 800; color: #0284c7;">
          Cari Huruf: <span style="font-size: 1.4rem; color: #be185d;">${targetLetter}</span>
        </div>
      </div>

      <div class="interactive-scene-box" style="min-height: 220px; gap: 20px; align-content: center;">
        ${balloonsHTML}
      </div>

      <p style="font-weight: 700; color: #64748b; text-align: center;">
        Ketuk balon yang memiliki huruf <strong style="color: #0284c7;">${targetLetter}</strong>!
      </p>
    `;
  }

  handleBalloonClick(el, targetLetter, letter) {
    if (el.classList.contains('popped')) return;

    if (letter === targetLetter) {
      el.classList.add('popped');
      el.style.transform = 'scale(1.3)';
      el.style.opacity = '0';
      if (window.audioEngine) {
        window.audioEngine.playPop();
        window.audioEngine.playStar();
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
        window.stateManager.unlockAchievement('pemburu_huruf');
      }
      if (window.piko) {
        window.piko.say('Hebat! Kamu menemukan hurufnya! +10 ⭐', 'happy', false);
      }

      // Check if all target balloons are popped
      const remaining = document.querySelectorAll(`.balloon-item[data-letter="${targetLetter}"]:not(.popped)`);
      if (remaining.length === 0) {
        setTimeout(() => {
          if (this.cariRound < 3) {
            this.initCariHuruf(this.cariRound + 1);
          } else {
            this.showVictoryModal('Cari Huruf Selesai!', 'Kamu sangat jeli menemukan huruf!', 3, 30);
            if (window.stateManager) {
              window.stateManager.completeLevel('kata', 'cari', 3, 100);
            }
          }
        }, 800);
      }
    } else {
      el.classList.add('wrong-shake');
      if (window.audioEngine) window.audioEngine.playIncorrect();
      if (window.piko) {
        window.piko.say(`Itu huruf ${letter}. Ayo cari huruf ${targetLetter} ya!`, 'encourage', true);
      }
      setTimeout(() => el.classList.remove('wrong-shake'), 500);
    }
  }

  /* --------------------------------------------------------------------------
     3. COCOKKAN GAMBAR (IMAGE TO WORD MATCHING)
     -------------------------------------------------------------------------- */
  initCocokkanGambar(round = 1) {
    this.cocokRound = round;
    const arena = document.getElementById('kata-activity-arena');

    // Pick 1 correct target and 3 wrong options
    const shuffled = [...ALPHABET_DATA].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const options = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    if (window.piko) {
      window.piko.say(`Gambar apakah ini? Pilih kata yang tepat!`, 'thinking', true);
    }

    let optionsHTML = options.map(opt => `
      <button class="option-choice-card" onclick="window.duniaKata.handleCocokAnswer(this, '${target.word}', '${opt.word}')">
        <span class="option-text-large">${opt.word}</span>
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Soal ${round} dari 4</span>
      </div>

      <div class="game-question-prompt">
        Kata yang cocok dengan gambar:
      </div>

      <div class="interactive-scene-box" style="flex-direction: column; min-height: 160px;">
        <div style="font-size: 5rem; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));">
          ${target.icon}
        </div>
      </div>

      <div class="options-grid-2x2">
        ${optionsHTML}
      </div>
    `;
  }

  handleCocokAnswer(btn, targetWord, selectedWord) {
    if (targetWord === selectedWord) {
      btn.classList.add('correct-flash');
      if (window.audioEngine) {
        window.audioEngine.playCorrect();
        window.audioEngine.speak(`Benar! Ini adalah ${targetWord}!`);
      }
      if (window.piko) {
        window.piko.say(`Luar biasa! Benar, ini ${targetWord}! +10 ⭐`, 'happy', false);
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
      }

      setTimeout(() => {
        if (this.cocokRound < 4) {
          this.initCocokkanGambar(this.cocokRound + 1);
        } else {
          this.showVictoryModal('Cocokkan Gambar Selesai!', 'Kamu sangat hebat membaca kata!', 3, 40);
          if (window.stateManager) {
            window.stateManager.completeLevel('kata', 'cocok', 3, 100);
          }
        }
      }, 1200);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) {
        window.audioEngine.playIncorrect();
        window.audioEngine.speak('Belum tepat, yuk coba lagi!');
      }
      if (window.piko) {
        window.piko.say('Belum tepat. Coba perhatikan gambarnya lagi ya!', 'encourage', false);
      }
      setTimeout(() => btn.classList.remove('wrong-shake'), 500);
    }
  }

  /* --------------------------------------------------------------------------
     4. SUSUN KATA (DRAG/TAP LETTER PUZZLE)
     -------------------------------------------------------------------------- */
  initSusunKata(index = 0) {
    this.susunIndex = index % WORD_PUZZLE_ITEMS.length;
    const item = WORD_PUZZLE_ITEMS[this.susunIndex];
    const letters = item.word.split('');
    this.susunLetters = letters;
    this.susunPlaced = new Array(letters.length).fill(null);

    const arena = document.getElementById('kata-activity-arena');

    // Scramble tiles
    const scrambled = letters.map((l, i) => ({ letter: l, id: i })).sort(() => 0.5 - Math.random());

    if (window.piko) {
      window.piko.say(`Ayo susun huruf-huruf ini menjadi kata "${item.word}"!`, 'idle', true);
    }

    let slotsHTML = letters.map((_, i) => `
      <div class="letter-slot" id="letter-slot-${i}" onclick="window.duniaKata.removeLetterFromSlot(${i})">
        _
      </div>
    `).join('');

    let tilesHTML = scrambled.map(t => `
      <button class="letter-tile-btn" id="letter-tile-${t.id}" onclick="window.duniaKata.placeLetter('${t.letter}', ${t.id})">
        ${t.letter}
      </button>
    `).join('');

    arena.innerHTML = `
      <div class="game-score-badge-row">
        <span class="game-progress-indicator">Kata ${this.susunIndex + 1} dari ${WORD_PUZZLE_ITEMS.length}</span>
        <button class="btn-cartoon btn-yellow btn-icon-only" onclick="window.audioEngine.speak('${item.word}');" title="Dengarkan Kata">
          🔊
        </button>
      </div>

      <div class="interactive-scene-box" style="flex-direction: column; min-height: 140px;">
        <div style="font-size: 4rem;">${item.icon}</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0284c7;">Petunjuk: ${item.meaning}</div>
      </div>

      <div class="word-target-slots">
        ${slotsHTML}
      </div>

      <div class="word-tile-bank">
        ${tilesHTML}
      </div>

      <div style="margin-top: auto; display: flex; gap: 10px; width: 100%;">
        <button class="btn-cartoon btn-orange" onclick="window.duniaKata.resetCurrentWordSlots();" style="flex: 1;">
          🔄 Ulangi
        </button>
        <button class="btn-cartoon btn-primary" onclick="window.duniaKata.nextWordPuzzle();" style="flex: 1;">
          Kata Berikutnya ▶
        </button>
      </div>
    `;
  }

  placeLetter(letter, tileId) {
    // Find first empty slot
    const emptyIndex = this.susunPlaced.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    if (window.audioEngine) window.audioEngine.playSnap();

    this.susunPlaced[emptyIndex] = { letter, tileId };
    const slotEl = document.getElementById(`letter-slot-${emptyIndex}`);
    if (slotEl) {
      slotEl.textContent = letter;
      slotEl.classList.add('filled');
    }

    const tileBtn = document.getElementById(`letter-tile-${tileId}`);
    if (tileBtn) {
      tileBtn.classList.add('used');
    }

    // Check if full
    if (!this.susunPlaced.includes(null)) {
      this.verifySusunWord();
    }
  }

  removeLetterFromSlot(slotIndex) {
    const placed = this.susunPlaced[slotIndex];
    if (!placed) return;

    if (window.audioEngine) window.audioEngine.playPop();

    const tileBtn = document.getElementById(`letter-tile-${placed.tileId}`);
    if (tileBtn) {
      tileBtn.classList.remove('used');
    }

    const slotEl = document.getElementById(`letter-slot-${slotIndex}`);
    if (slotEl) {
      slotEl.textContent = '_';
      slotEl.classList.remove('filled');
    }

    this.susunPlaced[slotIndex] = null;
  }

  resetCurrentWordSlots() {
    this.initSusunKata(this.susunIndex);
  }

  nextWordPuzzle() {
    this.initSusunKata(this.susunIndex + 1);
  }

  verifySusunWord() {
    const built = this.susunPlaced.map(p => p.letter).join('');
    const target = this.susunLetters.join('');

    if (built === target) {
      if (window.audioEngine) {
        window.audioEngine.playCorrect();
        window.audioEngine.speak(`Hebat! ${target}!`);
      }
      if (window.piko) {
        window.piko.say(`Luar biasa! Kata "${target}" tersusun sempurna! +10 ⭐`, 'happy', false);
      }
      if (window.stateManager) {
        window.stateManager.addStars(10);
        window.stateManager.unlockAchievement('susun_kata_hebat');
        window.stateManager.completeLevel('kata', 'susun', 3, 100);
      }
      if (window.app && window.app.fireConfetti) {
        window.app.fireConfetti();
      }

      setTimeout(() => {
        if (this.susunIndex + 1 < WORD_PUZZLE_ITEMS.length) {
          this.initSusunKata(this.susunIndex + 1);
        } else {
          this.showVictoryModal('Susun Kata Selesai!', 'Kamu sudah menjadi Master Membaca Kata!', 3, 50);
        }
      }, 1500);
    } else {
      if (window.audioEngine) {
        window.audioEngine.playIncorrect();
        window.audioEngine.speak('Belum pas, yuk kita susun lagi!');
      }
      if (window.piko) {
        window.piko.say('Hurufnya belum pas. Ketuk kotak untuk membetulkan ya!', 'encourage', false);
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. QUIZ MEMBACA (EVALUATION & STARS)
     -------------------------------------------------------------------------- */
  initQuizMembaca() {
    this.quizScore = 0;
    this.quizIndex = 0;

    // Build 5 randomized questions
    this.quizQuestions = [
      {
        question: 'Huruf apakah ini: "B"?',
        icon: '🔤',
        correct: 'B',
        options: ['B', 'D', 'P', 'R']
      },
      {
        question: 'Manakah kata yang berawalan huruf "K"?',
        icon: '🐱',
        correct: 'Kucing',
        options: ['Kucing', 'Bola', 'Apel', 'Domba']
      },
      {
        question: 'Suku kata dari kata "BO-LA" adalah...',
        icon: '⚽',
        correct: 'Bola',
        options: ['Bola', 'Batu', 'Buku', 'Baju']
      },
      {
        question: 'Pilih gambar yang berawalan huruf "A"!',
        icon: '❓',
        correct: '🍎 Apel',
        options: ['🍎 Apel', '🍌 Pisang', '🍊 Jeruk', '🍇 Anggur']
      },
      {
        question: 'Huruf pertama dari kata "ROTI" adalah...',
        icon: '🍞',
        correct: 'R',
        options: ['R', 'B', 'T', 'O']
      }
    ].sort(() => 0.5 - Math.random());

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const q = this.quizQuestions[this.quizIndex];
    const arena = document.getElementById('kata-activity-arena');

    if (window.piko) {
      window.piko.say(q.question, 'thinking', true);
    }

    let optionsHTML = q.options.map(opt => `
      <button class="option-choice-card" onclick="window.duniaKata.handleQuizAnswer(this, '${q.correct}', '${opt}')">
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
      if (window.piko) window.piko.say('Benar sekali! Pintar!', 'happy', false);
    } else {
      btn.classList.add('wrong-shake');
      if (window.audioEngine) window.audioEngine.playIncorrect();
      if (window.piko) window.piko.say('Tidak apa-apa, ayo lanjut ke soal berikutnya!', 'encourage', false);
    }

    setTimeout(() => {
      this.quizIndex++;
      if (this.quizIndex < this.quizQuestions.length) {
        this.renderQuizQuestion();
      } else {
        this.finishQuizMembaca();
      }
    }, 1000);
  }

  finishQuizMembaca() {
    let starsEarned = 1;
    if (this.quizScore >= 80) starsEarned = 3;
    else if (this.quizScore >= 60) starsEarned = 2;

    const bonusStars = this.quizScore / 2;
    if (window.stateManager) {
      window.stateManager.addStars(bonusStars);
      window.stateManager.completeLevel('kata', 'quiz', starsEarned, this.quizScore);
      window.stateManager.unlockAchievement('bintang_membaca');
    }

    this.showVictoryModal('Quiz Membaca Selesai!', `Nilai Quiz: ${this.quizScore}/100! Kamu dapat ${bonusStars} bintang!`, starsEarned, bonusStars);
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
window.duniaKata = new DuniaKataManager();
