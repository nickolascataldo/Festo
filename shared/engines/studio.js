/* ==========================================================================
   FestoStudio: SVG sticker boards. Tap a piece to add it, drag to move, rotate / resize / flip /
   bring forward / delete, undo and redo, save as a PNG. Used by the Christmas Workshop.

     FestoStudio.mount(root, cfg)
       cfg = { season, storageKey, exportBg, boards:[{ id, label, icon, w, h, bg, base:(color)=>svg markup,
                colors:[...] (optional base colours), groups:[{id,label,pieces:[{id,label,svg,size}]}] }] }
   Pieces are inner SVG markup drawn in a 0..100 box, scaled by `size` (default 60).
   Each board keeps its own work, so switching tabs never loses a picture.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h, NS = 'http://www.w3.org/2000/svg';

  function mount(root, cfg) {
    var key = cfg.storageKey, boards = cfg.boards, byId = {};
    boards.forEach(function (b) { byId[b.id] = b; });
    var st = { board: boards[0].id, work: {}, sel: null, group: null };
    boards.forEach(function (b) { st.work[b.id] = { items: [], color: null, next: 1, hist: [], fut: [] }; });

    var saved = F.store.get(key + '_v2', null);
    if (saved && byId[saved.board]) {
      st.board = saved.board;
      Object.keys(saved.work || {}).forEach(function (id) {
        var w = st.work[id], s = saved.work[id]; if (!w || !s) return;
        w.items = Array.isArray(s.items) ? s.items : []; w.color = s.color || null;
        w.next = w.items.reduce(function (m, i) { return Math.max(m, i.id + 1); }, 1);
      });
    }

    var tabs = h('div', { class: 'fx-pills fx-pills--scroll', role: 'tablist' });
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fxst-svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Decorating board');
    var swatches = h('div', { class: 'fxst-swatches' });
    var palTabs = h('div', { class: 'fx-pills fx-pills--scroll' }), palGrid = h('div', { class: 'fxst-palette' });
    var bar = h('div', { class: 'fxst-bar' });
    var board = h('div', { class: 'fxst-board' }, svg);
    root.appendChild(tabs);
    root.appendChild(h('div', { class: 'fxst' }, h('div', { class: 'fxst-stage' }, board, swatches, bar), h('aside', { class: 'fx-card fxst-side' }, palTabs, palGrid)));
    if (F.shell && F.shell.setAction) F.shell.setAction({ icon: 'rotate-left', label: 'Undo', onclick: undo });

    function B() { return byId[st.board]; }
    function W() { return st.work[st.board]; }
    function persist() {
      var out = {};
      Object.keys(st.work).forEach(function (id) { out[id] = { items: st.work[id].items, color: st.work[id].color }; });
      F.store.set(key + '_v2', { board: st.board, work: out });
    }
    function transform(it, def) {
      var s = (def.size || 60) / 100 * it.s;
      return 'translate(' + it.x + ' ' + it.y + ') rotate(' + it.r + ') scale(' + (it.f ? -s : s) + ' ' + s + ') translate(-50 -50)';
    }

    /* ----- history: snapshots of the item list, taken before every change ----- */
    function snap() { var w = W(); w.hist.push(JSON.stringify(w.items)); if (w.hist.length > 80) w.hist.shift(); w.fut = []; }
    function restore(json) {
      var w = W(); w.items = JSON.parse(json);
      if (st.sel && !w.items.some(function (i) { return i.id === st.sel; })) st.sel = null;
    }
    function undo() { var w = W(); if (!w.hist.length) return; w.fut.push(JSON.stringify(w.items)); restore(w.hist.pop()); render(); }
    function redo() { var w = W(); if (!w.fut.length) return; w.hist.push(JSON.stringify(w.items)); restore(w.fut.pop()); render(); }

    /* ----- drawing ----- */
    function pieceDef(id) {
      var b = B();
      for (var g = 0; g < b.groups.length; g++) for (var p = 0; p < b.groups[g].pieces.length; p++) if (b.groups[g].pieces[p].id === id) return b.groups[g].pieces[p];
      return null;
    }
    function render() {
      var b = B(), w = W();
      svg.setAttribute('viewBox', '0 0 ' + b.w + ' ' + b.h);
      board.style.aspectRatio = b.w + ' / ' + b.h; board.style.setProperty('--ar', (b.w / b.h).toFixed(4));
      var color = w.color || (b.colors && b.colors[0]) || null;
      var html = '<g class="fxst-base">' + b.base(color) + '</g><g class="fxst-items">';
      w.items.forEach(function (it) {
        var def = pieceDef(it.p); if (!def) return;
        html += '<g class="fxst-item' + (st.sel === it.id ? ' is-sel' : '') + '" data-id="' + it.id + '" transform="' + transform(it, def) + '"><rect x="8" y="8" width="84" height="84" fill="transparent"/>' + def.svg + '</g>';
      });
      svg.innerHTML = html + '</g>';
      renderBar(); persist();
    }
    function renderTabs() {
      tabs.innerHTML = '';
      boards.forEach(function (b) {
        tabs.appendChild(h('button', {
          class: 'fx-pill' + (st.board === b.id ? ' is-active' : ''), type: 'button', role: 'tab', 'aria-selected': String(st.board === b.id),
          onclick: function () { st.board = b.id; st.sel = null; st.group = null; renderAll(); }
        }, h('i', { class: 'fa-solid fa-' + b.icon }), b.label));
      });
    }
    function renderSwatches() {
      swatches.innerHTML = '';
      var b = B(); if (!b.colors) { swatches.hidden = true; return; }
      swatches.hidden = false;
      var cur = W().color || b.colors[0];
      b.colors.forEach(function (c) {
        swatches.appendChild(h('button', { class: 'fxst-swatch' + (cur === c ? ' is-on' : ''), type: 'button', style: { background: c }, 'aria-label': 'Color ' + c, onclick: function () { W().color = c; renderSwatches(); render(); } }));
      });
    }
    function renderPalette() {
      var b = B(); if (!st.group || !b.groups.some(function (g) { return g.id === st.group; })) st.group = b.groups[0].id;
      palTabs.innerHTML = ''; palGrid.innerHTML = '';
      b.groups.forEach(function (g) { palTabs.appendChild(h('button', { class: 'fx-pill' + (st.group === g.id ? ' is-active' : ''), type: 'button', onclick: function () { st.group = g.id; renderPalette(); } }, g.label)); });
      b.groups.filter(function (g) { return g.id === st.group; })[0].pieces.forEach(function (p) {
        var thumb = document.createElementNS(NS, 'svg'); thumb.setAttribute('viewBox', '0 0 100 100'); thumb.setAttribute('class', 'fxst-thumb'); thumb.innerHTML = p.svg;
        palGrid.appendChild(h('button', { class: 'fxst-piece', type: 'button', 'aria-label': 'Add ' + p.label, title: p.label, onclick: function () { add(p.id); } }, thumb));
      });
    }
    function btn(icon, label, fn, disabled) {
      var b = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': label, title: label, onclick: fn }, h('i', { class: 'fa-solid fa-' + icon }));
      if (disabled) b.disabled = true; return b;
    }
    function selItem() { var w = W(); return w.items.filter(function (x) { return x.id === st.sel; })[0] || null; }
    function mod(fn) { var it = selItem(); if (!it) return; snap(); fn(it); render(); }
    function remove() { var it = selItem(); if (!it) return; snap(); var w = W(); w.items = w.items.filter(function (x) { return x !== it; }); st.sel = null; render(); }
    function renderBar() {
      bar.innerHTML = '';
      var w = W(), has = !!st.sel;
      [btn('rotate-left', 'Undo', undo, !w.hist.length), btn('rotate-right', 'Redo', redo, !w.fut.length),
        btn('arrows-rotate', 'Rotate', function () { mod(function (it) { it.r = (it.r + 15) % 360; }); }, !has),
        btn('magnifying-glass-plus', 'Bigger', function () { mod(function (it) { it.s = Math.min(3, it.s * 1.15); }); }, !has),
        btn('magnifying-glass-minus', 'Smaller', function () { mod(function (it) { it.s = Math.max(0.3, it.s / 1.15); }); }, !has),
        btn('left-right', 'Flip', function () { mod(function (it) { it.f = it.f ? 0 : 1; }); }, !has),
        btn('layer-group', 'Bring to front', function () { var it = selItem(); if (!it) return; snap(); w.items = w.items.filter(function (x) { return x !== it; }); w.items.push(it); render(); }, !has),
        btn('trash-can', 'Delete piece', remove, !has)].forEach(function (b) { bar.appendChild(b); });
      bar.appendChild(h('button', { class: 'fx-btn', type: 'button', onclick: exportPng }, h('i', { class: 'fa-solid fa-download' }), 'Save'));
      bar.appendChild(h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', disabled: w.items.length ? null : 'disabled', onclick: function () { if (!w.items.length) return; snap(); w.items = []; st.sel = null; render(); } }, h('i', { class: 'fa-solid fa-broom' }), 'Clear'));
    }
    function renderAll() { renderTabs(); renderSwatches(); renderPalette(); render(); }

    /* ----- actions ----- */
    function add(pid) {
      var b = B(), w = W(), jitter = function () { return (Math.random() - 0.5) * 60; };
      snap();
      var it = { id: w.next++, p: pid, x: Math.round(b.w / 2 + jitter()), y: Math.round(b.h / 2 + jitter()), s: 1, r: 0, f: 0 };
      w.items.push(it); st.sel = it.id; F.audio.blip(520 + Math.random() * 200, 50, 'triangle', 0.04); render();
    }

    /* ----- drag ----- */
    var drag = null;
    function toSvg(e) { var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var m = svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 }; }
    svg.addEventListener('pointerdown', function (e) {
      var g = e.target.closest ? e.target.closest('.fxst-item') : null;
      if (!g) { if (st.sel) { st.sel = null; render(); } return; }
      var id = +g.getAttribute('data-id'), w = W(), it = w.items.filter(function (x) { return x.id === id; })[0]; if (!it) return;
      var wasSel = st.sel === id; st.sel = id;
      var p = toSvg(e); drag = { id: id, dx: it.x - p.x, dy: it.y - p.y, moved: false, pre: JSON.stringify(w.items) };
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      if (!wasSel) { drag.redraw = true; }
      var prev = svg.querySelector('.fxst-item.is-sel'); if (prev) prev.classList.remove('is-sel'); g.classList.add('is-sel');
      renderBar();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var it = W().items.filter(function (x) { return x.id === drag.id; })[0]; if (!it) return;
      var p = toSvg(e); it.x = Math.round(p.x + drag.dx); it.y = Math.round(p.y + drag.dy); drag.moved = true;
      var g = svg.querySelector('.fxst-item[data-id="' + it.id + '"]');
      if (g) g.setAttribute('transform', transform(it, pieceDef(it.p)));
    });
    function endDrag() {
      if (!drag) return;
      var w = W();
      if (drag.moved) { w.hist.push(drag.pre); if (w.hist.length > 80) w.hist.shift(); w.fut = []; renderBar(); }
      drag = null; persist();
    }
    svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag);

    /* ----- keyboard: arrows nudge, [ ] rotate, Delete removes ----- */
    document.addEventListener('keydown', function (e) {
      if (!st.sel || e.ctrlKey || e.metaKey || e.altKey) return;
      var a = document.activeElement; if (a && /input|textarea|select/i.test(a.tagName)) return;
      var step = e.shiftKey ? 10 : 2, k = e.key;
      if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); remove(); }
      else if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
        if (a && a.tagName === 'BUTTON' && a.classList.contains('fx-pill')) return;
        e.preventDefault(); mod(function (it) { if (k === 'ArrowLeft') it.x -= step; else if (k === 'ArrowRight') it.x += step; else if (k === 'ArrowUp') it.y -= step; else it.y += step; });
      }
      else if (k === '[') mod(function (it) { it.r = (it.r + 345) % 360; });
      else if (k === ']') mod(function (it) { it.r = (it.r + 15) % 360; });
    });

    /* ----- export ----- */
    function exportPng() {
      var b = B(), clone = svg.cloneNode(true);
      clone.querySelectorAll('.is-sel').forEach(function (n) { n.classList.remove('is-sel'); });
      clone.querySelectorAll('rect[fill="transparent"]').forEach(function (n) { n.remove(); });
      clone.setAttribute('xmlns', NS); clone.setAttribute('width', b.w * 2); clone.setAttribute('height', b.h * 2);
      var xml = new XMLSerializer().serializeToString(clone);
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = b.w * 2; c.height = b.h * 2; var cx = c.getContext('2d');
        cx.fillStyle = b.exportBg || cfg.exportBg || '#ffffff'; cx.fillRect(0, 0, c.width, c.height); cx.drawImage(img, 0, 0);
        c.toBlob(function (blob) {
          if (!blob) { F.ui.toast('Could not save the picture', { kind: 'warn' }); return; }
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-' + st.board + '.png';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); F.ui.toast('Saved to your downloads');
        }, 'image/png');
      };
      img.onerror = function () { F.ui.toast('Could not save the picture', { kind: 'warn' }); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    }

    renderAll();
    return { state: st, add: add, undo: undo, redo: redo, exportPng: exportPng };
  }

  global.FestoStudio = { mount: mount };
})(window);
