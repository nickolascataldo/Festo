/**
 * FESTO — CHRISTMAS & HOLIDAY BOOK SANCTUARY ENGINE
 * Features:
 * - Dynamic partitioning into strict 10-Book Shelves
 * - 3D Hardcover Book Rendering on Polished Mahogany Shelves
 * - Touch-friendly slider handling for mobile & tablet
 * - Isolated Christmas LocalStorage Profile Keys
 * - Mathematical Weighted Dot-Product Affinity Recommendation Scoring
 * - IntersectionObserver Dual-Fetch Caching for Open Library & Wikipedia
 */

const bookCoverCache = new Map();
let dwellTimer = null;

// Isolated LocalStorage Profile Utilities for Christmas Store
function getLikedBooks() {
  try { return JSON.parse(localStorage.getItem("festo_christmas_book_likes")) || []; } catch(e) { return []; }
}
function saveLikedBooks(list) {
  try { localStorage.setItem("festo_christmas_book_likes", JSON.stringify(list)); } catch(e) {}
}

function getReadingList() {
  try { return JSON.parse(localStorage.getItem("festo_christmas_reading_list")) || []; } catch(e) { return []; }
}
function saveReadingList(list) {
  try { localStorage.setItem("festo_christmas_reading_list", JSON.stringify(list)); } catch(e) {}
}

function getUserBookTagAffinity() {
  try { return JSON.parse(localStorage.getItem("festo_christmas_book_tag_affinity")) || {}; } catch(e) { return {}; }
}
function saveUserBookTagAffinity(map) {
  try { localStorage.setItem("festo_christmas_book_tag_affinity", JSON.stringify(map)); } catch(e) {}
}

function recordTagAffinity(bookTags, weightMultiplier) {
  if (!bookTags) return;
  const profile = getUserBookTagAffinity();
  Object.keys(bookTags).forEach(tag => {
    const tagWeight = bookTags[tag] || 0.5;
    profile[tag] = (profile[tag] || 0) + (tagWeight * weightMultiplier);
  });
  saveUserBookTagAffinity(profile);
}

function calculateBookRecommendationScore(book, userProfile) {
  if (!book.tags) return 0;
  let score = 0;
  Object.keys(book.tags).forEach(tag => {
    const bookWeight = book.tags[tag] || 0.5;
    const userWeight = userProfile[tag] || 0;
    score += (bookWeight * userWeight);
  });
  return score;
}

