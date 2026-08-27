/**
 * ==========================================================================
 * HALLOWEEN MUSIC STREAMER — MASTER ENGINE (Halloweenmusic.js)
 * ==========================================================================
 * 
 * Features:
 * - 4 Curated Thematic Playlists (Kids, Classics, Dub/Bass, Ambient/Drone)
 * - Dynamic Hero Header & Tracklist DOM Rendering
 * - Full Simulated Audio Playback Engine (Play, Pause, Scrub, Next, Prev)
 * - Track Favoriting / Heart Toggling with LocalStorage Persistence
 * - Drag-to-Scroll & Interactive Tab Selection for Playlists
 * - Real-Time Search across Track Titles, Artists, and Themes
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Curated Playlists Database
     ========================================================================== */
  const PLAYLIST_DATABASE = {
    'kids-halloween': {
      id: 'kids-halloween',
      name: 'Monster Mashups',
      subtitle: 'Kid-Friendly Spooky Fun',
      curator: 'Curated by Spooky Sprouts',
      stats: '10 Songs | 32 mins',
      cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
      tracks: [
        { id: 'k-1', title: 'Monster Mash', artist: 'Bobby "Boris" Pickett', duration: '3:12', durationSec: 192, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-2', title: 'Spooky Scary Skeletons', artist: 'Andrew Gold', duration: '2:10', durationSec: 130, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-3', title: 'Ghostbusters', artist: 'Ray Parker Jr.', duration: '4:01', durationSec: 241, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-4', title: 'This Is Halloween', artist: 'The Citizens of Halloween', duration: '3:16', durationSec: 196, cover: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-5', title: 'The Addams Family Theme', artist: 'Vic Mizzy', duration: '1:45', durationSec: 105, cover: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-6', title: 'Purple People Eater', artist: 'Sheb Wooley', duration: '2:15', durationSec: 135, cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-7', title: 'Casper the Friendly Ghost', artist: 'Little Richard', duration: '2:54', durationSec: 174, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-8', title: 'Scooby-Doo Main Title', artist: 'Larry Marks', duration: '1:05', durationSec: 65, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-9', title: 'I Put a Spell on You', artist: 'Hocus Pocus Cast', duration: '2:32', durationSec: 152, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'k-10', title: 'Grim Grinning Ghosts', artist: 'The Mellomen', duration: '5:32', durationSec: 332, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    'classic-halloween': {
      id: 'classic-halloween',
      name: 'Witching Hour Classics',
      subtitle: 'Golden Era Horror & Hits',
      curator: 'Curated by Moonlight Melodies',
      stats: '10 Songs | 44 mins',
      cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=500&auto=format&fit=crop&q=80',
      tracks: [
        { id: 'c-1', title: 'Thriller', artist: 'Michael Jackson', duration: '5:58', durationSec: 358, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-2', title: '(Don\'t Fear) The Reaper', artist: 'Blue Öyster Cult', duration: '5:08', durationSec: 308, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-3', title: 'Time Warp', artist: 'Rocky Horror Cast', duration: '3:18', durationSec: 198, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-4', title: 'Somebody\'s Watching Me', artist: 'Rockwell', duration: '3:59', durationSec: 239, cover: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-5', title: 'Halloween Theme (Main Title)', artist: 'John Carpenter', duration: '2:21', durationSec: 141, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-6', title: 'Tubular Bells (The Exorcist)', artist: 'Mike Oldfield', duration: '3:43', durationSec: 223, cover: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-7', title: 'Season of the Witch', artist: 'Donovan', duration: '4:56', durationSec: 296, cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-8', title: 'Bark at the Moon', artist: 'Ozzy Osbourne', duration: '4:17', durationSec: 257, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-9', title: 'Feed My Frankenstein', artist: 'Alice Cooper', duration: '4:44', durationSec: 284, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
        { id: 'c-10', title: 'Bela Lugosi\'s Dead', artist: 'Bauhaus', duration: '9:36', durationSec: 576, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    'dub-scary': {
      id: 'dub-scary',
      name: 'Haunted Bass & Dub',
      subtitle: 'High Energy Dark Beats',
      curator: 'Curated by CyberGhouls',
      stats: '10 Songs | 38 mins',
      cover: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=500&auto=format&fit=crop&q=80',
      tracks: [
        { id: 'd-1', title: 'Scary Monsters and Nice Sprites', artist: 'Skrillex', duration: '4:03', durationSec: 243, cover: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-2', title: 'Reptile\'s Theme', artist: 'Skrillex', duration: '3:57', durationSec: 237, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-3', title: 'Centipede', artist: 'Knife Party', duration: '4:06', durationSec: 246, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-4', title: 'Internet Friends', artist: 'Knife Party', duration: '5:01', durationSec: 301, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-5', title: 'Ghouls VIP', artist: 'Figure', duration: '3:42', durationSec: 222, cover: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-6', title: 'The Monster\'s Revenge', artist: 'Figure', duration: '4:11', durationSec: 251, cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-7', title: 'Voodoo People (Pendulum RMX)', artist: 'The Prodigy', duration: '5:07', durationSec: 307, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-8', title: 'Witchcraft', artist: 'Pendulum', duration: '4:12', durationSec: 252, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-9', title: 'Superbeast (Dubstep Remix)', artist: 'Rob Zombie', duration: '4:23', durationSec: 263, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'd-10', title: 'Dragula (Hot Rod Sci-Fi Remix)', artist: 'Rob Zombie', duration: '4:37', durationSec: 277, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' }
      ]
    },
    'ambient-scary': {
      id: 'ambient-scary',
      name: 'Ambient Ghostly Whispers',
      subtitle: 'Atmospheric Dark Drone',
      curator: 'Curated by Graveyard Nocturnes',
      stats: '10 Songs | 58 mins',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
      tracks: [
        { id: 'a-1', title: 'Whispering Shadows', artist: 'Lustmord', duration: '6:45', durationSec: 405, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-2', title: 'The Black Meadow', artist: 'Keeley Forsyth', duration: '4:30', durationSec: 270, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-3', title: 'Distant Crypt Echoes', artist: 'Atrium Carceri', duration: '5:22', durationSec: 322, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-4', title: 'Cemetery Mist', artist: 'Nox Arcana', duration: '4:18', durationSec: 258, cover: 'https://images.unsplash.com/photo-1572293007244-8b60335d2b7d?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-5', title: 'Labyrinth of Lost Souls', artist: 'Nox Arcana', duration: '5:12', durationSec: 312, cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-6', title: 'Haunted Forest Drone', artist: 'Kammarheit', duration: '7:01', durationSec: 421, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-7', title: 'The Clockwork Phantom', artist: 'Midnight Syndicate', duration: '3:45', durationSec: 225, cover: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-8', title: 'Gothic Sanctuary', artist: 'Midnight Syndicate', duration: '4:15', durationSec: 255, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-9', title: 'Cursed Ground', artist: 'Cryo Chamber Collective', duration: '8:24', durationSec: 504, cover: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=200&auto=format&fit=crop&q=80' },
        { id: 'a-10', title: 'Midnight Seance', artist: 'Dark Sanctuary', duration: '8:45', durationSec: 525, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80' }
      ]
    }
  };

  /* ==========================================================================
     2. App State & Persistence
     ========================================================================== */
  const STORAGE_KEY_LIKES = 'halloween_music_liked_tracks';
  
  let activePlaylistId = 'kids-halloween';
  let currentTrackIndex = 0;
  let isPlaying = false;
  let playbackTimer = null;
  let currentPlaybackSeconds = 0;
  let likedTracks = new Set();
  let activeDockView = 'music';

  function loadLikedTracks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      if (saved) {
        likedTracks = new Set(JSON.parse(saved));
      } else {
        likedTracks = new Set(['k-1', 'c-1', 'd-1', 'a-1']);
      }
    } catch (e) {
      likedTracks = new Set(['k-1', 'c-1']);
    }
  }

  function saveLikedTracks() {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify([...likedTracks]));
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }
  }

  /* ==========================================================================
     3. Helpers & Time Formatting
     ========================================================================== */
  function formatSeconds(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function showToast(message, icon = 'fa-music') {
    let toast = document.getElementById('music-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'music-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 125px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(29, 23, 42, 0.95);
        color: #ffffff;
        padding: 9px 18px;
        border-radius: 30px;
        border: 1px solid var(--accent-orange);
        box-shadow: 0 8px 24px rgba(0,0,0,0.7), 0 0 15px rgba(255,106,0,0.3);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        font-size: 0.8rem;
        font-weight: 700;
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
    }, 2200);
  }

  /* ==========================================================================
     4. UI Rendering Engine
     ========================================================================== */
  function renderHeroSection(playlist) {
    const cover = document.getElementById('heroCoverArt');
    const title = document.getElementById('hero-playlist-title');
    const curator = document.getElementById('heroCurator');
    const stats = document.getElementById('heroStats');

    if (cover) cover.src = playlist.cover;
    if (title) title.textContent = playlist.name.toUpperCase();
    if (curator) curator.textContent = playlist.curator;
    if (stats) stats.textContent = playlist.stats;
  }

  function renderTracklist(playlist) {
    const container = document.getElementById('tracklistContainer');
    if (!container) return;

    container.innerHTML = playlist.tracks.map((track, idx) => {
      const isCurrent = (activePlaylistId === playlist.id && currentTrackIndex === idx);
      const isLiked = likedTracks.has(track.id);

      return `
        <li class="track-stream-item ${isCurrent ? 'playing' : ''}" data-index="${idx}" data-id="${track.id}">
          <img src="${track.cover}" alt="${track.title} Cover" class="track-cover-thumb" loading="lazy">
          
          <div class="track-details-col">
            <div class="track-title-row">
              <span class="track-number">${idx + 1}.</span>
              <h4 class="track-name">${track.title}</h4>
            </div>
            <p class="track-artist">${track.artist}</p>
          </div>

          <span class="track-duration-stamp">${track.duration}</span>

          <button class="track-action-btn like-btn ${isLiked ? 'liked' : ''}" data-action="like" data-id="${track.id}" aria-label="Favorite Track">
            <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>
          </button>

          <button class="track-play-bubble" data-action="play-row" data-index="${idx}" aria-label="Play ${track.title}">
            <i class="fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}" aria-hidden="true"></i>
          </button>
        </li>
      `;
    }).join('');
  }

  function renderSavedTracks() {
    const container = document.getElementById('tracklistContainer');
    if (!container) return;

    const savedTracks = Object.values(PLAYLIST_DATABASE).flatMap(playlist =>
      playlist.tracks
        .filter(track => likedTracks.has(track.id))
        .map(track => ({ ...track, playlistId: playlist.id }))
    );

    if (savedTracks.length === 0) {
      container.innerHTML = '<li class="saved-empty-state">No saved tracks yet. Tap the heart on a song to save it.</li>';
      return;
    }

    container.innerHTML = savedTracks.map((track, idx) => {
      const originalIndex = PLAYLIST_DATABASE[track.playlistId].tracks.findIndex(savedTrack => savedTrack.id === track.id);
      return `
      <li class="track-stream-item" data-index="${originalIndex}" data-playlist-id="${track.playlistId}">
        <img src="${track.cover}" alt="${track.title} Cover" class="track-cover-thumb" loading="lazy">
        <div class="track-details-col">
          <div class="track-title-row"><span class="track-number">${idx + 1}.</span><h4 class="track-name">${track.title}</h4></div>
          <p class="track-artist">${track.artist}</p>
        </div>
        <span class="track-duration-stamp">${track.duration}</span>
        <button class="track-action-btn like-btn liked" data-action="like" data-id="${track.id}" aria-label="Remove from saved tracks"><i class="fa-solid fa-heart" aria-hidden="true"></i></button>
        <button class="track-play-bubble" data-action="play-row" data-index="${originalIndex}" data-playlist-id="${track.playlistId}" aria-label="Play ${track.title}"><i class="fa-solid fa-play" aria-hidden="true"></i></button>
      </li>
    `;
    }).join('');
  }

  function updateMiniPlayer() {
    const playlist = PLAYLIST_DATABASE[activePlaylistId];
    const track = playlist.tracks[currentTrackIndex];

    const miniCover = document.getElementById('miniCoverArt');
    const miniTitle = document.getElementById('miniSongTitle');
    const miniCurrentTime = document.getElementById('miniCurrentTime');
    const miniDuration = document.getElementById('miniDuration');
    const globalPlayIcon = document.getElementById('globalPlayIcon');
    const progressFill = document.getElementById('miniProgressBarFill');

    if (miniCover) miniCover.src = track.cover;
    if (miniTitle) miniTitle.textContent = track.title;
    if (miniCurrentTime) miniCurrentTime.textContent = formatSeconds(currentPlaybackSeconds);
    if (miniDuration) miniDuration.textContent = track.duration;

    if (globalPlayIcon) {
      globalPlayIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }

    if (progressFill) {
      const percentage = (currentPlaybackSeconds / track.durationSec) * 100;
      progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }
  }

  /* ==========================================================================
     5. Playback Controller
     ========================================================================== */
  function startPlaybackTimer() {
    clearInterval(playbackTimer);
    playbackTimer = setInterval(() => {
      const playlist = PLAYLIST_DATABASE[activePlaylistId];
      const track = playlist.tracks[currentTrackIndex];

      if (currentPlaybackSeconds < track.durationSec) {
        currentPlaybackSeconds++;
        updateMiniPlayer();
      } else {
        nextTrack();
      }
    }, 1000);
  }

  function pausePlaybackTimer() {
    clearInterval(playbackTimer);
  }

  function playTrack(index, playlistId = activePlaylistId) {
    if (activePlaylistId !== playlistId) {
      activePlaylistId = playlistId;
      renderHeroSection(PLAYLIST_DATABASE[activePlaylistId]);
    }

    currentTrackIndex = index;
    currentPlaybackSeconds = 0;
    isPlaying = true;

    startPlaybackTimer();
    renderTracklist(PLAYLIST_DATABASE[activePlaylistId]);
    updateMiniPlayer();

    const track = PLAYLIST_DATABASE[activePlaylistId].tracks[currentTrackIndex];
    showToast(`Playing: ${track.title}`, 'fa-play');
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
    const track = PLAYLIST_DATABASE[activePlaylistId].tracks[currentTrackIndex];

    if (isPlaying) {
      startPlaybackTimer();
      showToast(`Resumed: ${track.title}`, 'fa-play');
    } else {
      pausePlaybackTimer();
      showToast('Playback Paused', 'fa-pause');
    }

    renderTracklist(PLAYLIST_DATABASE[activePlaylistId]);
    updateMiniPlayer();
  }

  function nextTrack() {
    const playlist = PLAYLIST_DATABASE[activePlaylistId];
    currentTrackIndex = (currentTrackIndex + 1) % playlist.tracks.length;
    currentPlaybackSeconds = 0;
    isPlaying = true;

    startPlaybackTimer();
    renderTracklist(playlist);
    updateMiniPlayer();
    showToast(`Next: ${playlist.tracks[currentTrackIndex].title}`, 'fa-forward-step');
  }

  function prevTrack() {
    const playlist = PLAYLIST_DATABASE[activePlaylistId];
    currentTrackIndex = (currentTrackIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    currentPlaybackSeconds = 0;
    isPlaying = true;

    startPlaybackTimer();
    renderTracklist(playlist);
    updateMiniPlayer();
    showToast(`Previous: ${playlist.tracks[currentTrackIndex].title}`, 'fa-backward-step');
  }

  function selectPlaylist(playlistId) {
    if (activePlaylistId === playlistId) return;

    activePlaylistId = playlistId;
    currentTrackIndex = 0;
    currentPlaybackSeconds = 0;

    // Update active tab styles
    document.querySelectorAll('.playlist-pill-card').forEach(card => {
      const isTarget = card.dataset.playlistId === playlistId;
      card.classList.toggle('active', isTarget);
      card.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    const playlist = PLAYLIST_DATABASE[activePlaylistId];
    renderHeroSection(playlist);
    renderTracklist(playlist);
    updateMiniPlayer();

    showToast(`Loaded: ${playlist.name}`, 'fa-record-vinyl');
  }

  function toggleLike(trackId, btn) {
    const isNowLiked = !likedTracks.has(trackId);

    if (isNowLiked) {
      likedTracks.add(trackId);
      showToast('Added to Favorite Tracks', 'fa-heart');
    } else {
      likedTracks.delete(trackId);
      showToast('Removed from Favorites', 'fa-heart-crack');
    }

    saveLikedTracks();

    if (activeDockView === 'saved') {
      renderSavedTracks();
      return;
    }

    if (btn) {
      btn.classList.toggle('liked', isNowLiked);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isNowLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
    }
  }

  /* ==========================================================================
     6. Drag-To-Scroll Feature for Playlists Carousel
     ========================================================================== */
  function initDragToScroll() {
    const track = document.querySelector('.playlists-carousel-track');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      track.style.scrollSnapType = 'none';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      track.style.cursor = 'pointer';
      track.style.scrollSnapType = 'x mandatory';
    });

    track.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      track.style.cursor = 'pointer';
      track.style.scrollSnapType = 'x mandatory';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* ==========================================================================
     7. App Initialization & Event Listeners
     ========================================================================== */
  function init() {
    loadLikedTracks();

    // Initial Render
    const initialPlaylist = PLAYLIST_DATABASE[activePlaylistId];
    renderHeroSection(initialPlaylist);
    renderTracklist(initialPlaylist);
    updateMiniPlayer();
    initDragToScroll();

    // Playlist Selector Tabs Click Event
    document.querySelectorAll('.playlist-pill-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.playlistId;
        if (id) selectPlaylist(id);
      });
    });

    // Tracklist Actions Delegation (Row Play & Like)
    const tracklistContainer = document.getElementById('tracklistContainer');
    if (tracklistContainer) {
      tracklistContainer.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('[data-action="like"]');
        const playBtn = e.target.closest('[data-action="play-row"]');
        const row = e.target.closest('.track-stream-item');

        if (likeBtn) {
          e.stopPropagation();
          toggleLike(likeBtn.dataset.id, likeBtn);
        } else if (playBtn || row) {
          const index = parseInt((playBtn || row).dataset.index, 10);
          if (!isNaN(index)) {
            const playlistId = (playBtn || row).dataset.playlistId || activePlaylistId;
            if (activePlaylistId === playlistId && currentTrackIndex === index && isPlaying) {
              togglePlayPause();
            } else {
              playTrack(index, playlistId);
            }
          }
        }
      });
    }

    // Hero Playlist Play Button
    const mainPlayBtn = document.getElementById('mainPlaylistPlayBtn');
    if (mainPlayBtn) {
      mainPlayBtn.addEventListener('click', () => {
        playTrack(0);
      });
    }

    // Hero Action Buttons
    const followBtn = document.getElementById('followPlaylistBtn');
    if (followBtn) {
      followBtn.addEventListener('click', () => {
        const isFollowed = followBtn.classList.toggle('active');
        followBtn.textContent = isFollowed ? 'FOLLOWING' : 'FOLLOW';
        showToast(isFollowed ? 'Following Playlist!' : 'Unfollowed Playlist', 'fa-bell');
      });
    }

    const downloadBtn = document.getElementById('downloadPlaylistBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        showToast('Downloading all 10 tracks for offline listening...', 'fa-arrow-down');
      });
    }

    // Mini Player Playback Controls
    const globalPlayBtn = document.getElementById('globalPlayPauseBtn');
    if (globalPlayBtn) {
      globalPlayBtn.addEventListener('click', togglePlayPause);
    }

    const nextBtn = document.getElementById('nextTrackBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', nextTrack);
    }

    const prevBtn = document.getElementById('prevTrackBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', prevTrack);
    }

    // Bottom Navigation Bar Tab Switching
    document.querySelectorAll('.app-dock-nav .dock-tab-item').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = tab.getAttribute('href');
        if (target && target.endsWith('LandingPage.html')) return;
        e.preventDefault();
        document.querySelectorAll('.app-dock-nav .dock-tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (target === '#search') {
          activeDockView = 'search';
          document.querySelector('.search-trigger-btn')?.click();
          document.querySelector('.music-scroll-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target === '#saved') {
          activeDockView = 'saved';
          renderSavedTracks();
          showToast('Showing saved tracks', 'fa-bookmark');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
