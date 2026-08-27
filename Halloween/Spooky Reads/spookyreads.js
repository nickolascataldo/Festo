/**
* Spooky Reads & Scary Books — Core Application Engine (script.js)
*
* Features:
* - 40+ Verified horror classics & Stephen King books with real Open Library covers
* - Real-time debounced search by title, author, year, and sub-genre
* - Interactive bookshelf bookmarking synced with localStorage
* - Drag-to-scroll carousel navigation for desktop & mobile
* - Toast notification system for reading actions and bookmark states
*/

(() => {
'use strict';

/* ==========================================================================
1. Verified Horror & Stephen King Book Database (40+ Titles)
========================================================================== */
const BOOK_DATABASE = [
// --- SECTION 1: CURRENTLY READING ---
{
id: 'cr-1',
category: 'Currently Reading',
isWide: true,
title: 'The Shining',
author: 'Stephen King',
year: '1977',
pages: '447 pages',
rating: '4.8',
progress: 'Page 312 of 447',
poster: 'https://covers.openlibrary.org/b/id/8235116-L.jpg',
genre: 'Haunted Hotel • Psychological'
},
{
id: 'cr-2',
category: 'Currently Reading',
isWide: true,
title: 'Pet Sematary',
author: 'Stephen King',
year: '1983',
pages: '374 pages',
rating: '4.7',
progress: 'Page 140 of 374',
poster: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
genre: 'Grief • Supernatural'
},
{
id: 'cr-3',
category: 'Currently Reading',
isWide: true,
title: 'Dracula',
author: 'Bram Stoker',
year: '1897',
pages: '418 pages',
rating: '4.6',
progress: 'Page 88 of 418',
poster: 'https://covers.openlibrary.org/b/id/9255566-L.jpg',
genre: 'Gothic • Classic Horror'
},

// --- SECTION 2: STEPHEN KING MASTERWORKS ---
{
id: 'sk-1',
category: 'Stephen King Masterworks',
title: 'IT',
author: 'Stephen King',
year: '1986',
pages: '1138p',
rating: '4.8',
poster: 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
genre: 'Cosmic • Horror'
},
{
id: 'sk-2',
category: 'Stephen King Masterworks',
title: "Salem's Lot",
author: 'Stephen King',
year: '1975',
pages: '439p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8235272-L.jpg',
genre: 'Vampires • Gothic'
},
{
id: 'sk-3',
category: 'Stephen King Masterworks',
title: 'Misery',
author: 'Stephen King',
year: '1987',
pages: '310p',
rating: '4.7',
poster: 'https://covers.openlibrary.org/b/id/8231885-L.jpg',
genre: 'Psychological • Thriller'
},
{
id: 'sk-4',
category: 'Stephen King Masterworks',
title: 'Carrie',
author: 'Stephen King',
year: '1974',
pages: '199p',
rating: '4.4',
poster: 'https://covers.openlibrary.org/b/id/8231872-L.jpg',
genre: 'Supernatural • Horror'
},
{
id: 'sk-5',
category: 'Stephen King Masterworks',
title: 'The Stand',
author: 'Stephen King',
year: '1978',
pages: '1153p',
rating: '4.9',
poster: 'https://covers.openlibrary.org/b/id/8235288-L.jpg',
genre: 'Apocalyptic • Dark Fantasy'
},
{
id: 'sk-6',
category: 'Stephen King Masterworks',
title: 'Cujo',
author: 'Stephen King',
year: '1981',
pages: '319p',
rating: '4.2',
poster: 'https://covers.openlibrary.org/b/id/8231862-L.jpg',
genre: 'Creature • Suspense'
},
{
id: 'sk-7',
category: 'Stephen King Masterworks',
title: 'Doctor Sleep',
author: 'Stephen King',
year: '2013',
pages: '531p',
rating: '4.5',
poster: 'https://covers.openlibrary.org/b/id/7984916-L.jpg',
genre: 'Supernatural • Sequel'
},
{
id: 'sk-8',
category: 'Stephen King Masterworks',
title: 'Christine',
author: 'Stephen King',
year: '1983',
pages: '526p',
rating: '4.3',
poster: 'https://covers.openlibrary.org/b/id/8231860-L.jpg',
genre: 'Possession • Horror'
},

// --- SECTION 3: GOTHIC & CLASSIC NOVELS ---
{
id: 'gc-1',
category: 'Gothic & Classic Novels',
title: 'Frankenstein',
author: 'Mary Shelley',
year: '1818',
pages: '280p',
rating: '4.7',
poster: 'https://covers.openlibrary.org/b/id/8744576-L.jpg',
genre: 'Gothic • Sci-Fi'
},
{
id: 'gc-2',
category: 'Gothic & Classic Novels',
title: 'Hill House',
author: 'Shirley Jackson',
year: '1959',
pages: '246p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8278326-L.jpg',
genre: 'Haunted Mansion'
},
{
id: 'gc-3',
category: 'Gothic & Classic Novels',
title: 'The Exorcist',
author: 'William Peter Blatty',
year: '1971',
pages: '340p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/240726-L.jpg',
genre: 'Demonic Possession'
},
{
id: 'gc-4',
category: 'Gothic & Classic Novels',
title: "Rosemary's Baby",
author: 'Ira Levin',
year: '1967',
pages: '245p',
rating: '4.5',
poster: 'https://covers.openlibrary.org/b/id/6498516-L.jpg',
genre: 'Occult • Thriller'
},
{
id: 'gc-5',
category: 'Gothic & Classic Novels',
title: 'Wicked Comes',
author: 'Ray Bradbury',
year: '1962',
pages: '293p',
rating: '4.5',
poster: 'https://covers.openlibrary.org/b/id/8758836-L.jpg',
genre: 'Dark Carnival'
},
{
id: 'gc-6',
category: 'Gothic & Classic Novels',
title: 'Hell House',
author: 'Richard Matheson',
year: '1971',
pages: '301p',
rating: '4.3',
poster: 'https://covers.openlibrary.org/b/id/6408226-L.jpg',
genre: 'Supernatural'
},
{
id: 'gc-7',
category: 'Gothic & Classic Novels',
title: 'I Am Legend',
author: 'Richard Matheson',
year: '1954',
pages: '160p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8235111-L.jpg',
genre: 'Vampire • Sci-Fi'
},
{
id: 'gc-8',
category: 'Gothic & Classic Novels',
title: 'Dorian Gray',
author: 'Oscar Wilde',
year: '1890',
pages: '254p',
rating: '4.4',
poster: 'https://covers.openlibrary.org/b/id/9255551-L.jpg',
genre: 'Gothic • Classic'
},

// --- SECTION 4: MODERN PSYCHOLOGICAL TERROR ---
{
id: 'mh-1',
category: 'Modern Psychological Terror',
title: 'Bird Box',
author: 'Josh Malerman',
year: '2014',
pages: '262p',
rating: '4.3',
poster: 'https://covers.openlibrary.org/b/id/8197776-L.jpg',
genre: 'Post-Apocalyptic'
},
{
id: 'mh-2',
category: 'Modern Psychological Terror',
title: 'Heart-Shaped',
author: 'Joe Hill',
year: '2007',
pages: '376p',
rating: '4.4',
poster: 'https://covers.openlibrary.org/b/id/6498521-L.jpg',
genre: 'Ghost Story • Rock'
},
{
id: 'mh-3',
category: 'Modern Psychological Terror',
title: 'The Troop',
author: 'Nick Cutter',
year: '2014',
pages: '358p',
rating: '4.3',
poster: 'https://covers.openlibrary.org/b/id/8316276-L.jpg',
genre: 'Body Horror • Survival'
},
{
id: 'mh-4',
category: 'Modern Psychological Terror',
title: 'Mexican Gothic',
author: 'Silvia Moreno-Garcia',
year: '2020',
pages: '301p',
rating: '4.2',
poster: 'https://covers.openlibrary.org/b/id/10389656-L.jpg',
genre: 'Gothic • Mystery'
},
{
id: 'mh-5',
category: 'Modern Psychological Terror',
title: 'The Fisherman',
author: 'John Langan',
year: '2016',
pages: '266p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8584826-L.jpg',
genre: 'Cosmic • Dark Fantasy'
},
{
id: 'mh-6',
category: 'Modern Psychological Terror',
title: 'Ghost Story',
author: 'Peter Straub',
year: '1979',
pages: '483p',
rating: '4.4',
poster: 'https://covers.openlibrary.org/b/id/6575126-L.jpg',
genre: 'Supernatural • Winter'
},
{
id: 'mh-7',
category: 'Modern Psychological Terror',
title: 'Head Full Ghosts',
author: 'Paul Tremblay',
year: '2015',
pages: '287p',
rating: '4.1',
poster: 'https://covers.openlibrary.org/b/id/8235121-L.jpg',
genre: 'Possession • Mystery'
},
{
id: 'mh-8',
category: 'Modern Psychological Terror',
title: 'The Cabin',
author: 'Paul Tremblay',
year: '2018',
pages: '272p',
rating: '4.0',
poster: 'https://covers.openlibrary.org/b/id/8904226-L.jpg',
genre: 'Home Invasion'
},

// --- SECTION 5: NOSTALGIC NIGHTMARES & YA ---
{
id: 'yn-1',
category: 'Nostalgic Nightmares & YA',
title: 'Coraline',
author: 'Neil Gaiman',
year: '2002',
pages: '162p',
rating: '4.8',
poster: 'https://covers.openlibrary.org/b/id/8235118-L.jpg',
genre: 'Dark Fantasy'
},
{
id: 'yn-2',
category: 'Nostalgic Nightmares & YA',
title: 'Scary Stories',
author: 'Alvin Schwartz',
year: '1981',
pages: '111p',
rating: '4.7',
poster: 'https://covers.openlibrary.org/b/id/6975226-L.jpg',
genre: 'Folklore • Chilling'
},
{
id: 'yn-3',
category: 'Nostalgic Nightmares & YA',
title: 'Graveyard Book',
author: 'Neil Gaiman',
year: '2008',
pages: '312p',
rating: '4.7',
poster: 'https://covers.openlibrary.org/b/id/8231922-L.jpg',
genre: 'Ghosts • Fantasy'
},
{
id: 'yn-4',
category: 'Nostalgic Nightmares & YA',
title: 'Thief of Always',
author: 'Clive Barker',
year: '1992',
pages: '225p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/6498526-L.jpg',
genre: 'Dark Fable'
},
{
id: 'yn-5',
category: 'Nostalgic Nightmares & YA',
title: 'Haunted Mask',
author: 'R.L. Stine',
year: '1993',
pages: '121p',
rating: '4.3',
poster: 'https://covers.openlibrary.org/b/id/6408231-L.jpg',
genre: 'Goosebumps • Spooky'
},
{
id: 'yn-6',
category: 'Nostalgic Nightmares & YA',
title: 'Monster Blood',
author: 'R.L. Stine',
year: '1992',
pages: '128p',
rating: '4.1',
poster: 'https://covers.openlibrary.org/b/id/6408236-L.jpg',
genre: 'Goosebumps • Creature'
},
{
id: 'yn-7',
category: 'Nostalgic Nightmares & YA',
title: 'Living Dummy',
author: 'R.L. Stine',
year: '1993',
pages: '134p',
rating: '4.4',
poster: 'https://covers.openlibrary.org/b/id/6408241-L.jpg',
genre: 'Goosebumps • Slappy'
},
{
id: 'yn-8',
category: 'Nostalgic Nightmares & YA',
title: 'Halloween Tree',
author: 'Ray Bradbury',
year: '1972',
pages: '145p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8235126-L.jpg',
genre: 'Halloween Classic'
},

// --- SECTION 6: DARK FANTASY & VISCERAL SCARES ---
{
id: 'df-1',
category: 'Dark Fantasy & Visceral Scares',
title: 'Hellbound Heart',
author: 'Clive Barker',
year: '1986',
pages: '164p',
rating: '4.5',
poster: 'https://covers.openlibrary.org/b/id/6498531-L.jpg',
genre: 'Cenobites • Visceral'
},
{
id: 'df-2',
category: 'Dark Fantasy & Visceral Scares',
title: 'Books of Blood',
author: 'Clive Barker',
year: '1984',
pages: '507p',
rating: '4.7',
poster: 'https://covers.openlibrary.org/b/id/6498536-L.jpg',
genre: 'Splatterpunk • Horror'
},
{
id: 'df-3',
category: 'Dark Fantasy & Visceral Scares',
title: 'Vampire Interview',
author: 'Anne Rice',
year: '1976',
pages: '342p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8235131-L.jpg',
genre: 'Gothic • Vampires'
},
{
id: 'df-4',
category: 'Dark Fantasy & Visceral Scares',
title: 'Vampire Lestat',
author: 'Anne Rice',
year: '1985',
pages: '550p',
rating: '4.7',
poster: 'https://covers.openlibrary.org/b/id/8235136-L.jpg',
genre: 'Gothic • Vampires'
},
{
id: 'df-5',
category: 'Dark Fantasy & Visceral Scares',
title: 'Mountains Madness',
author: 'H.P. Lovecraft',
year: '1936',
pages: '110p',
rating: '4.4',
poster: 'https://covers.openlibrary.org/b/id/8235141-L.jpg',
genre: 'Cosmic • Antarctica'
},
{
id: 'df-6',
category: 'Dark Fantasy & Visceral Scares',
title: 'Call of Cthulhu',
author: 'H.P. Lovecraft',
year: '1928',
pages: '98p',
rating: '4.5',
poster: 'https://covers.openlibrary.org/b/id/8235146-L.jpg',
genre: 'Cosmic Mythos'
},
{
id: 'df-7',
category: 'Dark Fantasy & Visceral Scares',
title: 'The Ritual',
author: 'Adam Nevill',
year: '2011',
pages: '418p',
rating: '4.2',
poster: 'https://covers.openlibrary.org/b/id/8235151-L.jpg',
genre: 'Folk Horror • Wilderness'
},
{
id: 'df-8',
category: 'Dark Fantasy & Visceral Scares',
title: 'Right One In',
author: 'J. A. Lindqvist',
year: '2004',
pages: '472p',
rating: '4.6',
poster: 'https://covers.openlibrary.org/b/id/8235156-L.jpg',
genre: 'Nordic Vampire Horror'
}
];

/* ==========================================================================
2. App State & Bookmarking Storage
========================================================================== */
const STORAGE_KEY = 'spooky_reads_bookshelf';
let bookmarkedSet = new Set();

function loadBookmarks() {
try {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
bookmarkedSet = new Set(JSON.parse(saved));
} else {
// Initial defaults matching visual mockup
bookmarkedSet = new Set(['sk-1', 'sk-2', 'sk-3', 'sk-4', 'gc-1', 'gc-2', 'gc-3', 'gc-4']);
}
} catch (e) {
console.warn('LocalStorage is unavailable:', e);
bookmarkedSet = new Set(['sk-1', 'sk-2', 'sk-3', 'sk-4']);
}
}

function saveBookmarks() {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarkedSet]));
} catch (e) {
console.warn('Failed to save bookmark state:', e);
}
}

