/**
 * ==========================================================================
 * FESTO CHRISTMAS SANCTUARY ENGINE
 * Features:
 * - Real-Time Live Christmas Day Countdown Engine
 * - 60-Day Rotating Yuletide & Winter Folklore Lore Engine
 * - Smooth Manual Fact Carousel Switcher
 * - Category Shelf Filtering System
 * - Dynamic Snowfall & Ice Sparkle Canvas Particle Engine
 * - Profile & Moniker LocalStorage Persistence
 * ==========================================================================
 */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. 60 CURATED YULETIDE & CHRISTMAS FOLKLORE FACTS
     -------------------------------------------------------------------------- */
  const CHRISTMAS_FACTS = [
    "The tradition of evergreen Christmas trees began in 16th-century Germany, where devout Christians brought decorated fir trees indoors.",
    "Jingle Bells was originally written in 1857 by James Lord Pierpont titled 'One Horse Open Sleigh' for Thanksgiving celebrations.",
    "In Iceland, children leave shoes on windowsills for 13 mischievous Yule Lads who visit during the thirteen nights before Christmas.",
    "The iconic red-and-white Santa Claus suit was widely standardized in the 19th century by political cartoonist Thomas Nast.",
    "A Christmas Carol was written by Charles Dickens in only six weeks in late 1843 to pay off urgent household debts.",
    "The world's tallest cut Christmas tree was a 221-foot Douglas fir erected at Seattle's Northgate Shopping Center in 1950.",
    "In Victorian England, pulling Christmas crackers at the dinner table was invented by confectioner Tom Smith in 1847.",
    "Candy canes were originally created as straight white sugar sticks; their distinctive red stripes and curved hook were added around 1900.",
    "Poinsettia plants are native to Central America and were introduced to the US by diplomat Joel Roberts Poinsett in 1828.",
    "NORAD's famous Santa Tracker began by accident in 1955 when a Sears newspaper ad printed a misdialed telephone number for Santa.",
    "In Poland, Wigilia Christmas Eve dinners traditionally do not begin until the first evening star (Gwiazdka) appears in the night sky.",
    "Rudolph the Red-Nosed Reindeer was created in 1939 by Robert L. May as a promotional booklet for Montgomery Ward department stores.",
    "Mistletoe traditions trace back to ancient Druids who viewed the parasitic green plant as a sacred symbol of peace and vitality.",
    "Silent Night (Stille Nacht) was composed on Christmas Eve in 1818 by Franz Xaver Gruber in the Austrian village of Oberndorf.",
    "In Mexico, Las Posadas commemorates Mary and Joseph's journey from Nazareth to Bethlehem through nine nights of candlelit processions.",
    "Eggnog originated from the medieval English posset, a warm ale-and-milk drink enriched with figs and fragrant spices.",
    "The first commercially printed Christmas card was designed by John Callcott Horsley in London in 1843 for Sir Henry Cole.",
    "In Ukraine, decorating Christmas trees with spider webs and miniature spiders brings good fortune based on an ancient folk legend.",
    "The poinsettia's vibrant red parts are not flower petals, but specialized leaves known botanically as bracts.",
    "During the 1914 Christmas Truce of World War I, British and German soldiers crossed trenches to exchange carols and seasonal greetings.",
    "Gingerbread houses gained widespread European popularity following the 1812 publication of the Brothers Grimm's Hansel and Gretel.",
    "In Norway, folklore says witches and mischievous spirits roam on Christmas Eve, leading families to hide their brooms before sleeping.",
    "The song 'White Christmas' written by Irving Berlin is the best-selling single of all time with over 50 million copies sold.",
    "Tinsel was originally made of hammered shreds of real silver in Nuremberg, Germany, dating back to the early 1600s.",
    "In Japan, dining on fried chicken on Christmas Eve has become a widespread holiday tradition since a 1974 marketing campaign.",
    "The term 'Xmas' dates back to the 16th century, where 'X' represents the Greek letter Chi, the initial letter of Christ.",
    "In Sweden, the Yule Goat (Julbock) is an ancient Scandinavian symbol that predated the modern Santa Claus as a gift-giver.",
    "Frosty the Snowman was written in 1950 following the commercial success of Gene Autry's recording of Rudolph the Red-Nosed Reindeer.",
    "Nutcrackers became associated with good luck and household protection in German folklore before Tchaikovsky's ballet premiered in 1892.",
    "Christmas was declared an official federal holiday in the United States on June 26, 1870, by President Ulysses S. Grant.",
    "In Finland, Santa Claus is known as Joulupukki, meaning 'Yule Goat', who traditionally knocks on the front door rather than using the chimney.",
    "The Twelve Days of Christmas traditionally begin on Christmas Day (December 25) and run through the eve of Epiphany on January 5.",
    "Roast chestnuts became a winter staple in Mediterranean and European cities because chestnuts provided vital nourishment in late autumn.",
    "The Rockefeller Center Christmas Tree tradition began in 1931 when demolition workers pooled money for a small fir tree during construction.",
    "In the Philippines, the Giant Lantern Festival in San Fernando features illuminated caleidoscopic lanterns measuring up to twenty feet.",
    "A yule log was originally an entire tree trunk carefully selected, brought indoors, and kept burning slowly across the winter solstice.",
    "The holly plant's sharp leaves and crimson berries were seen in Celtic tradition as symbols of life enduring through harsh winter frost.",
    "The world's largest gingerbread house, constructed in Bryan, Texas in 2013, spanned nearly 40,000 cubic feet.",
    "Saint Nicholas was a real 4th-century bishop from Myra (modern-day Turkey) renowned for his generous and anonymous gift-giving.",
    "In Italy, La Befana is a kindly old woman who delivers treats and fruit to well-behaved children on the eve of Epiphany.",
    "Cranberries are one of only three fruits native to North America that are commercially cultivated on a major agricultural scale.",
    "The first artificial Christmas trees were manufactured in 19th-century Germany using dyed goose feathers attached to wire branches.",
    "Frankincense and Myrrh are aromatic tree resins harvested from Boswellia and Commiphora trees native to the Arabian Peninsula and Horn of Africa.",
    "In Australia and the Southern Hemisphere, Christmas falls during the summer solstice, leading to popular beach and barbecue celebrations.",
    "The Star of Bethlehem is described in the Gospel of Matthew as guiding the biblical Magi to the birthplace of Jesus.",
    "Wreaths hanging on doors have symbolized eternity and unyielding life since ancient Greek and Roman winter solstice festivals.",
    "The postal code 'H0H 0H0' is assigned by Canada Post to process thousands of children's letters mailed to the North Pole every December.",
    "The song 'Do You Hear What I Hear?' was written in October 1962 as a plea for international peace during the Cuban Missile Crisis.",
    "In Austria and the Alpine regions, Krampus is the folklore companion who accompanies St. Nicholas during early December festivities.",
    "Cinnamon and cloves became classic holiday baking spices during the medieval spice trade due to their warming and preservative properties.",
    "The tradition of kissing under mistletoe was widely recorded in English servant-hall customs by the late 18th century.",
    "In Venezuela, citizens in Caracas traditionally roller-skate to early morning Christmas church services known as Misa de Aguinaldo.",
    "Snowflakes always form hexagonal (six-sided) crystal structures due to the molecular bond geometry of freezing water molecules.",
    "The earliest recorded Christmas celebration in Rome took place on December 25 in 336 AD during the reign of Emperor Constantine.",
    "Wassailing was an ancient English ritual of singing carols and drinking spiced cider in orchards to ensure a bountiful apple harvest.",
    "The Salvation Army's iconic red kettle donation tradition originated in San Francisco in 1891 using a large iron soup pot.",
    "Evergreen boughs were gathered inside during ancient Roman Saturnalia festivals to celebrate Sol Invictus and the return of light.",
    "In Guatemala, families participate in 'La Quema del Diablo' (The Burning of the Devil) in early December to cleanse homes before Christmas.",
    "The word 'carol' originates from the Old French 'carole', describing a circular dance accompanied by lively singers.",
    "Boxing Day, celebrated on December 26 in the Commonwealth, historically originated as a day for tradesmen and servants to receive gift boxes."
  ];

  /* --------------------------------------------------------------------------
     2. REAL-TIME CHRISTMAS DAY COUNTDOWN ENGINE
     -------------------------------------------------------------------------- */
  function initChristmasCountdown() {
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minsEl = document.getElementById('countMins');
    const secsEl = document.getElementById('countSecs');

    function updateCountdown() {
      const now = new Date();
      let targetYear = now.getFullYear();
      let christmasTarget = new Date(targetYear, 11, 25, 0, 0, 0); // Dec 25, 00:00:00

      // If Christmas has passed this year, point to next year
      if (now > christmasTarget) {
        christmasTarget = new Date(targetYear + 1, 11, 25, 0, 0, 0);
      }

      const diff = christmasTarget - now;

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
    let currentIndex = getDayIndex() % CHRISTMAS_FACTS.length;

    const numDisplay = document.getElementById('factIndexNum');
    const textDisplay = document.getElementById('factDisplayArea');
    const cycleBtn = document.getElementById('nextFactBtn');

    const renderFact = (idx) => {
      if (numDisplay) numDisplay.textContent = (idx + 1).toString().padStart(2, '0');
      if (textDisplay) {
        textDisplay.style.opacity = '0';
        setTimeout(() => {
          textDisplay.textContent = CHRISTMAS_FACTS[idx];
          textDisplay.style.opacity = '1';
        }, 150);
      }
    };

    renderFact(currentIndex);

    cycleBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % CHRISTMAS_FACTS.length;
      renderFact(currentIndex);
    });
  }

  /* --------------------------------------------------------------------------
     4. PROFILE & SETTINGS LOCALSTORAGE MANAGER
     -------------------------------------------------------------------------- */
  function loadUserProfile() {
    const savedName = localStorage.getItem('festo_user_name') || 'Explorer';
    const savedAvatar = localStorage.getItem('festo_user_avatar') || '🎄';

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
    let selectedAvatar = localStorage.getItem('festo_user_avatar') || '🎄';

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
     5. 2D SNOWFALL PARTICLES CANVAS ENGINE
     -------------------------------------------------------------------------- */
  class SnowFlake {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.w;
      this.y = -10 - Math.random() * 20;
      this.radius = 1.2 + Math.random() * 2.8;
      this.speedY = 0.6 + Math.random() * 1.4;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.swingStep = Math.random() * Math.PI * 2;
      this.swingSpeed = 0.015 + Math.random() * 0.02;
      this.opacity = 0.4 + Math.random() * 0.55;
    }

    update() {
      this.swingStep += this.swingSpeed;
      this.y += this.speedY;
      this.x += Math.sin(this.swingStep) * 0.8 + this.speedX;

      if (this.y > this.h + 10 || this.x < -10 || this.x > this.w + 10) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.restore();
    }
  }

  function initSnowCanvas() {
    const canvas = document.getElementById('floatingSnowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 48 }, () => {
      const s = new SnowFlake(canvas.width, canvas.height);
      s.y = Math.random() * canvas.height;
      return s;
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
    initChristmasCountdown();
    loadUserProfile();
    initSnowCanvas();
    initFactWidget();
    initFilter();
    initSettingsModal();
  });
})();