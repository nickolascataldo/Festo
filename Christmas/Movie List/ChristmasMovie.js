/**
 * FESTO — CHRISTMAS VAULT ENGINE (V10.0 MAXIMUM RETENTION ARCHITECTURE)
 * Features:
 * - Dynamic sequential category numbering (1., 2., 3., ... 50.)
 * - Curated Priority Order (Blockbusters, Animation, Family Nostalgia, Road Trips at top)
 * - In-App "Holiday Watchlist" persistence (saves to localStorage)
 * - Interactive Cast Search (clicking an actor filters the vault instantly)
 * - Pure Letterboxd-style metadata hub (Zero external YouTube leaks or broken boxes)
 * - Fast Wikipedia caching with IntersectionObserver lazy loading
 */

const wikiCache = new Map();

const CATEGORY_PRIORITY_ORDER = [
  4,   // Modern Live-Action Blockbusters
  10,  // Animated Holiday Features & CGI
  3,   // 80s/90s Family Nostalgia
  16,  // Holiday Road Trips & Travel Disasters
  6,   // Santa Claus Lore & Origins
  7,   // High-Octane Action
  41,  // Black Family Holiday Classics
  18,  // Grinches & Heartwarmers
  23,  // Romantic Holiday Comedies
  9,   // Dark Christmas Comedies
  50,  // Animated Winter Shorts
  1,   // Golden Age Hollywood Classics
  2,   // Rankin/Bass Specials
  5    // A Christmas Carol Adaptations
];

// Watchlist LocalStorage Management
function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem("festo_christmas_watchlist")) || [];
  } catch (e) {
    return [];
  }
}

function saveWatchlist(list) {
  try {
    localStorage.setItem("festo_christmas_watchlist", JSON.stringify(list));
  } catch (e) {}
}

function isMovieInWatchlist(movieId) {
  const list = getWatchlist();
  return list.includes(movieId);
}

function toggleWatchlistMovie(movieId) {
  let list = getWatchlist();
  if (list.includes(movieId)) {
    list = list.filter(id => id !== movieId);
  } else {
    list.push(movieId);
  }
  saveWatchlist(list);
  return list.includes(movieId);
}

