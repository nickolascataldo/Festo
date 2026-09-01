/**
 * ==========================================================================
 * FESTO SUMMER SOLSTICE SANCTUARY ENGINE
 * Features:
 * - 60-Day Rotating Summer Coastal Trivia Engine
 * - Smooth Manual Fact Carousel Switcher
 * - Category Shelf Filtering System
 * - Floating Solar Particle Canvas Engine
 * - Profile & Moniker LocalStorage Persistence
 * ==========================================================================
 */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. 60 CURATED SUMMER SOLSTICE TRIVIA FACTS
     -------------------------------------------------------------------------- */
  const SOLSTICE_FACTS = [
    "The summer solstice marks the longest day of the year in the Northern Hemisphere, occurring around June 20-22.",
    "During the summer solstice, regions north of the Arctic Circle experience 24 continuous hours of daylight known as the Midnight Sun.",
    "The Eiffel Tower grows up to 6 inches taller during the summer due to thermal expansion of the iron structure.",
    "July was named by the Roman Senate in honor of Julius Caesar, who was born in that month.",
    "Watermelon is 92% water, making it one of the most hydrating natural snacks for hot summer days.",
    "The first modern Olympic Games held in the summer took place in Athens, Greece, in 1896.",
    "Sea turtles return to the exact same beaches where they were born to lay their summer eggs.",
    "Fireflies produce cold light through bioluminescence to signal and find mates on warm summer nights.",
    "Thunderstorms are most frequent in summer because warm surface air rises rapidly and collides with cooler upper layers.",
    "August was named after Emperor Augustus Caesar, who chose it because it was the month of his greatest triumphs.",
    "Sunflowers track the sun from east to west throughout the day in a process known as heliotropism.",
    "The dog days of summer refer to the period between July and August when Sirius, the Dog Star, rises with the sun.",
    "Beach sand is primarily composed of quartz (silicon dioxide) formed from weathered coastal rock over millennia.",
    "Coral reefs release trillions of eggs and sperm during synchronized nighttime mass spawning events following summer full moons.",
    "Hummingbirds consume up to twice their body weight in floral nectar every day during the height of summer.",
    "The Earth is actually farthest from the sun during early July (aphelion), but the northern tilt creates summer warmth.",
    "A single colony of honeybees can produce over 60 pounds of wildflower honey during summer peak bloom.",
    "Monarch butterflies born in late summer live up to eight months—much longer than summer generations that live only weeks.",
    "Cricket chirps can indicate ambient temperature: count chirps in 14 seconds and add 40 to estimate degrees Fahrenheit.",
    "The heat island effect causes urban concrete areas to be up to 10°F warmer than surrounding rural countryside.",
    "The first ice cream cone was popularized at the 1904 St. Louis World's Fair when an ice cream vendor teamed up with a waffle maker.",
    "Summer ocean waves are generally gentler than winter waves because storms out at sea are less severe.",
    "Cicadas emerge from underground after spending up to 17 years feeding on summer tree root sap.",
    "The largest wave ever recorded for surfing was 86 feet tall, conquered off the sunny coast of Nazaré.",
    "Flamingos develop their vibrant pink coloration by digesting beta-carotene found in summer brine shrimp.",
    "Popsicles were invented accidentally in 1905 by 11-year-old Frank Epperson when he left soda and a stirring stick outside overnight.",
    "Dragonflies are among the fastest insects in the world, flying up to 35 mph during sunny summer hunts.",
    "Strawberries are the only fruit with seeds on the outside—an average berry has about 200 seeds.",
    "The smell of the ocean is caused by dimethyl sulfide, a sulfur compound produced by coastal marine phytoplankton.",
    "During hot days, butterflies engage in 'puddling' by drinking from mineral-rich mud puddles to obtain salts.",
    "Solar noon occurs when the sun reaches its highest celestial elevation in the sky for the day.",
    "Dolphins produce unique signature whistles to identify themselves to their pods while cruising coastal reefs in summer.",
    "Fresh sweet corn produces natural sugars that begin converting into starch immediately after harvest.",
    "Sea breezes occur because land warms up faster than seawater, causing cool ocean air to rush inland.",
    "The Amazon River basin experiences peak sunshine during its dry summer season from June to November.",
    "Sunscreen was invented in the 1930s by chemist Franz Greiter after he suffered sunburn while climbing Mount Piz Buin.",
    "Summer lightning strikes Earth approximately 100 times every single second.",
    "Mangrove forests act as natural coastal barriers, protecting tropical coastlines from storm swells and tidal erosion.",
    "Lavender fields in Provence, France, reach peak aromatic harvest during the mid-summer months of July and August.",
    "The Arctic tern experiences two summers every year by migrating 44,000 miles from the Arctic to Antarctica and back.",
    "Blue whales can eat up to 4 tons of Antarctic summer krill in a single feeding day.",
    "Sunlight takes approximately 8 minutes and 20 seconds to travel from the surface of the sun to Earth.",
    "Pineapples take nearly two years to grow and develop into a single sweet tropical fruit.",
    "Bioluminescent dinoflagellates create glowing blue waves in coastal lagoons when agitated by moving water.",
    "Warm summer sea temperatures allow tropical cyclones and hurricanes to draw moisture and gain strength.",
    "Seagulls can safely drink both fresh and salt water thanks to specialized salt glands above their eyes.",
    "The ancient festival of Midsummer has been celebrated across northern Europe for centuries with bonfires and flower crowns.",
    "Palm trees are not true trees biologically—they are more closely related to grasses, bamboo, and lilies.",
    "Sea otters wrap themselves in thick giant kelp forests while floating on their backs to keep from drifting out to sea.",
    "Outdoor shade beneath a broad canopy deciduous tree can feel up to 20 degrees cooler than direct sunlight.",
    "The longest recorded continuous swim across open ocean was 140 miles across the Caribbean Sea.",
    "Sunlight stimulates human skin to synthesize vitamin D3, an essential hormone for bone health and immunity.",
    "Humpback whales sing complex, rhythmic songs that can travel hundreds of miles across warm summer waters.",
    "Coconuts are buoyant seeds designed by nature to float across ocean currents to germinate on distant shores.",
    "The solstice sun rises furthest north along the horizon compared to any other day of the year.",
    "Mangos are the most widely consumed fresh fruit in the world, thriving in tropical summer climates.",
    "Geocaching reaches its highest global player participation during long summer solstice weekends.",
    "Tidal pools create miniature ocean ecosystems where starfish, anemones, and crabs thrive between daily tides.",
    "Solar power generation reaches its annual peak during long, cloudless summer solstice days.",
    "Summer twilight (dusk) lasts significantly longer in higher latitudes due to the shallow angle of the sunset."
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
    let currentIndex = getDayIndex() % SOLSTICE_FACTS.length;

    const numDisplay = document.getElementById('factIndexNum');
    const textDisplay = document.getElementById('factDisplayArea');
    const cycleBtn = document.getElementById('nextFactBtn');

    const renderFact = (idx) => {
      if (numDisplay) numDisplay.textContent = (idx + 1).toString().padStart(2, '0');
      if (textDisplay) {
        textDisplay.style.opacity = '0';
        setTimeout(() => {
          textDisplay.textContent = SOLSTICE_FACTS[idx];
          textDisplay.style.opacity = '1';
        }, 150);
      }
    };

    renderFact(currentIndex);

    cycleBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % SOLSTICE_FACTS.length;
      renderFact(currentIndex);
    });
  }

  /* --------------------------------------------------------------------------
     3. PROFILE & SETTINGS LOCALSTORAGE MANAGER
     -------------------------------------------------------------------------- */
  function loadUserProfile() {
    const savedName = localStorage.getItem('festo_user_name') || 'Explorer';
    const savedAvatar = localStorage.getItem('festo_user_avatar') || '☀️';

    const greetingDisplay = document.getElementById('greetingDisplay');
    const userAvatarDisplay = document.getElementById('userAvatarDisplay');
    const usernameInput = document.getElementById('usernameInput');

    if (greetingDisplay) greetingDisplay.textContent = `Welcome, ${savedName}`;
    if (userAvatarDisplay) userAvatarDisplay.textContent = savedAvatar;
    if (usernameInput) usernameInput.value = savedName === 'Explorer' ? '' : savedName;

    document.querySelectorAll('.avatar-option').forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-avatar') === savedAvatar);
    });
  }

  function initSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('openSettingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    let selectedAvatar = localStorage.getItem('festo_user_avatar') || '☀️';

    openBtn?.addEventListener('click', () => modal.classList.add('active'));
    closeBtn?.addEventListener('click', () => modal.classList.remove('active'));

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

      localStorage.setItem('festo_user_name', nameVal);
      localStorage.setItem('festo_user_avatar', selectedAvatar);

      loadUserProfile();
      modal.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     4. 2D FLOATING SOLAR PARTICLES CANVAS ENGINE
     -------------------------------------------------------------------------- */
  class SolarPollen {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.w;
      this.y = Math.random() * this.h;
      this.size = 2 + Math.random() * 4.5;
      this.speedY = -0.3 - Math.random() * 0.8;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = 0.3 + Math.random() * 0.5;
      
      const colors = ['rgba(255, 183, 3, ', 'rgba(251, 133, 0, ', 'rgba(0, 180, 216, '];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > this.w + 10) {
        this.y = this.h + 10;
        this.x = Math.random() * this.w;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffb703';
      ctx.fill();
      ctx.restore();
    }
  }

  function initSolarCanvas() {
    const canvas = document.getElementById('floatingPollenCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 40 }, () => new SolarPollen(canvas.width, canvas.height));

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      requestAnimationFrame(loop);
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
    initSolarCanvas();
    initFactWidget();
    initFilter();
    initSettingsModal();
  });
})();