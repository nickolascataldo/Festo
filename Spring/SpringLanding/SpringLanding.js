/**
 * ==========================================================================
 * FESTO SPRING SANCTUARY ENGINE
 * Features:
 * - Sanctuary User Settings & Profile LocalStorage Persistence
 * - Harmonized Settings Modal (Housing Switch Seasons Action)
 * - 60-Day Rotating Spring Botanical Trivia Engine
 * - Smooth Manual Fact Carousel Switcher
 * - Category Shelf Filtering System
 * - Dynamic Sakura Petal Fall Canvas Simulation with Adjustable Density
 * ==========================================================================
 */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. 60 CURATED SPRING TRIVIA FACTS
     -------------------------------------------------------------------------- */
  const VERNAL_FACTS = [
    "The first day of spring is called the vernal equinox, where day and night are nearly equal in length across the globe.",
    "Sakura cherry blossom petals fall at a tranquil rate of approximately 5 centimeters per second in gentle wind.",
    "Honeybees begin active meadow foraging as soon as spring temperatures consistently hit 55°F (13°C).",
    "The word 'season' stems from the Old French 'seison', which originates from the Latin 'serere' meaning 'to sow'.",
    "During the vernal equinox, the sun rises due east and sets due west for all observers on Earth.",
    "Spring fever is a real physiological state driven by shifts in daylight, retinal signals, and serotonin cycles.",
    "Cut tulips continue to expand and can grow over an inch taller inside a fresh vase of water.",
    "Daffodils produce natural calcium oxalate crystals that protect them from foraging woodland animals.",
    "In Japan, meteorologists broadcast nightly 'Cherry Blossom Front' radar maps tracking the bloom northward.",
    "Baby birds develop their distinctive musical songs by mimicking adult melodies throughout their first spring.",
    "Petrichor, the earthy scent of spring rain, is produced by geosmin released by actinobacteria in moist soil.",
    "Monarch butterflies travel up to 3,000 miles every spring on their multi-generational journey north.",
    "Early blooming dandelions provide vital nectar and pollen reserves for newly awakened solitary bees.",
    "Spring cleaning traditions trace back centuries to Persian Nowruz rituals and seasonal hearth renovations.",
    "Frogs emerge from mud hibernation in early spring ponds to create their rhythmic dusk choruses.",
    "Maple sap tapping occurs exclusively during early spring when night freezes alternate with sunny thaw days.",
    "Earthworms resurface during spring rains to naturally till and oxygenate garden topsoils.",
    "Ladybugs gather in large groups in early spring to feed on emerging garden aphids.",
    "Bears waking from spring hibernation can lose up to 30% of their total body mass before summer.",
    "Snowdrops and winter crocuses produce natural antifreeze proteins allowing them to pierce through snow.",
    "Rabbits and hares welcome their first spring litters in sheltered warrens starting in early April.",
    "During the equinox at Chichen Itza, sunlight projects an illusion of a feathered serpent sliding down the pyramid.",
    "Lilac blossoms bloom for only two to three weeks, releasing heavy essential oils across garden breezes.",
    "Washington D.C.'s iconic cherry trees were presented in 1912 as a gift of friendship from the city of Tokyo.",
    "Eastern bluebirds return to northern meadows in early spring, signifying renewal in classic folklore.",
    "Raindrops during gentle spring showers fall at speeds ranging between 15 and 20 miles per hour.",
    "Hummingbirds flap their wings up to 80 times per second when arriving at spring nectar feeders.",
    "Magnolia trees evolved millions of years before bees and rely naturally on beetle pollination.",
    "Bud scales protect baby leaves all winter using a natural water-repellent resin shield.",
    "Spring winds distribute tree pollen across woodlands before canopy leaves develop to block airflow.",
    "The Southern Hemisphere welcomes spring in September while the Northern Hemisphere enters autumn.",
    "Red fox kits are born blind in spring underground dens, emerging into the sunlight four weeks later.",
    "Apple blossoms require active cross-pollination from companion tree varieties to yield autumn fruit.",
    "The spring 'dawn chorus' is created by male songbirds establishing nesting boundaries at first light.",
    "Peonies can thrive and produce fragrant spring blooms in garden plots for well over a century.",
    "Garden caterpillars consume massive amounts of spring greenery before weaving their transformation chrysalises.",
    "Strawberries are the first garden fruits to ripen from spring white blossoms into sweet berries.",
    "In the language of flowers, receiving white daisies in spring symbolized innocence and pure beginnings.",
    "The Romans distributed daffodils across Europe, valuing their botanical and decorative beauty.",
    "Nocturnal songbirds navigate northward across continents using constellations in starry spring skies.",
    "Lavender shrubs send out vibrant aromatic shoots as soon as freezing ground temperatures subside.",
    "The scent of freshly trimmed spring grass is an organic defense compound released to help the plant heal.",
    "Crisp spring sunlight angles create sharper, more vibrant double rainbows during passing showers.",
    "Wild turkeys display iridescent plumage and vocal calls across spring forest clearings.",
    "Young sunflower plants exhibit heliotropism, turning from east to west each day toward spring sunlight.",
    "Ancient Mediterranean cultures celebrated spring as the triumphant return of botanical abundance.",
    "Newly hatched ducklings can swim and forage alongside their parents within hours of hatching.",
    "Flowering dogwood blossoms feature white bracts designed to attract pollinators to tiny central florets.",
    "Butterflies possess taste sensors on their feet to evaluate optimal leaves for laying eggs.",
    "Spring features energetic wind patterns caused by collisions between arctic air and equatorial warmth.",
    "Foraging honeybees can navigate five miles from their hive in search of blooming clover fields.",
    "Every vernal flower petals' geometric patterns act as visual ultraviolet runways for pollinating bees.",
    "Willow branches contain natural salicylic acid, which historical gardeners used to root fresh cuttings.",
    "Morning dew forms when ground surfaces cool below the air's dew point under calm spring skies.",
    "Spring ferns unfurl from tightly coiled spiral shapes known affectionately as fiddleheads.",
    "Goldenrod and dandelion roots begin vigorous spring nutrient uptake as ground frost recedes.",
    "Garden robins can consume up to fourteen feet of earthworms in a single active spring feeding day.",
    "Cherry blossoms only maintain their peak bloom for approximately 7 to 10 days before petals fall.",
    "Sunlight duration expands most rapidly per day around the exact date of the vernal equinox.",
    "Botanical gardens around the world register their highest biodiversity activity during the spring season."
  ];

  /* --------------------------------------------------------------------------
     2. DAILY FACT ROTATION & CAROUSEL
     -------------------------------------------------------------------------- */
  function getDayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function initFactWidget() {
    let currentIndex = getDayIndex() % VERNAL_FACTS.length;

    const numDisplay = document.getElementById('factIndexNum');
    const textDisplay = document.getElementById('factDisplayArea');
    const cycleBtn = document.getElementById('nextFactBtn');

    const renderFact = (idx) => {
      if (numDisplay) numDisplay.textContent = (idx + 1).toString().padStart(2, '0');
      if (textDisplay) {
        textDisplay.style.opacity = '0';
        setTimeout(() => {
          textDisplay.textContent = VERNAL_FACTS[idx];
          textDisplay.style.opacity = '1';
        }, 150);
      }
    };

    renderFact(currentIndex);

    cycleBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % VERNAL_FACTS.length;
      renderFact(currentIndex);
    });
  }

  /* --------------------------------------------------------------------------
     3. PROFILE & SETTINGS LOCALSTORAGE MANAGER
     -------------------------------------------------------------------------- */
  let currentPetalDensity = 35;

  function loadUserProfile() {
    const savedName = localStorage.getItem('festo_user_name') || 'Explorer';
    const savedAvatar = localStorage.getItem('festo_user_avatar') || '🌸';
    const savedDensity = parseInt(localStorage.getItem('festo_petal_density') || '35', 10);

    const greetingDisplay = document.getElementById('greetingDisplay');
    const userAvatarDisplay = document.getElementById('userAvatarDisplay');
    const usernameInput = document.getElementById('usernameInput');
    const densitySelect = document.getElementById('petalDensitySelect');

    if (greetingDisplay) greetingDisplay.textContent = `Welcome, ${savedName}`;
    if (userAvatarDisplay) userAvatarDisplay.textContent = savedAvatar;
    if (usernameInput) usernameInput.value = savedName === 'Explorer' ? '' : savedName;
    if (densitySelect) densitySelect.value = savedDensity.toString();

    document.querySelectorAll('.avatar-option').forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-avatar') === savedAvatar);
    });

    currentPetalDensity = savedDensity;
  }

  function initSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('openSettingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    let selectedAvatar = localStorage.getItem('festo_user_avatar') || '🌸';

    openBtn?.addEventListener('click', () => {
      modal?.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => {
      modal?.classList.remove('active');
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    document.querySelectorAll('.avatar-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedAvatar = opt.getAttribute('data-avatar');
      });
    });

    saveBtn?.addEventListener('click', () => {
      const nameVal = document.getElementById('usernameInput')?.value.trim() || 'Explorer';
      const densityVal = parseInt(document.getElementById('petalDensitySelect')?.value || '35', 10);

      localStorage.setItem('festo_user_name', nameVal);
      localStorage.setItem('festo_user_avatar', selectedAvatar);
      localStorage.setItem('festo_petal_density', densityVal.toString());

      loadUserProfile();
      initPetals(); // Re-instantiate physics simulation with new particle density
      modal?.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     4. 2D SAKURA PETALS ENGINE
     -------------------------------------------------------------------------- */
  class BlossomPetal {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.w;
      this.y = -20 - Math.random() * 40;
      this.size = 8 + Math.random() * 12;
      this.speedY = 1.0 + Math.random() * 1.6;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.swingSpeed = 0.02 + Math.random() * 0.03;
      this.swingStep = Math.random() * 100;
      this.opacity = 0.45 + Math.random() * 0.45;

      const colors = ['rgba(255, 117, 143, ', 'rgba(255, 183, 195, ', 'rgba(255, 204, 213, '];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.swingStep += this.swingSpeed;
      this.angle += this.rotationSpeed;
      this.y += this.speedY;
      this.x += Math.sin(this.swingStep) * 1.2 + this.speedX;

      if (this.y > this.h + 20 || this.x < -30 || this.x > this.w + 30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.6, this.size * 1.2, -this.size * 0.2, this.size, this.size * 0.8);
      ctx.bezierCurveTo(this.size * 0.5, this.size * 1.2, -this.size * 0.5, this.size * 0.8, 0, 0);
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  let animationFrameId = null;

  function initPetals() {
    const canvas = document.getElementById('fallingPetalsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const petals = Array.from({ length: currentPetalDensity }, () => {
      const p = new BlossomPetal(canvas.width, canvas.height);
      p.y = Math.random() * canvas.height;
      return p;
    });

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  /* --------------------------------------------------------------------------
     5. SHELF CATEGORY FILTERING
     -------------------------------------------------------------------------- */
  function initFilter() {
    const buttons = document.querySelectorAll('.shelf-filter-bar .pill-btn');
    const volumes = document.querySelectorAll('#volumesGrid .book-tome-wrapper');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        volumes.forEach(vol => {
          const category = vol.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            vol.classList.remove('hidden');
          } else {
            vol.classList.add('hidden');
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     BOOTSTRAP
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initPetals();
    initFactWidget();
    initFilter();
    initSettingsModal();
  });
})();