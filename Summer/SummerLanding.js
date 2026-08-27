/**
 * ==========================================================================
 * THE SUN-DRENCHED COASTAL ODYSSEY — MASTER JAVASCRIPT ENGINE
 * File: SummerLanding.js
 * 
 * Powered by Three.js (r128), OrbitControls, and GSAP
 * Features:
 * - Dynamic Wave Splash Transition Screen
 * - Living 3D Tropical Beach with Animated Water Mesh & Palm Trees
 * - 7 Clickable 3D Coastal Landmarks (Store, Books, Movies, Music, Map, Games, Weather)
 * - Beach Telemetry HUD & Interactive Screen Tooltips
 * - Synthesized Tropical Audio & Ocean Waves
 * ==========================================================================
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. COASTAL DESTINATIONS DATABASE (7 BEACH LANDMARKS)
     ========================================================================== */
  const DESTINATIONS = {
    store: {
      id: 'store',
      title: 'Surf Shack & Beach Boutique',
      tagline: 'Custom Surfboards, Shades & Coral Gear',
      category: 'COASTAL BOUTIQUE',
      categoryIcon: 'fa-bag-shopping',
      color: 0xff5e5b,
      status: 'Beachfront Sector 01'
    },
    reads: {
      id: 'reads',
      title: 'Summer Reads Hammock Library',
      tagline: 'Sun-Drenched Novels & Beachside Paperbacks',
      category: 'LITERATURE COVE',
      categoryIcon: 'fa-book-open-reader',
      color: 0x2ec4b6,
      status: 'Palm Cove Sector 02'
    },
    movies: {
      id: 'movies',
      title: 'Sunset Beach Cinema & Drive-In',
      tagline: 'Open-Air Screenings & Tropical Mocktails',
      category: 'SUNSET CINEMA',
      categoryIcon: 'fa-film',
      color: 0xffb703,
      status: 'Dune Pavilion Sector 03'
    },
    music: {
      id: 'music',
      title: 'Tiki Bar Music Lounge & Bandstand',
      tagline: 'Steel Drums, Reggae & Island Sunset Beats',
      category: 'TIKI HARMONY',
      categoryIcon: 'fa-music',
      color: 0x9b5de5,
      status: 'Lagoon Pier Sector 04'
    },
    map: {
      id: 'map',
      title: 'Coastal Island Navigator Map',
      tagline: 'Surf Breaks, Coral Reefs & Secret Coves',
      category: 'SURF CARTOGRAPHY',
      categoryIcon: 'fa-map-location-dot',
      color: 0x00f0ff,
      status: 'Lookout Spire Sector 05'
    },
    game: {
      id: 'game',
      title: 'Boardwalk Volleyball & Arcade Games',
      tagline: 'Beach Sports, Water Balloons & Skee-Ball',
      category: 'BOARDWALK ARCADE',
      categoryIcon: 'fa-volleyball',
      color: 0x00bbf9,
      status: 'Golden Sands Sector 06'
    },
    weather: {
      id: 'weather',
      title: 'Surf & Marine Weather Observatory',
      tagline: 'Live Wave Buoy Swells, Wind & Tide Tables',
      category: 'OCEAN TELEMETRY',
      categoryIcon: 'fa-cloud-sun',
      color: 0xffd166,
      status: 'Marine Point Sector 07'
    }
  };

  /* ==========================================================================
     2. THREE.JS ENGINE STATE & SPATIAL PARAMETERS
     ========================================================================== */
  let scene, camera, renderer, controls;
  let raycaster, mouse;
  let oceanWaterMesh, oceanGeometry;
  let interactiveLandmarkMeshes = [];
  
  let animatedObjects = {
    palmLeaves: [],
    sunMesh: null,
    clouds: [],
    buoys: [],
    seagulls: [],
    tikiTorches: [],
    wavesClock: 0
  };
  let hoveredLandmark = null;

  // Camera Coordinate Presets
  const CAMERA_PANORAMIC_POS = { x: 0, y: 22, z: 52 };
  const CAMERA_BEACH_POS = { x: 0, y: 15, z: 24 };
  const CAMERA_BEACH_TARGET = { x: 0, y: 1.5, z: 0 };

  let isInsideBeach = false;
  let isAudioPlaying = false;
  let audioCtx = null;
  let surfMelodyInterval = null;

  /* ==========================================================================
     3. ASSET PRELOADER
     ========================================================================== */
  function simulatePreloader(onComplete) {
    const preloader = document.getElementById('experiencePreloader');
    const fill = document.getElementById('preloaderProgressFill');
    const percentage = document.getElementById('preloaderPercentage');
    const statusText = document.getElementById('preloaderStatusText');

    const statuses = [
      'Catching the offshore swell...',
      'Warming the white sands & planting palms...',
      'Building 7 coastal boardwalk destinations...',
      'Tuning the tiki steel drum frequencies...',
      'Welcome to the Sun-Drenched Coast!'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 12;
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
     4. PROCEDURAL 3D SCENE & ENVIRONMENT ASSEMBLY
     ========================================================================== */
  function initThreeScene() {
    const canvas = document.getElementById('webglCanvas');
    if (!canvas) return;

    // 1. Scene, Camera, and Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x01243a, 0.01);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(CAMERA_PANORAMIC_POS.x, CAMERA_PANORAMIC_POS.y, CAMERA_PANORAMIC_POS.z);

    // 2. Renderer with Filmic Tone Mapping
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. OrbitControls Constructor with Namespace Fallbacks
    const ControlsConstructor = THREE.OrbitControls || window.OrbitControls;
    if (ControlsConstructor) {
      controls = new ControlsConstructor(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.minDistance = 10;
      controls.maxDistance = 75;
      controls.target.set(0, 3.5, 0);
    }

    // 4. Raycaster & Coordinates
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-100, -100);

    // 5. Build Tropical Island Environment
    setupTropicalLighting();
    createAnimatedOcean();
    createSandyShoreAndBoardwalk();
    createTropicalPalms();
    createSevenCoastalLandmarks();
    createSunAndSkyline();

    // 6. Global Event Handlers
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    // 7. Start Render Loop
    animate();
  }

  function setupTropicalLighting() {
    // Ambient Daylight
    const ambientLight = new THREE.AmbientLight(0xfff1d0, 0.95);
    scene.add(ambientLight);

    // Direct Golden Sunlight
    const sunLight = new THREE.DirectionalLight(0xfffae0, 2.2);
    sunLight.position.set(35, 55, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Island Center Point Light
    const beachGlow = new THREE.PointLight(0xffb703, 2.5, 40);
    beachGlow.position.set(0, 6, 0);
    scene.add(beachGlow);
  }

  function createAnimatedOcean() {
    // 3D Plane Geometry with Vertices for Wave Simulation
    oceanGeometry = new THREE.PlaneGeometry(160, 160, 48, 48);
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x0088aa,
      roughness: 0.15,
      metalness: 0.65,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });

    oceanWaterMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanWaterMesh.rotation.x = -Math.PI / 2;
    oceanWaterMesh.position.set(0, -1.8, 0);
    oceanWaterMesh.receiveShadow = true;
    scene.add(oceanWaterMesh);
  }

  function createSandyShoreAndBoardwalk() {
    // Curved Sand Coast Island
    const sandGeo = new THREE.CylinderGeometry(18.5, 20.5, 3.2, 48);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xe8cf9d,
      roughness: 0.92,
      metalness: 0.05
    });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.y = -2.6;
    sandMesh.receiveShadow = true;
    scene.add(sandMesh);

    // Wooden Boardwalk Ring
    const boardwalkGeo = new THREE.RingGeometry(9.0, 14.5, 48);
    const boardwalkMat = new THREE.MeshStandardMaterial({
      color: 0xb58a63,
      roughness: 0.8,
      side: THREE.DoubleSide
    });
    const boardwalk = new THREE.Mesh(boardwalkGeo, boardwalkMat);
    boardwalk.rotation.x = -Math.PI / 2;
    boardwalk.position.y = -0.98;
    boardwalk.receiveShadow = true;
    scene.add(boardwalk);

    // Center Tropical Lagoon Pool
    const lagoonGeo = new THREE.CircleGeometry(5.8, 32);
    const lagoonMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.8
    });
    const lagoon = new THREE.Mesh(lagoonGeo, lagoonMat);
    lagoon.rotation.x = -Math.PI / 2;
    lagoon.position.y = -0.97;
    scene.add(lagoon);
  }

  function createTropicalPalms() {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.4;
      const x = Math.cos(angle) * 7.5;
      const z = Math.sin(angle) * 7.5;

      const palmGroup = new THREE.Group();

      // Slanted Curved Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 4.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7a5031, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 2.2;
      trunk.rotation.z = (Math.random() - 0.5) * 0.25;
      palmGroup.add(trunk);

      // Fronds / Palm Leaves
      for (let j = 0; j < 5; j++) {
        const frondGeo = new THREE.ConeGeometry(1.6, 0.4, 4);
        const frondMat = new THREE.MeshStandardMaterial({ color: 0x1e824c, roughness: 0.6 });
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.position.set(0, 4.4, 0);
        frond.rotation.x = Math.PI / 2.5;
        frond.rotation.y = (j / 5) * Math.PI * 2;
        palmGroup.add(frond);
        animatedObjects.palmLeaves.push(frond);
      }

      palmGroup.position.set(x, -1.0, z);
      scene.add(palmGroup);
    }
  }

  /* ==========================================================================
     5. 3D COASTAL LANDMARKS (7 CLICKABLE SPOTS)
     ========================================================================== */
  function createSevenCoastalLandmarks() {
    interactiveLandmarkMeshes = [];
    const keys = Object.keys(DESTINATIONS);
    const radius = 11.8;
    const count = keys.length;

    keys.forEach((key, index) => {
      const dest = DESTINATIONS[key];
      const angle = (index / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const landmarkGroup = new THREE.Group();

      switch (key) {
        case 'store':
          buildSurfStoreModel(landmarkGroup, dest);
          break;
        case 'reads':
          buildBookNookModel(landmarkGroup, dest);
          break;
        case 'movies':
          buildBeachCinemaModel(landmarkGroup, dest);
          break;
        case 'music':
          buildTikiMusicLoungeModel(landmarkGroup, dest);
          break;
        case 'map':
          buildMapLookoutTowerModel(landmarkGroup, dest);
          break;
        case 'game':
          buildVolleyballArcadeModel(landmarkGroup, dest);
          break;
        case 'weather':
          buildWeatherObservatoryModel(landmarkGroup, dest);
          break;
      }

      // Overhead Interactive Sun Beacon Pin
      const pinGeo = new THREE.SphereGeometry(0.48, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.y = 5.2;
      landmarkGroup.add(pin);

      landmarkGroup.position.set(x, -1.0, z);
      landmarkGroup.lookAt(0, -1.0, 0);
      landmarkGroup.userData = { destinationKey: key, data: dest };

      scene.add(landmarkGroup);
      interactiveLandmarkMeshes.push(landmarkGroup);
    });
  }

  // Model Builder Functions
  function buildSurfStoreModel(g, d) {
    // Surf Shack Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.4, 2.6), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.6 }));
    body.position.y = 1.2;
    g.add(body);

    // Thatched Straw Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.5, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 }));
    roof.position.y = 3.2;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    // Surfboards Leaning Against Wall
    const boardGeo = new THREE.CylinderGeometry(0.12, 0.45, 2.8, 12);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.rotation.z = 0.25;
    board.position.set(1.4, 1.2, 0.8);
    g.add(board);
  }

  function buildBookNookModel(g, d) {
    // Open-Air Cedar Library
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 2.8), new THREE.MeshStandardMaterial({ color: 0x8d5b4c }));
    deck.position.y = 0.2;
    g.add(deck);

    // Hammock Pillars
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0x5c3d2e }));
      p.position.set(i % 2 === 0 ? 1.2 : -1.2, 1.3, i < 2 ? 1.2 : -1.2);
      g.add(p);
    }

    // Book Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 3.0), new THREE.MeshStandardMaterial({ color: d.color }));
    canopy.position.y = 2.6;
    g.add(canopy);
  }

  function buildBeachCinemaModel(g, d) {
    // Outdoor Movie Screen
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 0.3), new THREE.MeshStandardMaterial({ color: 0x1b263b }));
    screenFrame.position.y = 1.6;
    g.add(screenFrame);

    const screenWhite = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    screenWhite.position.set(0, 1.6, 0.16);
    g.add(screenWhite);

    // Beach Loungers
    const lounger = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 0.8), new THREE.MeshStandardMaterial({ color: d.color }));
    lounger.position.set(0, 0.2, 1.6);
    g.add(lounger);
  }

  function buildTikiMusicLoungeModel(g, d) {
    // Round Tiki Hut Pavilion
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x5c3d2e }));
    floor.position.y = 0.2;
    g.add(floor);

    // Bamboo Columns
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0xd4a373 }));
      col.position.set(Math.cos(a) * 1.4, 1.3, Math.sin(a) * 1.4);
      g.add(col);
    }

    // Thatched Dome
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.5, 16), new THREE.MeshStandardMaterial({ color: 0xa67c52, roughness: 0.95 }));
    roof.position.y = 3.1;
    g.add(roof);
  }

  function buildMapLookoutTowerModel(g, d) {
    // Lighthouse / Lookout Tower
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 3.6, 16), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.5 }));
    tower.position.y = 1.8;
    g.add(tower);

    const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    platform.position.y = 3.7;
    g.add(platform);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
    beacon.position.y = 4.3;
    g.add(beacon);
  }

  function buildVolleyballArcadeModel(g, d) {
    // Volleyball Court Net & Boardwalk Arcade
    const shack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.6 }));
    shack.position.y = 1.1;
    g.add(shack);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.4, 4), new THREE.MeshStandardMaterial({ color: 0xffe8d6 }));
    roof.position.y = 2.8;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    // Volleyball Model
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    ball.position.set(1.4, 0.4, 1.2);
    g.add(ball);
  }

  function buildWeatherObservatoryModel(g, d) {
    // Marine Barometer & Weather Spire
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 2.4, 16), new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.5 }));
    base.position.y = 1.2;
    g.add(base);

    const anemometer = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 8, 16), new THREE.MeshStandardMaterial({ color: 0xff5e5b, metalness: 0.8 }));
    anemometer.rotation.x = Math.PI / 2;
    anemometer.position.set(0, 3.2, 0);
    g.add(anemometer);
  }

  function createSunAndSkyline() {
    // Glowing Sun Sphere in Background Sky
    const sunGeo = new THREE.SphereGeometry(4.5, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd55 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(40, 35, -45);
    scene.add(sunMesh);
    animatedObjects.sunMesh = sunMesh;
  }

  /* ==========================================================================
     6. ANIMATION RENDER LOOP & WAVE PHYSICS
     ========================================================================== */
  function animate() {
    requestAnimationFrame(animate);

    animatedObjects.wavesClock += 0.035;

    // 1. Ocean Wave Vertex Animation
    if (oceanGeometry) {
      const pos = oceanGeometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.18 + animatedObjects.wavesClock) * 0.45 +
                  Math.cos(v * 0.18 + animatedObjects.wavesClock) * 0.45;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    // 2. Gentle Palm Leaf Sway
    animatedObjects.palmLeaves.forEach((frond, idx) => {
      frond.rotation.z = Math.sin(animatedObjects.wavesClock + idx) * 0.08;
    });

    // 3. Update Orbit Controls
    if (controls && controls.enabled) {
      controls.autoRotate = !isInsideBeach;
      controls.autoRotateSpeed = 0.4;
      controls.update();
    }

    handleRaycastHover();
    renderer.render(scene, camera);
  }

  /* ==========================================================================
     7. WAVE SPLASH TRANSITION & CAMERA GLIDE CONTROLLER
     ========================================================================== */
  function triggerWaveSplash(onMidpoint = null) {
    const splashOverlay = document.getElementById('waveSplashOverlay');
    if (!splashOverlay) return;

    splashOverlay.classList.remove('splashing');
    void splashOverlay.offsetWidth; // Force Reflow
    splashOverlay.classList.add('splashing');

    playWaveSound();

    setTimeout(() => {
      if (typeof onMidpoint === 'function') onMidpoint();
    }, 600);

    setTimeout(() => {
      splashOverlay.classList.remove('splashing');
    }, 2800);
  }

  function diveIntoBeach(targetKey = null) {
    if (isInsideBeach && !targetKey) return;

    // Trigger Splash Screen Animation Transition
    triggerWaveSplash(() => {
      isInsideBeach = true;

      document.getElementById('heroPrompt')?.classList.add('hidden');
      document.getElementById('resetCameraBtn')?.classList.remove('hidden');
      document.getElementById('coastalTelemetryHud')?.classList.remove('hidden');

      let targetX = CAMERA_BEACH_POS.x;
      let targetY = CAMERA_BEACH_POS.y;
      let targetZ = CAMERA_BEACH_POS.z;
      let lookTarget = { ...CAMERA_BEACH_TARGET };

      if (targetKey && DESTINATIONS[targetKey]) {
        const landmark = interactiveLandmarkMeshes.find(b => b.userData.destinationKey === targetKey);
        if (landmark) {
          targetX = landmark.position.x * 0.72;
          targetY = 4.5;
          targetZ = landmark.position.z * 0.72;
          lookTarget = { x: landmark.position.x, y: 1.5, z: landmark.position.z };
        }
      }

      if (controls) {
        controls.enabled = false;
        controls.autoRotate = false;
      }

      gsap.to(camera.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 1.6,
        ease: 'power3.inOut'
      });

      gsap.to(controls ? controls.target : CAMERA_BEACH_TARGET, {
        x: lookTarget.x,
        y: lookTarget.y,
        z: lookTarget.z,
        duration: 1.6,
        ease: 'power3.inOut',
        onComplete: () => {
          if (controls) {
            controls.enabled = true;
          }
        }
      });
    });
  }

  function resetToPanoramicView() {
    isInsideBeach = false;

    document.getElementById('heroPrompt')?.classList.remove('hidden');
    document.getElementById('resetCameraBtn')?.classList.add('hidden');
    document.getElementById('coastalTelemetryHud')?.classList.add('hidden');
    hideTooltip();

    if (controls) {
      controls.enabled = false;
    }

    gsap.to(camera.position, {
      x: CAMERA_PANORAMIC_POS.x,
      y: CAMERA_PANORAMIC_POS.y,
      z: CAMERA_PANORAMIC_POS.z,
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
  }

  /* ==========================================================================
     8. RAYCASTING, TOOLTIPS & INPUT HANDLERS
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
    interactiveLandmarkMeshes.forEach(group => {
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
        hoveredLandmark = rootGroup;
        document.body.style.cursor = 'pointer';
        showTooltipForLandmark(rootGroup);
        return;
      }
    }

    hoveredLandmark = null;
    document.body.style.cursor = 'default';
    hideTooltip();
  }

  function showTooltipForLandmark(group) {
    const tooltip = document.getElementById('threeTooltip');
    const titleEl = document.getElementById('tooltipTitle');
    const iconEl = document.getElementById('tooltipIcon');
    const statusEl = document.getElementById('tooltipStatus');

    if (!tooltip || !group.userData?.data) return;

    const dest = group.userData.data;
    titleEl.textContent = dest.title;
    iconEl.className = `fa-solid ${dest.categoryIcon}`;
    if (statusEl) statusEl.textContent = dest.status;

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
    if (hoveredLandmark && hoveredLandmark.userData?.destinationKey) {
      const key = hoveredLandmark.userData.destinationKey;
      diveIntoBeach(key);
    }
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
     9. SYNTHESIZED TROPICAL WEB AUDIO & OCEAN SWELLS
     ========================================================================== */
  function playSynthesizedTone(freq = 440, volume = 0.15, delay = 0) {
    if (!isAudioPlaying) return;

    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.75);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.75);
      }, delay);
    } catch (e) {
      console.warn('Audio Context restricted:', e);
    }
  }

  function playWaveSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // White Noise Buffer to simulate ocean swell crash
      const bufferSize = audioCtx.sampleRate * 1.5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
      filter.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 1.5);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio wave swell failed:', e);
    }
  }

  function startTropicalMelodyLoop() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Steel Drum Calypso Pentatonic Motif
    const notes = [
      523.25, 587.33, 659.25, 783.99, 880.00,
      783.99, 659.25, 587.33, 523.25, 659.25
    ];

    let step = 0;
    clearInterval(surfMelodyInterval);
    surfMelodyInterval = setInterval(() => {
      if (isAudioPlaying) {
        playSynthesizedTone(notes[step], 0.12, 0);
        step = (step + 1) % notes.length;
      }
    }, 420);
  }

  function stopTropicalMelodyLoop() {
    clearInterval(surfMelodyInterval);
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
      label.textContent = isAudioPlaying ? 'Music Playing' : 'Surf Beats';
    }

    if (isAudioPlaying) {
      playWaveSound();
      startTropicalMelodyLoop();
    } else {
      stopTropicalMelodyLoop();
    }
  }

  /* ==========================================================================
     10. MASTER INITIALIZATION
     ========================================================================== */
  function init() {
    // 1. Run Preloader & Initialize WebGL
    simulatePreloader(() => {
      initThreeScene();
    });

    // 2. Action Controls
    document.getElementById('diveInBtn')?.addEventListener('click', () => diveIntoBeach());
    document.getElementById('quickSplashSubBtn')?.addEventListener('click', () => triggerWaveSplash());
    document.getElementById('triggerSplashBtn')?.addEventListener('click', () => triggerWaveSplash());
    document.getElementById('resetCameraBtn')?.addEventListener('click', resetToPanoramicView);

    // 3. Audio Controller
    document.getElementById('audioToggleBtn')?.addEventListener('click', toggleAudioAmbiance);

    // 4. Guide Modal Triggers
    document.getElementById('infoHelpBtn')?.addEventListener('click', openGuideModal);
    document.getElementById('closeGuideBtn')?.addEventListener('click', closeGuideModal);
    document.getElementById('guideScrim')?.addEventListener('click', closeGuideModal);
    document.getElementById('guideConfirmBtn')?.addEventListener('click', closeGuideModal);

    // 5. Bottom Dock Quick Navigation (Glides smoothly without popups)
    document.querySelectorAll('.beach-dock-bar .dock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.beach-dock-bar .dock-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const destKey = btn.getAttribute('data-destination');
        if (destKey === 'ocean') {
          resetToPanoramicView();
        } else {
          diveIntoBeach(destKey);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();