/* ==========================================================================
3. DOM Rendering & Templates
========================================================================== */
let booksContainer;
let searchInput;
let navItems;
let activeView = 'home';

const COVER_TITLE_OVERRIDES = {
'IT': 'It',
'Hill House': 'The Haunting of Hill House',
'Wicked Comes': 'Something Wicked This Way Comes',
'Mountains Madness': 'At the Mountains of Madness',
'Call of Cthulhu': 'The Call of Cthulhu',
'Right One In': 'Let the Right One In'
};

BOOK_DATABASE.forEach(book => {
const coverTitle = COVER_TITLE_OVERRIDES[book.title] || book.title;
book.poster = `https://covers.openlibrary.org/b/title/${encodeURIComponent(coverTitle)}-L.jpg`;
});

function renderWideCard(book) {
return `
<article class="wide-card" data-id="${book.id}">
<div class="wide-thumbnail-wrap">
<img src="${book.poster}" alt="${book.title} cover" class="card-thumb" loading="lazy">
<span class="tag-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${book.rating}</span>
<span class="tag-progress">${book.progress}</span>
</div>
<div class="wide-card-body">
<div class="card-meta-text">
<h3 class="book-title">${book.title}</h3>
<p class="book-subtext">${book.author} • ${book.year}</p>
</div>
<button class="read-action-btn" data-action="read" data-title="${book.title}" aria-label="Continue reading ${book.title}">
<i class="fa-solid fa-book-open" aria-hidden="true"></i>
</button>
</div>
</article>
`;
}

