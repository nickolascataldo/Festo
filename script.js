// Festo - Seasonal & Holiday Experiences Landing Page Script

document.addEventListener('DOMContentLoaded', () => {
  // State management
  let activeSeason = 'summer';

  // DOM Elements
  const themeCards = document.querySelectorAll('.theme-card');
  const segmentButtons = document.querySelectorAll('.segment-btn');
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const appContainer = document.querySelector('.festo-app');

  // Season configuration data
  const seasonData = {
    spring: {
      accentColor: '#ff3385',
      glow1: 'rgba(255, 51, 133, 0.25)',
      glow2: 'rgba(255, 182, 193, 0.18)',
      particleType: 'cherry_blossom'
    },
    summer: {
      accentColor: '#ffb700',
      glow1: 'rgba(255, 183, 0, 0.22)',
      glow2: 'rgba(0, 212, 255, 0.15)',
      particleType: 'sparkle'
    },
    halloween: {
      accentColor: '#ff5500',
      glow1: 'rgba(255, 85, 0, 0.25)',
      glow2: 'rgba(138, 43, 226, 0.2)',
      particleType: 'ghost'
    },
    christmas: {
      accentColor: '#00e676',
      glow1: 'rgba(0, 230, 118, 0.22)',
      glow2: 'rgba(255, 255, 255, 0.18)',
      particleType: 'snow'
    }
  };

  /* ==========================================================================
     Web Audio API Sound Effects Synthesizer
     ========================================================================== */
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  /**
   * Generates a subtle procedural sound effect per season
   * @param {string} season - The season key ('spring'|'summer'|'halloween'|'christmas')
   */
  function playSeasonSound(season) {
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.08, now); // Keep volume subtle
    masterGain.connect(audioCtx.destination);

    switch (season) {
      case 'spring': {
        // Soft floral chime bell (A4 & C#5 harmonized fade)
        [440, 554.37].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.08, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.05);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + 0.65 + idx * 0.05);
        });
        break;
      }

      case 'summer': {
        // Warm synth rise (beach breeze)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.25);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'halloween': {
        // Eerie low-frequency warble ghost tone
        const osc = audioCtx.createOscillator();
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(8, now); // Vibrato speed
        lfoGain.gain.setValueAtTime(15, now); // Vibrato depth

        lfo.connect(osc.frequency);
        
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(masterGain);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.5);
        osc.stop(now + 0.5);
        break;
      }

      case 'christmas': {
        // High sleigh bell chime pair (E6 & B6 crisp drops)
        [1318.51, 1975.53].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.06, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4 + idx * 0.08);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + idx * 0.08);
          osc.stop(now + 0.45 + idx * 0.08);
        });
        break;
      }
    }
  }

  /* ==========================================================================
     Seasonal Particle Canvas System
     ========================================================================== */
  const canvas = document.createElement('canvas');
  canvas.id = 'seasonal-particle-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  appContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId = null;

  function resizeCanvas() {
    canvas.width = appContainer.clientWidth;
    canvas.height = appContainer.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor(type) {
      this.type = type;
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.2 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = Math.random() * 0.03 - 0.015;

      if (this.type === 'snow' || this.type === 'cherry_blossom') {
        this.y = -20;
      } else if (this.type === 'ghost') {
        this.y = canvas.height + 20;
        this.speedY = -(Math.random() * 0.8 + 0.3);
      }
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.type === 'ghost' && this.y < -30) this.reset();
      if ((this.type === 'snow' || this.type === 'cherry_blossom') && this.y > canvas.height + 20) this.reset();
      if (this.type === 'sparkle') {
        this.opacity -= 0.008;
        if (this.opacity <= 0) this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      switch (this.type) {
        case 'cherry_blossom':
          ctx.fillStyle = '#ff75a0';
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'sparkle':
          ctx.fillStyle = '#ffdf7a';
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'ghost':
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(0, -this.size / 2, this.size / 2, Math.PI, 0, false);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#07090e';
          ctx.fillRect(-this.size / 4, -this.size / 2, 2, 2);
          ctx.fillRect(this.size / 8, -this.size / 2, 2, 2);
          break;

        case 'snow':
        default:
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }

  function initParticles(type) {
    particles = [];
    const count = type === 'sparkle' ? 45 : 30;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(type));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  /* ==========================================================================
     UI State Updates & Theme Switching
     ========================================================================== */
  function setSeason(seasonKey, isUserInteraction = true) {
    if (!seasonData[seasonKey]) return;
    activeSeason = seasonKey;
    const config = seasonData[seasonKey];

    // Play procedural sound if triggered by user click
    if (isUserInteraction) {
      initAudioContext();
      playSeasonSound(seasonKey);
    }

    // 1. Update active states for Theme Cards
    themeCards.forEach(card => {
      const isSelected = card.dataset.season === seasonKey;
      card.classList.toggle('active', isSelected);
      card.setAttribute('aria-selected', isSelected.toString());
    });

    // 2. Update active states for Segmented Control Buttons
    segmentButtons.forEach(btn => {
      const isSelected = btn.dataset.season === seasonKey;
      btn.classList.toggle('active', isSelected);
      
      const checkIcon = btn.querySelector('.check-icon');
      if (isSelected) {
        if (!checkIcon) {
          const check = document.createElement('span');
          check.className = 'check-icon';
          check.textContent = '✓ ';
          btn.prepend(check);
        }
      } else if (checkIcon) {
        checkIcon.remove();
      }
    });

    // 3. Update Timeline Nodes
    timelineNodes.forEach(node => {
      node.classList.toggle('active', node.dataset.season === seasonKey);
    });

    // 4. Update Dynamic Background Mesh Lights
    appContainer.style.setProperty('--glow-1', config.glow1);
    appContainer.style.setProperty('--glow-2', config.glow2);

    // 5. Trigger Seasonal Particle Transition
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    initParticles(config.particleType);
    animateParticles();

    // Save preference
    localStorage.setItem('festo_default_season', seasonKey);
  }

  // Event Listeners
  themeCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.classList.contains('secondary-link')) return;
      setSeason(card.dataset.season, true);
    });
  });

  segmentButtons.forEach(btn => {
    btn.addEventListener('click', () => setSeason(btn.dataset.season, true));
  });

  timelineNodes.forEach(node => {
    node.addEventListener('click', () => setSeason(node.dataset.season, true));
  });

  // Init default or stored season without autoplay sound block issues
  const savedSeason = localStorage.getItem('festo_default_season') || 'summer';
  setSeason(savedSeason, false);
});