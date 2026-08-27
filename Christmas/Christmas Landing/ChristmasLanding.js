/**
 * ==========================================================================
 * THE ENCHANTED 3D SNOWGLOBE VILLAGE — MASTER JAVASCRIPT ENGINE
 * File: ChristmasLanding.js
 * 
 * Powered by Three.js (r128), OrbitControls, and GSAP
 * ==========================================================================
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. DESTINATIONS DATABASE (9 THEMED HOLIDAY REALMS)
     ========================================================================== */
  const DESTINATIONS = {
    movies: {
      id: 'movies',
      title: 'Christmas Cinema & Drive-In',
      tagline: 'Holiday Classics & Screenings',
      category: 'ENTERTAINMENT REALM',
      categoryIcon: 'fa-film',
      color: 0xd42426,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      description: 'Step into the snow-dusted cinema hall screening seasonal favorites from Home Alone to The Polar Express with a crackling fireplace and warm peppermint cocoa on tap.',
      btnText: 'OPEN CHRISTMAS MOVIES',
      stats: [
        { number: '50+', label: 'MOVIES' },
        { number: '4K', label: 'STREAMING' },
        { number: '100%', label: 'FESTIVE' }
      ],
      highlights: [
        'Curated Holiday Playlists & Watchlists',
        'Vintage Black-and-White Classics Collection',
        'Kids & Family Animation Screenings'
      ]
    },
    reads: {
      id: 'reads',
      title: 'Storybook Nook & Library',
      tagline: 'Winter Tales & Fireside Classics',
      category: 'LITERATURE REALM',
      categoryIcon: 'fa-book-bookmark',
      color: 0x247ba0,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      description: 'A glowing cedar library with a giant book-shaped roof stacked with Dickens’ A Christmas Carol, The Nutcracker, poetry, and bedtime stories by candle glow.',
      btnText: 'EXPLORE BOOK CATALOG',
      stats: [
        { number: '120+', label: 'STORIES' },
        { number: 'AUDIO', label: 'NARRATION' },
        { number: 'COZY', label: 'AMBIANCE' }
      ],
      highlights: [
        'Interactive Illustrated Holiday Storybooks',
        'Fireside Audiobooks & Ambient Winter Rain',
        'Printable Family Reading Checklists'
      ]
    },
    store: {
      id: 'store',
      title: 'North Pole Toy Emporium',
      tagline: 'Artisan Gifts & Handcrafted Ornaments',
      category: 'BOUTIQUE REALM',
      categoryIcon: 'fa-gift',
      color: 0xf4c430,
      image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
      description: 'Styled like a wrapped Christmas gift box with a giant golden bow. Shop handcrafted Nutcrackers, artisan glass globes, wool stockings, and glowing winter decor.',
      btnText: 'ENTER HOLIDAY STORE',
      stats: [
        { number: '250+', label: 'ITEMS' },
        { number: 'HAND', label: 'CRAFTED' },
        { number: 'GLOBAL', label: 'DISPATCH' }
      ],
      highlights: [
        'Artisan Glass Snowglobes & Nutcrackers',
        'Personalized Christmas Tree Baubles',
        'Festive Knit Apparel & Wool Stockings'
      ]
    },
    map: {
      id: 'map',
      title: 'Christmas Town Radar Map',
      tagline: 'Interactive North Pole Coordinates',
      category: 'CARTOGRAPHY REALM',
      categoryIcon: 'fa-map-location-dot',
      color: 0x2ec4b6,
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
      description: 'A high-tech radar navigation tower with a spinning parabolic dish. View nearby holiday attractions, ice-skating rinks, tree farms, and Christmas light shows.',
      btnText: 'OPEN HOLIDAY MAP',
      stats: [
        { number: '18+', label: 'ZONES' },
        { number: 'GPS', label: 'TELEMETRY' },
        { number: '3D', label: 'RADAR' }
      ],
      highlights: [
        'Live Village Coordinates & Waypoints',
        'Nearby Ice Skating & Light Show Locator',
        'Interactive Waypoint Route Planner'
      ]
    },
    music: {
      id: 'music',
      title: 'Carolers Jukebox Pavilion',
      tagline: 'Holiday Swing & Traditional Carols',
      category: 'HARMONY REALM',
      categoryIcon: 'fa-music',
      color: 0x9b5de5,
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      description: 'An open-air acoustic gazebo pavilion streaming festive big band swing, cozy acoustic hearth guitar, orchestral choral carols, and lo-fi winter beats.',
      btnText: 'LAUNCH HOLIDAY JUKEBOX',
      stats: [
        { number: '4', label: 'PLAYLISTS' },
        { number: 'LOSSLESS', label: 'AUDIO' },
        { number: '24/7', label: 'STREAM' }
      ],
      highlights: [
        'Big Band Holiday Swing & Vinyl Jazz',
        'Traditional Church Choirs & Carols',
        'Cozy Fireside Lofi Instrumental Beats'
      ]
    },
    game: {
      id: 'game',
      title: 'Elf Workshop Arcade',
      tagline: 'Holiday Mini-Games & Decorator',
      category: 'ARCADE REALM',
      categoryIcon: 'fa-gamepad',
      color: 0x00bbf9,
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
      description: 'Topped with a spinning golden clockwork gear. Play Christmas tree decorating challenges, snowflake pattern cutting, and physics-based present-wrapping mini-games.',
      btnText: 'PLAY ARCADE GAMES',
      stats: [
        { number: '8', label: 'MINI-GAMES' },
        { number: 'HIGH', label: 'SCORES' },
        { number: 'BADGES', label: 'UNLOCKABLE' }
      ],
      highlights: [
        'Ornament Physics & Tree Decorator',
        'Snowflake Stencil & Origami Cutter',
        'Elf Present Assembly Line Blitz'
      ]
    },
    tracker: {
      id: 'tracker',
      title: 'Santa Flight Radar Tower',
      tagline: 'Live Sleigh Tracking & Telemetry',
      category: 'OBSERVATORY REALM',
      categoryIcon: 'fa-satellite-dish',
      color: 0x00f5d4,
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800&auto=format&fit=crop&q=80',
      description: 'An astronomical observatory tower with a golden telescope and rotating beacon tracking Santa’s live supersonic sleigh flight path across all worldwide time zones.',
      btnText: 'OPEN SLEIGH RADAR',
      stats: [
        { number: 'LIVE', label: 'TRACKING' },
        { number: 'MACH 9', label: 'SPEED' },
        { number: '2.4B', label: 'GIFTS' }
      ],
      highlights: [
        'Real-Time Chimney Route Radar',
        'Reindeer Resting & Weather Telemetry',
        'Worldwide Time Zone Countdown Clock'
      ]
    },
    letters: {
      id: 'letters',
      title: 'North Pole Dispatch Post Office',
      tagline: 'Send Direct Letters to Santa',
      category: 'DISPATCH REALM',
      categoryIcon: 'fa-envelope',
      color: 0xff6b6b,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
      description: 'Features a giant wax-sealed envelope sign and red express drop boxes. Type out your personalized digital wishlist and dispatch it straight to Santa’s main workshop desk.',
      btnText: 'WRITE LETTER TO SANTA',
      stats: [
        { number: 'EXPRESS', label: 'DELIVERY' },
        { number: 'WAX', label: 'SEALED' },
        { number: 'DIRECT', label: 'REPLY' }
      ],
      highlights: [
        'Digital Wishlist Builder & Stamp Creator',
        'Personalized Wax Seal Stamp Customizer',
        'Direct Elf Dispatch Certificate Receipt'
      ]
    },
    bakery: {
      id: 'bakery',
      title: 'Sugarplum Sweets & Cocoa Mill',
      tagline: 'Fresh Gingerbread & Spiced Cocoa',
      category: 'CULINARY REALM',
      categoryIcon: 'fa-cookie-bite',
      color: 0xf15bb5,
      image: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=800&auto=format&fit=crop&q=80',
      description: 'A gingerbread windmill with rotating peppermint candy sails serving piping-hot oven-fresh cookies, frosted cinnamon rolls, and rich marshmallow-topped cocoa.',
      btnText: 'VIEW BAKERY MENU',
      stats: [
        { number: '30+', label: 'RECIPES' },
        { number: 'FRESH', label: 'BAKED' },
        { number: 'HOT', label: 'COCOA' }
      ],
      highlights: [
        'Interactive Cookie Frosting Designer',
        'Gourmet Hot Cocoa Mix Selector',
        'Printable Holiday Bake-Off Recipes'
      ]
    }
  };

  /* ==========================================================================
     2. THREE.JS ENGINE STATE & COORDINATES
     ========================================================================== */
  let scene, camera, renderer, controls;
  let raycaster, mouse;
  let snowflakeGeometry, snowParticles;
  let glassSphereMesh, basePedestalGroup;

  let interactiveBuildingMeshes = [];
  let animatedObjects = {
    train: null,
    trainAngle: 0,
    trainSpeed: 0.015,
    windmillBlades: null,
    radarDish: null,
    workshopGear: null,
    santaSleigh: null,
    sleighAngle: 0,
    sleighSpeed: 0.008,
    treeLights: []
  };
  let hoveredObject = null;

  // Camera Spatial Layout
  const CAMERA_ORBIT_POS = { x: 0, y: 15, z: 48 };
  const CAMERA_VILLAGE_POS = { x: 0, y: 16, z: 22 };
  const CAMERA_VILLAGE_TARGET = { x: 0, y: 1.5, z: 0 };

  let isInsideVillage = false;
  let isAudioPlaying = false;
  let audioCtx = null;
  let melodyInterval = null;

  /* ==========================================================================
     3. ASSET PRELOADER
     ========================================================================== */
  function simulatePreloader(onComplete) {
    const preloader = document.getElementById('experiencePreloader');
    const fill = document.getElementById('preloaderProgressFill');
    const percentage = document.getElementById('preloaderPercentage');
    const statusText = document.getElementById('preloaderStatusText');

    const statuses = [
      'Blowing snow onto cobblestone paths...',
      'Polishing crystal snowglobe glass...',
      'Firing up the Holiday Express train...',
      'Lighting up 9 festive destinations...',
      'Welcome to the Enchanted Village!'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress > 100) progress = 100;

      if (fill) fill.style.width = `${progress}%`;
      if (percentage) percentage.textContent = `${progress}%`;

      const statusIndex = Math.min(Math.floor((progress / 100) * statuses.length), statuses.length - 1);
      if (statusText) statusText.textContent = statuses[statusIndex];

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (preloader) preloader.classList.add('loaded');
          if (typeof onComplete === 'function') onComplete();
        }, 300);
      }
    }, 100);
  }

  /* ==========================================================================
     4. PROCEDURAL 3D SCENE & ENGINE ASSEMBLY
     ========================================================================== */
  function initThreeScene() {
    const canvas = document.getElementById('webglCanvas');
    if (!canvas) return;

    // 1. Scene, Camera, and Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.012);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(CAMERA_ORBIT_POS.x, CAMERA_ORBIT_POS.y, CAMERA_ORBIT_POS.z);

    // 2. Renderer with Proper Tone Mapping & Depth Sorting
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. OrbitControls Constructor with Namespace Fallbacks
    const ControlsConstructor = THREE.OrbitControls || window.OrbitControls;
    if (ControlsConstructor) {
      controls = new ControlsConstructor(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 + 0.05;
      controls.minDistance = 10;
      controls.maxDistance = 65;
      controls.target.set(0, 3.5, 0);
    }

    // 4. Raycaster & Coordinates
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-100, -100);

    // 5. Build Environment
    setupLighting();
    createSnowglobeEnclosure();
    createLivingTerrain();
    createCentralTownSquare();
    createThemedArchitecturalRealms();
    createKineticEntities();
    createSnowstormSystem();

    // 6. Global Interaction Handlers
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    // 7. Start Render Loop
    animate();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xd5e8ff, 0.95);
    scene.add(ambientLight);

    const moonlight = new THREE.DirectionalLight(0x99e6ff, 2.0);
    moonlight.position.set(30, 50, 25);
    moonlight.castShadow = true;
    moonlight.shadow.mapSize.width = 1024;
    moonlight.shadow.mapSize.height = 1024;
    scene.add(moonlight);

    // Warm Town Center Illumination
    const townLight = new THREE.PointLight(0xffbe3b, 3.2, 35);
    townLight.position.set(0, 6, 0);
    scene.add(townLight);
  }

  function createSnowglobeEnclosure() {
    // Crystal Glass Sphere (Uses MeshStandardMaterial with depthWrite false for crystal clarity)
    const glassGeo = new THREE.SphereGeometry(18.5, 48, 48);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xcaebff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.1,
      depthWrite: false,
      side: THREE.FrontSide
    });

    glassSphereMesh = new THREE.Mesh(glassGeo, glassMat);
    glassSphereMesh.position.set(0, 9, 0);
    glassSphereMesh.renderOrder = 10;
    scene.add(glassSphereMesh);

    // Carved Mahogany and Brass Pedestal
    basePedestalGroup = new THREE.Group();

    const woodBaseGeo = new THREE.CylinderGeometry(18.6, 21.2, 6.8, 48);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x240e04, roughness: 0.45, metalness: 0.15 });
    const woodBase = new THREE.Mesh(woodBaseGeo, woodMat);
    woodBase.position.y = -7.8;
    basePedestalGroup.add(woodBase);

    const brassRingGeo = new THREE.TorusGeometry(18.8, 0.5, 16, 64);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf4c430, roughness: 0.25, metalness: 0.85 });
    const brassRing = new THREE.Mesh(brassRingGeo, brassMat);
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = -4.5;
    basePedestalGroup.add(brassRing);

    scene.add(basePedestalGroup);
  }

  function createLivingTerrain() {
    // Snow-Covered Terrain Plane
    const terrainGeo = new THREE.CylinderGeometry(18.0, 18.0, 2.5, 48);
    const terrainMat = new THREE.MeshStandardMaterial({ color: 0xf4f9ff, roughness: 0.9, metalness: 0.05 });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -2.8;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Cobblestone Circular Ring Road
    const roadGeo = new THREE.RingGeometry(8.5, 13.8, 48);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x8a9bb2, roughness: 0.85, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -1.53;
    road.receiveShadow = true;
    scene.add(road);

    // Center Frozen Skating Pond
    const pondGeo = new THREE.CircleGeometry(5.4, 32);
    const pondMat = new THREE.MeshStandardMaterial({ color: 0x6bb8e4, roughness: 0.1, metalness: 0.75 });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.y = -1.52;
    scene.add(pond);

    // 8 Victorian Street Lamp Posts
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.3;
      const x = Math.cos(angle) * 7.4;
      const z = Math.sin(angle) * 7.4;

      const post = new THREE.Group();
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 1.2;
      post.add(pole);

      const lampGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffe077 });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.y = 2.4;
      post.add(lamp);

      post.position.set(x, -1.5, z);
      scene.add(post);
    }
  }

  function createCentralTownSquare() {
    const squareGroup = new THREE.Group();

    // Stacked Pine Cones
    const coneColors = [0x0d4d2b, 0x115e34, 0x187341, 0x1e824c];
    for (let i = 0; i < 4; i++) {
      const coneGeo = new THREE.ConeGeometry(3.4 - i * 0.65, 2.6, 14);
      const coneMat = new THREE.MeshStandardMaterial({ color: coneColors[i % coneColors.length], roughness: 0.8 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = 0.6 + i * 1.6;
      cone.castShadow = true;
      squareGroup.add(cone);
    }

    // Tree Topper Star
    const starGeo = new THREE.OctahedronGeometry(0.6);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.y = 6.2;
    squareGroup.add(star);

    // Tree Lights
    animatedObjects.treeLights = [];
    const lightPalette = [0xff0055, 0xffea00, 0x00f5d4, 0x9b5de5, 0xffffff];
    for (let j = 0; j < 24; j++) {
      const tY = 0.8 + (j / 24) * 4.5;
      const tRadius = 3.0 - (tY / 6.0) * 2.2;
      const tAngle = j * 1.8;

      const bulbGeo = new THREE.SphereGeometry(0.12, 6, 6);
      const bulbMat = new THREE.MeshBasicMaterial({ color: lightPalette[j % lightPalette.length] });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(Math.cos(tAngle) * tRadius, tY, Math.sin(tAngle) * tRadius);
      squareGroup.add(bulb);
      animatedObjects.treeLights.push(bulb);
    }

    squareGroup.position.set(0, -1.5, 0);
    scene.add(squareGroup);
  }

  /* ==========================================================================
     5. 3D ARCHITECTURAL REALMS (9 DESTINATIONS)
     ========================================================================== */
  function createThemedArchitecturalRealms() {
    interactiveBuildingMeshes = [];
    const keys = Object.keys(DESTINATIONS);
    const radius = 11.2;
    const count = keys.length;

    keys.forEach((key, index) => {
      const dest = DESTINATIONS[key];
      const angle = (index / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const realmBuilding = new THREE.Group();

      switch (key) {
        case 'movies':
          buildCinemaModel(realmBuilding, dest);
          break;
        case 'reads':
          buildLibraryModel(realmBuilding, dest);
          break;
        case 'store':
          buildGiftStoreModel(realmBuilding, dest);
          break;
        case 'map':
          buildRadarMapModel(realmBuilding, dest);
          break;
        case 'music':
          buildPavilionModel(realmBuilding, dest);
          break;
        case 'game':
          buildWorkshopModel(realmBuilding, dest);
          break;
        case 'tracker':
          buildTrackerModel(realmBuilding, dest);
          break;
        case 'letters':
          buildPostOfficeModel(realmBuilding, dest);
          break;
        case 'bakery':
          buildBakeryModel(realmBuilding, dest);
          break;
      }

      // Overhead Interactive Pin Marker
      const pinGeo = new THREE.SphereGeometry(0.44, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.y = 5.2;
      realmBuilding.add(pin);

      realmBuilding.position.set(x, -1.5, z);
      realmBuilding.lookAt(0, -1.5, 0);
      realmBuilding.userData = { destinationKey: key, data: dest };

      scene.add(realmBuilding);
      interactiveBuildingMeshes.push(realmBuilding);
    });
  }

  function buildCinemaModel(g, d) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.6, 2.6), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.6 }));
    body.position.y = 1.3;
    g.add(body);

    const marquee = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.7, 0.8), new THREE.MeshBasicMaterial({ color: 0xffea00 }));
    marquee.position.set(0, 2.3, 1.4);
    g.add(marquee);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    roof.position.y = 3.3;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);
  }

  function buildLibraryModel(g, d) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.3, 2.8), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.7 }));
    body.position.y = 1.15;
    g.add(body);

    const bookSpine = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.0, 12), new THREE.MeshStandardMaterial({ color: 0x8b0000 }));
    bookSpine.rotation.x = Math.PI / 2;
    bookSpine.position.set(0, 2.9, 0);
    g.add(bookSpine);

    const bookRoof = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.25, 2.8), new THREE.MeshStandardMaterial({ color: 0xfffcf0 }));
    bookRoof.position.set(0, 2.7, 0);
    bookRoof.rotation.z = 0.32;
    g.add(bookRoof);
  }

  function buildGiftStoreModel(g, d) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.5, 2.7), new THREE.MeshStandardMaterial({ color: 0x165b33, roughness: 0.5 }));
    box.position.y = 1.25;
    g.add(box);

    const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.55, 2.75), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.8 }));
    ribbonV.position.y = 1.25;
    g.add(ribbonV);

    const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(2.75, 2.55, 0.5), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.8 }));
    ribbonH.position.y = 1.25;
    g.add(ribbonH);

    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.22, 12, 24), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.8 }));
    bow.position.set(0, 2.9, 0);
    g.add(bow);
  }

  function buildRadarMapModel(g, d) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.7, 2.3, 16), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.5 }));
    base.position.y = 1.15;
    g.add(base);

    const dish = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    dish.rotation.x = -Math.PI / 3;
    dish.position.set(0, 3.4, 0);
    g.add(dish);
    animatedObjects.radarDish = dish;
  }

  function buildPavilionModel(g, d) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    base.position.y = 0.2;
    g.add(base);

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.1, 8), new THREE.MeshStandardMaterial({ color: 0xf4c430 }));
      col.position.set(Math.cos(a) * 1.35, 1.25, Math.sin(a) * 1.35);
      g.add(col);
    }

    const dome = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.5, 8), new THREE.MeshStandardMaterial({ color: d.color }));
    dome.position.y = 2.9;
    g.add(dome);
  }

  function buildWorkshopModel(g, d) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.3, 2.7), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.6 }));
    body.position.y = 1.15;
    g.add(body);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.5, 4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    roof.position.y = 2.9;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    const gear = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.16, 8, 16), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.85 }));
    gear.position.set(0, 3.9, 0);
    g.add(gear);
    animatedObjects.workshopGear = gear;
  }

  function buildTrackerModel(g, d) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 3.4, 16), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.5 }));
    tower.position.y = 1.7;
    g.add(tower);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    dome.position.y = 3.4;
    g.add(dome);

    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.5, 12), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.8 }));
    scope.rotation.x = Math.PI / 4;
    scope.position.set(0, 3.8, 0.65);
    g.add(scope);
  }

  function buildPostOfficeModel(g, d) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.3, 2.5), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.6 }));
    body.position.y = 1.15;
    g.add(body);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 1.5, 4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    roof.position.y = 2.9;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    const letter = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.85, 0.1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    letter.position.set(0, 1.9, 1.35);
    g.add(letter);
  }

  function buildBakeryModel(g, d) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 2.7, 12), new THREE.MeshStandardMaterial({ color: 0x6e3814 }));
    tower.position.y = 1.35;
    g.add(tower);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.3, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    roof.position.y = 3.3;
    g.add(roof);

    const blades = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const sail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.9, 0.05), new THREE.MeshStandardMaterial({ color: 0xff2a2a }));
      sail.position.y = 0.95;
      const pivot = new THREE.Group();
      pivot.rotation.z = (i * Math.PI) / 2;
      pivot.add(sail);
      blades.add(pivot);
    }
    blades.position.set(0, 2.6, 1.3);
    g.add(blades);
    animatedObjects.windmillBlades = blades;
  }

  /* ==========================================================================
     6. KINETIC ENTITIES (TRAIN, SANTA SLEIGH, BLIZZARD)
     ========================================================================== */
  function createKineticEntities() {
    // 1. Holiday Express Train
    const trainGroup = new THREE.Group();

    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 1.5), new THREE.MeshStandardMaterial({ color: 0xd42426, metalness: 0.3 }));
    engine.position.y = 0.45;
    trainGroup.add(engine);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 0.65), new THREE.MeshStandardMaterial({ color: 0x165b33 }));
    cab.position.set(0, 0.75, -0.35);
    trainGroup.add(cab);

    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.55, 8), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.8 }));
    stack.position.set(0, 0.9, 0.45);
    trainGroup.add(stack);

    trainGroup.position.set(6.2, -1.5, 0);
    scene.add(trainGroup);
    animatedObjects.train = trainGroup;

    // 2. Santa's Sleigh in Orbit
    const sleighGroup = new THREE.Group();
    const sleighBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.65, 2.2), new THREE.MeshStandardMaterial({ color: 0xd42426 }));
    sleighGroup.add(sleighBody);

    const runners = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 2.4), new THREE.MeshStandardMaterial({ color: 0xf4c430, metalness: 0.9 }));
    runners.position.y = -0.35;
    sleighGroup.add(runners);

    sleighGroup.position.set(0, 13.5, 0);
    scene.add(sleighGroup);
    animatedObjects.santaSleigh = sleighGroup;
  }

  function createSnowstormSystem() {
    const count = 1800;
    snowflakeGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 17.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 9.0;
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.04;
      velocities[i * 3 + 1] = -(Math.random() * 0.07 + 0.03);
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }

    snowflakeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    snowflakeGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const snowflakeMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.32,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    snowParticles = new THREE.Points(snowflakeGeometry, snowflakeMat);
    scene.add(snowParticles);
  }

  /* ==========================================================================
     7. ANIMATION RENDER LOOP
     ========================================================================== */
  function animate() {
    requestAnimationFrame(animate);

    // 1. Blizzard Flurry Movement
    if (snowParticles) {
      const pos = snowflakeGeometry.attributes.position.array;
      const vel = snowflakeGeometry.attributes.velocity.array;

      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3] += vel[i * 3];
        pos[i * 3 + 1] += vel[i * 3 + 1];
        pos[i * 3 + 2] += vel[i * 3 + 2];

        if (pos[i * 3 + 1] < -2.5) {
          pos[i * 3 + 1] = 23.0;
          pos[i * 3] = (Math.random() - 0.5) * 28;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
        }
      }
      snowflakeGeometry.attributes.position.needsUpdate = true;
    }

    // 2. Kinetic Objects Animation
    if (animatedObjects.train) {
      animatedObjects.trainAngle += animatedObjects.trainSpeed;
      const r = 6.4;
      const tx = Math.cos(animatedObjects.trainAngle) * r;
      const tz = Math.sin(animatedObjects.trainAngle) * r;
      animatedObjects.train.position.set(tx, -1.45, tz);
      animatedObjects.train.rotation.y = -animatedObjects.trainAngle + Math.PI / 2;
    }

    if (animatedObjects.santaSleigh) {
      animatedObjects.sleighAngle += animatedObjects.sleighSpeed;
      const sr = 12.8;
      const sx = Math.cos(animatedObjects.sleighAngle) * sr;
      const sz = Math.sin(animatedObjects.sleighAngle) * sr;
      animatedObjects.santaSleigh.position.set(sx, 13.0 + Math.sin(animatedObjects.sleighAngle * 2) * 1.4, sz);
      animatedObjects.santaSleigh.rotation.y = -animatedObjects.sleighAngle + Math.PI / 2;
    }

    if (animatedObjects.windmillBlades) animatedObjects.windmillBlades.rotation.z += 0.03;
    if (animatedObjects.radarDish) animatedObjects.radarDish.rotation.z += 0.02;
    if (animatedObjects.workshopGear) animatedObjects.workshopGear.rotation.z += 0.025;

    // 3. Tree Lights Flickering
    if (animatedObjects.treeLights.length > 0 && Math.random() < 0.1) {
      const idx = Math.floor(Math.random() * animatedObjects.treeLights.length);
      animatedObjects.treeLights[idx].visible = !animatedObjects.treeLights[idx].visible;
    }

    // 4. Update Orbit Controls
    if (controls && controls.enabled) {
      controls.autoRotate = !isInsideVillage;
      controls.autoRotateSpeed = 0.5;
      controls.update();
    }

    handleRaycastHover();
    renderer.render(scene, camera);
  }

  /* ==========================================================================
     8. CINEMATIC CAMERA NAVIGATION CONTROLLER
     ========================================================================== */
  function diveIntoVillage(targetKey = null) {
    if (isInsideVillage && !targetKey) return;

    isInsideVillage = true;
    playFestiveChime();

    document.getElementById('heroPrompt')?.classList.add('hidden');
    document.getElementById('resetCameraBtn')?.classList.remove('hidden');
    document.getElementById('villageTelemetryHud')?.classList.remove('hidden');

    let targetX = CAMERA_VILLAGE_POS.x;
    let targetY = CAMERA_VILLAGE_POS.y;
    let targetZ = CAMERA_VILLAGE_POS.z;
    let lookTarget = { ...CAMERA_VILLAGE_TARGET };

    if (targetKey && DESTINATIONS[targetKey]) {
      const building = interactiveBuildingMeshes.find(b => b.userData.destinationKey === targetKey);
      if (building) {
        targetX = building.position.x * 0.7;
        targetY = 4.0;
        targetZ = building.position.z * 0.7;
        lookTarget = { x: building.position.x, y: 1.5, z: building.position.z };
      }
    }

    // Disable OrbitControls during GSAP tweening
    if (controls) {
      controls.enabled = false;
      controls.autoRotate = false;
    }

    gsap.to(camera.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1.8,
      ease: 'power3.inOut'
    });

    gsap.to(controls ? controls.target : CAMERA_VILLAGE_TARGET, {
      x: lookTarget.x,
      y: lookTarget.y,
      z: lookTarget.z,
      duration: 1.8,
      ease: 'power3.inOut',
      onComplete: () => {
        if (controls) {
          controls.enabled = true;
        }
        if (targetKey && DESTINATIONS[targetKey]) {
          openDestinationModal(targetKey);
        }
      }
    });

    if (glassSphereMesh) {
      gsap.to(glassSphereMesh.material, { opacity: 0.04, duration: 1.2 });
    }
  }

  function resetToOrbitView() {
    isInsideVillage = false;
    closeDestinationModal();

    document.getElementById('heroPrompt')?.classList.remove('hidden');
    document.getElementById('resetCameraBtn')?.classList.add('hidden');
    document.getElementById('villageTelemetryHud')?.classList.add('hidden');
    hideTooltip();

    if (controls) {
      controls.enabled = false;
    }

    gsap.to(camera.position, {
      x: CAMERA_ORBIT_POS.x,
      y: CAMERA_ORBIT_POS.y,
      z: CAMERA_ORBIT_POS.z,
      duration: 1.6,
      ease: 'power3.out'
    });

    gsap.to(controls ? controls.target : { x: 0, y: 3.5, z: 0 }, {
      x: 0,
      y: 3.5,
      z: 0,
      duration: 1.6,
      ease: 'power3.out',
      onComplete: () => {
        if (controls) {
          controls.enabled = true;
          controls.autoRotate = true;
        }
      }
    });

    if (glassSphereMesh) {
      gsap.to(glassSphereMesh.material, { opacity: 0.22, duration: 1.2 });
    }
  }

  function shakeSnowglobeEffect() {
    const currentPos = { ...camera.position };

    gsap.to(camera.position, {
      x: currentPos.x + 2.2,
      y: currentPos.y - 1.6,
      duration: 0.08,
      repeat: 7,
      yoyo: true,
      ease: 'sine.inOut',
      onComplete: () => {
        gsap.to(camera.position, { ...currentPos, duration: 0.4 });
      }
    });

    if (snowParticles) {
      const vel = snowflakeGeometry.attributes.velocity.array;
      for (let i = 0; i < vel.length; i++) vel[i] *= 4.5;
      setTimeout(() => {
        for (let i = 0; i < vel.length; i++) vel[i] /= 4.5;
      }, 1400);
    }

    playSynthesizedTone(1567.98, 0.2, 0);
    playSynthesizedTone(1760.0, 0.2, 120);
  }

  /* ==========================================================================
     9. RAYCASTING, SCREEN TOOLTIPS & USER INTERACTION
     ========================================================================== */
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchStart(event) {
    if (event.touches.length > 0) {
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  function handleRaycastHover() {
    if (!raycaster || !camera) return;

    raycaster.setFromCamera(mouse, camera);

    const hitList = [];
    interactiveBuildingMeshes.forEach(group => {
      group.traverse(child => {
        if (child.isMesh) hitList.push(child);
      });
    });

    const intersects = raycaster.intersectObjects(hitList, false);

    if (intersects.length > 0) {
      let rootGroup = intersects[0].object;
      while (rootGroup.parent && !rootGroup.userData?.destinationKey) {
        rootGroup = rootGroup.parent;
      }

      if (rootGroup.userData?.destinationKey) {
        hoveredObject = rootGroup;
        document.body.style.cursor = 'pointer';
        showTooltipForBuilding(rootGroup);
        return;
      }
    }

    if (!isInsideVillage && glassSphereMesh) {
      const globeHits = raycaster.intersectObject(glassSphereMesh);
      if (globeHits.length > 0) {
        document.body.style.cursor = 'pointer';
        hideTooltip();
        return;
      }
    }

    hoveredObject = null;
    document.body.style.cursor = 'default';
    hideTooltip();
  }

  function showTooltipForBuilding(group) {
    const tooltip = document.getElementById('threeTooltip');
    const titleEl = document.getElementById('tooltipTitle');
    const iconEl = document.getElementById('tooltipIcon');

    if (!tooltip || !group.userData?.data) return;

    const dest = group.userData.data;
    titleEl.textContent = dest.title;
    iconEl.className = `fa-solid ${dest.categoryIcon}`;

    const pinPos = new THREE.Vector3();
    group.getWorldPosition(pinPos);
    pinPos.y += 5.2;
    pinPos.project(camera);

    const screenX = (pinPos.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-(pinPos.y * 0.5) + 0.5) * window.innerHeight;

    tooltip.style.transform = `translate(${screenX}px, ${screenY}px)`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    document.getElementById('threeTooltip')?.classList.remove('visible');
  }

  function onCanvasClick() {
    if (hoveredObject && hoveredObject.userData?.destinationKey) {
      const key = hoveredObject.userData.destinationKey;
      if (!isInsideVillage) {
        diveIntoVillage(key);
      } else {
        openDestinationModal(key);
      }
      return;
    }

    if (!isInsideVillage && glassSphereMesh) {
      const hits = raycaster.intersectObject(glassSphereMesh);
      if (hits.length > 0) {
        diveIntoVillage();
      }
    }
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /* ==========================================================================
     10. MODAL CONTROLLER
     ========================================================================== */
  function openDestinationModal(destKey) {
    const dest = DESTINATIONS[destKey];
    if (!dest) return;

    const modal = document.getElementById('destinationModal');
    const coverImg = document.getElementById('modalCoverImg');
    const catIcon = document.getElementById('modalCategoryIcon');
    const catText = document.getElementById('modalCategoryText');
    const titleEl = document.getElementById('modalDestTitle');
    const taglineEl = document.getElementById('modalDestTagline');
    const descEl = document.getElementById('modalDestDesc');
    const ribbon = document.getElementById('modalStatsRibbon');
    const highlightsList = document.getElementById('modalHighlightsList');
    const actionBtn = document.getElementById('portalEnterActionBtn');
    const actionText = document.getElementById('modalActionBtnText');

    if (coverImg) coverImg.src = dest.image;
    if (catIcon) catIcon.className = `fa-solid ${dest.categoryIcon}`;
    if (catText) catText.textContent = dest.category;
    if (titleEl) titleEl.textContent = dest.title;
    if (taglineEl) taglineEl.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${dest.tagline}`;
    if (descEl) descEl.textContent = dest.description;
    if (actionText) actionText.textContent = dest.btnText;
    if (actionBtn) actionBtn.setAttribute('data-key', destKey);

    if (ribbon && dest.stats) {
      ribbon.innerHTML = dest.stats.map(s => `
        <div class="stat-bubble">
          <span class="stat-number">${s.number}</span>
          <span class="stat-label">${s.label}</span>
        </div>
      `).join('');
    }

    if (highlightsList && dest.highlights) {
      highlightsList.innerHTML = dest.highlights.map(h => `
        <li><i class="fa-solid fa-check"></i> ${h}</li>
      `).join('');
    }

    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    playSynthesizedTone(1046.5, 0.18, 0);
  }

  function closeDestinationModal() {
    const modal = document.getElementById('destinationModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function openGuideModal() {
    const guideModal = document.getElementById('guideInfoModal');
    if (guideModal) {
      guideModal.classList.add('open');
      guideModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeGuideModal() {
    const guideModal = document.getElementById('guideInfoModal');
    if (guideModal) {
      guideModal.classList.remove('open');
      guideModal.setAttribute('aria-hidden', 'true');
    }
  }

  /* ==========================================================================
     11. SYNTHESIZED WEB AUDIO API CHRISTMAS CAROLS
     ========================================================================== */
  function playSynthesizedTone(freq = 1046.5, volume = 0.18, delay = 0) {
    if (!isAudioPlaying) return;

    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.65);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.65);
      }, delay);
    } catch (e) {
      console.warn('Audio Context restricted:', e);
    }
  }

  function playFestiveChime() {
    playSynthesizedTone(1318.5, 0.18, 0);
    playSynthesizedTone(1567.98, 0.18, 100);
    playSynthesizedTone(2093.0, 0.22, 220);
  }

  function startBackgroundCarolLoop() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const notes = [
      659.25, 659.25, 659.25,
      659.25, 659.25, 659.25,
      659.25, 783.99, 523.25, 587.33, 659.25,
      698.46, 698.46, 698.46, 698.46,
      698.46, 659.25, 659.25, 659.25,
      659.25, 587.33, 587.33, 659.25, 587.33, 783.99
    ];

    let step = 0;
    clearInterval(melodyInterval);
    melodyInterval = setInterval(() => {
      if (isAudioPlaying) {
        playSynthesizedTone(notes[step], 0.12, 0);
        step = (step + 1) % notes.length;
      }
    }, 380);
  }

  function stopBackgroundCarolLoop() {
    clearInterval(melodyInterval);
  }

  function toggleAudioAmbiance() {
    isAudioPlaying = !isAudioPlaying;

    const audioBtn = document.getElementById('audioToggleBtn');
    const icon = document.getElementById('audioIcon');
    const label = document.getElementById('audioTextLabel');

    if (audioBtn) audioBtn.classList.toggle('playing', isAudioPlaying);

    if (icon) {
      icon.className = isAudioPlaying ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }

    if (label) {
      label.textContent = isAudioPlaying ? 'Music Playing' : 'Holiday Music';
    }

    if (isAudioPlaying) {
      playFestiveChime();
      startBackgroundCarolLoop();
    } else {
      stopBackgroundCarolLoop();
    }
  }

  /* ==========================================================================
     12. MASTER INITIALIZER
     ========================================================================== */
  function init() {
    // 1. Run Preloader & Initialize WebGL
    simulatePreloader(() => {
      initThreeScene();
    });

    // 2. Action Controls
    document.getElementById('diveInBtn')?.addEventListener('click', () => diveIntoVillage());
    document.getElementById('quickShakeSubBtn')?.addEventListener('click', shakeSnowglobeEffect);
    document.getElementById('shakeGlobeBtn')?.addEventListener('click', shakeSnowglobeEffect);
    document.getElementById('resetCameraBtn')?.addEventListener('click', resetToOrbitView);

    // 3. Audio Controller
    document.getElementById('audioToggleBtn')?.addEventListener('click', toggleAudioAmbiance);

    // 4. Modal Triggers & Guide
    document.getElementById('closeModalBtn')?.addEventListener('click', closeDestinationModal);
    document.getElementById('modalScrim')?.addEventListener('click', closeDestinationModal);
    document.getElementById('infoHelpBtn')?.addEventListener('click', openGuideModal);
    document.getElementById('closeGuideBtn')?.addEventListener('click', closeGuideModal);
    document.getElementById('guideScrim')?.addEventListener('click', closeGuideModal);
    document.getElementById('guideConfirmBtn')?.addEventListener('click', closeGuideModal);

    // 5. Destination Launch Button
    document.getElementById('portalEnterActionBtn')?.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-key');
      const dest = DESTINATIONS[key];
      if (dest) {
        alert(`Entering ${dest.title}! Launching destination...`);
        closeDestinationModal();
      }
    });

    // 6. Bottom Dock Quick Navigation
    document.querySelectorAll('.village-dock-bar .dock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.village-dock-bar .dock-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const destKey = btn.getAttribute('data-destination');
        if (destKey === 'globe') {
          resetToOrbitView();
        } else {
          diveIntoVillage(destKey);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();