function renderPosterCard(book) {
const isBookmarked = bookmarkedSet.has(book.id);
return `
<article class="poster-card" data-id="${book.id}">
<div class="poster-thumbnail-wrap">
<img src="${book.poster}" alt="${book.title} cover" class="poster-img" loading="lazy">
<span class="poster-badge-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${book.rating}</span>
</div>
<div class="poster-card-body">
<div class="poster-header-row">
<h3 class="poster-book-title">${book.title}</h3>
<button class="bookmark-btn ${isBookmarked ? 'active' : ''}"
data-action="bookmark"
data-id="${book.id}"
data-title="${book.title}"
aria-label="${isBookmarked ? 'Remove' : 'Add'} bookmark">
<i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
</button>
</div>
<p class="poster-meta">${book.author} (${book.year})</p>
<p class="poster-genre">${book.genre}</p>
</div>
</article>
`;
}

function renderBookSections(dataset) {
if (!booksContainer) return;

if (dataset.length === 0) {
booksContainer.innerHTML = `
<div style="text-align:center; padding: 60px 20px; color: var(--text-secondary);">
<i class="fa-solid fa-book-skull" style="font-size: 2.8rem; color: var(--accent-orange); margin-bottom: 14px;"></i>
<h3 style="color: var(--text-primary); font-size: 1.15rem; margin-bottom: 6px;">${activeView === 'library' ? 'Your bookshelf is empty' : 'No Spooky Books Found'}</h3>
<p style="font-size: 0.85rem;">${activeView === 'library' ? 'Use the bookmark icon to save books here.' : 'Try searching for another Stephen King story, author, or horror genre.'}</p>
</div>
`;
return;
}

const categories = [...new Set(dataset.map(b => b.category))];
let htmlMarkup = '';

if (activeView === 'home') {
const bestSellers = [...BOOK_DATABASE]
.sort((firstBook, secondBook) => Number(secondBook.rating) - Number(firstBook.rating))
.slice(0, 8);
htmlMarkup += `
<section class="category-section best-sellers-section" aria-label="Best Sellers">
<div class="section-header">
<h2 class="section-title">BEST SELLERS</h2>
<span class="section-kicker">Most read & highest rated</span>
</div>
<div class="horizontal-scroll poster-cards-row">
${bestSellers.map(book => renderPosterCard(book)).join('')}
</div>
</section>
`;
}

categories.forEach(categoryName => {
const categoryBooks = dataset.filter(b => b.category === categoryName);
if (categoryBooks.length === 0) return;

const isWideRow = Boolean(categoryBooks[0].isWide);

htmlMarkup += `
<section class="category-section" aria-label="${categoryName}">
<div class="section-header">
<h2 class="section-title">${categoryName}</h2>
<a href="#more" class="see-all-link" aria-label="View all in ${categoryName}">
<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
</a>
</div>
<div class="horizontal-scroll ${isWideRow ? 'wide-cards-row' : 'poster-cards-row'}">
${categoryBooks.map(book => isWideRow ? renderWideCard(book) : renderPosterCard(book)).join('')}
</div>
</section>
`;
});

booksContainer.innerHTML = htmlMarkup;
initDragToScroll();
}

