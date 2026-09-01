/**
 * FESTO — SUMMER VAULT ENGINE (WIKIPEDIA REST API & LAZY PRE-FETCH)
 * Manages modular multi-part data merging, intersection-observer lazy loading,
 * multi-field cast searching, and YouTube trailer playback.
 */

// In-memory cache to prevent duplicate network calls to Wikipedia
const wikiCache = new Map();

/**
 * Fetches Wikipedia article summary, official theatrical poster, and canonical page link.
 */
async function fetchWikiPoster(wikiSlug) {
  if (!wikiSlug) return null;
  if (wikiCache.has(wikiSlug)) return wikiCache.get(wikiSlug);

  // Clean slug to prevent double-encoding issues
  const cleanSlug = decodeURIComponent(wikiSlug).replace(/\s+/g, '_');
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSlug)}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        'Api-User-Agent': 'FestoSummerCinemaVault/1.0 (contact@festoapp.local)'
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
    console.error(`[Festo Summer] Wiki load failed for "${cleanSlug}":`, err);
  }

  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  // Vault DOM References
  const vaultContainer = document.getElementById("categoryContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");

  // Cinema Modal DOM References
  const movieModal = document.getElementById("movieModal");
  const modalCloseBtn = document.getElementById("modalClose");
  const modalPoster = document.getElementById("modalPoster");
  const modalRatingTag = document.getElementById("modalRatingTag");
  const modalCategory = document.getElementById("modalCategory");
  const modalYear = document.getElementById("modalYear");
  const modalTitle = document.getElementById("modalTitle");
  const modalCastList = document.getElementById("modalCastList");
  const modalOverview = document.getElementById("modalOverview");
  const modalIframe = document.getElementById("modalIframe");
  const modalYtDirectLink = document.getElementById("modalYtDirectLink");
  const modalWikiLink = document.getElementById("modalWikiLink");
  const modalWatchLink = document.getElementById("modalWatchLink");

  /**
   * IntersectionObserver: Smoothly prefetches Wikipedia posters as cards
   * enter within a 250px buffer of the viewport.
   */
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
        observer.unobserve(card); // Unobserve once triggered
      }
    });
  }, {
    rootMargin: "250px 250px 250px 250px", // 250px pre-load cushion in all directions
    threshold: 0.01
  });

  /**
   * Groups items by categoryLabel.
   */
  function groupTitlesByCategory(dataset) {
    return dataset.reduce((acc, item) => {
      const label = item.categoryLabel || "Featured Summer Hits";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});
  }

  /**
   * Renders the dynamic horizontal category rails.
   */
  function renderVault(dataset) {
    vaultContainer.innerHTML = "";
    const groupedData = groupTitlesByCategory(dataset);
    const categoryKeys = Object.keys(groupedData);

    if (categoryKeys.length === 0) {
      vaultContainer.innerHTML = `
        <div class="empty-results">
          <h3>No Summer Hits Found</h3>
          <p>No blockbusters, beach adventures, or stars matched your search.</p>
        </div>
      `;
      return;
    }

    categoryKeys.forEach(categoryLabel => {
      const movies = groupedData[categoryLabel];

      // Section Row
      const rowSection = document.createElement("section");
      rowSection.className = "category-row";

      // Category Heading
      const titleHeader = document.createElement("h3");
      titleHeader.className = "category-title";
      titleHeader.textContent = categoryLabel;
      rowSection.appendChild(titleHeader);

      // Horizontal Slider Rail
      const slider = document.createElement("div");
      slider.className = "movie-slider summer-scroll";

      movies.forEach(movie => {
        const card = document.createElement("article");
        card.className = "movie-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `${movie.title} (${movie.year})`);

        // Store slug on dataset for IntersectionObserver
        card.dataset.wikiSlug = movie.wikiSlug || "";

        card.innerHTML = `
          <div class="poster-box">
            <img 
              class="official-poster" 
              alt="${movie.title} Poster"
            >
            <div class="card-rating-badge">★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</div>
          </div>
          <div class="card-details">
            <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
            <div class="card-meta">
              <span>${movie.year}</span>
              <span class="card-btn-hint">Inspect ☀️</span>
            </div>
          </div>
        `;

        // Register card with Lazy Observer
        posterObserver.observe(card);

        // Click and Keyboard Accessibility
        card.addEventListener("click", () => openCinemaModal(movie));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCinemaModal(movie);
          }
        });

        slider.appendChild(card);
      });

      rowSection.appendChild(slider);
      vaultContainer.appendChild(rowSection);
    });
  }

  /**
   * Opens the theatre modal, populates cast chips, and initiates trailer playback.
   */
  async function openCinemaModal(movie) {
    modalRatingTag.textContent = `★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'} / 10`;
    modalCategory.textContent = movie.categoryLabel;
    modalYear.textContent = movie.year;
    modalTitle.textContent = movie.title;
    modalOverview.textContent = "Retrieving official summer archives from Wikipedia...";

    modalPoster.src = "";
    modalPoster.classList.remove("loaded");

    // Render Starring Cast & Voice Badges
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
          window.scrollTo({ top: 380, behavior: 'smooth' });
        });

        modalCastList.appendChild(badge);
      });
      modalCastList.parentElement.style.display = "flex";
    } else {
      modalCastList.parentElement.style.display = "none";
    }

    // Embed YouTube Trailer with Verified Fallbacks
    if (movie.youtubeTrailerKey) {
      modalIframe.src = `https://www.youtube.com/embed/${movie.youtubeTrailerKey}?autoplay=1&rel=0`;
      modalIframe.parentElement.style.display = "block";
      modalYtDirectLink.href = `https://www.youtube.com/watch?v=${movie.youtubeTrailerKey}`;
      modalYtDirectLink.style.display = "inline-block";
    } else {
      modalIframe.src = "";
      modalIframe.parentElement.style.display = "none";
      modalYtDirectLink.style.display = "none";
    }

    // Set streaming destination on JustWatch
    modalWatchLink.href = `https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`;

    // Populate Wikipedia Details
    const wikiData = await fetchWikiPoster(movie.wikiSlug);
    if (wikiData) {
      if (wikiData.poster) {
        modalPoster.src = wikiData.poster;
        modalPoster.classList.add("loaded");
      }
      if (wikiData.overview) modalOverview.textContent = wikiData.overview;
      modalWikiLink.href = wikiData.wikiUrl;
    } else {
      modalWikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.wikiSlug || movie.title)}`;
    }

    movieModal.classList.add("active");
    movieModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Freeze background scrolling
  }

  /**
   * Closes the modal and cuts trailer playback.
   */
  function closeCinemaModal() {
    movieModal.classList.remove("active");
    movieModal.setAttribute("aria-hidden", "true");
    modalIframe.src = ""; // Cut audio/video immediately
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

  /**
   * Real-time search across Title, Year, Category, and Actor/Voice Cast.
   */
  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    clearSearchBtn.style.display = query.length > 0 ? "block" : "none";

    const dataset = window.summerData || [];

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
    renderVault(window.summerData || []);
    searchInput.focus();
  });

  // Initial load once scripts are ready
  if (window.summerData && Array.isArray(window.summerData)) {
    renderVault(window.summerData);
  }
});