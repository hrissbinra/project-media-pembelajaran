/* ==========================================================================
   PETUALANGAN PINTAR - PIKO CHARACTER CONTROLLER (Vector SVG & Animations)
   Interactive Companion with Expressions, Speech Bubbles, and Voice Lines
   ========================================================================== */

class PikoCharacter {
  constructor() {
    this.currentExpression = 'idle'; // idle, happy, thinking, surprised, encourage
    this.container = null;
    this.bubbleTextEl = null;
    this.currentMessage = "";
    this.isBlinking = false;
    this.blinkTimer = null;
  }

  init(containerId = 'piko-character-box', bubbleTextId = 'piko-bubble-text') {
    this.container = document.getElementById(containerId);
    this.bubbleTextEl = document.getElementById(bubbleTextId);

    if (this.container) {
      this.render();
      this.container.addEventListener('click', () => this.handlePikoTap());
    }

    this.startAutoBlink();
  }

  startAutoBlink() {
    if (this.blinkTimer) clearInterval(this.blinkTimer);
    this.blinkTimer = setInterval(() => {
      if (this.currentExpression === 'idle') {
        const eyeL = document.getElementById('piko-eye-left');
        const eyeR = document.getElementById('piko-eye-right');
        if (eyeL && eyeR) {
          eyeL.setAttribute('ry', '1');
          eyeR.setAttribute('ry', '1');
          setTimeout(() => {
            if (this.currentExpression === 'idle') {
              eyeL.setAttribute('ry', '7');
              eyeR.setAttribute('ry', '7');
            }
          }, 180);
        }
      }
    }, 4000);
  }

  setExpression(expr = 'idle') {
    this.currentExpression = expr;
    this.render();
  }