/* ==========================================================================
4. Real-Time Search with Debounce
========================================================================== */
function debounce(func, delay = 200) {
let timeout;
return (...args) => {
clearTimeout(timeout);
timeout = setTimeout(() => func(...args), delay);
};
}

function handleSearchQuery(query) {
const cleanTerm = query.trim().toLowerCase();

if (!cleanTerm) {
activeView = 'home';
renderBookSections(BOOK_DATABASE);
return;
}

const filtered = BOOK_DATABASE.filter(book =>
book.title.toLowerCase().includes(cleanTerm) ||
book.author.toLowerCase().includes(cleanTerm) ||
book.genre.toLowerCase().includes(cleanTerm) ||
book.category.toLowerCase().includes(cleanTerm) ||
book.year.includes(cleanTerm)
);

renderBookSections(filtered);
}

/* ==========================================================================
5. Toast Notification & Interaction Engine
========================================================================== */
function showToast(message, icon = 'fa-book-bookmark') {
let toast = document.getElementById('spooky-toast');
if (!toast) {
toast = document.createElement('div');
toast.id = 'spooky-toast';
toast.style.cssText = `
position: fixed;
bottom: 85px;
left: 50%;
transform: translateX(-50%) translateY(20px);
background: rgba(20, 22, 28, 0.96);
color: #ffffff;
padding: 10px 18px;
border-radius: 30px;
border: 1px solid var(--accent-orange);
box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 15px rgba(255,106,0,0.3);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
font-size: 0.82rem;
font-weight: 600;
z-index: 1000;
opacity: 0;
pointer-events: none;
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
display: flex;
align-items: center;
gap: 8px;
`;
document.body.appendChild(toast);
}

toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-orange);"></i> ${message}`;
toast.style.opacity = '1';
toast.style.transform = 'translateX(-50%) translateY(0)';

