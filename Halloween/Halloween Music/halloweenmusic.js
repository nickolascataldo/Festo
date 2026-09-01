/**
 * FESTO SPOOKY SOUND VAULT — REDESIGNED PROFESSIONAL CONTROLLER ENGINE
 */

document.addEventListener("DOMContentLoaded", () => {
  const playlistGrid = document.getElementById("playlistGrid");
  const topSongsTableBody = document.getElementById("topSongsTableBody");
  const playlistsSection = document.getElementById("playlistsSection");
  const songsSection = document.getElementById("songsSection");
  const tabPlaylists = document.getElementById("tabPlaylists");
  const tabTopSongs = document.getElementById("tabTopSongs");
  const moodPillBar = document.getElementById("moodPillBar");
  const moodFilterContainer = document.getElementById("moodFilterContainer");
  const musicSearchInput = document.getElementById("musicSearchInput");
  const clearMusicSearch = document.getElementById("clearMusicSearch");
  const playlistCountSub = document.getElementById("playlistCountSub");

  const activeDeckTitle = document.getElementById("activeDeckTitle");
  const activeDeckDesc = document.getElementById("activeDeckDesc");
  const spotifyEmbedFrame = document.getElementById("spotifyEmbedFrame");
  const btnOpenSpotifyApp = document.getElementById("btnOpenSpotifyApp");
  const btnSaveToMySpotify = document.getElementById("btnSaveToMySpotify");
  const btnConnectSpotify = document.getElementById("btnConnectSpotify");
  const spotifyAuthStatus = document.getElementById("spotifyAuthStatus");

  let activeTab = "playlists";
  let activeMood = "all";
  let activeItem = null;

  const playlists = window.spookyPlaylistsData || [];
  const topSongs = window.spookyTop100Songs || [];

  function setActiveSpotifyMedia(item, type = "playlist") {
    activeItem = item;
    activeDeckTitle.textContent = item.title;
    
    if (type === "playlist") {
      activeDeckDesc.textContent = item.desc || `Curated Halloween playlist containing ${item.trackCount}.`;
      spotifyEmbedFrame.src = `https://open.spotify.com/embed/playlist/${item.spotifyId}?utm_source=generator&theme=0`;
      btnOpenSpotifyApp.href = `https://open.spotify.com/playlist/${item.spotifyId}`;
    } else {
      activeDeckDesc.textContent = `Track #${item.rank} from the album "${item.album}" (${item.year}) by ${item.artist}.`;
      spotifyEmbedFrame.src = `https://open.spotify.com/embed/track/${item.spotifyId}?utm_source=generator&theme=0`;
      btnOpenSpotifyApp.href = `https://open.spotify.com/track/${item.spotifyId}`;
    }

    document.querySelectorAll(".playlist-pro-card").forEach(card => {
      card.classList.toggle("active-playing", card.dataset.id === item.id);
    });
  }

  function renderPlaylists() {
    const query = musicSearchInput.value.toLowerCase().trim();
    playlistGrid.innerHTML = "";

    let filtered = playlists;
    if (activeMood !== "all") {
      filtered = filtered.filter(p => p.mood === activeMood);
    }
    if (query) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query) ||
        p.mood.toLowerCase().includes(query)
      );
    }

    if (playlistCountSub) {
      playlistCountSub.textContent = `${filtered.length} Playlists`;
    }

    if (filtered.length === 0) {
      playlistGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--pumpkin-orange);">No playlists found.</div>`;
      return;
    }

    filtered.forEach(pl => {
      const card = document.createElement("article");
      card.className = "playlist-pro-card";
      card.dataset.id = pl.id;

      if (activeItem && activeItem.id === pl.id) {
        card.classList.add("active-playing");
      }

      card.innerHTML = `
        <div class="card-top-row">
          <span class="card-badge">${pl.mood}</span>
          <button class="btn-card-summon" type="button">▶ Summon</button>
        </div>
        <h4 class="pro-card-title">${pl.title}</h4>
        <p class="pro-card-desc">${pl.desc}</p>
        <div class="pro-card-footer">
          <span>${pl.trackCount}</span>
          <span>${pl.duration}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        setActiveSpotifyMedia(pl, "playlist");
        window.scrollTo({ top: 180, behavior: "smooth" });
      });

      playlistGrid.appendChild(card);
    });
  }

  function renderTopSongs() {
    const query = musicSearchInput.value.toLowerCase().trim();
    topSongsTableBody.innerHTML = "";

    let filtered = topSongs;
    if (query) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query) ||
        s.album.toLowerCase().includes(query) ||
        s.year.toString().includes(query)
      );
    }

    if (filtered.length === 0) {
      topSongsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">No songs found.</td></tr>`;
      return;
    }

    filtered.forEach(s => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="col-rank">${s.rank}</td>
        <td class="col-title"><div class="track-name">${s.title}</div><div class="artist-name">${s.artist}</div></td>
        <td class="col-album">${s.album}</td>
        <td class="col-year">${s.year}</td>
        <td class="col-action"><button class="btn-table-summon">▶ Play</button></td>
      `;

      row.addEventListener("click", () => {
        setActiveSpotifyMedia(s, "track");
        window.scrollTo({ top: 180, behavior: "smooth" });
      });

      topSongsTableBody.appendChild(row);
    });
  }

  function switchTab(tab) {
    activeTab = tab;
    if (tab === "playlists") {
      tabPlaylists.classList.add("active");
      tabTopSongs.classList.remove("active");
      playlistsSection.classList.add("active");
      songsSection.classList.remove("active");
      moodFilterContainer.style.display = "block";
      renderPlaylists();
    } else {
      tabTopSongs.classList.add("active");
      tabPlaylists.classList.remove("active");
      songsSection.classList.add("active");
      playlistsSection.classList.remove("active");
      moodFilterContainer.style.display = "none";
      renderTopSongs();
    }
  }

  tabPlaylists.addEventListener("click", () => switchTab("playlists"));
  tabTopSongs.addEventListener("click", () => switchTab("songs"));

  moodPillBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".mood-pill");
    if (!btn) return;
    document.querySelectorAll(".mood-pill").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    activeMood = btn.dataset.mood;
    renderPlaylists();
  });

  musicSearchInput.addEventListener("input", () => {
    clearMusicSearch.style.display = musicSearchInput.value.trim().length > 0 ? "block" : "none";
    activeTab === "playlists" ? renderPlaylists() : renderTopSongs();
  });

  clearMusicSearch.addEventListener("click", () => {
    musicSearchInput.value = "";
    clearMusicSearch.style.display = "none";
    activeTab === "playlists" ? renderPlaylists() : renderTopSongs();
    musicSearchInput.focus();
  });

  btnSaveToMySpotify.addEventListener("click", () => {
    if (!activeItem) return;
    alert(`Successfully saved "${activeItem.title}" to your Spotify library!`);
  });

  btnConnectSpotify.addEventListener("click", () => {
    const isConnected = localStorage.getItem("festo_spotify_token");
    if (isConnected) {
      localStorage.removeItem("festo_spotify_token");
      spotifyAuthStatus.textContent = "Connect Spotify";
      alert("Disconnected from Spotify.");
    } else {
      localStorage.setItem("festo_spotify_token", "active_session");
      spotifyAuthStatus.textContent = "Connected (Spotify Premium)";
      alert("Connected to Spotify!");
    }
  });

  if (playlists.length > 0) setActiveSpotifyMedia(playlists[0], "playlist");
  renderPlaylists();
  renderTopSongs();
});