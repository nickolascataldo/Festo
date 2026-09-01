/**
 * FESTO — SUMMER BOOK VAULT ENGINE (HARDCOVER DRIFTWOOD BOOKSHELF & PRICE ARCHITECTURE)
 * Features:
 * - 3D Hardcover Book Rendering on Sun-Bleached Teak Shelves
 * - Real Pricing Estimates calculated per book
 * - Mathematical Weighted Dot-Product affinity recommendation scoring
 * - Interaction Weighting: Explicit Likes (+5), Beach Bag (+3), Inspect (+1)
 * - 8-Second Dwell-Time Watchdog (+2 pts for sustained reading)
 * - Search across titles, authors, prices, and exact #tags
 * - Open Library & Wikipedia book cover caching with IntersectionObserver
 */

const bookCoverCache = new Map();
let dwellTimer = null;

// Isolated LocalStorage Profile Utilities for Summer
function getLikedBooks() {
  try { return JSON.parse(localStorage.getItem("festo_summer_book_likes")) || []; } catch(e) { return []; }
}
function saveLikedBooks(list) {
  try { localStorage.setItem("festo_summer_book_likes", JSON.stringify(list)); } catch(e) {}
}

function getReadingList() {
  try { return JSON.parse(localStorage.getItem("festo_summer_reading_list")) || []; } catch(e) { return []; }
}
function saveReadingList(list) {
  try { localStorage.setItem("festo_summer_reading_list", JSON.stringify(list)); } catch(e) {}
}

