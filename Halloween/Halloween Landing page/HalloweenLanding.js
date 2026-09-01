/**
 * ==========================================================================
 * FESTO HALLOWEEN HOLLOW SANCTUARY ENGINE
 * Features:
 * - Real-Time Live Halloween Countdown Engine
 * - 60-Day Rotating Halloween & Gothic Trivia Engine
 * - Smooth Manual Fact Carousel Switcher
 * - Category Shelf Filtering System
 * - Floating Ember Canvas Simulation Engine
 * - Profile & Moniker LocalStorage Persistence
 * ==========================================================================
 */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. 60 CURATED HALLOWEEN TRIVIA FACTS
     -------------------------------------------------------------------------- */
  const HALLOWEEN_FACTS = [
    "Halloween's origins date back over 2,000 years to the ancient Celtic festival of Samhain.",
    "Jack-o'-Lanterns were originally carved from turnips and potatoes in Ireland and Scotland, not pumpkins.",
    "The world's heaviest pumpkin ever recorded weighed over 2,700 pounds.",
    "Black cats were associated with witches in medieval folklore because they were believed to be shapeshifters or 'familiars'.",
    "Trick-or-treating became widely popularized in the United States during the late 1930s.",
    "Candy corn was invented in the 1880s by George Renninger and was originally called 'Chicken Feed'.",
    "The word 'witch' comes from the Old English 'wicce', meaning 'wise woman'.",
    "Owls were feared in medieval times because their nocturnal calls were believed to foretell an impending death.",
    "In Mexico, Día de los Muertos (Day of the Dead) is celebrated from October 31 to November 2 to honor deceased loved ones.",
    "Bram Stoker's classic 1897 novel 'Dracula' was originally titled 'The Un-Dead'.",
    "Full moons on Halloween are rare, occurring roughly once every 18 to 19 years.",
    "Spiders are associated with Halloween because cobwebs naturally gather in eerie, abandoned places.",
    "Bobbing for apples originated as a Roman courting ritual dedicated to Pomona, the goddess of fruit and trees.",
    "The fear of Halloween is medically known as Samhainophobia.",
    "Illinois produces more pumpkins than any other state in the United States.",
    "In Hong Kong, the Halloween festival is known as Yue Lan, or the Festival of the Hungry Ghosts.",
    "Bats are celebrated on Halloween because Celtic bonfires attracted insects, which in turn drew large bat swarms.",
    "The Michael Myers mask in the 1978 movie 'Halloween' was actually a modified William Shatner Captain Kirk mask painted white.",
    "Celtic people wore grotesque masks during Samhain to disguise themselves so wandering spirits would mistake them for fellow phantoms.",
    "Over 10% of annual candy sales in the United States occur directly during the Halloween season.",
    "Transylvania, the fictional home of Count Dracula, is a real historical region located in central Romania.",
    "Gargoyles were carved onto medieval cathedrals as water spouts designed to ward off malevolent spirits.",
    "The classic Mexican tradition of Calaveras (sugar skulls) represents the sweetness of life and departed souls.",
    "In the Victorian era, young women peeled apples in one long strip on Halloween and threw it over their shoulder to divine their future spouse's initial.",
    "Sleepy Hollow, New York, the setting of Washington Irving's headless horseman tale, was originally called North Tarrytown.",
    "Vampire bats do exist in real life, native to Central and South America, and feed primarily on livestock blood.",
    "The legendary Salem Witch Trials took place in colonial Massachusetts between February 1692 and May 1693.",
    "Raven symbolism in gothic folklore represents wisdom, prophecy, and the bridge between the physical and spirit worlds.",
    "White pumpkins, often nicknamed 'Ghost Pumpkins' or 'Casper Pumpkins', are prized for their eerie appearance.",
    "Mary Shelley conceived the story of Frankenstein during a cold, stormy summer in Switzerland in 1816 when she was just 18.",
    "The legendary banshee in Irish mythology is an ancestral spirit whose mournful wailing warns of a coming tragedy.",
    "Pumpkins are scientifically classified as fruits because they contain seeds and develop from the flower of the plant.",
    "In ancient Celtic lore, the veil between the living and the spirit realm grew thin on the night of October 31st.",
    "Edgar Allan Poe's famous poem 'The Raven' was first published in January 1845, earning him immediate global fame.",
    "A cauldron historically represented the womb of the earth goddess, symbolizing transformation, brewing, and rebirth.",
    "Black and orange are the traditional colors of Halloween, representing darkness/death and the autumn harvest respectively.",
    "The ghost ship 'The Flying Dutchman' was famously cursed to sail the oceans forever without ever making port.",
    "Night-blooming flowers like the Moonflower and Night Phlox only release their fragrance after dusk.",
    "The Bell Witch of Tennessee is one of the most documented ghost legends in American folklore history.",
    "Mummies were wrapped in hundreds of yards of linen by ancient Egyptians to preserve their body for the afterlife.",
    "The Winchester Mystery House in California features 160 rooms built continuously to confuse supposed vengeful spirits.",
    "Fog forms near ground level when moist air cools to its dew point, creating the atmospheric mist of autumn nights.",
    "The gargoyle 'Stryge' atop Notre-Dame Cathedral in Paris is famous for resting its head in its hands as it overlooks the city.",
    "In medieval times, hazelnut divination was practiced on Halloween to test lovers' devotion by tossing nuts into the fireplace.",
    "The term 'ghoul' originates from Arabic folklore ('ghul'), referring to desert demons that haunt burial grounds.",
    "Ouija boards were originally patented in 1890 as an innocent parlor game before gaining their mystical reputation.",
    "A group of ravens is called an 'unkindness' or a 'conspiracy', fitting their gothic reputation.",
    "Gargoyles get their name from the French word 'gargouille', which means 'throat' or 'gullet'.",
    "The catacombs beneath Paris contain the skeletal remains of more than six million people.",
    "Gothic literature emerged in the late 18th century with Horace Walpole's 1764 novel 'The Castle of Otranto'.",
    "Ancient Romans celebrated Feralia in late February to honor the peaceful rest of the dead.",
    "Will-o'-the-wisps are glowing marsh lights caused by the natural ignition of phosphine and methane gases.",
    "The phrase 'hocus pocus' may have originated from parodying Latin incantations used in early stage magic.",
    "The Tower of London is said to be haunted by numerous royal ghosts, including Anne Boleyn and Lady Jane Grey.",
    "Black candles in medieval rituals were used to absorb negative energies and establish protective barriers.",
    "The largest Jack-o'-Lantern ever carved was created from a 2,096-pound pumpkin in 2010.",
    "Werewolf mythology dates back to ancient Greek legends, notably the story of King Lycaon punished by Zeus.",
    "Autumn leaves change color because trees stop producing green chlorophyll, revealing natural orange carotenes and red anthocyanins.",
    "Cemeteries facing east in historical traditions were aligned toward the sunrise, symbolizing resurrection and hope.",
    "October is the peak month for ghost hunting expeditions across historical heritage sites worldwide."
  ];

  /* --------------------------------------------------------------------------
     2. REAL-TIME HALLOWEEN COUNTDOWN ENGINE
     -------------------------------------------------------------------------- */
  function initHalloweenCountdown() {
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minsEl = document.getElementById('countMins');
    const secsEl = document.getElementById('countSecs');

    function updateCountdown() {
      const now = new Date();
      let targetYear = now.getFullYear();
      let halloweenTarget = new Date(targetYear, 9, 31, 23, 59, 59); // Oct 31

      // If Halloween has already passed this year, count down to next year's
      if (now > halloweenTarget) {
        halloweenTarget = new Date(targetYear + 1, 9, 31, 23, 59, 59);
      }

      const diff = halloweenTarget - now;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = d.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
      if (minsEl) minsEl.textContent = m.toString().padStart(2, '0');
      if (secsEl) secsEl.textContent = s.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* --------------------------------------------------------------------------
     3. DAILY FACT ROTATION & CAROUSEL
     -------------------------------------------------------------------------- */
  function getDayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function initFactWidget() {
    let currentIndex = getDayIndex() % HALLOWEEN_FACTS.length;

    const numDisplay = document.getElementById('factIndexNum');
    const textDisplay = document.getElementById('factDisplayArea');
    const cycleBtn = document.getElementById('nextFactBtn');

    const renderFact = (idx) => {
      if (numDisplay) numDisplay.textContent = (idx + 1).toString().padStart(2, '0');
      if (textDisplay) {
        textDisplay.style.opacity = '0';
        setTimeout(() => {
          textDisplay.textContent = HALLOWEEN_FACTS[idx];
          textDisplay.style.opacity = '1';
        }, 150);
      }
    };

    renderFact(currentIndex);

    cycleBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % HALLOWEEN_FACTS.length;
      renderFact(currentIndex);
    });
  }

  /* --------------------------------------------------------------------------
     4. PROFILE & SETTINGS LOCALSTORAGE MANAGER
     -------------------------------------------------------------------------- */
  function loadUserProfile() {
    const savedName = localStorage.getItem('festo_user_name') || 'Explorer';
    const savedAvatar = localStorage.getItem('festo_user_avatar') || '🎃';

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
    let selectedAvatar = localStorage.getItem('festo_user_avatar') || '🎃';

    openBtn?.addEventListener('click', () => modal?.classList.add('active'));
    closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));

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
      modal?.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     5. 2D FLOATING EMBER PARTICLES CANVAS ENGINE
     -------------------------------------------------------------------------- */
  class SpookyEmber {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.w;
      this.y = this.h + Math.random() * 20;
      this.size = 2 + Math.random() * 4.5;
      this.speedY = -0.3 - Math.random() * 0.8;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = 0.3 + Math.random() * 0.55;
      
      const colors = ['rgba(255, 117, 0, ', 'rgba(232, 93, 4, ', 'rgba(157, 78, 221, ', 'rgba(255, 183, 3, '];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > this.w + 10) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff7500';
      ctx.fill();
      ctx.restore();
    }
  }

  function initEmbersCanvas() {
    const canvas = document.getElementById('floatingEmbersCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 42 }, () => {
      const p = new SpookyEmber(canvas.width, canvas.height);
      p.y = Math.random() * canvas.height;
      return p;
    });

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
     6. SHELF CATEGORY FILTERING
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
    initHalloweenCountdown();
    loadUserProfile();
    initEmbersCanvas();
    initFactWidget();
    initFilter();
    initSettingsModal();
  });
})();