clearTimeout(toast._timeout);
toast._timeout = setTimeout(() => {
toast.style.opacity = '0';
toast.style.transform = 'translateX(-50%) translateY(20px)';
}, 2400);
}

function toggleBookmark(bookId, title, btn) {
const isSaved = !bookmarkedSet.has(bookId);

if (isSaved) {
bookmarkedSet.add(bookId);
showToast(`Added "${title}" to bookshelf`, 'fa-book-bookmark');
} else {
bookmarkedSet.delete(bookId);
showToast(`Removed "${title}" from bookshelf`, 'fa-trash-can');
}

saveBookmarks();

if (activeView === 'library') {
renderBookSections(BOOK_DATABASE.filter(book => bookmarkedSet.has(book.id)));
return;
}

if (btn) {
btn.classList.toggle('active', isSaved);
const icon = btn.querySelector('i');
if (icon) {
icon.className = isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
}
}
}

function openReader(title) {
showToast(`Opening reader for "${title}"`, 'fa-book-open');
}

/* ==========================================================================
6. Drag-to-Scroll Horizontal Carousel
========================================================================== */
function initDragToScroll() {
const sliders = document.querySelectorAll('.horizontal-scroll');

sliders.forEach(slider => {
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
isDown = true;
slider.style.cursor = 'grabbing';
slider.style.scrollSnapType = 'none';
startX = e.pageX - slider.offsetLeft;
scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
if (!isDown) return;
isDown = false;
slider.style.cursor = 'default';
slider.style.scrollSnapType = 'x mandatory';
});

slider.addEventListener('mouseup', () => {
if (!isDown) return;
isDown = false;
slider.style.cursor = 'default';
slider.style.scrollSnapType = 'x mandatory';
});

slider.addEventListener('mousemove', (e) => {
if (!isDown) return;
e.preventDefault();
const x = e.pageX - slider.offsetLeft;
const walk = (x - startX) * 1.5;
slider.scrollLeft = scrollLeft - walk;
});
});
}

