/**
 * ==========================================================================
 * FESTO — UNIFIED FOUR-SEASON OS (MASTER CONTROL ENGINE)
 * ==========================================================================
 * Features:
 * - Real-Time Astronomical Calendar & Clock Sync
 * - Ambient Seasonal Canvas Particle Simulation
 * - Tactile Realm Filtering & Orbit Telemetry
 * - Dynamic Quick-Preview Drawer with Live Module Telemetry
 * - Pinned Default Realm LocalStorage Engine (Zero Redirect Hijacking)
 * - Informational Architecture & System Modals
 * ==========================================================================
 */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. MASTER REALM REGISTRY & METADATA
     -------------------------------------------------------------------------- */
  const REALM_REGISTRY = {
    spring: {
      name: 'Spring Haven',
      epoch: 'Epoch of Regrowth & Botany',
      icon: '🌸',
      sigil: '🌸',
      orbitLabel: 'VERNAL EQUINOX',
      color: '#ff8fa3',
      path: 'Spring/SpringLanding/SpringLanding.html',
      stats: { books: '1,000+', films: '50 Reels', tools: '7 Modules' },
      summary: 'A botanical sanctuary featuring 50 handcrafted literature shelves, open-air cinema playlists, interactive seed planting wheels, meadow wind harp audio, and flower trail radar maps.'
    },
    summer: {
      name: 'Summer Solstice',
      epoch: 'Epoch of Sunshine & Waves',
      icon: '☀️',
      sigil: '☀️',
      orbitLabel: 'SUMMER SOLSTICE',
      color: '#ffb703',
      path: 'Summer/Summer Landing/SummerLanding.html',
      stats: { books: '1,000+', films: '48 Reels', tools: '8 Modules' },
      summary: 'A sun-drenched coastal retreat featuring sun-bleached teak bookshelves, coastal thriller cinema, beach arcade games, wave rhythm soundscapes, and UV telemetry radar.'
    },
    halloween: {
      name: 'Halloween Hollow',
      epoch: 'Epoch of Shadows & Mystique',
      icon: '🎃',
      sigil: '🎃',
      orbitLabel: 'AUTUMN HARVEST',
      color: '#f77f00',
      path: 'Halloween/Landing Page/LandingPage.html',
      stats: { books: '1,000+', films: '52 Reels', tools: '7 Modules' },
      summary: 'A gothic haven of dark academia grimoires, midnight psychological horror cinema, eerie synthesized music, costume DIY wheels, and haunted excursion trail radars.'
    },
    christmas: {
      name: 'Christmas Sanctuary',
      epoch: 'Epoch of Frost & Warm Hearth',
      icon: '🎄',
      sigil: '🎄',
      orbitLabel: 'WINTER SOLSTICE',
      color: '#e63946',
      path: 'Christmas/Christmas Landing/ChristmasLanding.html',
      stats: { books: '1,000+', films: '50 Reels', tools: '7 Modules' },
      summary: 'A festive fireside sanctuary featuring Yuletide story vaults, classic holiday cinema marathons, roaring hearth acoustics, artisan gift bazaars, and light show radars.'
    }
  };

  /* --------------------------------------------------------------------------
     2. REAL-TIME ASTRONOMICAL SYNC & CLOCK ENGINE
     -------------------------------------------------------------------------- */
  function detectCurrentSeason() {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    if (month >= 2 && month <= 4) return 'spring';     // Mar, Apr, May
    if (month >= 5 && month <= 7) return 'summer';     // Jun, Jul, Aug
    if (month >= 8 && month <= 9) return 'halloween';  // Sep, Oct
    return 'christmas';                                // Nov, Dec, Jan, Feb
  }

  function initRealtimeClockAndTelemetry() {
    const clockEl = document.getElementById('livePortalClock');
    const sigilEl = document.getElementById('activeRealmSigil');
    const orbitLabelEl = document.getElementById('currentOrbitSeason');
    const matchTextEl = document.getElementById('calendarMatchText');
    const fastEnterBtn = document.getElementById('fastEnterBtn');

    const updateClock = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    };

    updateClock();
    setInterval(updateClock, 1000);

    // Sync Astronomical Calendar Suggestion
    const naturalSeasonKey = detectCurrentSeason();
    const config = REALM_REGISTRY[naturalSeasonKey];

    if (sigilEl) sigilEl.textContent = config.sigil;
    if (orbitLabelEl) orbitLabelEl.textContent = config.orbitLabel;
    if (matchTextEl) {
      matchTextEl.innerHTML = `Current Seasonal Realm: <strong>${config.name}</strong>`;
    }
    if (fastEnterBtn) {
      fastEnterBtn.setAttribute('href', config.path);
    }
  }

  /* --------------------------------------------------------------------------
     3. AMBIENT PARTICLE ENGINE (4-SEASON HARMONY)
     -------------------------------------------------------------------------- */
  class AmbientParticle {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.w;
      this.y = Math.random() * this.h;
      this.size = 1.5 + Math.random() * 3.5;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = 0.2 + Math.random() * 0.45;
      
      const colors = ['#e5b869', '#ff8fa3', '#ffb703', '#f77f00', '#e63946', '#2a9d8f'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < -10 || this.x > this.w + 10 || this.y < -10 || this.y > this.h + 10) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  let particleCanvas, particleCtx, particles = [];
  const PARTICLE_COUNT = 38;

  function initAmbientParticles() {
    particleCanvas = document.getElementById('seasonalParticlesCanvas');
    if (!particleCanvas) return;
    particleCtx = particleCanvas.getContext('2d');

    const resize = () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particles = Array.from({ length: PARTICLE_COUNT }, () => new AmbientParticle(particleCanvas.width, particleCanvas.height));

    const loop = () => {
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(p => {
        p.update();
        p.draw(particleCtx);
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* --------------------------------------------------------------------------
     4. TACTILE REALM FILTERING
     -------------------------------------------------------------------------- */
  function initRealmFilterTabs() {
    const tabs = document.querySelectorAll('.realm-filter-tab');
    const cards = document.querySelectorAll('.realm-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const season = tab.getAttribute('data-season');

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        cards.forEach(card => {
          const realm = card.getAttribute('data-realm');
          if (season === 'all' || realm === season) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. PINNED DEFAULT REALM ENGINE (NO FORCED REDIRECTS)
     -------------------------------------------------------------------------- */
  function syncDefaultUI(pinnedRealm) {
    // 1. Sync config pills
    document.querySelectorAll('.config-pill-btn').forEach(btn => {
      const realm = btn.getAttribute('data-default');
      btn.classList.toggle('active', realm === pinnedRealm);
    });

    // 2. Sync card status badges
    ['spring', 'summer', 'halloween', 'christmas'].forEach(realm => {
      const badge = document.getElementById(`${realm}-default-badge`);
      if (badge) {
        badge.classList.toggle('visible', realm === pinnedRealm);
      }
    });

    // 3. Sync bookmark icon states inside card action rows
    document.querySelectorAll('.btn-bookmark-realm').forEach(btn => {
      const realm = btn.getAttribute('data-bookmark');
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');

      if (realm === pinnedRealm) {
        btn.style.borderColor = 'var(--gold-accent)';
        btn.style.color = 'var(--gold-accent)';
        if (icon) icon.className = 'fa-solid fa-bookmark';
        if (label) label.textContent = 'Pinned';
      } else {
        btn.style.borderColor = '';
        btn.style.color = '';
        if (icon) icon.className = 'fa-regular fa-bookmark';
        if (label) label.textContent = 'Pin Default';
      }
    });
  }

  function initDefaultBookmarkManager() {
    let savedPinned = localStorage.getItem('festo_default_season');
    syncDefaultUI(savedPinned);

    const togglePin = (realmKey) => {
      const current = localStorage.getItem('festo_default_season');
      if (current === realmKey) {
        localStorage.removeItem('festo_default_season');
        syncDefaultUI(null);
      } else {
        localStorage.setItem('festo_default_season', realmKey);
        syncDefaultUI(realmKey);
      }
    };

    // Bottom config pills
    document.querySelectorAll('.config-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const realm = btn.getAttribute('data-default');
        togglePin(realm);
      });
    });

    // Card bookmark buttons
    document.querySelectorAll('.btn-bookmark-realm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const realm = btn.getAttribute('data-bookmark');
        togglePin(realm);
      });
    });

    // Reset button in top header
    document.getElementById('resetDefaultBtn')?.addEventListener('click', () => {
      localStorage.removeItem('festo_default_season');
      syncDefaultUI(null);
      alert('Default realm preference reset.');
    });

    // Scroll to preferences on gear click
    document.getElementById('openMasterSettingsBtn')?.addEventListener('click', () => {
      const panel = document.querySelector('.master-config-panel');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* --------------------------------------------------------------------------
     6. INTERACTIVE QUICK-PREVIEW DRAWER
     -------------------------------------------------------------------------- */
  function initInspectDrawer() {
    const modal = document.getElementById('inspectModal');
    const drawerIcon = document.getElementById('drawerIcon');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerSub = document.getElementById('drawerSub');
    const statsGrid = document.getElementById('drawerStatsGrid');
    const summaryText = document.getElementById('drawerSummaryText');
    const launchBtn = document.getElementById('drawerLaunchBtn');
    const closeBtn = document.getElementById('drawerCloseBtn');

    document.querySelectorAll('[data-inspect]').forEach(btn => {
      btn.addEventListener('click', () => {
        const realmKey = btn.getAttribute('data-inspect');
        const realm = REALM_REGISTRY[realmKey];
        if (!realm) return;

        if (drawerIcon) drawerIcon.textContent = realm.icon;
        if (drawerTitle) drawerTitle.textContent = realm.name;
        if (drawerSub) drawerSub.textContent = realm.epoch;
        if (summaryText) summaryText.textContent = realm.summary;
        if (launchBtn) launchBtn.setAttribute('href', realm.path);

        if (statsGrid) {
          statsGrid.innerHTML = `
            <div class="stat-box">
              <div class="stat-val">${realm.stats.books}</div>
              <div class="stat-key">Curated Books</div>
            </div>
            <div class="stat-box">
              <div class="stat-val">${realm.stats.films}</div>
              <div class="stat-key">Cinema Chambers</div>
            </div>
            <div class="stat-box">
              <div class="stat-val">${realm.stats.tools}</div>
              <div class="stat-key">Pavilion Tools</div>
            </div>
          `;
        }

        modal?.classList.add('active');
      });
    });

    closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     7. SYSTEM DOCUMENTATION MODALS
     -------------------------------------------------------------------------- */
  const DOC_REGISTRY = {
    about: {
      title: 'Unified Architecture',
      body: 'Festo is engineered as a single-page progressive OS container connecting four seasonal realms (Spring Haven, Summer Solstice, Halloween Hollow, and Christmas Sanctuary). Each realm features dedicated offline-first architectures for books, cinema, maps, audio, and tools.'
    },
    timeline: {
      title: 'Seasonal Astronomical Calendar',
      body: 'Festo synchronizes in real time with the solar calendar:\n\n• Spring Equinox (March – May)\n• Summer Solstice (June – August)\n• Autumn Harvest & Halloween (September – October)\n• Winter Solstice & Yuletide (November – February)'
    },
    roadmap: {
      title: 'Module Specifications',
      body: 'Each of the four realms contains dedicated sub-applications:\n\n1. Interactive Activity Wheels\n2. 50-Shelf 3D Bookshelves\n3. Curated Cinema Meadows\n4. Synthesized Audio Jukeboxes\n5. Radial Exploration Maps\n6. Seasonal Lifestyle Boutiques\n7. Solar & UV Weather Telemetry'
    },
    privacy: {
      title: 'Local Privacy Architecture',
      body: 'All personal preferences, favorites, reading list items, and pinned default realm selections are strictly stored on-device via HTML5 LocalStorage. No user telemetry is harvested or transmitted externally.'
    },
    contact: {
      title: 'Creator & Support Contact',
      body: 'Direct inquiries, feature requests, or archival metadata submissions can be transmitted to contact@festo.app.'
    },
    legal: {
      title: 'Archival Licensure & Metadata',
      body: 'Motion picture archival metadata and literary artwork are retrieved asynchronously via Wikimedia Commons and Open Library REST APIs under Creative Commons (CC BY-SA) licensing.'
    }
  };

  function initDocModals() {
    const modal = document.getElementById('infoModal');
    const titleEl = document.getElementById('infoModalTitle');
    const bodyEl = document.getElementById('infoModalBody');
    const closeBtn = document.getElementById('infoModalCloseBtn');

    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const key = trigger.getAttribute('data-modal');
        const doc = DOC_REGISTRY[key];
        if (!doc) return;

        if (titleEl) titleEl.textContent = doc.title;
        if (bodyEl) bodyEl.innerText = doc.body;

        modal?.classList.add('active');
      });
    });

    closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     8. SYSTEM INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initRealtimeClockAndTelemetry();
    initAmbientParticles();
    initRealmFilterTabs();
    initDefaultBookmarkManager();
    initInspectDrawer();
    initDocModals();
  });
})();