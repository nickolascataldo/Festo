/**
* Halloween Movie Playlist — Core Application Engine (script.js)
*
* Features:
* - Dynamic Rendering & Filtering for 40+ Halloween Movies
* - Debounced Real-Time Search across titles, genres, and release years
* - Bookmark Persistence via Web Storage (localStorage)
* - Interactive Playback Modal & Quick-Toast Notifications
* - Touch & Desktop Drag-to-Scroll Support for Horizontal Carousels
* - Responsive Bottom-Dock Navigation Management
*/

(() => {
'use strict';

/* ==========================================================================
1. Movie Database (40+ Curated Titles)
========================================================================== */
const MOVIE_DATABASE = [
// --- SECTION 1: CURRENTLY WATCHING ---
{
id: 'watch-1',
category: 'Currently Watching',
isWide: true,
title: 'Halloweentown',
year: '1998',
duration: '1h 24m',
rating: '4.5',
timeLeft: '24m left',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
genre: 'Family • Fantasy'
},
{
id: 'watch-2',
category: 'Currently Watching',
isWide: true,
title: 'Practical Magic',
year: '1998',
duration: '1h 44m',
rating: '4.3',
timeLeft: '24m left',
poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
genre: 'Romance • Fantasy'
},
{
id: 'watch-3',
category: 'Currently Watching',
isWide: true,
title: 'Sleepy Hollow',
year: '1999',
duration: '1h 45m',
rating: '4.6',
timeLeft: '18m left',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
genre: 'Gothic • Mystery'
},

// --- SECTION 2: ESSENTIAL CLASSICS ---
{
id: 'classic-1',
category: 'Essential Classics',
title: 'Halloween',
year: '1978',
duration: '1h 31m',
rating: '4.7',
poster: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'classic-2',
category: 'Essential Classics',
title: "Trick 'r Treat",
year: '2007',
duration: '1h 22m',
rating: '4.1',
poster: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'classic-3',
category: 'Essential Classics',
title: 'The Exorcist',
year: '1973',
duration: '2h 02m',
rating: '4.5',
poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'classic-4',
category: 'Essential Classics',
title: 'Psycho',
year: '1960',
duration: '1h 49m',
rating: '4.6',
poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'classic-5',
category: 'Essential Classics',
title: 'The Shining',
year: '1980',
duration: '2h 26m',
rating: '4.8',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
genre: 'Psychological • Horror'
},
{
id: 'classic-6',
category: 'Essential Classics',
title: 'Elm Street',
year: '1984',
duration: '1h 31m',
rating: '4.5',
poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'classic-7',
category: 'Essential Classics',
title: 'Friday 13th',
year: '1980',
duration: '1h 35m',
rating: '4.2',
poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'classic-8',
category: 'Essential Classics',
title: 'Texas Chainsaw',
year: '1974',
duration: '1h 23m',
rating: '4.4',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Cult'
},

// --- SECTION 3: FAMILY & KIDS ---
{
id: 'fam-1',
category: 'Family & Kids',
title: 'Hocus Pocus',
year: '1993',
duration: '1h 36m',
rating: '4.2',
poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
genre: 'Family • Animation'
},
{
id: 'fam-2',
category: 'Family & Kids',
title: 'Corpse Bride',
year: '2005',
duration: '1h 17m',
rating: '4.4',
poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
genre: 'Family • Animation'
},
{
id: 'fam-3',
category: 'Family & Kids',
title: 'Monster House',
year: '2006',
duration: '1h 31m',
rating: '4.0',
poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
genre: 'Family • Animation'
},
{
id: 'fam-4',
category: 'Family & Kids',
title: 'Casper',
year: '1995',
duration: '1h 40m',
rating: '3.8',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
genre: 'Family • Animation'
},
{
id: 'fam-5',
category: 'Family & Kids',
title: 'Nightmare X-mas',
year: '1993',
duration: '1h 16m',
rating: '4.8',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
genre: 'Musical • Family'
},
{
id: 'fam-6',
category: 'Family & Kids',
title: 'Coraline',
year: '2009',
duration: '1h 40m',
rating: '4.7',
poster: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&auto=format&fit=crop&q=80',
genre: 'Fantasy • Animation'
},
{
id: 'fam-7',
category: 'Family & Kids',
title: 'Addams Family',
year: '1991',
duration: '1h 39m',
rating: '4.3',
poster: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=400&auto=format&fit=crop&q=80',
genre: 'Comedy • Spooky'
},
{
id: 'fam-8',
category: 'Family & Kids',
title: 'Frankenweenie',
year: '2012',
duration: '1h 27m',
rating: '4.1',
poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
genre: 'Family • Animation'
},

// --- SECTION 4: MODERN HORROR ---
{
id: 'mod-1',
category: 'Modern Horror',
title: 'Hereditary',
year: '2018',
duration: '2h 07m',
rating: '4.6',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
genre: 'Supernatural • Drama'
},
{
id: 'mod-2',
category: 'Modern Horror',
title: 'Scream (2022)',
year: '2022',
duration: '1h 54m',
rating: '4.2',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Mystery'
},
{
id: 'mod-3',
category: 'Modern Horror',
title: 'Barbarian',
year: '2022',
duration: '1h 42m',
rating: '4.3',
poster: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&auto=format&fit=crop&q=80',
genre: 'Thriller • Mystery'
},
{
id: 'mod-4',
category: 'Modern Horror',
title: 'X',
year: '2022',
duration: '1h 45m',
rating: '4.1',
poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
genre: 'Slasher • Horror'
},
{
id: 'mod-5',
category: 'Modern Horror',
title: 'Midsommar',
year: '2019',
duration: '2h 28m',
rating: '4.5',
poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
genre: 'Folk Horror • Drama'
},
{
id: 'mod-6',
category: 'Modern Horror',
title: 'Talk to Me',
year: '2023',
duration: '1h 35m',
rating: '4.4',
poster: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=400&auto=format&fit=crop&q=80',
genre: 'Supernatural • Thriller'
},
{
id: 'mod-7',
category: 'Modern Horror',
title: 'The Conjuring',
year: '2013',
duration: '1h 52m',
rating: '4.7',
poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Paranormal'
},
{
id: 'mod-8',
category: 'Modern Horror',
title: 'Get Out',
year: '2017',
duration: '1h 44m',
rating: '4.8',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
genre: 'Psychological • Mystery'
},

// --- SECTION 5: 90S NOSTALGIA & CULT ---
{
id: 'nos-1',
category: '90s Nostalgia & Cult',
title: 'The Craft',
year: '1996',
duration: '1h 41m',
rating: '4.2',
poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
genre: 'Drama • Fantasy'
},
{
id: 'nos-2',
category: '90s Nostalgia & Cult',
title: 'Scream',
year: '1996',
duration: '1h 51m',
rating: '4.7',
poster: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Slasher'
},
{
id: 'nos-3',
category: '90s Nostalgia & Cult',
title: 'Beetlejuice',
year: '1988',
duration: '1h 32m',
rating: '4.6',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
genre: 'Comedy • Fantasy'
},
{
id: 'nos-4',
category: '90s Nostalgia & Cult',
title: 'The Faculty',
year: '1998',
duration: '1h 44m',
rating: '3.9',
poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
genre: 'Sci-Fi • Horror'
},
{
id: 'nos-5',
category: '90s Nostalgia & Cult',
title: 'Blair Witch',
year: '1999',
duration: '1h 21m',
rating: '4.0',
poster: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Mystery'
},
{
id: 'nos-6',
category: '90s Nostalgia & Cult',
title: 'Last Summer',
year: '1997',
duration: '1h 41m',
rating: '3.8',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
genre: 'Mystery • Slasher'
},
{
id: 'nos-7',
category: '90s Nostalgia & Cult',
title: 'Idle Hands',
year: '1999',
duration: '1h 32m',
rating: '3.9',
poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
genre: 'Comedy • Horror'
},
{
id: 'nos-8',
category: '90s Nostalgia & Cult',
title: 'Buffy Slayer',
year: '1992',
duration: '1h 26m',
rating: '3.7',
poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
genre: 'Action • Comedy'
},

// --- SECTION 6: GOTHIC & SUPERNATURAL ---
{
id: 'goth-1',
category: 'Gothic & Supernatural',
title: 'Dracula',
year: '1992',
duration: '2h 08m',
rating: '4.5',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
genre: 'Gothic • Romance'
},
{
id: 'goth-2',
category: 'Gothic & Supernatural',
title: 'Crimson Peak',
year: '2015',
duration: '1h 59m',
rating: '4.1',
poster: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&auto=format&fit=crop&q=80',
genre: 'Gothic • Mystery'
},
{
id: 'goth-3',
category: 'Gothic & Supernatural',
title: 'The Ring',
year: '2002',
duration: '1h 55m',
rating: '4.4',
poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Mystery'
},
{
id: 'goth-4',
category: 'Gothic & Supernatural',
title: 'Insidious',
year: '2010',
duration: '1h 43m',
rating: '4.3',
poster: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Mystery'
},
{
id: 'goth-5',
category: 'Gothic & Supernatural',
title: 'The Others',
year: '2001',
duration: '1h 44m',
rating: '4.6',
poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
genre: 'Mystery • Supernatural'
},
{
id: 'goth-6',
category: 'Gothic & Supernatural',
title: 'Sinister',
year: '2012',
duration: '1h 50m',
rating: '4.3',
poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Mystery'
},
{
id: 'goth-7',
category: 'Gothic & Supernatural',
title: 'The Witch',
year: '2015',
duration: '1h 32m',
rating: '4.4',
poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
genre: 'Folk Horror • Mystery'
},
{
id: 'goth-8',
category: 'Gothic & Supernatural',
title: 'Poltergeist',
year: '1982',
duration: '1h 54m',
rating: '4.4',
poster: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&auto=format&fit=crop&q=80',
genre: 'Horror • Classic'
}
];

const POSTER_SEARCH_TITLES = {
	'Elm Street': 'A Nightmare on Elm Street',
	'Texas Chainsaw': 'The Texas Chain Saw Massacre',
	'Nightmare X-mas': 'The Nightmare Before Christmas',
	'Addams Family': 'The Addams Family',
	'Blair Witch': 'The Blair Witch Project',
	'Last Summer': 'I Know What You Did Last Summer',
	'Buffy Slayer': 'Buffy the Vampire Slayer'
};

function normalizeMovieTitle(title) {
	return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function loadAccuratePosters() {
	await Promise.all(MOVIE_DATABASE.map(async movie => {
		const searchTitle = POSTER_SEARCH_TITLES[movie.title] || movie.title;
		try {
			const response = await fetch(`https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(searchTitle)}.json`);
			if (!response.ok) return;
			const result = await response.json();
			const matchingMovie = result.d?.find(item => {
				if (item.qid !== 'movie' || !item.i?.imageUrl) return false;
				const sameYear = !item.y || String(item.y) === movie.year;
				const sameTitle = normalizeMovieTitle(item.l).includes(normalizeMovieTitle(searchTitle));
				return sameYear && sameTitle;
			}) || result.d?.find(item => item.qid === 'movie' && item.i?.imageUrl);
			if (matchingMovie) movie.poster = matchingMovie.i.imageUrl;
		} catch (error) {
			console.warn(`Could not load the poster for ${movie.title}:`, error);
		}
	}));
}

/* ==========================================================================
2. App State & Storage Management
========================================================================== */
const STORAGE_KEY = 'halloween_movie_bookmarks';
let bookmarkedSet = new Set();

function loadBookmarks() {
try {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
bookmarkedSet = new Set(JSON.parse(saved));
} else {
// Initial defaults matching visual mockup
bookmarkedSet = new Set([
'classic-1', 'classic-2', 'classic-3', 'classic-4',
'fam-1', 'fam-2', 'fam-3', 'fam-4'
]);
}
} catch (e) {
console.warn('LocalStorage is unavailable:', e);
bookmarkedSet = new Set(['classic-1', 'classic-2', 'classic-3', 'classic-4']);
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
3. DOM Elements Cache
========================================================================== */
let moviesContainer;
let searchInput;
let navItems;
let activeView = 'home';

/* ==========================================================================
4. Template Renderers
========================================================================== */
function renderWideCard(movie) {
return `
<article class="wide-card" data-id="${movie.id}">
<div class="wide-thumbnail-wrap">
<img src="${movie.poster}" alt="${movie.title} thumbnail" class="card-thumb" loading="lazy">
<span class="tag-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${movie.rating}</span>
<span class="tag-duration">${movie.timeLeft || movie.duration}</span>
</div>
<div class="wide-card-body">
<div class="card-meta-text">
<h3 class="movie-title">${movie.title}</h3>
<p class="movie-subtext">${movie.year} • ${movie.duration}</p>
</div>
<button class="play-action-btn" data-action="play" data-title="${movie.title}" aria-label="Play ${movie.title}">
<i class="fa-solid fa-play" aria-hidden="true"></i>
</button>
</div>
</article>
`;
}

function renderPosterCard(movie) {
const isBookmarked = bookmarkedSet.has(movie.id);
return `
<article class="poster-card" data-id="${movie.id}">
<div class="poster-thumbnail-wrap">
<img src="${movie.poster}" alt="${movie.title} poster" class="poster-img" loading="lazy">
<span class="poster-badge-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${movie.rating}</span>
</div>
<div class="poster-card-body">
<div class="poster-header-row">
<h3 class="poster-movie-title">${movie.title}</h3>
<button class="bookmark-btn ${isBookmarked ? 'active' : ''}"
data-action="bookmark"
data-id="${movie.id}"
data-title="${movie.title}"
aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark'} for ${movie.title}">
<i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
</button>
</div>
<p class="poster-meta">${movie.year} • ${movie.duration}</p>
<p class="poster-genre">${movie.genre}</p>
</div>
</article>
`;
}

function renderMovieSections(dataset) {
if (!moviesContainer) return;

if (dataset.length === 0) {
moviesContainer.innerHTML = `
<div style="text-align:center; padding: 60px 20px; color: var(--text-secondary);">
<i class="fa-solid fa-bookmark" style="font-size: 2.5rem; color: var(--accent-orange); margin-bottom: 12px;"></i>
<h3 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 6px;">${activeView === 'library' ? 'Your watchlist is empty' : 'No Spooky Movies Found'}</h3>
<p style="font-size: 0.85rem;">${activeView === 'library' ? 'Save a movie with its bookmark icon to find it here.' : 'Try searching for a different horror classic or genre.'}</p>
</div>
`;
return;
}

const categories = [...new Set(dataset.map(m => m.category))];
let htmlMarkup = '';

categories.forEach(categoryName => {
const categoryMovies = dataset.filter(m => m.category === categoryName);
if (categoryMovies.length === 0) return;

const isWideRow = Boolean(categoryMovies[0].isWide);

htmlMarkup += `
<section class="category-section" aria-label="${categoryName}">
<div class="section-header">
<h2 class="section-title">${categoryName}</h2>
<a href="#view-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}" class="see-all-link" aria-label="View all ${categoryName}">
<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
</a>
</div>
<div class="horizontal-scroll ${isWideRow ? 'wide-cards-row' : 'poster-cards-row'}">
${categoryMovies.map(movie => isWideRow ? renderWideCard(movie) : renderPosterCard(movie)).join('')}
</div>
</section>
`;
});

moviesContainer.innerHTML = htmlMarkup;
initDragToScroll();
}

/* ==========================================================================
5. Real-Time Search & Debounce Engine
========================================================================== */
function debounce(func, delay = 250) {
let timeout;
return (...args) => {
clearTimeout(timeout);
timeout = setTimeout(() => func(...args), delay);
};
}

function handleSearchQuery(query) {
const cleanTerm = query.trim().toLowerCase();

if (!cleanTerm) {
renderMovieSections(MOVIE_DATABASE);
return;
}

const filtered = MOVIE_DATABASE.filter(movie =>
movie.title.toLowerCase().includes(cleanTerm) ||
movie.genre.toLowerCase().includes(cleanTerm) ||
movie.category.toLowerCase().includes(cleanTerm) ||
movie.year.includes(cleanTerm)
);

renderMovieSections(filtered);
}

function showLibrary() {
activeView = 'library';
if (searchInput) searchInput.value = '';
renderMovieSections(MOVIE_DATABASE.filter(movie => bookmarkedSet.has(movie.id)));
}

function showHome() {
activeView = 'home';
if (searchInput) searchInput.value = '';
renderMovieSections(MOVIE_DATABASE);
}

/* ==========================================================================
6. Interactive Features: Toast, Bookmarking & Modal Playback
========================================================================== */
function showToastNotification(message, icon = 'fa-check') {
let toast = document.getElementById('spooky-toast');
if (!toast) {
toast = document.createElement('div');
toast.id = 'spooky-toast';
toast.style.cssText = `
position: fixed;
bottom: 85px;
left: 50%;
transform: translateX(-50%) translateY(20px);
background: rgba(22, 22, 28, 0.95);
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

function toggleBookmark(movieId, title, buttonEl) {
const isNowBookmarked = !bookmarkedSet.has(movieId);

if (isNowBookmarked) {
bookmarkedSet.add(movieId);
showToastNotification(`Added "${title}" to your playlist`, 'fa-bookmark');
} else {
bookmarkedSet.delete(movieId);
showToastNotification(`Removed "${title}" from watchlist`, 'fa-trash-can');
}

saveBookmarks();

// Toggle button UI state smoothly
if (buttonEl) {
buttonEl.classList.toggle('active', isNowBookmarked);
const icon = buttonEl.querySelector('i');
if (icon) {
icon.className = isNowBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
}
}
}

function launchPlaybackModal(title) {
showToastNotification(`Starting: ${title}`, 'fa-play');
}

/* ==========================================================================
7. Horizontal Carousel Mouse & Touch Drag-to-Scroll
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
8. Event Delegation & Lifecycle Initialization
========================================================================== */
function initEvents() {
// Search Listener
if (searchInput) {
searchInput.addEventListener('input', debounce((e) => {
handleSearchQuery(e.target.value);
}, 200));
}

// Dynamic Delegate for Play & Bookmark actions
if (moviesContainer) {
moviesContainer.addEventListener('click', (e) => {
const bookmarkBtn = e.target.closest('[data-action="bookmark"]');
const playBtn = e.target.closest('[data-action="play"]');

if (bookmarkBtn) {
e.preventDefault();
const id = bookmarkBtn.getAttribute('data-id');
const title = bookmarkBtn.getAttribute('data-title');
toggleBookmark(id, title, bookmarkBtn);
} else if (playBtn) {
e.preventDefault();
const title = playBtn.getAttribute('data-title');
launchPlaybackModal(title);
}
});
}

// Bottom Navigation tab selection
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
searchInput?.focus();
 activeView = 'search';
 } else if (icon && icon.classList.contains('fa-layer-group')) {
 showLibrary();
 } else if (icon && icon.classList.contains('fa-house')) {
 showHome();
}
});
});
}
}

// App Entry Point
document.addEventListener('DOMContentLoaded', () => {
moviesContainer = document.getElementById('moviesContainer');
searchInput = document.getElementById('searchInput');
navItems = document.querySelectorAll('.bottom-nav .nav-item');

loadBookmarks();
initEvents();
loadAccuratePosters().then(() => {
renderMovieSections(MOVIE_DATABASE);
initEvents();
});
});

})();
