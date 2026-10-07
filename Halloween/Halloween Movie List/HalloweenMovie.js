/**
 * FESTO — HALLOWEEN VAULT CONTROLLER
 * Full Wikipedia/Wikimedia REST API Engine with Cast Search & Embed Fallback
 */

document.addEventListener("DOMContentLoaded", () => {
  // Vault DOM References
  const vaultContainer = document.getElementById("categoryContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const trailerIdx = FestoVault.trailerIndex(typeof halloweenData !== "undefined" ? halloweenData : []);

  // Modal References
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
   * Groups items by categoryLabel.
   */
  function groupTitlesByCategory(dataset) {
    return dataset.reduce((acc, item) => {
      const label = item.categoryLabel || "Featured Halloween Horrors";
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
          <h3>No Nightmares Found</h3>
          <p>No titles, release years, or actors matched your search criteria.</p>
        </div>
      `;
      return;
    }

    categoryKeys.forEach(categoryLabel => {
      const movies = groupedData[categoryLabel];

      // Row Section Container
      const rowSection = document.createElement("section");
      rowSection.className = "category-row";

      // Row Title
      const titleHeader = document.createElement("h3");
      titleHeader.className = "category-title";
      titleHeader.textContent = categoryLabel;
      rowSection.appendChild(titleHeader);

      // Horizontal Slider Rail
      const slider = document.createElement("div");
      slider.className = "movie-slider spooky-scroll";

      movies.forEach(movie => {
        const card = document.createElement("article");
        card.className = "movie-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `${movie.title} (${movie.year})`);

        card.innerHTML = `
          <div class="poster-box">
            <img 
              class="official-poster" 
              alt="${movie.title} Poster" 
              loading="lazy"
            >
            <div class="card-rating-badge">★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</div>
          </div>
          <div class="card-details">
            <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
            <div class="card-meta">
              <span>${movie.year}</span>
              <span class="card-btn-hint">Inspect</span>
            </div>
          </div>
        `;

        FestoCovers.attach(card.querySelector(".official-poster"), movie, "movie");

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
   * Opens the theatre modal, renders cast tags, embeds the trailer, and queries Wikipedia.
   */
  function openCinemaModal(movie) {
    modalRatingTag.textContent = `★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'} / 10`;
    modalCategory.textContent = movie.categoryLabel;
    modalYear.textContent = movie.year;
    modalTitle.textContent = movie.title;
    modalOverview.textContent = "Retrieving official archival record from Wikipedia...";
    
    // Reset poster to initial state
    modalPoster.src = "";
    modalPoster.classList.remove("loaded");

    // Render Starring & Voice Actors List
    modalCastList.innerHTML = "";
    if (movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0) {
      movie.cast.forEach(actor => {
        const badge = document.createElement("span");
        badge.className = "cast-badge";
        badge.textContent = actor;
        
        // Clicking cast badge auto-searches for that actor
        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          closeCinemaModal();
          searchInput.value = actor;
          handleSearch();
          window.scrollTo({ top: 400, behavior: 'smooth' });
        });

        modalCastList.appendChild(badge);
      });
      modalCastList.parentElement.style.display = "flex";
    } else {
      modalCastList.parentElement.style.display = "none";
    }

    // Trailer: embed only when the key is unique to this title; a key shared by several films is a placeholder.
    const trailer = FestoVault.trailer(movie, trailerIdx);
    if (trailer.mode === "embed") {
      modalIframe.src = `${trailer.url}?autoplay=1&rel=0`;
      modalIframe.parentElement.style.display = "block";
      modalYtDirectLink.href = `https://www.youtube.com/watch?v=${trailer.key}`;
      modalYtDirectLink.textContent = "Open on YouTube ↗";
    } else {
      modalIframe.src = "";
      modalIframe.parentElement.style.display = "none";
      modalYtDirectLink.href = trailer.url;
      modalYtDirectLink.textContent = "Search trailer on YouTube ↗";
    }
    modalYtDirectLink.style.display = "inline-block";

    // Set streaming destination on JustWatch
    modalWatchLink.href = `https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`;

    movieModal.classList.add("active");
    movieModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Freeze background scrolling

    modalWikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.wikiSlug || movie.title)}`;

    // Open instantly; the poster and synopsis fill in when they arrive.
    FestoCovers.resolve(movie, "movie", { overview: true }).then(info => {
      if (!movieModal.classList.contains("active") || modalTitle.textContent !== movie.title) return;
      if (info.poster) { modalPoster.src = info.poster; modalPoster.classList.add("loaded"); }
      modalOverview.textContent = info.overview || "No synopsis on record for this title. The Wikipedia link below may have more.";
      if (info.wikiUrl) modalWikiLink.href = info.wikiUrl;
    });
  }

  /**
   * Closes the theatre modal and cuts video playback.
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
   * Real-time Multi-Field Search Filter (Title, Year, Category, and Actor/Cast).
   */
  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    clearSearchBtn.style.display = query.length > 0 ? "block" : "none";

    if (!query) {
      renderVault(halloweenData);
      return;
    }

    const filtered = halloweenData.filter(item => {
      const matchesTitle = item.title && item.title.toLowerCase().includes(query);
      const matchesYear = item.year && item.year.toString().includes(query);
      const matchesCategory = item.categoryLabel && item.categoryLabel.toLowerCase().includes(query);
      
      // Check for actor matches in cast array
      const matchesCast = item.cast && Array.isArray(item.cast) && item.cast.some(actor => 
        actor.toLowerCase().includes(query)
      );

      return matchesTitle || matchesYear || matchesCategory || matchesCast;
    });

    renderVault(filtered);
  }

  searchInput.addEventListener("input", Festo.dom.debounce(handleSearch, 180));

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderVault(halloweenData);
    searchInput.focus();
  });

  // Initial Boot
  if (typeof halloweenData !== "undefined" && Array.isArray(halloweenData)) {
    FestoVault.fillCounts(document, FestoVault.counts(halloweenData));
    renderVault(halloweenData);
  } else {
    vaultContainer.innerHTML = `
      <div class="empty-results">
        <h3>Manifest Missing</h3>
        <p>Ensure HalloweenData.js is loaded prior to HalloweenMovie.js.</p>
      </div>
    `;
  }
});