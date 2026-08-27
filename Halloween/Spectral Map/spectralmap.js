/**
 * ==========================================================================
 * SPECTRAL RADAR MAP — CORE ENGINE (spectralmap.js)
 * ==========================================================================
 * 
 * Features:
 * - Leaflet.js Interactive Dark Cartography & Custom Spectral Pins
 * - Real-Time Simulated EMF Fluctuation Engine (0.8 mG - 9.4 mG)
 * - 4 Category Radar Filter (Graveyards, Haunts, Spirit Halloween, Paid Investigations)
 * - Interactive Booking / Investigation Modal with Instant Reservation Simulation
 * - Geolocation Pinning & Dynamic Distance Calculations
 * - Sliding Feed Drawer with Drag-to-Scroll & Responsive Touch Handling
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Live Paranormal Encounters & Locations Database
     ========================================================================== */
  const SPECTRAL_LOCATIONS = [
    // --- GRAVEYARDS ---
    {
      id: 'grave-1',
      name: 'Old Dutch Burial Ground',
      category: 'graveyards',
      categoryLabel: 'Historic Graveyard',
      lat: 41.0853,
      lng: -73.8584,
      distance: '1.2 mi',
      emfLevel: '4.8 mG',
      price: 'Free Public Access',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
      description: 'Founded in 1685. Home of the Headless Horseman legend. Frequent cold spots and unexplained EVP anomalies recorded near the crypts.',
      bookable: false
    },
    {
      id: 'grave-2',
      name: 'Blackwood Hollow Cemetery',
      category: 'graveyards',
      categoryLabel: 'Haunted Cemetery',
      lat: 41.0921,
      lng: -73.8490,
      distance: '2.4 mi',
      emfLevel: '3.6 mG',
      price: 'Free Public Access',
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=500&auto=format&fit=crop&q=80',
      description: 'Late 19th-century cemetery featuring crumbling mausoleums. Visitors report misty humanoid apparitions passing between weeping willows.',
      bookable: false
    },
    {
      id: 'grave-3',
      name: 'Resurrection Mary Crypt Grounds',
      category: 'graveyards',
      categoryLabel: 'Spectral Burial Site',
      lat: 41.0760,
      lng: -73.8680,
      distance: '3.1 mi',
      emfLevel: '5.2 mG',
      price: 'Free Public Access',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
      description: 'Famous roadside ghost sightings and phantom hitchhiker reports dating back to 1930. Severe electromagnetic spikes near the main gate.',
      bookable: false
    },

    // --- HAUNTED HOUSES / ATTRACTIONS ---
    {
      id: 'haunt-1',
      name: 'Headless Horseman Hayrides',
      category: 'haunts',
      categoryLabel: 'Haunted Scream Park',
      lat: 41.0990,
      lng: -73.8350,
      distance: '4.5 mi',
      emfLevel: '2.1 mG',
      price: '$45 Admission',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
      description: 'World-renowned horror scream park featuring 10 themed haunted walkthroughs, monster trails, and special effects pyrotechnics.',
      bookable: true,
      bookingLabel: 'Buy Fast-Pass Tickets'
    },
    {
      id: 'haunt-2',
      name: 'Asylum 49 Scream Compound',
      category: 'haunts',
      categoryLabel: 'Full-Contact Haunted House',
      lat: 41.0690,
      lng: -73.8440,
      distance: '3.8 mi',
      emfLevel: '3.9 mG',
      price: '$38 Admission',
      image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=500&auto=format&fit=crop&q=80',
      description: 'High-intensity theatrical haunted hospital where doctors and deranged patients interact directly with brave guests.',
      bookable: true,
      bookingLabel: 'Reserve VIP Entry'
    },
    {
      id: 'haunt-3',
      name: 'The Dark Labyrinth Manor',
      category: 'haunts',
      categoryLabel: 'Haunted Maze & Attraction',
      lat: 41.0810,
      lng: -73.8750,
      distance: '2.8 mi',
      emfLevel: '2.4 mG',
      price: '$32 Admission',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
      description: 'Pitch-black labyrinth where visitors navigate using only a flickering electronic candle. Psychological scares around every bend.',
      bookable: true,
      bookingLabel: 'Book Maze Slot'
    },

    // --- SPIRIT HALLOWEEN LOCATIONS ---
    {
      id: 'spirit-1',
      name: 'Spirit Halloween — Tarrytown Center',
      category: 'spirit',
      categoryLabel: 'Costume & Animatronics Hub',
      lat: 41.0775,
      lng: -73.8570,
      distance: '0.8 mi',
      emfLevel: '1.2 mG',
      price: 'Open Daily (10AM - 9PM)',
      image: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=500&auto=format&fit=crop&q=80',
      description: 'Superstore stocked with 2026 animatronics, officially licensed horror masks, fog machines, and decor.',
      bookable: false
    },
    {
      id: 'spirit-2',
      name: 'Spirit Halloween — Galleria Plaza',
      category: 'spirit',
      categoryLabel: 'Costume & Props Superstore',
      lat: 41.0950,
      lng: -73.8650,
      distance: '3.6 mi',
      emfLevel: '1.4 mG',
      price: 'Open Daily (9AM - 10PM)',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
      description: 'Massive seasonal warehouse packed with life-sized slashers, creepy props, and themed makeup bars.',
      bookable: false
    },

    // --- PAID PRIVATE INVESTIGATION SITES ---
    {
      id: 'investigate-1',
      name: 'The Shanley Hotel — Overnight Lockdown',
      category: 'investigations',
      categoryLabel: 'Private Paranormal Lockdown',
      lat: 41.0910,
      lng: -73.8790,
      distance: '5.2 mi',
      emfLevel: '8.4 mG (EXTREME)',
      price: '$175 / Person / Night',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
      description: 'Spend the night inside one of America\'s most active haunted hotels. Full access to the brothel rooms, basement, and spirit box gear included.',
      bookable: true,
      bookingLabel: 'Book Overnight Investigation'
    },
    {
      id: 'investigate-2',
      name: 'Rolling Hills Sanatorium — Ghost Hunt',
      category: 'investigations',
      categoryLabel: 'Full Gear Paranormal Hunt',
      lat: 41.0620,
      lng: -73.8520,
      distance: '6.4 mi',
      emfLevel: '7.6 mG (VERY HIGH)',
      price: '$120 Private Pass',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
      description: 'Private guided ghost hunt with thermal cameras, REM pods, and spirit boxes through abandoned infirmary wards.',
      bookable: true,
      bookingLabel: 'Book Investigation Slot'
    },
    {
      id: 'investigate-3',
      name: 'Whispering Pines Grist Mill',
      category: 'investigations',
      categoryLabel: 'Evening Ghost Expedition',
      lat: 41.1040,
      lng: -73.8420,
      distance: '4.9 mi',
      emfLevel: '6.1 mG (HIGH)',
      price: '$85 / Session',
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=500&auto=format&fit=crop&q=80',
      description: 'Century-old watermill with active poltergeist accounts. Laser grids and infrared motion trackers provided upon arrival.',
      bookable: true,
      bookingLabel: 'Reserve 4-Hour Investigation'
    }
  ];

  /* ==========================================================================
     2. Application State & Leaflet Setup
     ========================================================================== */
  let mapInstance = null;
  let markersLayerGroup = null;
  let activeFilter = 'all';
  let isHeatmapActive = false;
  let isDrawerExpanded = false;
  let emfInterval = null;

  const DEFAULT_MAP_CENTER = [41.0853, -73.8584]; // Sleepy Hollow / Tarrytown Region
  const DEFAULT_ZOOM = 13;

  /* ==========================================================================
     3. Helper & Notification Engine
     ========================================================================== */
  function showToast(message, icon = 'fa-ghost') {
    let toast = document.getElementById('spectral-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'spectral-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(25, 19, 40, 0.96);
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 30px;
        border: 1px solid var(--accent-spectral-green);
        box-shadow: 0 8px 24px rgba(0,0,0,0.8), 0 0 16px var(--accent-spectral-glow);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        font-size: 0.82rem;
        font-weight: 700;
        z-index: 2000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-spectral-green);"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  /* ==========================================================================
     4. Simulated EMF Fluctuation System
     ========================================================================== */
  function startEmfMeter() {
    const emfValEl = document.getElementById('emfValue');
    const leds = document.querySelectorAll('.emf-leds .led');

    clearInterval(emfInterval);
    emfInterval = setInterval(() => {
      // Fluctuate randomly between 1.2 mG and 8.9 mG
      const randomEmf = (Math.random() * (8.5 - 1.2) + 1.2).toFixed(1);
      if (emfValEl) emfValEl.textContent = `${randomEmf} mG`;

      // Update LED Lights based on severity
      const val = parseFloat(randomEmf);
      leds.forEach((led, idx) => {
        led.classList.remove('on');
        if (idx === 0) led.classList.add('on');
        if (idx === 1 && val > 2.0) led.classList.add('on');
        if (idx === 2 && val > 4.0) led.classList.add('on');
        if (idx === 3 && val > 6.0) led.classList.add('on');
        if (idx === 4 && val > 7.5) led.classList.add('on');
      });
    }, 2800);
  }

  /* ==========================================================================
     5. Custom Leaflet Pin Icon Generator
     ========================================================================== */
  function createCustomPin(location) {
    let iconClass = 'fa-ghost';
    let pinClass = 'investigation';

    switch (location.category) {
      case 'graveyards':
        iconClass = 'fa-monument';
        pinClass = 'graveyard';
        break;
      case 'haunts':
        iconClass = 'fa-house-chimney-crack';
        pinClass = 'haunt';
        break;
      case 'spirit':
        iconClass = 'fa-ghost';
        pinClass = 'spirit';
        break;
      case 'investigations':
        iconClass = 'fa-skull';
        pinClass = 'investigation';
        break;
    }

    return L.divIcon({
      className: 'custom-pin-wrapper',
      html: `
        <div class="custom-spectral-pin ${pinClass}" data-id="${location.id}">
          <i class="fa-solid ${iconClass}"></i>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  /* ==========================================================================
     6. Map Rendering & Pin Placement
     ========================================================================== */
  function initLeafletMap() {
    const mapEl = document.getElementById('spectralMap');
    if (!mapEl) return;

    // CartoDB Dark Matter Tiles (Styled with custom CSS filter in stylesheet)
    mapInstance = L.map('spectralMap', {
      zoomControl: false,
      attributionControl: false
    }).setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance);

    markersLayerGroup = L.layerGroup().addTo(mapInstance);
    renderMapPins();
  }

  function renderMapPins() {
    if (!markersLayerGroup) return;
    markersLayerGroup.clearLayers();

    const searchTerm = (document.getElementById('locationSearchInput')?.value || '').toLowerCase().trim();

    const filtered = SPECTRAL_LOCATIONS.filter(loc => {
      const matchesCategory = (activeFilter === 'all' || loc.category === activeFilter);
      const matchesSearch = loc.name.toLowerCase().includes(searchTerm) ||
                            loc.categoryLabel.toLowerCase().includes(searchTerm) ||
                            loc.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    filtered.forEach(loc => {
      const pinIcon = createCustomPin(loc);
      const marker = L.marker([loc.lat, loc.lng], { icon: pinIcon });

      const popupHtml = `
        <div class="popup-mini-card">
          <h4 class="popup-title">${loc.name}</h4>
          <span class="popup-category">${loc.categoryLabel}</span>
          <div class="popup-price">${loc.price}</div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        openLocationModal(loc.id);
      });

      markersLayerGroup.addLayer(marker);
    });

    renderLocationsFeed(filtered);
  }

  /* ==========================================================================
     7. Sliding Locations Feed List Rendering
     ========================================================================== */
  function renderLocationsFeed(dataset) {
    const feedContainer = document.getElementById('locationsFeedList');
    const counter = document.getElementById('locationsCounter');

    if (counter) {
      counter.textContent = `${dataset.length} Live Signals`;
    }

    if (!feedContainer) return;

    if (dataset.length === 0) {
      feedContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 10px; color: var(--text-muted);">
          <i class="fa-solid fa-ghost" style="font-size: 2.2rem; color: var(--accent-spectral-green); margin-bottom: 10px;"></i>
          <h4 style="color:#fff; font-size:0.95rem; margin-bottom:4px;">No Paranormal Activity Found</h4>
          <p style="font-size:0.75rem;">Try clearing your search query or selecting a different radar filter.</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = dataset.map(loc => `
      <article class="location-feed-card" data-id="${loc.id}">
        <div class="card-thumb-wrap">
          <img src="${loc.image}" alt="${loc.name}" class="card-thumb-img" loading="lazy">
        </div>
        <div class="card-meta-col">
          <div class="card-title-row">
            <h4 class="card-title">${loc.name}</h4>
            <span class="card-distance">${loc.distance}</span>
          </div>
          <span class="card-category-tag">${loc.categoryLabel}</span>
          <div class="card-price-badge">${loc.price}</div>
        </div>
        <button class="card-action-btn" aria-label="View Details for ${loc.name}">
          <i class="fa-solid ${loc.bookable ? 'fa-bolt' : 'fa-location-arrow'}"></i>
        </button>
      </article>
    `).join('');
  }

  /* ==========================================================================
     8. Modal Booking & Investigation Window
     ========================================================================== */
  function openLocationModal(locationId) {
    const loc = SPECTRAL_LOCATIONS.find(l => l.id === locationId);
    if (!loc) return;

    const modal = document.getElementById('locationDetailModal');
    const content = document.getElementById('modalDynamicContent');

    if (!modal || !content) return;

    content.innerHTML = `
      <img src="${loc.image}" alt="${loc.name}" class="modal-header-img">
      <h3 class="modal-title">${loc.name}</h3>
      <p class="modal-subtitle"><i class="fa-solid fa-satellite-dish"></i> ${loc.categoryLabel} • EMF: ${loc.emfLevel}</p>
      
      <p class="modal-description">${loc.description}</p>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <span style="font-size:0.78rem; font-weight:700; color:var(--text-muted);">ADMISSION / ACCESS:</span>
        <span style="font-size:0.95rem; font-weight:800; color:var(--accent-orange);">${loc.price}</span>
      </div>

      ${loc.bookable ? `
        <button class="modal-book-btn" id="confirmBookingBtn" data-id="${loc.id}">
          <i class="fa-solid fa-skull"></i> ${loc.bookingLabel || 'Book Private Investigation'}
        </button>
      ` : `
        <button class="modal-book-btn" style="background:linear-gradient(135deg, #443c56, #282136); color:#fff;" id="navigateRouteBtn" data-lat="${loc.lat}" data-lng="${loc.lng}">
          <i class="fa-solid fa-diamond-turn-right"></i> Navigate Route
        </button>
      `}
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Attach Dynamic Actions
    const bookBtn = document.getElementById('confirmBookingBtn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        showToast(`Investigation Reserved for ${loc.name}! Confirmation dispatched to your EMF receiver.`, 'fa-envelope-circle-check');
        modal.classList.remove('open');
      });
    }

    const navBtn = document.getElementById('navigateRouteBtn');
    if (navBtn) {
      navBtn.addEventListener('click', () => {
        showToast(`Plotting navigation vector to ${loc.name}...`, 'fa-location-arrow');
        mapInstance.flyTo([loc.lat, loc.lng], 16, { duration: 1.5 });
        modal.classList.remove('open');
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('locationDetailModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  /* ==========================================================================
     9. Event Listeners & Master Initializer
     ========================================================================== */
  function init() {
    initLeafletMap();
    startEmfMeter();

    // Category Filter Pills
    document.querySelectorAll('.category-filter-bar .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-filter-bar .filter-pill').forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        activeFilter = pill.dataset.filter;
        renderMapPins();
      });
    });

    // Search Input Listener
    const searchInput = document.getElementById('locationSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderMapPins();
      });
    }

    // Geolocation Locate Button
    const locateBtn = document.getElementById('locateUserBtn');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        showToast('Locking onto your ghostly GPS coordinates...', 'fa-crosshairs');
        mapInstance.flyTo(DEFAULT_MAP_CENTER, 14, { duration: 1.2 });
      });
    }

    // Map Floating Actions
    const recenterBtn = document.getElementById('recenterMapBtn');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => {
        mapInstance.flyTo(DEFAULT_MAP_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
        showToast('Radar View Recentered', 'fa-compass');
      });
    }

    const heatmapBtn = document.getElementById('toggleHeatmapBtn');
    if (heatmapBtn) {
      heatmapBtn.addEventListener('click', () => {
        isHeatmapActive = !isHeatmapActive;
        heatmapBtn.classList.toggle('active', isHeatmapActive);
        showToast(isHeatmapActive ? 'EMF Heatmap Overlay: ACTIVE' : 'EMF Heatmap Disabled', 'fa-radiation');
      });
    }

    // Drawer Header Toggle
    const drawerToggle = document.getElementById('drawerHeaderToggle');
    const drawer = document.getElementById('locationsDrawer');
    if (drawerToggle && drawer) {
      drawerToggle.addEventListener('click', () => {
        isDrawerExpanded = !isDrawerExpanded;
        drawer.classList.toggle('expanded', isDrawerExpanded);
      });
    }

    const listDrawerBtn = document.getElementById('toggleListDrawerBtn');
    if (listDrawerBtn && drawer) {
      listDrawerBtn.addEventListener('click', () => {
        isDrawerExpanded = !isDrawerExpanded;
        drawer.classList.toggle('expanded', isDrawerExpanded);
      });
    }

    // Feed Item Selection Delegation
    const feedList = document.getElementById('locationsFeedList');
    if (feedList) {
      feedList.addEventListener('click', (e) => {
        const card = e.target.closest('.location-feed-card');
        if (card) {
          const locId = card.dataset.id;
          const loc = SPECTRAL_LOCATIONS.find(l => l.id === locId);
          if (loc) {
            mapInstance.flyTo([loc.lat, loc.lng], 15, { duration: 1.2 });
            openLocationModal(locId);
          }
        }
      });
    }

    // Modal Close Triggers
    const closeBtn = document.getElementById('closeModalBtn');
    const backdrop = document.getElementById('modalBackdropVeil');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Bottom Navigation Dock Switching
    document.querySelectorAll('.spectral-bottom-dock .dock-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.spectral-bottom-dock .dock-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