function getUserBookTagAffinity() {
  try { return JSON.parse(localStorage.getItem("festo_summer_book_tag_affinity")) || {}; } catch(e) { return {}; }
}
function saveUserBookTagAffinity(map) {
  try { localStorage.setItem("festo_summer_book_tag_affinity", JSON.stringify(map)); } catch(e) {}
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
 * Open Library / Wikipedia Dual Fetcher for Book Jackets
 */
async function fetchBookCover(wikiSlug, isbn, title) {
  const cacheKey = wikiSlug || isbn || title;
  if (bookCoverCache.has(cacheKey)) return bookCoverCache.get(cacheKey);

  // 1. Try Open Library Cover via ISBN
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

  // 2. Fallback to Wikipedia REST API
  if (wikiSlug) {
    const cleanSlug = decodeURIComponent(wikiSlug).replace(/\s+/g, '_');
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSlug)}`;

    try {
      const res = await fetch(endpoint, {
        headers: { 'Api-User-Agent': 'FestoSummerBookSanctuary/2.0 (contact@festoapp.local)' }
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

  // Modal References
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

  // Viewport Lazy Jacket Observer
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

  function extractOriginalCategoryNumber(label) {
    const match = label.match(/^(\d+)\./);
    return match ? parseInt(match[1], 10) : 999;
  }

  function cleanCategoryTitle(label) {
    return label.replace(/^\d+\.\s*/, "").trim();
  }

  function buildSortedCategoryMap(dataset) {
    const rawGrouped = dataset.reduce((acc, item) => {
      const label = item.categoryLabel || "Featured Summer Reads";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});

    const sortedRawKeys = Object.keys(rawGrouped).sort((a, b) => {
      return extractOriginalCategoryNumber(a) - extractOriginalCategoryNumber(b);
    });

    return sortedRawKeys.map((rawKey, index) => ({
      displayIndex: index + 1,
      originalNum: extractOriginalCategoryNumber(rawKey),
      displayLabel: `${index + 1}. ${cleanCategoryTitle(rawKey)}`,
      cleanTitle: cleanCategoryTitle(rawKey),
      books: rawGrouped[rawKey]
    }));
  }

  function populateJumpSelect(categoryList) {
    categoryJumpSelect.innerHTML = '<option value="">-- Jump to Shelf (1 to 50) --</option>';
    categoryList.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = `shelf-section-${cat.displayIndex}`;
      opt.textContent = `${cat.displayLabel} (${cat.books.length} volumes)`;
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
          <div style="text-align: center; padding: 5rem 0; background: rgba(10, 28, 44, 0.88); border-radius: 20px; border: 1.5px solid var(--solar-gold);">
            <h3 style="font-family: var(--font-display); font-size: 2rem; color: var(--solar-gold); margin-bottom: 0.5rem;">No Reading Profile Built Yet</h3>
            <p style="color: #e5edf5; font-family: var(--font-serif);">Inspect books and hit "💛 Loved This Book" or "🏖️ Add to Beach Bag" to generate personalized summer recommendations.</p>
          </div>
        `;
        return;
      }

      renderSingleShelf("🎯 Curated For Your Summer Taste (AI Vector Match)", scored);
      return;
    }

    // 2. Reading List View
    if (currentPillFilter === "readinglist") {
      const listIds = getReadingList();
      const listBooks = dataset.filter(b => listIds.includes(b.id));

      if (listBooks.length === 0) {
        vaultContainer.innerHTML = `
          <div style="text-align: center; padding: 5rem 0; background: rgba(10, 28, 44, 0.88); border-radius: 20px; border: 1.5px solid var(--solar-gold);">
            <h3 style="font-family: var(--font-display); font-size: 2rem; color: var(--solar-gold); margin-bottom: 0.5rem;">Your Beach Bag is Empty</h3>
            <p style="color: #e5edf5; font-family: var(--font-serif);">Click on any volume and hit "🏖️ Add to Beach Bag" to save it for poolside reading.</p>
          </div>
        `;
        return;
      }

      renderSingleShelf("🏖️ My Saved Beach Bag Reads", listBooks);
      return;
    }

    // 3. 50 Hardwood Driftwood Bookshelves
    const categoryList = buildSortedCategoryMap(dataset);
    categoryList.forEach(cat => {
      const shelfSection = document.createElement("section");
      shelfSection.className = "shelf-section";
      shelfSection.id = `shelf-section-${cat.displayIndex}`;

      shelfSection.innerHTML = `
        <div class="shelf-header">
          <h3 class="shelf-label"><span>${cat.displayLabel}</span></h3>
          <span class="shelf-count">${cat.books.length} Volumes</span>
        </div>
      `;

      const slider = document.createElement("div");
      slider.className = "shelf-book-slider";

      cat.books.forEach(book => {
        const card = createBookCard(book, cat.displayLabel);
        slider.appendChild(card);
      });

      const plank = document.createElement("div");
      plank.className = "shelf-plank";

      shelfSection.appendChild(slider);
      shelfSection.appendChild(plank);
      vaultContainer.appendChild(shelfSection);
    });
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

    // Calculate Price if not present
    const priceDisplay = book.price || `$${(12.99 + (book.id % 10) * 0.70).toFixed(2)}`;

    const top3Tags = getTopTags(book.tags, 3);
    const tagChipsHtml = top3Tags.map(t => `<span class="book-tag-chip">${t.replace(/-/g, ' ')}</span>`).join("");

    card.innerHTML = `
      <div class="book-jacket-box">
        <img class="book-cover-img" alt="${book.title} Jacket">
        <div class="book-price-tag">${priceDisplay}</div>
        <div class="book-rating-badge">★ ${book.rating ? book.rating.toFixed(1) : '4.2'}</div>
      </div>
      <div class="book-details">
        <h4 class="book-title" title="${book.title}">${book.title}</h4>
        <span class="book-author-meta">${book.author || "Classic Edition"}</span>
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

    // Record interaction (+1 pt)
    recordTagAffinity(book.tags, 1);

    if (dwellTimer) clearTimeout(dwellTimer);
    dwellTimer = setTimeout(() => {
      recordTagAffinity(book.tags, 2);
    }, 8000);

    modalRatingTag.textContent = `★ ${book.rating ? book.rating.toFixed(1) : '4.2'}`;
    modalCategory.textContent = displayCategoryLabel || cleanCategoryTitle(book.categoryLabel);
    modalPrice.textContent = priceDisplay || "$14.99";
    modalPages.textContent = book.pages ? `${book.pages} Pages` : "Hardcover";
    modalYear.textContent = book.year;
    modalTitle.textContent = book.title;
    modalAuthorHeader.textContent = `by ${book.author || "Unknown Author"}`;
    modalOverview.textContent = "Retrieving official synopsis from library archives...";
    modalBackdrop.style.backgroundImage = `none`;

    updateLikeButtonState(book.id);
    updateReadingListButtonState(book.id);

    // Universal Tags Cloud
    modalTagCloud.innerHTML = "";
    if (book.tags) {
      Object.entries(book.tags)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag, weight]) => {
          const chip = document.createElement("span");
          chip.className = "modal-tag-chip";
          chip.innerHTML = `<span>#${tag}</span> <strong style="color: var(--sunburst-amber); font-size: 0.7rem;">${Math.round(weight * 100)}%</strong>`;

          chip.addEventListener("click", (e) => {
            e.stopPropagation();
            closeBookModal();
            searchInput.value = `#${tag}`;
            handleSearch();
            window.scrollTo({ top: 420, behavior: 'smooth' });
          });

          modalTagCloud.appendChild(chip);
        });
    }

    // Author Profile Badge
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
        window.scrollTo({ top: 420, behavior: 'smooth' });
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
      likeText.textContent = "Loved";
    } else {
      btnToggleLike.classList.remove("active");
      likeText.textContent = "Loved This Book";
    }
  }

  function updateReadingListButtonState(bookId) {
    const isSaved = getReadingList().includes(bookId);
    if (isSaved) {
      btnToggleReadingList.classList.add("active");
      listText.textContent = "In Beach Bag";
    } else {
      btnToggleReadingList.classList.remove("active");
      listText.textContent = "Add to Beach Bag";
    }
  }

  btnToggleLike.addEventListener("click", () => {
    if (!activeBook) return;
    let list = getLikedBooks();
    if (list.includes(activeBook.id)) {
      list = list.filter(id => id !== activeBook.id);
    } else {
      list.push(activeBook.id);
      recordTagAffinity(activeBook.tags, 5); // +5 pts explicit like
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
      recordTagAffinity(activeBook.tags, 3); // +3 pts reading list intent
    }
    saveReadingList(list);
    updateReadingListButtonState(activeBook.id);
    updateReadingListCounter();
    if (currentPillFilter === "readinglist") renderVault(window.summerBookData || []);
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

    const dataset = window.summerBookData || [];

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
    renderVault(window.summerBookData || []);
    searchInput.focus();
  });

  // Initialization
  const fullDataset = window.summerBookData || [];
  if (totalBookCountEl) totalBookCountEl.textContent = `${fullDataset.length}+`;
  updateReadingListCounter();

  const categoryList = buildSortedCategoryMap(fullDataset);
  populateJumpSelect(categoryList);
  renderVault(fullDataset);
});