/* ==========================================================================
7. Event Delegation & App Initialization
========================================================================== */
function init() {
booksContainer = document.getElementById('booksContainer');
searchInput = document.getElementById('searchInput');
navItems = document.querySelectorAll('.bottom-nav .nav-item');

loadBookmarks();
renderBookSections(BOOK_DATABASE);

// Search Input Listener
if (searchInput) {
searchInput.addEventListener('input', debounce((e) => {
handleSearchQuery(e.target.value);
}, 200));
}

// Click Delegation for Bookmarks and Read actions
if (booksContainer) {
booksContainer.addEventListener('click', (e) => {
const bookmarkBtn = e.target.closest('[data-action="bookmark"]');
const readBtn = e.target.closest('[data-action="read"]');

if (bookmarkBtn) {
e.preventDefault();
const id = bookmarkBtn.getAttribute('data-id');
const title = bookmarkBtn.getAttribute('data-title');
toggleBookmark(id, title, bookmarkBtn);
} else if (readBtn) {
e.preventDefault();
const title = readBtn.getAttribute('data-title');
openReader(title);
}
});
}

// Bottom Navigation tab switching
if (navItems && navItems.length > 0) {
navItems.forEach(item => {
item.addEventListener('click', (e) => {
const target = item.getAttribute('href');
if (target && target.endsWith('LandingPage.html')) return;
e.preventDefault();
navItems.forEach(nav => nav.classList.remove('active'));
item.classList.add('active');

const icon = item.querySelector('i');
if (icon && icon.classList.contains('fa-magnifying-glass')) {
activeView = 'search';
searchInput?.focus();
} else if (icon && icon.classList.contains('fa-book-bookmark')) {
activeView = 'library';
if (searchInput) searchInput.value = '';
renderBookSections(BOOK_DATABASE.filter(book => bookmarkedSet.has(book.id)));
}
});
});
}
}

document.addEventListener('DOMContentLoaded', init);
})();