function getTopTags(tagsObj, limit = 3) {
  if (!tagsObj) return [];
  return Object.entries(tagsObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
}

/**
 * Dual Fetcher for Book Covers via Open Library & Wikipedia
 */
async function fetchBookCover(wikiSlug, isbn, title) {
  const cacheKey = wikiSlug || isbn || title;
  if (bookCoverCache.has(cacheKey)) return bookCoverCache.get(cacheKey);

  // 1. Check Open Library via ISBN
  if (isbn) {
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg?default=false`;
    try {
      const imgRes = await fetch(coverUrl, { method: 'HEAD' });
      if (imgRes.ok) {
        const result = {
          poster: coverUrl,
          overview: "",
          wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiSlug || title)}`
        };
        bookCoverCache.set(cacheKey, result);
        return result;
      }
    } catch(e) {}
  }

  // 2. Wikipedia Summary API fallback
  if (wikiSlug) {
    const cleanSlug = decodeURIComponent(wikiSlug).replace(/\s+/g, '_');
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSlug)}`;

    try {
      const res = await fetch(endpoint, {
        headers: { 'Api-User-Agent': 'FestoChristmasBookSanctuary/1.0 (contact@festoapp.local)' }
      });
      if (res.ok) {
        const data = await res.json();
        const result = {
          poster: data.thumbnail?.source || data.originalimage?.source || null,
          overview: data.extract || "",
          wikiUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanSlug)}`
        };
        bookCoverCache.set(cacheKey, result);
        return result;
      }
    } catch(e) {}
  }

  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const vaultContainer = document.getElementById("categoryContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const totalBookCountEl = document.getElementById("totalBookCount");
  const readingListCountEl = document.getElementById("readingListCount");
  const filterPills = document.getElementById("filterPills");
  const categoryJumpSelect = document.getElementById("categoryJumpSelect");

  // Modal DOM Elements
  const bookModal = document.getElementById("bookModal");
  const modalCloseBtn = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalRatingTag = document.getElementById("modalRatingTag");
  const modalCategory = document.getElementById("modalCategory");
  const modalPrice = document.getElementById("modalPrice");
  const modalPages = document.getElementById("modalPages");
  const modalYear = document.getElementById("modalYear");
  const modalTitle = document.getElementById("modalTitle");
  const modalAuthorHeader = document.getElementById("modalAuthorHeader");
  const modalAuthorList = document.getElementById("modalAuthorList");
  const modalTagCloud = document.getElementById("modalTagCloud");
  const modalOverview = document.getElementById("modalOverview");
  const modalWikiLink = document.getElementById("modalWikiLink");
  const modalGoodreadsLink = document.getElementById("modalGoodreadsLink");
  const btnToggleLike = document.getElementById("btnToggleLike");
  const btnToggleReadingList = document.getElementById("btnToggleReadingList");
  const likeText = document.getElementById("likeText");
  const listText = document.getElementById("listText");

  let currentPillFilter = "all";
  let activeBook = null;

  function updateReadingListCounter() {
    if (readingListCountEl) readingListCountEl.textContent = getReadingList().length;
  }

  // Lazy Jacket Observer
  const coverObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const slug = card.dataset.wikiSlug;
        const isbn = card.dataset.isbn;
        const title = card.dataset.title;
        const imgEl = card.querySelector(".book-cover-img");

        if (imgEl && !imgEl.classList.contains("loaded")) {
          fetchBookCover(slug, isbn, title).then(data => {
            if (data && data.poster) {
              imgEl.src = data.poster;
              imgEl.onload = () => imgEl.classList.add("loaded");
            }
          });
        }
        observer.unobserve(card);
      }
    });
  }, { rootMargin: "250px", threshold: 0.01 });

  function cleanCategoryTitle(label) {
    return (label || "").replace(/^\d+\.\s*/, "").trim();
  }

  /**
   * Partitions books strictly into chunks of 10 volumes per shelf
   */
  function buildTenBookShelves(dataset) {
    const rawGrouped = dataset.reduce((acc, item) => {
      const label = item.categoryLabel || "Featured Holiday Reads";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});

    const sortedLabels = Object.keys(rawGrouped);
    const shelfGroups = [];
    let currentGlobalIndex = 1;

    sortedLabels.forEach(label => {
      const booksInCat = rawGrouped[label];
      const chunkSize = 10;
      
      for (let i = 0; i < booksInCat.length; i += chunkSize) {
        const chunk = booksInCat.slice(i, i + chunkSize);
        const partNum = Math.floor(i / chunkSize) + 1;
        const totalParts = Math.ceil(booksInCat.length / chunkSize);
        
        const titleSuffix = totalParts > 1 ? ` (Part ${partNum})` : "";
        const cleanTitle = `${cleanCategoryTitle(label)}${titleSuffix}`;

        shelfGroups.push({
          displayIndex: currentGlobalIndex,
          displayLabel: `${currentGlobalIndex}. ${cleanTitle}`,
          cleanTitle: cleanTitle,
          books: chunk
        });
        currentGlobalIndex++;
      }
    });

    return shelfGroups;
  }

  function populateJumpSelect(shelfList) {
    categoryJumpSelect.innerHTML = '<option value="">-- Jump to Shelf Group (Groups of 10) --</option>';
    shelfList.forEach(shelf => {
      const opt = document.createElement("option");
      opt.value = `shelf-section-${shelf.displayIndex}`;
      opt.textContent = `${shelf.displayLabel} [${shelf.books.length} volumes]`;
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

  function renderVault(dataset) {
    vaultContainer.innerHTML = "";

    // 1. Recommended View
    if (currentPillFilter === "recommended") {
      const profile = getUserBookTagAffinity();
      const scored = dataset
        .map(b => ({ book: b, score: calculateBookRecommendationScore(b, profile) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 30)
        .map(item => item.book);

      if (scored.length === 0) {
        vaultContainer.innerHTML = `
          <div style="text-align: center; padding: 4rem 1rem; background: rgba(18, 30, 24, 0.9); border-radius: 20px; border: 1.5px solid var(--gold-warm);">
            <h3 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); color: var(--gold-warm); margin-bottom: 0.5rem;">No Festive Recommendations Yet</h3>
            <p style="color: #f0eade; font-family: var(--font-serif); font-size: clamp(0.9rem, 1.6vw, 1rem);">Inspect books and tap "💚 Favorite Book" or "🧣 Add to Fireside List" to discover your holiday taste profile.</p>
          </div>
        `;
        return;
      }

      renderChunkedCustomShelves("⭐ Divined For Your Winter Hearth (AI Match)", scored);
      return;
    }

    // 2. Reading List View
    if (currentPillFilter === "readinglist") {
      const listIds = getReadingList();
      const listBooks = dataset.filter(b => listIds.includes(b.id));

      if (listBooks.length === 0) {
        vaultContainer.innerHTML = `
          <div style="text-align: center; padding: 4rem 1rem; background: rgba(18, 30, 24, 0.9); border-radius: 20px; border: 1.5px solid var(--gold-warm);">
            <h3 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); color: var(--gold-warm); margin-bottom: 0.5rem;">Your Fireside Reading List is Empty</h3>
            <p style="color: #f0eade; font-family: var(--font-serif); font-size: clamp(0.9rem, 1.6vw, 1rem);">Inspect any holiday volume and hit "🧣 Add to Fireside List" to save it for snowy nights.</p>
          </div>
        `;
        return;
      }

      renderChunkedCustomShelves("🧣 My Saved Fireside Reading List", listBooks);
      return;
    }

    // 3. Render Shelves in Groups of 10
    const shelfList = buildTenBookShelves(dataset);
    shelfList.forEach(shelf => {
      const shelfSection = document.createElement("section");
      shelfSection.className = "shelf-section";
      shelfSection.id = `shelf-section-${shelf.displayIndex}`;

      shelfSection.innerHTML = `
        <div class="shelf-header">
          <h3 class="shelf-label"><span>${shelf.displayLabel}</span></h3>
          <span class="shelf-count">${shelf.books.length} Volumes</span>
        </div>
      `;

      const slider = document.createElement("div");
      slider.className = "shelf-book-slider";

      shelf.books.forEach(book => {
        const card = createBookCard(book, shelf.displayLabel);
        slider.appendChild(card);
      });

      const plank = document.createElement("div");
      plank.className = "shelf-plank";

      shelfSection.appendChild(slider);
      shelfSection.appendChild(plank);
      vaultContainer.appendChild(shelfSection);
    });
  }

  function renderChunkedCustomShelves(baseTitle, books) {
    const chunkSize = 10;
    for (let i = 0; i < books.length; i += chunkSize) {
      const chunk = books.slice(i, i + chunkSize);
      const partNum = Math.floor(i / chunkSize) + 1;
      const totalParts = Math.ceil(books.length / chunkSize);
      const title = totalParts > 1 ? `${baseTitle} (Part ${partNum})` : baseTitle;

      renderSingleShelf(title, chunk);
    }
  }

  function renderSingleShelf(title, books) {
    const shelfSection = document.createElement("section");
    shelfSection.className = "shelf-section";

    shelfSection.innerHTML = `
      <div class="shelf-header">
        <h3 class="shelf-label"><span>${title}</span></h3>
        <span class="shelf-count">${books.length} Volumes</span>
      </div>
    `;

    const slider = document.createElement("div");
    slider.className = "shelf-book-slider";

    books.forEach(book => {
      const card = createBookCard(book, title);
      slider.appendChild(card);
    });

    const plank = document.createElement("div");
    plank.className = "shelf-plank";

    shelfSection.appendChild(slider);
    shelfSection.appendChild(plank);
    vaultContainer.appendChild(shelfSection);
  }

  function createBookCard(book, displayCategoryLabel) {
    const card = document.createElement("article");
    card.className = "book-volume-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.dataset.wikiSlug = book.wikiSlug || "";
    card.dataset.isbn = book.isbn || "";
    card.dataset.title = book.title || "";

    const priceDisplay = book.price || `$${(12.99 + (book.id % 10) * 0.70).toFixed(2)}`;
    const top3Tags = getTopTags(book.tags, 3);
    const tagChipsHtml = top3Tags.map(t => `<span class="book-tag-chip">${t.replace(/-/g, ' ')}</span>`).join("");

    card.innerHTML = `
      <div class="book-jacket-box">
        <img class="book-cover-img" alt="${book.title} Jacket">
        <div class="book-price-tag">${priceDisplay}</div>
        <div class="book-rating-badge">★ ${book.rating ? book.rating.toFixed(1) : '4.3'}</div>
      </div>
      <div class="book-details">
        <h4 class="book-title" title="${book.title}">${book.title}</h4>
        <span class="book-author-meta">${book.author || "Holiday Classic"}</span>
        <div class="book-tags-row">
          ${tagChipsHtml}
        </div>
      </div>
    `;

    coverObserver.observe(card);

    card.addEventListener("click", () => openBookModal(book, displayCategoryLabel, priceDisplay));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openBookModal(book, displayCategoryLabel, priceDisplay);
      }
    });

    return card;
  }

  async function openBookModal(book, displayCategoryLabel, priceDisplay) {
    activeBook = book;

    recordTagAffinity(book.tags, 1);

    if (dwellTimer) clearTimeout(dwellTimer);
    dwellTimer = setTimeout(() => {
      recordTagAffinity(book.tags, 2);
    }, 8000);

    modalRatingTag.textContent = `★ ${book.rating ? book.rating.toFixed(1) : '4.3'}`;
    modalCategory.textContent = displayCategoryLabel || cleanCategoryTitle(book.categoryLabel);
    modalPrice.textContent = priceDisplay || "$14.99";
    modalPages.textContent = book.pages ? `${book.pages} Pages` : "Hardcover";
    modalYear.textContent = book.year;
    modalTitle.textContent = book.title;
    modalAuthorHeader.textContent = `by ${book.author || "Unknown Author"}`;
    modalOverview.textContent = "Retrieving festive synopsis from library archives...";
    modalBackdrop.style.backgroundImage = `none`;

    updateLikeButtonState(book.id);
    updateReadingListButtonState(book.id);

    // Tags Cloud
    modalTagCloud.innerHTML = "";
    if (book.tags) {
      Object.entries(book.tags)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag, weight]) => {
          const chip = document.createElement("span");
          chip.className = "modal-tag-chip";
          chip.innerHTML = `<span>#${tag}</span> <strong style="color: var(--crimson-red); font-size: 0.7rem;">${Math.round(weight * 100)}%</strong>`;

          chip.addEventListener("click", (e) => {
            e.stopPropagation();
            closeBookModal();
            searchInput.value = `#${tag}`;
            handleSearch();
            window.scrollTo({ top: 350, behavior: 'smooth' });
          });

          modalTagCloud.appendChild(chip);
        });
    }

    // Author Badge
    modalAuthorList.innerHTML = "";
    if (book.author) {
      const badge = document.createElement("span");
      badge.className = "author-badge";
      badge.textContent = `✍️ ${book.author}`;

      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        closeBookModal();
        searchInput.value = book.author;
        handleSearch();
        window.scrollTo({ top: 350, behavior: 'smooth' });
      });

      modalAuthorList.appendChild(badge);
    }

    modalGoodreadsLink.href = `https://www.goodreads.com/search?q=${encodeURIComponent(book.title + " " + (book.author || ""))}`;

    const coverData = await fetchBookCover(book.wikiSlug, book.isbn, book.title);
    if (coverData) {
      if (coverData.poster) modalBackdrop.style.backgroundImage = `url('${coverData.poster}')`;
      if (coverData.overview) modalOverview.textContent = coverData.overview;
      modalWikiLink.href = coverData.wikiUrl;
    } else {
      modalWikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(book.wikiSlug || book.title)}`;
    }

    bookModal.classList.add("active");
    bookModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function updateLikeButtonState(bookId) {
    const isLiked = getLikedBooks().includes(bookId);
    if (isLiked) {
      btnToggleLike.classList.add("active");
      likeText.textContent = "Favorited";
    } else {
      btnToggleLike.classList.remove("active");
      likeText.textContent = "Favorite Book";
    }
  }

  function updateReadingListButtonState(bookId) {
    const isSaved = getReadingList().includes(bookId);
    if (isSaved) {
      btnToggleReadingList.classList.add("active");
      listText.textContent = "On Fireside List";
    } else {
      btnToggleReadingList.classList.remove("active");
      listText.textContent = "Add to Fireside List";
    }
  }

  btnToggleLike.addEventListener("click", () => {
    if (!activeBook) return;
    let list = getLikedBooks();
    if (list.includes(activeBook.id)) {
      list = list.filter(id => id !== activeBook.id);
    } else {
      list.push(activeBook.id);
      recordTagAffinity(activeBook.tags, 5);
    }
    saveLikedBooks(list);
    updateLikeButtonState(activeBook.id);
  });

  btnToggleReadingList.addEventListener("click", () => {
    if (!activeBook) return;
    let list = getReadingList();
    if (list.includes(activeBook.id)) {
      list = list.filter(id => id !== activeBook.id);
    } else {
      list.push(activeBook.id);
      recordTagAffinity(activeBook.tags, 3);
    }
    saveReadingList(list);
    updateReadingListButtonState(activeBook.id);
    updateReadingListCounter();
    if (currentPillFilter === "readinglist") renderVault(window.christmasBookData || []);
  });

  function closeBookModal() {
    if (dwellTimer) clearTimeout(dwellTimer);
    bookModal.classList.remove("active");
    bookModal.setAttribute("aria-hidden", "true");
    activeBook = null;
    document.body.style.overflow = "auto";
  }

  modalCloseBtn.addEventListener("click", closeBookModal);
  window.addEventListener("click", (e) => { if (e.target === bookModal) closeBookModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && bookModal.classList.contains("active")) closeBookModal(); });

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
    let query = searchInput.value.toLowerCase().trim();
    clearSearchBtn.style.display = query.length > 0 ? "block" : "none";

    let dataset = window.christmasBookData || [];

    // Filter Pill Routing
    if (currentPillFilter !== "all" && currentPillFilter !== "recommended" && currentPillFilter !== "readinglist") {
      dataset = dataset.filter(item => {
        const matchesCategory = item.category && item.category.toLowerCase().includes(currentPillFilter);
        const matchesTag = item.tags && Object.keys(item.tags).some(t => t.toLowerCase().includes(currentPillFilter));
        return matchesCategory || matchesTag;
      });
    }

    if (!query) {
      renderVault(dataset);
      return;
    }

    const isTagSearch = query.startsWith("#");
    const cleanTagQuery = query.replace(/^#/, "");

    const filtered = dataset.filter(item => {
      const matchesTitle = item.title && item.title.toLowerCase().includes(query);
      const matchesAuthor = item.author && item.author.toLowerCase().includes(query);
      const matchesYear = item.year && item.year.toString().includes(query);
      
      let matchesTags = false;
      if (item.tags) {
        matchesTags = Object.keys(item.tags).some(t => t.toLowerCase().includes(cleanTagQuery));
      }

      return isTagSearch ? matchesTags : (matchesTitle || matchesAuthor || matchesYear || matchesTags);
    });

    renderVault(filtered);
  }

  searchInput.addEventListener("input", handleSearch);

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderVault(window.christmasBookData || []);
    searchInput.focus();
  });

  // Startup Initialization
  const fullDataset = window.christmasBookData || [];
  if (totalBookCountEl) totalBookCountEl.textContent = `${fullDataset.length}+`;
  updateReadingListCounter();

  const shelfList = buildTenBookShelves(fullDataset);
  populateJumpSelect(shelfList);
  renderVault(fullDataset);
});