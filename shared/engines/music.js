/* ==========================================================================
   FestoMusic v2: the app-style sound page.
     CATEGORIES  a row of icon tiles
     NOW PLAYING one Spotify embed
     PLAYLISTS   list cards (play / open in Spotify / save)
     SONGS       an optional searchable list with Spotify + YouTube search links
   Every playlist id in the data was checked against Spotify's oEmbed endpoint when the data was built.
   There is no fake "Connect Spotify". No thumbnails.

     FestoMusic.mount(root, cfg)
       cfg = { season, storageKey, title, categories:[{id,label,icon,color,playlists:[{id,title,blurb}]}],
               songs:[{title,artist,year}], songsTitle }
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h;

  function embedUrl(id) { return 'https://open.spotify.com/embed/playlist/' + encodeURIComponent(id) + '?utm_source=generator&theme=0'; }
  function openUrl(id) { return 'https://open.spotify.com/playlist/' + encodeURIComponent(id); }
  function songLinks(s) {
    var q = encodeURIComponent(s.title + ' ' + s.artist);
    return { spotify: 'https://open.spotify.com/search/' + q, youtube: 'https://www.youtube.com/results?search_query=' + q };
  }
  function decadeOf(y) { return y < 1980 ? 'Before 1980' : y < 1990 ? '1980s' : y < 2000 ? '1990s' : y < 2010 ? '2000s' : '2010s on'; }
  function icon(n, x) { return h('i', { class: 'fa-solid fa-' + n + (x ? ' ' + x : '') }); }

  function mount(root, cfg) {
    var key = cfg.storageKey, cats = cfg.categories;
    var favs = F.store.get(key + '_favs', []);
    var st = { cat: cats[0].id, sel: null, q: '', decade: 'all' }, byId = {};
    cats.forEach(function (c) { c.playlists.forEach(function (p) { p.cat = c.id; byId[p.id] = p; }); });
    var last = F.store.get(key + '_last', null);
    st.sel = byId[last] ? last : cats[0].playlists[0].id;
    st.cat = byId[st.sel].cat;

    /* ---- layout ---- */
    var tilesRow = h('div', { class: 'fx-tiles' });
    var nowTitle = h('h3', { class: 'fx-feature-title' });
    var nowCat = h('span', { class: 'fx-eyebrow' });
    var playerBox = h('div', { class: 'fxmu-playerbox' });
    var nowOpen = h('a', { class: 'fx-btn fx-btn--sm', target: '_blank', rel: 'noopener' }, icon('arrow-up-right-from-square'), 'Open in Spotify');
    var nowFav = h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button' });
    var now = h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Now playing'),
      h('div', { class: 'fx-card fxmu-now' }, nowCat, nowTitle, playerBox, h('div', { class: 'fx-row' }, nowOpen, nowFav),
        h('p', { class: 'fx-muted fxmu-note' }, 'Previews play for 30 seconds unless you are signed in to Spotify here.')));
    var listTitle = h('h2', { class: 'fx-sec-title' });
    var list = h('div', { class: 'fxmu-list' });
    root.appendChild(h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Moods'), tilesRow));
    root.appendChild(now);
    root.appendChild(h('section', { class: 'fx-sec' }, listTitle, list));

    var songsSec = null, songSearch, songList, songCount, decadeBox;
    if (cfg.songs && cfg.songs.length) {
      songSearch = h('input', { class: 'fx-input', type: 'search', placeholder: 'Search ' + cfg.songs.length + ' songs', 'aria-label': 'Search songs' });
      songList = h('ol', { class: 'fxmu-songs' });
      songCount = h('span', { class: 'fx-muted' });
      decadeBox = h('div', { class: 'fx-pills fx-pills--scroll' });
      songsSec = h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, (cfg.songsTitle || 'Songs'), songCount),
        h('div', { class: 'fx-search' }, icon('magnifying-glass'), songSearch), decadeBox, songList);
      root.appendChild(songsSec);
    }
    if (F.shell && F.shell.setAction) F.shell.setAction({ icon: 'magnifying-glass', label: 'Search songs', onclick: function () { if (songSearch) { songSearch.focus(); songSearch.scrollIntoView({ behavior: 'smooth', block: 'center' }); } } });

    /* ---- behaviour ---- */
    function setSel(id, play) {
      st.sel = id; F.store.set(key + '_last', id);
      var p = byId[id], c = cats.filter(function (x) { return x.id === p.cat; })[0];
      nowTitle.textContent = p.title; nowCat.textContent = c.label;
      nowOpen.setAttribute('href', openUrl(id));
      var fav = favs.indexOf(id) >= 0;
      nowFav.innerHTML = ''; nowFav.appendChild(h('i', { class: 'fa-' + (fav ? 'solid' : 'regular') + ' fa-heart' })); nowFav.appendChild(document.createTextNode(fav ? ' Saved' : ' Save'));
      if (play || !playerBox.firstChild) {
        playerBox.innerHTML = '';
        playerBox.appendChild(h('iframe', { class: 'fxmu-embed', title: p.title + ' on Spotify', src: embedUrl(id), loading: 'lazy', allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture', frameborder: '0' }));
      }
      renderList();
    }
    nowFav.addEventListener('click', function () { toggleFav(st.sel); });
    function toggleFav(id) { var i = favs.indexOf(id); if (i >= 0) favs.splice(i, 1); else favs.push(id); F.store.set(key + '_favs', favs); setSel(st.sel, false); renderTiles(); }

    function renderTiles() {
      tilesRow.innerHTML = '';
      cats.forEach(function (c) {
        tilesRow.appendChild(h('button', { class: 'fx-tile' + (st.cat === c.id ? ' is-on' : ''), type: 'button', 'aria-pressed': String(st.cat === c.id), onclick: function () { st.cat = c.id; renderTiles(); renderList(); } }, icon(c.icon), h('span', null, c.label), h('small', null, String(c.playlists.length))));
      });
      tilesRow.appendChild(h('button', { class: 'fx-tile' + (st.cat === 'favs' ? ' is-on' : ''), type: 'button', 'aria-pressed': String(st.cat === 'favs'), onclick: function () { st.cat = 'favs'; renderTiles(); renderList(); } }, icon('heart'), h('span', null, 'Saved'), h('small', null, String(favs.length))));
    }
    function renderList() {
      var items, c;
      if (st.cat === 'favs') { items = favs.map(function (id) { return byId[id]; }).filter(Boolean); listTitle.textContent = 'Saved · ' + items.length; }
      else { c = cats.filter(function (x) { return x.id === st.cat; })[0]; items = c.playlists; listTitle.textContent = c.label; }
      list.innerHTML = '';
      if (!items.length) list.appendChild(h('p', { class: 'fx-muted' }, 'Tap the heart on a playlist to save it here.'));
      items.forEach(function (p) {
        var pc = cats.filter(function (x) { return x.id === p.cat; })[0];
        var on = st.sel === p.id, fav = favs.indexOf(p.id) >= 0;
        list.appendChild(h('article', { class: 'fx-listcard fxmu-row' + (on ? ' is-on' : ''), style: { '--c': pc.color || 'var(--fx-accent)' } },
          h('button', { class: 'fx-listcard-art fxmu-play', type: 'button', 'aria-label': 'Play ' + p.title, onclick: function () { setSel(p.id, true); now.scrollIntoView({ behavior: F.motion.reduced() ? 'auto' : 'smooth', block: 'start' }); } }, icon(on ? 'volume-high' : 'play')),
          h('div', { class: 'fxs-text' }, h('h3', { class: 'fx-listcard-title' }, p.title), p.blurb ? h('p', { class: 'fxs-blurb' }, p.blurb) : null),
          h('div', { class: 'fxs-acts' },
            h('a', { class: 'fx-circle-btn fxs-act', href: openUrl(p.id), target: '_blank', rel: 'noopener', 'aria-label': 'Open ' + p.title + ' in Spotify' }, h('i', { class: 'fa-brands fa-spotify' })),
            h('button', { class: 'fx-circle-btn fxs-act' + (fav ? ' is-on' : ''), type: 'button', 'aria-pressed': String(fav), 'aria-label': (fav ? 'Unsave ' : 'Save ') + p.title, onclick: function () { toggleFav(p.id); } }, h('i', { class: 'fa-' + (fav ? 'solid' : 'regular') + ' fa-heart' })))));
      });
    }
    function renderSongs() {
      if (!songsSec) return;
      var q = st.q.toLowerCase().trim();
      var res = cfg.songs.filter(function (s) { return (st.decade === 'all' || decadeOf(s.year) === st.decade) && (!q || (s.title + ' ' + s.artist).toLowerCase().indexOf(q) >= 0); });
      songList.innerHTML = '';
      songCount.textContent = String(res.length);
      res.forEach(function (s) {
        var l = songLinks(s);
        songList.appendChild(h('li', { class: 'fxmu-song' },
          h('span', { class: 'fxmu-rank' }, String(cfg.songs.indexOf(s) + 1)),
          h('span', { class: 'fxmu-songtext' }, h('strong', null, s.title), h('span', { class: 'fx-muted' }, s.artist + (s.year ? ' · ' + s.year : ''))),
          h('span', { class: 'fx-row' },
            h('a', { class: 'fx-circle-btn fxs-act', href: l.spotify, target: '_blank', rel: 'noopener', 'aria-label': 'Search Spotify for ' + s.title }, h('i', { class: 'fa-brands fa-spotify' })),
            h('a', { class: 'fx-circle-btn fxs-act', href: l.youtube, target: '_blank', rel: 'noopener', 'aria-label': 'Search YouTube for ' + s.title }, h('i', { class: 'fa-brands fa-youtube' })))));
      });
      if (!res.length) songList.appendChild(h('li', { class: 'fx-muted' }, 'No songs match that.'));
    }
    if (songsSec) {
      songSearch.addEventListener('input', F.dom.debounce(function () { st.q = songSearch.value; renderSongs(); }, 150));
      ['all', 'Before 1980', '1980s', '1990s', '2000s', '2010s on'].forEach(function (d) {
        decadeBox.appendChild(h('button', { class: 'fx-pill' + (d === 'all' ? ' is-active' : ''), type: 'button', onclick: function (e) { st.decade = d; decadeBox.querySelectorAll('.fx-pill').forEach(function (b) { b.classList.remove('is-active'); }); e.currentTarget.classList.add('is-active'); renderSongs(); } }, d === 'all' ? 'All' : d));
      });
    }
    renderTiles(); setSel(st.sel, true); renderSongs();
    return { select: setSel };
  }

  global.FestoMusic = { mount: mount, _pure: { embedUrl: embedUrl, openUrl: openUrl, songLinks: songLinks, decadeOf: decadeOf } };
})(window);
