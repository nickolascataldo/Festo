/**
 * FESTO — Spring Cinema Meadow Engine
 * High-Speed Asynchronous Wikimedia Hydration & Real-Time Vector Affinity Discovery
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. LOCAL STORAGE AFFINITY PROFILE STORE
  // ==========================================================================
  const Store = {
    KEYS: {
      LIKES: 'festo_spring_likes',
      WATCHLIST: 'festo_spring_watchlist',
      AFFINITY: 'festo_spring_tag_affinity'
    },
    get(key, fallback) {
      try { 
        return JSON.parse(localStorage.getItem(key)) || fallback; 
      } catch (e) { 
        return fallback; 
      }
    },
    set(key, val) {
      try { 
        localStorage.setItem(key, JSON.stringify(val)); 
      } catch (e) {
        console.warn('LocalStorage write failed:', e);
      }
    },
    recordAffinity(tags, multiplier) {
      if (!tags) return;
      const profile = this.get(this.KEYS.AFFINITY, {});
      for (const [tag, weight] of Object.entries(tags)) {
        profile[tag] = (profile[tag] || 0) + ((Number(weight) || 0.5) * multiplier);
      }
      this.set(this.KEYS.AFFINITY, profile);
    }
  };

  // ==========================================================================
  // 2. IN-MEMORY WIKIPEDIA REST API CACHE
  // ==========================================================================
  const wikiCache = new Map();

  async function fetchWikiPoster(wikiSlug) {
    if (!wikiSlug) return null;
    if (wikiCache.has(wikiSlug)) return wikiCache.get(wikiSlug);

    const cleanSlug = decodeURIComponent(wikiSlug).trim().replace(/\s+/g, '_');
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSlug)}`;

    try {
      const res = await fetch(endpoint, {
        headers: { 'Api-User-Agent': 'FestoSpringCinemaVault/9.0 (contact@festoapp.local)' }
      });
      if (res.ok) {
        const data = await res.json();
        const payload = {
          poster: data.thumbnail?.source || data.originalimage?.source || null,
          overview: data.extract || 'No narrative synopsis available in Wikipedia records.',
          wikiUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanSlug)}`
        };
        wikiCache.set(wikiSlug, payload);
        return payload;
      }
    } catch (e) {
      // Fail silently to maintain UI responsiveness
    }
    return null;
  }

  // ==========================================================================
  // 3. VECTOR SIMILARITY & METADATA HELPERS
  // ==========================================================================
  function computeMovieScore(movie, userProfile) {
    if (!movie.tags || !userProfile) return 0;
    let score = 0;
    for (const [tag, weight] of Object.entries(movie.tags)) {
      if (userProfile[tag]) {
        score += (Number(weight) || 0.5) * userProfile[tag];
      }
    }
    return score;
  }

  function getTopTags(tagsObj, limit = 3) {
    if (!tagsObj) return [];
    return Object.entries(tagsObj)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  // ==========================================================================
  // 4. UI RUNTIME CONTROLLER
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
      vault: document.getElementById('categoryContainer'),
      searchInput: document.getElementById('searchInput'),
      clearSearch: document.getElementById('clearSearch'),
      totalMovieCount: document.getElementById('totalMovieCount'),
      watchlistCount: document.getElementById('watchlistCount'),
      filterPills: document.getElementById('filterPills'),
      jumpSelect: document.getElementById('categoryJumpSelect'),
      modal: document.getElementById('movieModal'),
      modalClose: document.getElementById('modalClose'),
      modalBackdrop: document.getElementById('modalBackdrop'),
      modalRating: document.getElementById('modalRatingTag'),
      modalCategory: document.getElementById('modalCategory'),
      modalYear: document.getElementById('modalYear'),
      modalTitle: document.getElementById('modalTitle'),
      modalCast: document.getElementById('modalCastList'),
      modalTags: document.getElementById('modalTagCloud'),
      modalOverview: document.getElementById('modalOverview'),
      modalWikiLink: document.getElementById('modalWikiLink'),
      modalWatchLink: document.getElementById('modalWatchLink'),
      btnLike: document.getElementById('btnToggleLike'),
      btnWatchlist: document.getElementById('btnToggleWatchlist'),
      likeText: document.getElementById('likeText'),
      watchlistText: document.getElementById('watchlistText')
    };

    const fullDataset = window.springData || [];
    const movieMap = new Map(fullDataset.map(m => [String(m.id), m]));
    let currentFilter = 'all';
    let activeMovie = null;
    let dwellTimeout = null;

    function refreshWatchlistCounter() {
      if (DOM.watchlistCount) {
        DOM.watchlistCount.textContent = Store.get(Store.KEYS.WATCHLIST, []).length;
      }
    }

    // High-Performance Parallel Poster Loader
    const posterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const slug = card.dataset.wikiSlug;
        const img = card.querySelector('.official-poster');

        if (slug && img && !img.classList.contains('loaded')) {
          fetchWikiPoster(slug).then(data => {
            if (data?.poster) {
              img.src = data.poster;
              img.onload = () => img.classList.add('loaded');
            }
          });
        }
        observer.unobserve(card);
      });
    }, { rootMargin: '350px 0px', threshold: 0.01 });

    const parseCategoryNumber = label => (label.match(/^(\d+)\./) ? parseInt(label.match(/^(\d+)\./)[1], 10) : 999);
    const cleanCategoryTitle = label => label.replace(/^\d+\.\s*/, '').trim();

    function categorizeData(dataset) {
      const grouped = dataset.reduce((acc, item) => {
        const key = item.categoryLabel || 'Featured Spring Classics';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      return Object.keys(grouped)
        .sort((a, b) => parseCategoryNumber(a) - parseCategoryNumber(b))
        .map((key, i) => ({
          index: i + 1,
          label: `${i + 1}. ${cleanCategoryTitle(key)}`,
          movies: grouped[key]
        }));
    }

    function initJumpSelect(categories) {
      DOM.jumpSelect.innerHTML = '<option value="">-- Jump to a Specific Chamber (1 to 50) --</option>';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = `cat-section-${cat.index}`;
        opt.textContent = `${cat.label} (${cat.movies.length} titles)`;
        DOM.jumpSelect.appendChild(opt);
      });
    }

    function buildCardHTML(movie) {
      const topTags = getTopTags(movie.tags, 3)
        .map(t => `<span class="card-tag-pill">${t.replace(/-/g, ' ')}</span>`)
        .join('');

      return `
        <article class="movie-card" role="button" tabindex="0" data-id="${movie.id}" data-wiki-slug="${movie.wikiSlug || ''}">
          <div class="poster-box">
            <img class="official-poster" alt="${movie.title} Poster" loading="lazy">
            <div class="card-rating-badge">★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</div>
          </div>
          <div class="card-details">
            <div>
              <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
              <div class="card-meta">
                <span>${movie.year}</span>
                <span class="card-btn-hint">Inspect 🌸</span>
              </div>
            </div>
            <div class="card-tags-row">${topTags}</div>
          </div>
        </article>
      `;
    }

    function render(dataset) {
      DOM.vault.innerHTML = '';

      if (currentFilter === 'recommended') {
        const profile = Store.get(Store.KEYS.AFFINITY, {});
        const scored = dataset
          .map(m => ({ movie: m, score: computeMovieScore(m, profile) }))
          .filter(i => i.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 30)
          .map(i => i.movie);

        if (!scored.length) {
          DOM.vault.innerHTML = `
            <div style="text-align:center; padding:5rem 0;">
              <h3 style="font-family:var(--font-heading); font-size:2rem; color:var(--wild-rose); margin-bottom:0.5rem;">No Taste Profile Built Yet</h3>
              <p style="color:var(--text-muted); font-weight:600;">Inspect or like films to train your personalized discovery rail.</p>
            </div>
          `;
          return;
        }
        renderRail('🎯 Personalized For You (Live Vector Match)', scored);
        return;
      }

      if (currentFilter === 'watchlist') {
        const watchlistIds = new Set(Store.get(Store.KEYS.WATCHLIST, []));
        const watchlistMovies = dataset.filter(m => watchlistIds.has(m.id));

        if (!watchlistMovies.length) {
          DOM.vault.innerHTML = `
            <div style="text-align:center; padding:5rem 0;">
              <h3 style="font-family:var(--font-heading); font-size:2rem; color:var(--wild-rose); margin-bottom:0.5rem;">Your Watchlist is Empty</h3>
              <p style="color:var(--text-muted); font-weight:600;">Click "Inspect 🌸" on any title and hit "Add to Watchlist".</p>
            </div>
          `;
          return;
        }
        renderRail('⭐ My Saved Spring Watchlist', watchlistMovies);
        return;
      }

      const categories = categorizeData(dataset);
      categories.forEach(cat => {
        const section = document.createElement('section');
        section.className = 'category-row';
        section.id = `cat-section-${cat.index}`;
        section.innerHTML = `
          <h3 class="category-title">
            <span>${cat.label}</span>
            <span class="category-count-badge">(${cat.movies.length})</span>
          </h3>
          <div class="movie-slider">${cat.movies.map(buildCardHTML).join('')}</div>
        `;
        DOM.vault.appendChild(section);
      });

      DOM.vault.querySelectorAll('.movie-card').forEach(card => posterObserver.observe(card));
    }

    function renderRail(title, movies) {
      const section = document.createElement('section');
      section.className = 'category-row';
      section.innerHTML = `
        <h3 class="category-title">
          <span>${title}</span>
          <span class="category-count-badge">(${movies.length})</span>
        </h3>
        <div class="movie-slider">${movies.map(buildCardHTML).join('')}</div>
      `;
      DOM.vault.appendChild(section);
      section.querySelectorAll('.movie-card').forEach(card => posterObserver.observe(card));
    }

    // ==========================================================================
    // 5. CONSERVATORY MODAL ACTIONS
    // ==========================================================================
    async function openModal(movie) {
      activeMovie = movie;
      Store.recordAffinity(movie.tags, 1);

      if (dwellTimeout) clearTimeout(dwellTimeout);
      dwellTimeout = setTimeout(() => Store.recordAffinity(movie.tags, 2), 8000);

      DOM.modalRating.textContent = `★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}`;
      DOM.modalCategory.textContent = cleanCategoryTitle(movie.categoryLabel || 'Featured Classic');
      DOM.modalYear.textContent = movie.year;
      DOM.modalTitle.textContent = movie.title;
      DOM.modalOverview.textContent = 'Retrieving records from Wikipedia archives...';
      DOM.modalBackdrop.style.backgroundImage = 'none';

      updateButtonStates(movie.id);

      DOM.modalTags.innerHTML = movie.tags 
        ? Object.entries(movie.tags)
            .sort((a, b) => (b[1] || 0) - (a[1] || 0))
            .map(([t, w]) => `<span class="modal-tag-chip" data-search="#${t}">#${t} <span class="weight-pip">${Math.round((w || 0.5) * 100)}%</span></span>`)
            .join('')
        : '';

      DOM.modalCast.innerHTML = Array.isArray(movie.cast)
        ? movie.cast.map(actor => `<span class="cast-badge" data-search="${actor}">${actor}</span>`).join('')
        : '';

      DOM.modalWatchLink.href = `https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`;

      DOM.modal.classList.add('active');
      DOM.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const wiki = await fetchWikiPoster(movie.wikiSlug);
      if (wiki) {
        if (wiki.poster) DOM.modalBackdrop.style.backgroundImage = `url('${wiki.poster}')`;
        if (wiki.overview) DOM.modalOverview.textContent = wiki.overview;
        DOM.modalWikiLink.href = wiki.wikiUrl;
      } else {
        DOM.modalWikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.wikiSlug || movie.title)}`;
      }
    }

    function closeModal() {
      if (dwellTimeout) clearTimeout(dwellTimeout);
      DOM.modal.classList.remove('active');
      DOM.modal.setAttribute('aria-hidden', 'true');
      activeMovie = null;
      document.body.style.overflow = 'auto';
    }

    function updateButtonStates(movieId) {
      const likes = Store.get(Store.KEYS.LIKES, []);
      const watchlist = Store.get(Store.KEYS.WATCHLIST, []);

      DOM.btnLike.classList.toggle('active', likes.includes(movieId));
      DOM.likeText.textContent = likes.includes(movieId) ? 'Loved' : 'Love This';

      DOM.btnWatchlist.classList.toggle('active', watchlist.includes(movieId));
      DOM.watchlistText.textContent = watchlist.includes(movieId) ? 'Saved' : 'Add to Watchlist';
    }

    // ==========================================================================
    // 6. EVENT DELEGATION & LISTENERS
    // ==========================================================================
    DOM.vault.addEventListener('click', (e) => {
      const card = e.target.closest('.movie-card');
      if (card && card.dataset.id) {
        const movie = movieMap.get(card.dataset.id);
        if (movie) openModal(movie);
      }
    });

    DOM.vault.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.movie-card');
        if (card && card.dataset.id) {
          e.preventDefault();
          const movie = movieMap.get(card.dataset.id);
          if (movie) openModal(movie);
        }
      }
    });

    DOM.modal.addEventListener('click', (e) => {
      const target = e.target.closest('[data-search]');
      if (target) {
        const val = target.dataset.search;
        closeModal();
        DOM.searchInput.value = val;
        handleSearch();
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    });

    DOM.btnLike.addEventListener('click', () => {
      if (!activeMovie) return;
      let likes = Store.get(Store.KEYS.LIKES, []);
      likes = likes.includes(activeMovie.id) ? likes.filter(id => id !== activeMovie.id) : [...likes, activeMovie.id];
      if (likes.includes(activeMovie.id)) Store.recordAffinity(activeMovie.tags, 5);
      Store.set(Store.KEYS.LIKES, likes);
      updateButtonStates(activeMovie.id);
    });

    DOM.btnWatchlist.addEventListener('click', () => {
      if (!activeMovie) return;
      let wl = Store.get(Store.KEYS.WATCHLIST, []);
      wl = wl.includes(activeMovie.id) ? wl.filter(id => id !== activeMovie.id) : [...wl, activeMovie.id];
      if (wl.includes(activeMovie.id)) Store.recordAffinity(activeMovie.tags, 3);
      Store.set(Store.KEYS.WATCHLIST, wl);
      updateButtonStates(activeMovie.id);
      refreshWatchlistCounter();
      if (currentFilter === 'watchlist') render(fullDataset);
    });

    function handleSearch() {
      const q = DOM.searchInput.value.toLowerCase().trim();
      DOM.clearSearch.style.display = q ? 'block' : 'none';

      if (!q) { 
        render(fullDataset); 
        return; 
      }

      const isTag = q.startsWith('#');
      const cleanTag = q.replace(/^#/, '');

      const filtered = fullDataset.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const castMatch = item.cast?.some(c => c.toLowerCase().includes(q));
        const tagMatch = item.tags && Object.keys(item.tags).some(t => t.toLowerCase().includes(cleanTag));
        return isTag ? tagMatch : (titleMatch || castMatch || tagMatch);
      });

      render(filtered);
    }

    DOM.searchInput.addEventListener('input', handleSearch);

    DOM.clearSearch.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.clearSearch.style.display = 'none';
      render(fullDataset);
      DOM.searchInput.focus();
    });

    DOM.filterPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-btn');
      if (!btn) return;
      document.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      handleSearch();
    });

    DOM.jumpSelect.addEventListener('change', (e) => {
      const target = document.getElementById(e.target.value);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    DOM.modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === DOM.modal) closeModal(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && DOM.modal.classList.contains('active')) closeModal(); });

    // ==========================================================================
    // 7. INITIAL EXECUTION
    // ==========================================================================
    if (DOM.totalMovieCount) DOM.totalMovieCount.textContent = `${fullDataset.length}+`;
    refreshWatchlistCounter();
    initJumpSelect(categorizeData(fullDataset));
    render(fullDataset);
  });
})();