  handlePikoTap() {
    if (window.audioEngine) {
      window.audioEngine.playPop();
    }
    if (window.stateManager) {
      window.stateManager.incrementPikoTap();
    }

    const quotes = [
      "Halo! Aku Piko, siap bertualang bersamamu!",
      "Kamu pintar sekali! Terus semangat ya!",
      "Ayo kita kumpulkan semua bintang emasnya!",
      "Belajar membaca dan berhitung itu sangat asyik!",
      "Piko sangat senang bisa menjadi teman belajarmu!"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    this.say(randomQuote, 'happy', true);
  }

  say(text, expr = 'idle', speakVoice = true) {
    this.currentMessage = text;
    this.setExpression(expr);

    if (this.bubbleTextEl) {
      this.bubbleTextEl.textContent = text;
      // Trigger pop animation
      this.bubbleTextEl.parentElement.style.transform = 'scale(1.04)';
      setTimeout(() => {
        if (this.bubbleTextEl && this.bubbleTextEl.parentElement) {
          this.bubbleTextEl.parentElement.style.transform = 'scale(1)';
        }
      }, 150);
    }

    if (speakVoice && window.audioEngine && window.stateManager) {
      if (window.stateManager.data.settings.voiceEnabled) {
        window.audioEngine.speak(text);
      }
    }
  }

  repeatVoice() {
    if (this.currentMessage && window.audioEngine) {
      window.audioEngine.speak(this.currentMessage);
    }
  }

  /* --------------------------------------------------------------------------
     RICH VECTOR SVG GRAPHICS FOR PIKO
     -------------------------------------------------------------------------- */
  render() {
    if (!this.container) return;

    let eyeLeftSVG = `<ellipse id="piko-eye-left" cx="48" cy="55" rx="5.5" ry="7" fill="#1e293b"/>
                      <circle cx="46" cy="52" r="2.5" fill="#ffffff"/>`;
    let eyeRightSVG = `<ellipse id="piko-eye-right" cx="72" cy="55" rx="5.5" ry="7" fill="#1e293b"/>
                       <circle cx="70" cy="52" r="2.5" fill="#ffffff"/>`;
    let mouthSVG = `<path d="M 52 70 Q 60 78 68 70" stroke="#b91c1c" stroke-width="3.5" fill="#f87171" stroke-linecap="round"/>`;
    let gestureSVG = ``;
    let extraEffectSVG = ``;

    switch (this.currentExpression) {
      case 'happy':
        // Crescent starry happy eyes & wide open joyous mouth
        eyeLeftSVG = `<path d="M 43 57 Q 48 48 53 57" stroke="#0f172a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
                      <path d="M 41 47 L 43 51 L 47 51 L 44 54 L 45 58 L 41 55 L 37 58 L 38 54 L 35 51 L 39 51 Z" fill="#fbbf24" transform="scale(0.5) translate(30, 30)"/>`;
        eyeRightSVG = `<path d="M 67 57 Q 72 48 77 57" stroke="#0f172a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
                       <path d="M 41 47 L 43 51 L 47 51 L 44 54 L 45 58 L 41 55 L 37 58 L 38 54 L 35 51 L 39 51 Z" fill="#fbbf24" transform="scale(0.5) translate(80, 30)"/>`;
        mouthSVG = `<path d="M 50 67 Q 60 84 70 67 Z" fill="#ef4444" stroke="#991b1b" stroke-width="3"/>
                    <path d="M 54 75 Q 60 82 66 75" fill="#fca5a5"/>`;
        gestureSVG = `<g transform="translate(0, -6)">
                        <circle cx="28" cy="75" r="9" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
                        <circle cx="92" cy="75" r="9" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
                      </g>`;
        extraEffectSVG = `<text x="50%" y="22" font-family="Fredoka" font-size="16" font-weight="bold" fill="#f59e0b" text-anchor="middle">✨ Hore! ✨</text>`;
        break;

      case 'thinking':
        // Looking up to speech bubble with hand near chin
        eyeLeftSVG = `<ellipse id="piko-eye-left" cx="50" cy="51" rx="5" ry="6.5" fill="#1e293b"/>
                      <circle cx="51" cy="49" r="2.2" fill="#ffffff"/>`;
        eyeRightSVG = `<ellipse id="piko-eye-right" cx="74" cy="51" rx="5" ry="6.5" fill="#1e293b"/>
                       <circle cx="75" cy="49" r="2.2" fill="#ffffff"/>`;
        mouthSVG = `<path d="M 56 71 Q 62 67 66 72" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
        gestureSVG = `<g transform="translate(42, 66)">
                        <circle cx="22" cy="6" r="9" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
                      </g>`;
        extraEffectSVG = `<text x="96" y="32" font-family="Fredoka" font-size="22" font-weight="900" fill="#38bdf8">💡</text>`;
        break;

      case 'surprised':
        // Big round glinting eyes and O-mouth
        eyeLeftSVG = `<ellipse id="piko-eye-left" cx="47" cy="53" rx="7" ry="8" fill="#1e293b"/>
                      <circle cx="45" cy="50" r="3" fill="#ffffff"/>`;
        eyeRightSVG = `<ellipse id="piko-eye-right" cx="73" cy="53" rx="7" ry="8" fill="#1e293b"/>
                       <circle cx="71" cy="50" r="3" fill="#ffffff"/>`;
        mouthSVG = `<ellipse cx="60" cy="72" rx="6" ry="8" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>`;
        extraEffectSVG = `<text x="92" y="28" font-family="Fredoka" font-size="20" font-weight="900" fill="#ec4899">❗</text>`;
        break;

      case 'encourage':
        // Gentle warm smile and thumbs up
        eyeLeftSVG = `<path d="M 44 56 Q 48 50 52 56" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
        eyeRightSVG = `<path d="M 68 56 Q 72 50 76 56" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
        mouthSVG = `<path d="M 53 68 Q 60 76 67 68" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
        gestureSVG = `<g transform="translate(78, 62)">
                        <circle cx="10" cy="8" r="9" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
                        <text x="5" y="14" font-size="14">👍</text>
                      </g>`;
        extraEffectSVG = `<text x="50%" y="22" font-family="Fredoka" font-size="14" font-weight="bold" fill="#22c55e" text-anchor="middle">Yuk, coba lagi! 💪</text>`;
        break;

      default: // idle
        break;
    }

    const svgContent = `
      <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="100%" stop-color="#fed7aa"/>
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#eab308"/>
          </linearGradient>
        </defs>

        <!-- Body & Shirt -->
        <path d="M 38 95 L 82 95 C 84 105 88 120 88 120 L 32 120 C 32 120 36 105 38 95 Z" fill="url(#shirtGrad)" stroke="#ca8a04" stroke-width="3"/>
        <path d="M 52 95 L 60 106 L 68 95" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>

        <!-- Ears -->
        <circle cx="34" cy="58" r="9" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
        <circle cx="86" cy="58" r="9" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>

        <!-- Head / Face -->
        <ellipse cx="60" cy="58" rx="28" ry="26" fill="url(#skinGrad)" stroke="#ea580c" stroke-width="3"/>

        <!-- Cute Rosy Cheeks -->
        <circle cx="43" cy="65" r="5" fill="#fbcfe8" opacity="0.8"/>
        <circle cx="77" cy="65" r="5" fill="#fbcfe8" opacity="0.8"/>

        <!-- Explorer Cap / Friendly Hat -->
        <path d="M 30 46 C 30 25 90 25 90 46 Z" fill="url(#capGrad)" stroke="#0369a1" stroke-width="3"/>
        <!-- Cap Visor -->
        <path d="M 24 45 Q 60 38 96 45 C 96 49 24 49 24 45 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2.5"/>
        <!-- Star Badge on Cap -->
        <polygon points="60,26 62.5,33 70,33 64,37 66,44 60,40 54,44 56,37 50,33 57.5,33" fill="#fde047" stroke="#ca8a04" stroke-width="1.2"/>

        <!-- Hair Tuft under Cap -->
        <path d="M 36 46 Q 44 52 48 47 Q 56 53 62 47 Q 70 53 76 47 Q 82 52 84 46" stroke="#451a03" stroke-width="3" fill="none" stroke-linecap="round"/>

        <!-- Eyes -->
        ${eyeLeftSVG}
        ${eyeRightSVG}

        <!-- Mouth -->
        ${mouthSVG}

        <!-- Gestures (Hands / Props) -->
        ${gestureSVG}

        <!-- Extra Floating Emotion Effect -->
        ${extraEffectSVG}
      </svg>
    `;

    this.container.innerHTML = svgContent;
  }
}

// Global Singleton Instance
window.piko = new PikoCharacter();
