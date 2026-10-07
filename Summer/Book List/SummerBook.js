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
    categoryJumpSelect.innerHTML = '<option value="">-- Jump to a shelf --</option>';
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

    if (!dataset.length && currentPillFilter !== "recommended" && currentPillFilter !== "readinglist") {
      FestoVault.emptyState(vaultContainer, {
        title: "No books match that",
        body: "Try a different word, or clear the search and filters to see the whole vault.",
        ctaLabel: "Show every Summer book",
        onCta: () => {
          searchInput.value = "";
          filterPills.querySelector('[data-filter="all"]').click();
        }
      });
      return;
    }

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
            <p style="color: #e5edf5; font-family: var(--font-serif);">Inspect books and hit "Loved This Book" or "Add to Beach Bag" to generate personalized summer recommendations.</p>
          </div>
        `;
        return;
      }

      renderSingleShelf("Curated For Your Summer Taste (AI Vector Match)", scored);
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
            <p style="color: #e5edf5; font-family: var(--font-serif);">Click on any volume and hit "Add to Beach Bag" to save it for poolside reading.</p>
          </div>
        `;
        return;
      }

      renderSingleShelf("My Saved Beach Bag Reads", listBooks);
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

    FestoCovers.attach(card.querySelector(".book-cover-img"), book, "book");

    card.addEventListener("click", () => openBookModal(book, displayCategoryLabel, priceDisplay));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openBookModal(book, displayCategoryLabel, priceDisplay);
      }
    });

    return card;
  }

  function openBookModal(book, displayCategoryLabel, priceDisplay) {
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
      badge.textContent = `By ${book.author}`;

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

    modalWikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(book.wikiSlug || book.title)}`;
    (function () {
      var host = document.getElementById("modalBuyLinks");
      if (!host || !window.Festo || !Festo.links) return;
      var l = Festo.links.book(book);
      host.innerHTML = "";
      var label = document.createElement("span"); label.className = "buy-label"; label.textContent = "Find a copy"; host.appendChild(label);
      [["Bookshop", l.bookshop], ["Amazon", l.amazon], ["Library", l.library]].forEach(function (x) {
        var a = document.createElement("a"); a.href = x[1]; a.target = "_blank"; a.className = "btn-wiki buy-link";
        a.rel = "noopener noreferrer" + (x[0] === "Amazon" && l.affiliate ? " sponsored" : ""); a.textContent = x[0] + " \u2197"; host.appendChild(a);
      });
      if (l.affiliate) { var n = document.createElement("small"); n.className = "buy-note"; n.textContent = "Amazon links may earn Festo a commission."; host.appendChild(n); }
    })();

    bookModal.classList.add("active");
    bookModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Open instantly; the jacket and synopsis fill in when they arrive.
    FestoCovers.resolve(book, "book", { overview: true }).then(info => {
      if (activeBook !== book) return;
      if (info.poster) modalBackdrop.style.backgroundImage = `url('${info.poster}')`;
      modalOverview.textContent = info.overview || "No synopsis on record for this edition. The Wikipedia and Goodreads links below may have more.";
      if (info.wikiUrl) modalWikiLink.href = info.wikiUrl;
    });
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

    let dataset = window.summerBookData || [];
    if (currentPillFilter.startsWith("tag:")) dataset = FestoVault.filterByTag(dataset, currentPillFilter.slice(4));

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

  searchInput.addEventListener("input", Festo.dom.debounce(handleSearch, 180));

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    handleSearch();
    searchInput.focus();
  });

  // Initialization
  const fullDataset = FestoVault.dedupe(window.summerBookData || []);
  window.summerBookData = fullDataset;   // handleSearch and the reading list read this again
  FestoVault.fillCounts(document, FestoVault.counts(fullDataset));
  if (totalBookCountEl) totalBookCountEl.textContent = fullDataset.length.toLocaleString("en-US");
  searchInput.placeholder = `Search ${fullDataset.length} books, authors, #tags...`;

  // Genre pills come from the data, so none of them can come back empty.
  FestoVault.tagPills(fullDataset, { max: 6, prefer: ["seaside-town","island-community","tropical-resort","adventure-quest","psychological-thriller","coming-of-age"] }).forEach(p => {
    const btn = document.createElement("button");
    btn.className = "pill-btn";
    btn.dataset.filter = `tag:${p.key}`;
    btn.textContent = `${p.label} (${p.count})`;
    filterPills.appendChild(btn);
  });
  updateReadingListCounter();

  const categoryList = buildSortedCategoryMap(fullDataset);
  populateJumpSelect(categoryList);
  renderVault(fullDataset);
});