async function fetchWikiPoster(wikiSlug) {
  if (!wikiSlug) return null;
  if (wikiCache.has(wikiSlug)) return wikiCache.get(wikiSlug);

  const cleanSlug = decodeURIComponent(wikiSlug).replace(/\s+/g, '_');
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSlug)}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        'Api-User-Agent': 'FestoChristmasCinemaVault/10.0 (contact@festoapp.local)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const posterUrl = data.thumbnail?.source || data.originalimage?.source || null;
      const result = {
        poster: posterUrl,
        overview: data.extract || "",
        wikiUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanSlug)}`
      };
      wikiCache.set(wikiSlug, result);
      return result;
    }
  } catch (err) {
    console.error(`[Festo Christmas] Wiki load failed for "${cleanSlug}":`, err);
  }

  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  // Vault DOM References
  const vaultContainer = document.getElementById("categoryContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const totalMovieCountEl = document.getElementById("totalMovieCount");
  const watchlistCountEl = document.getElementById("watchlistCount");
  const filterPills = document.getElementById("filterPills");
  const categoryJumpSelect = document.getElementById("categoryJumpSelect");

  // Detail Modal DOM References
  const movieModal = document.getElementById("movieModal");
  const modalCloseBtn = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalRatingTag = document.getElementById("modalRatingTag");
  const modalCategory = document.getElementById("modalCategory");
  const modalYear = document.getElementById("modalYear");
  const modalTitle = document.getElementById("modalTitle");
  const modalCastList = document.getElementById("modalCastList");
  const modalOverview = document.getElementById("modalOverview");
  const modalWikiLink = document.getElementById("modalWikiLink");
  const modalWatchLink = document.getElementById("modalWatchLink");
  const btnToggleWatchlist = document.getElementById("btnToggleWatchlist");
  const watchlistIcon = document.getElementById("watchlistIcon");
  const watchlistText = document.getElementById("watchlistText");

  let currentPillFilter = "all";
  let activeMovie = null;

  function updateWatchlistCounter() {
    if (watchlistCountEl) {
      watchlistCountEl.textContent = getWatchlist().length;
    }
  }

  // IntersectionObserver for lazy Wikipedia posters
  const posterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const slug = card.dataset.wikiSlug;
        const imgEl = card.querySelector(".official-poster");

        if (slug && imgEl && !imgEl.classList.contains("loaded")) {
          fetchWikiPoster(slug).then(data => {
            if (data && data.poster) {
              imgEl.src = data.poster;
              imgEl.onload = () => imgEl.classList.add("loaded");
            }
          });
        }
        observer.unobserve(card);
      }
    });
  }, {
    rootMargin: "250px",
    threshold: 0.01
  });

  function extractOriginalCategoryNumber(label) {
    const match = label.match(/^(\d+)\./);
    return match ? parseInt(match[1], 10) : 999;
  }

  function cleanCategoryTitle(label) {
    return label.replace(/^\d+\.\s*/, "").trim();
  }

  function buildSortedCategoryMap(dataset) {
    const rawGrouped = dataset.reduce((acc, item) => {
      const label = item.categoryLabel || "Featured Holiday Classics";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});

    const sortedRawKeys = Object.keys(rawGrouped).sort((a, b) => {
      const numA = extractOriginalCategoryNumber(a);
      const numB = extractOriginalCategoryNumber(b);

      const rankA = CATEGORY_PRIORITY_ORDER.indexOf(numA);
      const rankB = CATEGORY_PRIORITY_ORDER.indexOf(numB);

      const weightA = rankA !== -1 ? rankA : 100 + numA;
      const weightB = rankB !== -1 ? rankB : 100 + numB;

      return weightA - weightB;
    });

    const displayGrouped = [];
    sortedRawKeys.forEach((rawKey, index) => {
      const displayIndex = index + 1;
      const cleanTitle = cleanCategoryTitle(rawKey);
      const displayLabel = `${displayIndex}. ${cleanTitle}`;
      const originalNum = extractOriginalCategoryNumber(rawKey);

      displayGrouped.push({
        displayIndex,
        originalNum,
        displayLabel,
        cleanTitle,
        movies: rawGrouped[rawKey]
      });
    });

    return displayGrouped;
  }

  function populateJumpSelect(categoryList) {
    categoryJumpSelect.innerHTML = '<option value="">-- Jump to a Specific Category --</option>';
    categoryList.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = `cat-section-${cat.displayIndex}`;
      opt.textContent = `${cat.displayLabel} (${cat.movies.length} titles)`;
      categoryJumpSelect.appendChild(opt);
    });
  }

  categoryJumpSelect.addEventListener("change", (e) => {
    const targetId = e.target.value;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  function matchesPillFilter(originalNum, filter) {
    if (filter === "all") return true;

    switch (filter) {
      case "blockbuster":
        return originalNum === 4 || originalNum === 6 || originalNum === 14 || originalNum === 18;
      case "animation":
        return originalNum === 2 || originalNum === 10 || originalNum === 20 || originalNum === 48 || originalNum === 50;
      case "roadtrip":
        return originalNum === 16;
      case "family":
        return originalNum === 3 || originalNum === 25 || originalNum === 37 || originalNum === 41 || originalNum === 44 || originalNum === 47;
      case "action":
        return originalNum === 7 || originalNum === 17 || originalNum === 27 || originalNum === 49;
      case "classics":
        return originalNum === 1 || originalNum === 5 || originalNum === 21 || originalNum === 36 || originalNum === 43;
      case "romance":
        return originalNum === 11 || originalNum === 12 || originalNum === 23 || originalNum === 24 || originalNum === 31 || originalNum === 39 || originalNum === 40 || originalNum === 46;
      default:
        return true;
    }
  }

  function renderVault(dataset) {
    vaultContainer.innerHTML = "";

    // Handle "My Watchlist" View
    if (currentPillFilter === "watchlist") {
      const watchlistIds = getWatchlist();
      const watchlistMovies = dataset.filter(m => watchlistIds.includes(m.id));

      if (watchlistMovies.length === 0) {
        vaultContainer.innerHTML = `
          <div class="empty-results">
            <h3>Your Holiday Watchlist is Empty</h3>
            <p>Click "Inspect ❄️" on any movie card and hit "⭐ Add to Watchlist" to curate your holiday marathon.</p>
          </div>
        `;
        return;
      }

      const rowSection = document.createElement("section");
      rowSection.className = "category-row";

      const titleHeader = document.createElement("h3");
      titleHeader.className = "category-title";
      titleHeader.innerHTML = `<span>⭐ My Saved Holiday Watchlist</span> <small style="font-size: 0.8rem; color: var(--warm-gold); opacity: 0.8;">(${watchlistMovies.length})</small>`;
      rowSection.appendChild(titleHeader);

      const slider = document.createElement("div");
      slider.className = "movie-slider holiday-scroll";

      watchlistMovies.forEach(movie => {
        const card = createMovieCard(movie, "⭐ Holiday Watchlist");
        slider.appendChild(card);
      });

      rowSection.appendChild(slider);
      vaultContainer.appendChild(rowSection);
      return;
    }

    const categoryList = buildSortedCategoryMap(dataset);
    const visibleCategories = categoryList.filter(cat => matchesPillFilter(cat.originalNum, currentPillFilter));

    if (visibleCategories.length === 0) {
      vaultContainer.innerHTML = `
        <div class="empty-results">
          <h3>No Holiday Classics Found</h3>
          <p>No titles matched your active search or filter.</p>
        </div>
      `;
      return;
    }

    visibleCategories.forEach(cat => {
      const rowSection = document.createElement("section");
      rowSection.className = "category-row";
      rowSection.id = `cat-section-${cat.displayIndex}`;

      const titleHeader = document.createElement("h3");
      titleHeader.className = "category-title";
      titleHeader.innerHTML = `<span>${cat.displayLabel}</span> <small style="font-size: 0.8rem; color: var(--warm-gold); opacity: 0.8;">(${cat.movies.length})</small>`;
      rowSection.appendChild(titleHeader);

      const slider = document.createElement("div");
      slider.className = "movie-slider holiday-scroll";

      cat.movies.forEach(movie => {
        const card = createMovieCard(movie, cat.displayLabel);
        slider.appendChild(card);
      });

      rowSection.appendChild(slider);
      vaultContainer.appendChild(rowSection);
    });
  }

  function createMovieCard(movie, displayCategoryLabel) {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `${movie.title} (${movie.year})`);
    card.dataset.wikiSlug = movie.wikiSlug || "";

    card.innerHTML = `
      <div class="poster-box">
        <img class="official-poster" alt="${movie.title} Poster">
        <div class="card-rating-badge">★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</div>
      </div>
      <div class="card-details">
        <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
        <div class="card-meta">
          <span>${movie.year}</span>
          <span class="card-btn-hint">Inspect ❄️</span>
        </div>
      </div>
    `;

    posterObserver.observe(card);

    card.addEventListener("click", () => openCinemaModal(movie, displayCategoryLabel));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCinemaModal(movie, displayCategoryLabel);
      }
    });

    return card;
  }

  async function openCinemaModal(movie, displayCategoryLabel) {
    activeMovie = movie;

    modalRatingTag.textContent = `★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}`;
    modalCategory.textContent = displayCategoryLabel || cleanCategoryTitle(movie.categoryLabel);
    modalYear.textContent = movie.year;
    modalTitle.textContent = movie.title;
    modalOverview.textContent = "Retrieving official holiday records from Wikipedia archives...";

    modalBackdrop.style.backgroundImage = `none`;

    // Watchlist state sync
    updateWatchlistButtonState(movie.id);

    // Render Cast Badges
    modalCastList.innerHTML = "";
    if (movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0) {
      movie.cast.forEach(actor => {
        const badge = document.createElement("span");
        badge.className = "cast-badge";
        badge.textContent = actor;

        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          closeCinemaModal();
          searchInput.value = actor;
          handleSearch();
          window.scrollTo({ top: 420, behavior: 'smooth' });
        });

        modalCastList.appendChild(badge);
      });
      modalCastList.parentElement.style.display = "flex";
    } else {
      modalCastList.parentElement.style.display = "none";
    }

    modalWatchLink.href = `https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`;

    const wikiData = await fetchWikiPoster(movie.wikiSlug);
    if (wikiData) {
      if (wikiData.poster) {
        modalBackdrop.style.backgroundImage = `url('${wikiData.poster}')`;
      }
      if (wikiData.overview) modalOverview.textContent = wikiData.overview;
      modalWikiLink.href = wikiData.wikiUrl;
    } else {
      modalWikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.wikiSlug || movie.title)}`;
    }

    movieModal.classList.add("active");
    movieModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function updateWatchlistButtonState(movieId) {
    const isSaved = isMovieInWatchlist(movieId);
    if (isSaved) {
      btnToggleWatchlist.classList.add("active");
      watchlistIcon.textContent = "✓";
      watchlistText.textContent = "On Your Watchlist";
    } else {
      btnToggleWatchlist.classList.remove("active");
      watchlistIcon.textContent = "⭐";
      watchlistText.textContent = "Add to Watchlist";
    }
  }

  btnToggleWatchlist.addEventListener("click", () => {
    if (!activeMovie) return;
    toggleWatchlistMovie(activeMovie.id);
    updateWatchlistButtonState(activeMovie.id);
    updateWatchlistCounter();
    if (currentPillFilter === "watchlist") {
      renderVault(window.christmasData || []);
    }
  });

  function closeCinemaModal() {
    movieModal.classList.remove("active");
    movieModal.setAttribute("aria-hidden", "true");
    activeMovie = null;
    document.body.style.overflow = "auto";
  }

  modalCloseBtn.addEventListener("click", closeCinemaModal);

  window.addEventListener("click", (e) => {
    if (e.target === movieModal) closeCinemaModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && movieModal.classList.contains("active")) {
      closeCinemaModal();
    }
  });

  // Filter Pills Handlers
  filterPills.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill-btn");
    if (!btn) return;

    document.querySelectorAll(".pill-btn").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    currentPillFilter = btn.dataset.filter;
    handleSearch();
  });

  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    clearSearchBtn.style.display = query.length > 0 ? "block" : "none";

    const dataset = window.christmasData || [];

    if (!query) {
      renderVault(dataset);
      return;
    }

    const filtered = dataset.filter(item => {
      const matchesTitle = item.title && item.title.toLowerCase().includes(query);
      const matchesYear = item.year && item.year.toString().includes(query);
      const matchesCategory = item.categoryLabel && item.categoryLabel.toLowerCase().includes(query);
      const matchesCast = item.cast && Array.isArray(item.cast) && item.cast.some(actor =>
        actor.toLowerCase().includes(query)
      );

      return matchesTitle || matchesYear || matchesCategory || matchesCast;
    });

    renderVault(filtered);
  }

  searchInput.addEventListener("input", handleSearch);

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderVault(window.christmasData || []);
    searchInput.focus();
  });

  // Initialize Library
  const fullDataset = window.christmasData || [];
  if (totalMovieCountEl) {
    totalMovieCountEl.textContent = `${fullDataset.length}+`;
  }
  updateWatchlistCounter();

  const categoryList = buildSortedCategoryMap(fullDataset);
  populateJumpSelect(categoryList);
  renderVault(fullDataset);
});