/* ==========================================================================
   FestoWeather: Open-Meteo (keyless) weather for all four seasons.
     FestoWeather.mount(root, { season, widgets:[...], title })
   Widgets: now, uv, temp, wind, rain, hourly, daily, moon, sun, snow, lightShow,
            haunt, ootNight, pollen, air
   Dev hooks: ?festoMock=uv11|snow|rain   ?festoOffline=1
   Offline: last good payload (marked stale), or moon + seasonal guidance only.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h, svg = F.dom.svg;
  var CACHE_KEY = 'festo_weather_cache_v1', UNITS_KEY = 'festo_units';

  /* ====================== pure helpers (node-testable) ====================== */
  var UV_BANDS = [
    { id: 'low', label: 'Low', from: 0, to: 3, color: '#3EA72D', risk: 'Low risk of sunburn', advice: ['You can safely enjoy being outside.', 'Wear sunglasses on bright days.', 'Snow and sand reflect UV, so take care there.'] },
    { id: 'moderate', label: 'Moderate', from: 3, to: 6, color: '#FFD60A', risk: 'Moderate risk of sunburn', advice: ['Seek shade around midday.', 'Wear a hat, sunglasses and SPF 30+ sunscreen.', 'Cover up if you will be out for hours.'] },
    { id: 'high', label: 'High', from: 6, to: 8, color: '#F18B00', risk: 'High risk of sunburn', advice: ['Reduce time in the sun between 10 AM and 4 PM.', 'Wear a shirt, hat and sunglasses; reapply SPF 30+ every 2 hours.', 'Seek shade whenever you can.'] },
    { id: 'very-high', label: 'Very high', from: 8, to: 11, color: '#E53210', risk: 'Very high risk of sunburn', advice: ['Take extra care: unprotected skin can burn in minutes.', 'Avoid the midday sun; stay in the shade.', 'Wear long sleeves, a wide-brim hat and SPF 50.'] },
    { id: 'extreme', label: 'Extreme', from: 11, to: 13, color: '#B567A4', risk: 'Extreme risk of sunburn', advice: ['Avoid being outside during midday hours.', 'Shade, long sleeves, a hat, sunglasses and SPF 50+ are essential.', 'Unprotected skin can burn in about 15 minutes or less.'] }
  ];
  function uvScale(uv) {
    uv = Math.max(0, Number(uv) || 0);
    var band = UV_BANDS[0];
    for (var i = 0; i < UV_BANDS.length; i++) if (uv >= UV_BANDS[i].from) band = UV_BANDS[i];
    var burn = uv < 1 ? null : Math.max(5, Math.round(150 / uv / 5) * 5);
    return { uv: uv, level: band.id, label: band.label, color: band.color, risk: band.risk, advice: band.advice, burnMinutes: burn };
  }
  var SYNODIC = 29.530588853, REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
  function moonPhase(date) {
    var days = (date.getTime() - REF_NEW_MOON) / 86400000;
    var f = ((days / SYNODIC) % 1 + 1) % 1;
    var illum = (1 - Math.cos(2 * Math.PI * f)) / 2;
    var name = f < 0.0339 || f > 0.9661 ? 'New Moon' : f < 0.2161 ? 'Waxing Crescent' : f < 0.2839 ? 'First Quarter' : f < 0.4661 ? 'Waxing Gibbous' : f < 0.5339 ? 'Full Moon' : f < 0.7161 ? 'Waning Gibbous' : f < 0.7839 ? 'Last Quarter' : 'Waning Crescent';
    return { fraction: f, illumination: illum, name: name, daysToFull: ((0.5 - f + 1) % 1) * SYNODIC, daysToNew: ((1 - f) % 1) * SYNODIC };
  }
  var BEAUFORT = [[1, 'Calm'], [4, 'Light air'], [8, 'Light breeze'], [13, 'Gentle breeze'], [19, 'Moderate breeze'], [25, 'Fresh breeze'], [32, 'Strong breeze'], [39, 'Near gale'], [47, 'Gale'], [55, 'Strong gale'], [64, 'Storm'], [73, 'Violent storm'], [999, 'Hurricane force']];
  function beaufort(mph) { for (var i = 0; i < BEAUFORT.length; i++) if (mph < BEAUFORT[i][0]) return BEAUFORT[i][1]; return 'Hurricane force'; }
  function compass(deg) { return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(((deg % 360) + 360) % 360 / 22.5) % 16]; }
  function wmo(code, isDay) {
    var d = isDay !== 0;
    if (code === 0) return { icon: d ? 'sun' : 'moon', text: 'Clear' };
    if (code === 1) return { icon: d ? 'cloud-sun' : 'cloud-moon', text: 'Mostly clear' };
    if (code === 2) return { icon: d ? 'cloud-sun' : 'cloud-moon', text: 'Partly cloudy' };
    if (code === 3) return { icon: 'cloud', text: 'Overcast' };
    if (code === 45 || code === 48) return { icon: 'smog', text: 'Fog' };
    if (code >= 51 && code <= 57) return { icon: 'cloud-rain', text: 'Drizzle' };
    if (code >= 61 && code <= 67) return { icon: 'cloud-showers-heavy', text: 'Rain' };
    if (code >= 71 && code <= 77) return { icon: 'snowflake', text: 'Snow' };
    if (code >= 80 && code <= 82) return { icon: 'cloud-sun-rain', text: 'Rain showers' };
    if (code === 85 || code === 86) return { icon: 'snowflake', text: 'Snow showers' };
    if (code >= 95) return { icon: 'cloud-bolt', text: 'Thunderstorm' };
    return { icon: 'temperature-half', text: 'Weather' };
  }
  function wi(name) { return h('i', { class: 'fa-solid fa-' + name }); }
  function tempColor(f) { // f in Fahrenheit -> colour
    var stops = [[0, '#4cc9f0'], [32, '#4895ef'], [55, '#52b788'], [72, '#ffd166'], [90, '#f77f00'], [105, '#d62828']];
    for (var i = 1; i < stops.length; i++) if (f <= stops[i][0]) return stops[i][1];
    return stops[stops.length - 1][1];
  }
  function spookScore(m) {
    var s = 10;
    if (m.vis != null && m.vis < 5000) s += 25;
    if (m.cloud != null && m.cloud >= 40 && m.cloud <= 85) s += 10;
    if (m.windMph >= 8 && m.windMph <= 22) s += 20;
    if (m.moon > 0.9) s += 25; else if (m.moon < 0.1) s += 15;
    if (m.tempF != null && m.tempF < 50) s += 15;
    if (m.wet) s += 10;
    return Math.min(100, s);
  }
  function spookLabel(s) { return s >= 80 ? 'Witching hour' : s >= 60 ? 'Properly haunted' : s >= 35 ? 'Pleasantly eerie' : 'Calm and cozy'; }
  function lightShowScore(m) {
    var s = 100;
    if (m.pop > 30) s -= Math.min(45, (m.pop - 30)); if (m.windMph > 12) s -= Math.min(30, (m.windMph - 12) * 2);
    if (m.tempF < 25) s -= Math.min(30, (25 - m.tempF)); if (m.vis != null && m.vis < 3000) s -= 15;
    return Math.max(0, Math.round(s));
  }
  function pollenGuidance(month, southern) {
    var m = southern ? (month + 6) % 12 : month;   // 0 = Jan
    if (m >= 1 && m <= 4) return { season: 'Tree pollen season', detail: 'Birch, oak, maple and cedar are the usual culprits. Showers help wash it away; windy dry days are the worst.', level: 'Often high' };
    if (m >= 4 && m <= 6) return { season: 'Grass pollen season', detail: 'Grasses peak from late spring into early summer. Mowing and midday sun make symptoms worse.', level: 'Often high' };
    if (m >= 7 && m <= 9) return { season: 'Weed pollen season', detail: 'Ragweed and similar weeds dominate late summer and fall.', level: 'Often moderate to high' };
    return { season: 'Low pollen season', detail: 'Cold months are mostly quiet, though indoor allergens such as dust and mould can still bother you.', level: 'Usually low' };
  }

  /* ====================== data ====================== */
  function toModel(loc, units, w) {
    var c = w.current, hr = w.hourly, dl = w.daily;
    var model = { loc: loc, units: units, fetchedAt: Date.now(), tz: w.timezone, stale: false };
    model.now = { time: c.time, temp: c.temperature_2m, feels: c.apparent_temperature, humidity: c.relative_humidity_2m, code: c.weather_code, isDay: c.is_day, wind: c.wind_speed_10m, gust: c.wind_gusts_10m, windDir: c.wind_direction_10m, precip: c.precipitation, snow: c.snowfall, cloud: c.cloud_cover, uv: c.uv_index, vis: c.visibility };
    var start = Math.max(0, hr.time.indexOf(c.time.slice(0, 13) + ':00'));
    model.hourly = [];
    for (var i = start; i < Math.min(hr.time.length, start + 48); i++) {
      model.hourly.push({ t: hr.time[i], temp: hr.temperature_2m[i], pop: hr.precipitation_probability[i], uv: hr.uv_index[i], wind: hr.wind_speed_10m[i], snow: hr.snowfall[i], code: hr.weather_code[i], cloud: hr.cloud_cover[i], vis: hr.visibility[i], depth: hr.snow_depth ? hr.snow_depth[i] : null, isDay: hr.is_day ? hr.is_day[i] : 1 });
    }
    model.daily = dl.time.map(function (d, i) {
      return { date: d, code: dl.weather_code[i], tmax: dl.temperature_2m_max[i], tmin: dl.temperature_2m_min[i], uvMax: dl.uv_index_max[i], pop: dl.precipitation_probability_max[i], snow: dl.snowfall_sum[i], precip: dl.precipitation_sum[i], sunrise: dl.sunrise[i], sunset: dl.sunset[i] };
    });
    return model;
  }
  function mockModel(kind, loc, units) {
    var base = new Date(F.now());
    var iso = function (d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
    var curHour = new Date(base); curHour.setMinutes(0, 0, 0);
    var K = { uv11: { temp: 96, feels: 104, code: 0, uv: 11.4, wind: 6, pop: 0, snow: 0 }, snow: { temp: 24, feels: 14, code: 73, uv: 0.5, wind: 14, pop: 90, snow: 0.6 }, rain: { temp: 58, feels: 55, code: 63, uv: 1.2, wind: 16, pop: 85, snow: 0 } }[kind] || { temp: 70, feels: 70, code: 2, uv: 5, wind: 8, pop: 10, snow: 0 };
    var hourly = [], i;
    for (i = 0; i < 48; i++) {
      var t = new Date(curHour.getTime() + i * 3600000), hr = t.getHours();
      var sun = hr >= 6 && hr <= 19 ? Math.sin((hr - 6) / 13 * Math.PI) : 0;
      hourly.push({ t: iso(t), temp: K.temp - 8 + 10 * sun, pop: K.pop, uv: K.uv * sun, wind: K.wind, snow: K.snow, code: K.code, cloud: kind === 'rain' ? 90 : 30, vis: kind === 'snow' ? 2500 : 20000, depth: kind === 'snow' ? 0.12 : null, isDay: hr >= 6 && hr <= 19 ? 1 : 0 });
    }
    var daily = [];
    for (i = 0; i < 7; i++) {
      var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      daily.push({ date: iso(d).slice(0, 10), code: K.code, tmax: K.temp + 2, tmin: K.temp - 14, uvMax: K.uv, pop: K.pop, snow: K.snow * 6, precip: K.pop / 40, sunrise: iso(d).slice(0, 11) + '06:42', sunset: iso(d).slice(0, 11) + '19:28' });
    }
    return { loc: loc, units: units, fetchedAt: Date.now(), stale: false, mock: kind, now: { time: iso(base), temp: K.temp, feels: K.feels, humidity: 55, code: K.code, isDay: 1, wind: K.wind, gust: K.wind + 9, windDir: 250, precip: K.pop / 40, snow: K.snow, cloud: kind === 'rain' ? 90 : 30, uv: K.uv, vis: kind === 'snow' ? 2500 : 20000 }, hourly: hourly, daily: daily };
  }
  function fetchWeather(loc, units) {
    if (F.flags.mock) return Promise.resolve(mockModel(F.flags.mock, loc, units));
    var imp = units === 'imperial';
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat.toFixed(4) + '&longitude=' + loc.lon.toFixed(4) +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m,wind_direction_10m,is_day,uv_index,visibility' +
      '&hourly=temperature_2m,precipitation_probability,uv_index,wind_speed_10m,snowfall,snow_depth,weather_code,cloud_cover,visibility,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,precipitation_probability_max,snowfall_sum,precipitation_sum' +
      '&temperature_unit=' + (imp ? 'fahrenheit' : 'celsius') + '&wind_speed_unit=' + (imp ? 'mph' : 'kmh') + '&precipitation_unit=' + (imp ? 'inch' : 'mm') + '&timezone=auto&forecast_days=7';
    return F.net.json(url, { timeoutMs: 9000, retries: 1 }).then(function (w) { return toModel(loc, units, w); });
  }
  function fetchAir(loc) {
    if (F.flags.mock || F.flags.offline) return Promise.resolve(null);
    var url = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + loc.lat.toFixed(3) + '&longitude=' + loc.lon.toFixed(3) + '&current=us_aqi,pm2_5,birch_pollen,grass_pollen,ragweed_pollen&timezone=auto';
    return F.net.json(url, { timeoutMs: 7000, retries: 0 }).then(function (d) { return d.current || null; }, function () { return null; });
  }

  /* ====================== formatting ====================== */
  function fmtT(model, v) { return v == null ? '–' : Math.round(v) + '°' + (model.units === 'imperial' ? 'F' : 'C'); }
  function toF(model, v) { return model.units === 'imperial' ? v : v * 9 / 5 + 32; }
  function toMph(model, v) { return model.units === 'imperial' ? v : v * 0.621371; }
  function speedUnit(model) { return model.units === 'imperial' ? 'mph' : 'km/h'; }
  function hourLabel(t) { var hr = +t.slice(11, 13); return (hr % 12 || 12) + (hr < 12 ? ' AM' : ' PM'); }
  function dayLabel(d, i) { if (i === 0) return 'Today'; return new Date(d + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' }); }
  function timeLabel(t) { var hr = +t.slice(11, 13), mm = t.slice(14, 16); return (hr % 12 || 12) + ':' + mm + (hr < 12 ? ' AM' : ' PM'); }

  /* ====================== SVG widgets ====================== */
  function polar(cx, cy, r, deg) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arcPath(cx, cy, r0, r1, a0, a1) {
    var p0 = polar(cx, cy, r1, a0), p1 = polar(cx, cy, r1, a1), p2 = polar(cx, cy, r0, a1), p3 = polar(cx, cy, r0, a0);
    return 'M' + p0 + ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + p1 + ' L' + p2 + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + p3 + ' Z';
  }
  function uvGauge(uv) {
    var sc = uvScale(uv), max = 13, cx = 150, cy = 148;
    var s = svg('svg', { viewBox: '0 0 300 175', class: 'fxwx-gauge', role: 'img', 'aria-label': 'UV index ' + Math.round(uv * 10) / 10 + ', ' + sc.risk });
    UV_BANDS.forEach(function (b) {
      var a0 = 180 + (b.from / max) * 180 + 0.8, a1 = 180 + (b.to / max) * 180 - 0.8;
      s.appendChild(svg('path', { d: arcPath(cx, cy, 78, 132, a0, a1), fill: b.color, stroke: 'rgba(0,0,0,0.35)', 'stroke-width': 2 }));
    });
    var ang = 180 + Math.min(uv, max) / max * 180, tip = polar(cx, cy, 120, ang), l = polar(cx, cy, 14, ang + 90), r = polar(cx, cy, 14, ang - 90);
    s.appendChild(svg('path', { d: 'M' + l + ' L' + tip + ' L' + r + ' Z', fill: '#17202a', stroke: '#fff', 'stroke-width': 2, class: 'fxwx-needle' }));
    s.appendChild(svg('circle', { cx: cx, cy: cy, r: 36, fill: '#fff', stroke: '#17202a', 'stroke-width': 4 }));
    s.appendChild(svg('text', { x: cx, y: cy + 10, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: '#17202a', 'font-family': 'Plus Jakarta Sans, sans-serif' }, String(Math.round(uv))));
    return s;
  }
  function tempRing(model, v) {
    var f = toF(model, v), pct = Math.max(0, Math.min(1, (f + 10) / 125)), R = 62, C = 2 * Math.PI * R;
    var s = svg('svg', { viewBox: '0 0 160 160', class: 'fxwx-ring', role: 'img', 'aria-label': 'Temperature ' + fmtT(model, v) });
    s.appendChild(svg('circle', { cx: 80, cy: 80, r: R, fill: 'none', stroke: 'rgba(255,255,255,0.12)', 'stroke-width': 14 }));
    s.appendChild(svg('circle', { cx: 80, cy: 80, r: R, fill: 'none', stroke: tempColor(f), 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-dasharray': (C * pct * 0.75) + ' ' + C, transform: 'rotate(135 80 80)' }));
    s.appendChild(svg('text', { x: 80, y: 90, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: 'currentColor', 'font-family': 'Plus Jakarta Sans, sans-serif' }, fmtT(model, v)));
    return s;
  }
  function compassSvg(deg) {
    var s = svg('svg', { viewBox: '0 0 120 120', class: 'fxwx-compass', role: 'img', 'aria-label': 'Wind from ' + compass(deg) });
    s.appendChild(svg('circle', { cx: 60, cy: 60, r: 52, fill: 'none', stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 3 }));
    [['N', 60, 18], ['E', 104, 64], ['S', 60, 112], ['W', 16, 64]].forEach(function (p) { s.appendChild(svg('text', { x: p[1], y: p[2], 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: 'currentColor' }, p[0])); });
    var g = svg('g', { transform: 'rotate(' + ((deg + 180) % 360) + ' 60 60)' });
    g.appendChild(svg('path', { d: 'M60 22 L70 62 L60 56 L50 62 Z', fill: 'var(--fx-accent)', stroke: '#fff', 'stroke-width': 1.5 }));
    s.appendChild(g);
    return s;
  }
  function moonSvg(f, size) {
    var R = 46, c = Math.cos(2 * Math.PI * f), rx = Math.abs(c) * R, waxing = f < 0.5;
    var s = svg('svg', { viewBox: '0 0 100 100', width: size || 100, height: size || 100, class: 'fxwx-moon', role: 'img', 'aria-label': 'Moon phase' });
    s.appendChild(svg('circle', { cx: 50, cy: 50, r: R, fill: '#1b2030', stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 1.5 }));
    var d = 'M50 ' + (50 - R) + ' A' + R + ' ' + R + ' 0 0 1 50 ' + (50 + R) + ' A' + rx + ' ' + R + ' 0 0 ' + (c > 0 ? 0 : 1) + ' 50 ' + (50 - R) + ' Z';
    var lit = svg('path', { d: d, fill: '#f3ecd0' });
    if (!waxing) lit.setAttribute('transform', 'translate(100 0) scale(-1 1)');
    s.appendChild(lit);
    return s;
  }

  /* ====================== widgets ====================== */
  function card(title, icon, body, cls) { return h('section', { class: 'fx-card fxwx-card ' + (cls || '') }, h('h3', { class: 'fxwx-h' }, icon ? h('i', { class: 'fa-solid ' + icon }) : null, title), body); }
  function stat(label, value, sub) { return h('div', { class: 'fxwx-stat' }, h('span', { class: 'fxwx-stat-v' }, value), h('span', { class: 'fxwx-stat-l' }, label), sub ? h('span', { class: 'fxwx-stat-s' }, sub) : null); }

  var W = {
    now: function (m) {
      var c = wmo(m.now.code, m.now.isDay);
      return h('section', { class: 'fx-card fxwx-now' },
        h('div', { class: 'fxwx-now-main' }, h('span', { class: 'fxwx-now-ico' }, wi(c.icon)),
          h('div', null, h('div', { class: 'fxwx-now-temp' }, fmtT(m, m.now.temp)), h('div', { class: 'fxwx-now-cond' }, c.text), h('div', { class: 'fx-muted' }, 'Feels like ' + fmtT(m, m.now.feels)))),
        h('div', { class: 'fxwx-now-stats' },
          stat('Wind', Math.round(m.now.wind) + ' ' + speedUnit(m), compass(m.now.windDir)),
          stat('Humidity', Math.round(m.now.humidity) + '%'),
          stat('Cloud cover', Math.round(m.now.cloud) + '%'),
          stat('UV now', String(Math.round(m.now.uv * 10) / 10))));
    },
    uv: function (m) {
      var uv = m.now.uv, peak = m.daily[0] ? m.daily[0].uvMax : uv, sc = uvScale(peak > uv ? peak : uv);
      var legend = h('div', { class: 'fxwx-legend' }, UV_BANDS.map(function (b) { return h('span', { class: 'fxwx-chip' }, h('i', { style: { background: b.color } }), b.label + ' ' + b.from + (b.id === 'extreme' ? '+' : '–' + (b.to - 1))); }));
      return card('UV index & sun safety', 'fa-sun', h('div', { class: 'fxwx-uv' },
        h('div', { class: 'fxwx-uv-gauge' }, uvGauge(sc.uv), h('div', { class: 'fxwx-uv-risk', style: { '--lvl': sc.color } }, sc.risk),
          h('div', { class: 'fx-muted fxwx-uv-sub' }, 'Now ' + (Math.round(uv * 10) / 10) + ' · today\'s peak ' + (Math.round(peak * 10) / 10))),
        h('div', { class: 'fxwx-uv-advice' },
          h('h4', { class: 'fxwx-h4' }, 'Sun safety advice'),
          sc.advice.map(function (a, i) { return h('div', { class: 'fxwx-tip' }, h('span', { class: 'fxwx-tip-ico' }, wi(['bottle-droplet', 'hat-cowboy', 'umbrella-beach'][i % 3])), h('span', null, a)); }),
          sc.burnMinutes ? h('p', { class: 'fx-muted fxwx-note' }, 'Rough guide: fair skin may start to burn in about ' + sc.burnMinutes + ' minutes at this UV. Darker skin takes longer, but can still burn.') : h('p', { class: 'fx-muted fxwx-note' }, 'UV is very low right now (night or heavy cloud).'),
          legend)), 'fxwx-wide');
    },
    temp: function (m) {
      var hi = m.daily[0], f = toF(m, m.now.temp);
      var note = f >= 95 ? 'Heat warning: drink water often and take breaks in the shade.' : f >= 85 ? 'Hot out. Plan outdoor activity for morning or evening.' : f <= 20 ? 'Bitterly cold. Cover skin and limit time outside.' : f <= 40 ? 'Chilly. Layers and a hat will help.' : 'A comfortable range for most plans.';
      return card('Temperature', 'fa-temperature-half', h('div', { class: 'fxwx-center' }, tempRing(m, m.now.temp), h('div', { class: 'fx-muted' }, 'Feels like ' + fmtT(m, m.now.feels)), h('div', { class: 'fxwx-hilo' }, h('span', null, '▲ ' + fmtT(m, hi.tmax)), h('span', null, '▼ ' + fmtT(m, hi.tmin))), h('p', { class: 'fx-muted fxwx-note' }, note)));
    },
    wind: function (m) {
      var mph = toMph(m, m.now.wind);
      return card('Wind', 'fa-wind', h('div', { class: 'fxwx-center' }, compassSvg(m.now.windDir), h('div', { class: 'fxwx-big' }, Math.round(m.now.wind) + ' ' + speedUnit(m)), h('div', { class: 'fx-muted' }, beaufort(mph) + ' · from the ' + compass(m.now.windDir)), h('div', { class: 'fx-muted' }, 'Gusts to ' + Math.round(m.now.gust) + ' ' + speedUnit(m))));
    },
    rain: function (m) {
      var pop = Math.max.apply(null, m.hourly.slice(0, 12).map(function (x) { return x.pop || 0; }));
      var unit = m.units === 'imperial' ? 'in' : 'mm';
      return card('Rain', 'fa-umbrella', h('div', { class: 'fxwx-center' },
        h('div', { class: 'fxwx-drops' }, wi(pop >= 60 ? 'cloud-showers-heavy' : pop >= 30 ? 'cloud-sun-rain' : 'umbrella')),
        h('div', { class: 'fxwx-big' }, pop + '%'), h('div', { class: 'fx-muted' }, 'chance of rain in the next 12 hours'),
        h('div', { class: 'fxwx-bar' }, h('i', { style: { width: pop + '%' } })),
        h('div', { class: 'fx-muted' }, 'Now: ' + (m.now.precip || 0) + ' ' + unit + ' · today: ' + (m.daily[0].precip || 0) + ' ' + unit)));
    },
    hourly: function (m) {
      return card('Next 24 hours', 'fa-clock', h('div', { class: 'fxwx-hours', role: 'list' }, m.hourly.slice(0, 24).map(function (x, i) {
        var c = wmo(x.code, x.isDay);
        return h('div', { class: 'fxwx-hour', role: 'listitem' }, h('span', { class: 'fx-muted' }, i === 0 ? 'Now' : hourLabel(x.t)), h('span', { class: 'fxwx-hico' }, wi(c.icon)), h('strong', null, fmtT(m, x.temp)), h('span', { class: 'fxwx-pop' }, (x.pop || 0) + '%'));
      })), 'fxwx-wide');
    },
    daily: function (m) {
      var lo = Math.min.apply(null, m.daily.map(function (d) { return d.tmin; })), hi = Math.max.apply(null, m.daily.map(function (d) { return d.tmax; }));
      return card('7-day outlook', 'fa-calendar-week', h('div', { class: 'fxwx-days' }, m.daily.map(function (d, i) {
        var c = wmo(d.code, 1), left = ((d.tmin - lo) / (hi - lo || 1)) * 100, w = ((d.tmax - d.tmin) / (hi - lo || 1)) * 100;
        return h('div', { class: 'fxwx-day' }, h('span', { class: 'fxwx-dname' }, dayLabel(d.date, i)), h('span', null, wi(c.icon)), h('span', { class: 'fxwx-dlo' }, fmtT(m, d.tmin)),
          h('span', { class: 'fxwx-dbar' }, h('i', { style: { left: left + '%', width: Math.max(8, w) + '%', background: 'linear-gradient(90deg,' + tempColor(toF(m, d.tmin)) + ',' + tempColor(toF(m, d.tmax)) + ')' } })), h('span', { class: 'fxwx-dhi' }, fmtT(m, d.tmax)));
      })), 'fxwx-wide');
    },
    sun: function (m) {
      var d = m.daily[0];
      return card('Sun', 'fa-sun', h('div', { class: 'fxwx-sunrow' }, stat('Sunrise', timeLabel(d.sunrise)), stat('Sunset', timeLabel(d.sunset)), stat('Peak UV', String(Math.round((d.uvMax || 0) * 10) / 10))));
    },
    moon: function (m) {
      var p = moonPhase(F.now());
      return card('Moon', 'fa-moon', h('div', { class: 'fxwx-center' }, moonSvg(p.fraction, 104), h('div', { class: 'fxwx-big' }, p.name), h('div', { class: 'fx-muted' }, Math.round(p.illumination * 100) + '% lit'),
        h('div', { class: 'fx-muted' }, 'Next full moon in ' + Math.round(p.daysToFull) + ' days · new moon in ' + Math.round(p.daysToNew) + ' days')));
    },
    snow: function (m) {
      var next24 = m.hourly.slice(0, 24).reduce(function (a, x) { return a + (x.snow || 0); }, 0), week = m.daily.reduce(function (a, d) { return a + (d.snow || 0); }, 0);
      var u = m.units === 'imperial' ? 'in' : 'cm', depth = m.hourly[0] && m.hourly[0].depth;
      var dec = F.now().getMonth() === 11;
      var f = toF(m, m.now.temp);
      var note = week > 0.5 ? 'Snow is in the forecast this week.' : f > 40 ? 'Too mild for snow right now.' : 'Cold enough for snow, but none is forecast this week.';
      return card('Snowfall', 'fa-snowflake', h('div', { class: 'fxwx-center' }, h('div', { class: 'fxwx-drops' }, wi('snowflake')),
        h('div', { class: 'fxwx-sunrow' }, stat('Next 24 h', (Math.round(next24 * 10) / 10) + ' ' + u), stat('This week', (Math.round(week * 10) / 10) + ' ' + u), depth != null ? stat('On ground', (Math.round(depth * (m.units === 'imperial' ? 39.37 : 100) * 10) / 10) + ' ' + u) : null),
        h('p', { class: 'fx-muted fxwx-note' }, note + (dec ? ' A "white Christmas" needs snow on the ground on Dec 25, so check back closer to the day.' : ''))));
    },
    lightShow: function (m) {
      var next = m.hourly.slice(0, 12);
      var pop = Math.max.apply(null, next.map(function (x) { return x.pop || 0; }));
      var score = lightShowScore({ pop: pop, windMph: toMph(m, m.now.wind), tempF: toF(m, m.now.temp), vis: m.now.vis });
      var label = score >= 80 ? 'Great night for a light tour' : score >= 55 ? 'Decent: bundle up' : 'Better to stay in';
      return card('Light-show conditions', 'fa-star', h('div', { class: 'fxwx-center' }, h('div', { class: 'fxwx-big' }, score + '/100'), h('div', { class: 'fxwx-bar' }, h('i', { style: { width: score + '%' } })), h('strong', null, label),
        h('p', { class: 'fx-muted fxwx-note' }, 'Rain, wind, cold and visibility over the next 12 hours.')));
    },
    haunt: function (m) {
      var p = moonPhase(F.now());
      var s = spookScore({ vis: m.now.vis, cloud: m.now.cloud, windMph: toMph(m, m.now.wind), moon: p.illumination, tempF: toF(m, m.now.temp), wet: (m.now.precip || 0) > 0 });
      return card('Spook meter', 'fa-ghost', h('div', { class: 'fxwx-center' }, h('div', { class: 'fxwx-big' }, s + '/100'), h('div', { class: 'fxwx-bar fxwx-bar--spooky' }, h('i', { style: { width: s + '%' } })), h('strong', null, spookLabel(s)),
        h('p', { class: 'fx-muted fxwx-note' }, 'For fun: fog, wind, a bright or missing moon and a chill raise it.')));
    },
    ootNight: function (m) {
      var now = F.now(), isOct31 = now.getMonth() === 9 && now.getDate() === 31;
      var evening = m.hourly.filter(function (x) { var hr = +x.t.slice(11, 13); return hr >= 18 && hr <= 21; }).slice(0, 4);
      if (!evening.length) evening = m.hourly.slice(0, 4);
      var tMin = Math.min.apply(null, evening.map(function (x) { return x.temp; })), tMax = Math.max.apply(null, evening.map(function (x) { return x.temp; }));
      var pop = Math.max.apply(null, evening.map(function (x) { return x.pop || 0; })), wind = Math.max.apply(null, evening.map(function (x) { return x.wind || 0; }));
      var tips = [];
      if (pop >= 40) tips.push(['umbrella', 'Bring umbrellas and put costumes in a waterproof bag.']);
      if (toF(m, tMin) < 50) tips.push(['temperature-low', 'Dress in layers under the costume. It will be chilly.']);
      if (toMph(m, wind) > 20) tips.push(['wind', 'Secure lightweight decorations and skip open candle flames.']);
      tips.push(['lightbulb', 'Carry a flashlight or glow stick, and wear something reflective.']);
      var daysTo = Math.round((new Date(now.getFullYear(), 9, 31) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
      return card(isOct31 ? 'Trick-or-treat tonight' : 'Trick-or-treat preview: tonight 6 to 9 PM', 'fa-candy-cane', h('div', null,
        h('div', { class: 'fxwx-sunrow' }, stat('Temperature', fmtT(m, tMin) + ' to ' + fmtT(m, tMax)), stat('Rain chance', pop + '%'), stat('Wind', Math.round(wind) + ' ' + speedUnit(m))),
        tips.map(function (t) { return h('div', { class: 'fxwx-tip' }, h('span', { class: 'fxwx-tip-ico' }, wi(t[0])), h('span', null, t[1])); }),
        !isOct31 && daysTo > 0 ? h('p', { class: 'fx-muted fxwx-note' }, 'Halloween is ' + daysTo + ' days away. Forecasts reach about a week ahead, so this is a preview. Check back closer to the night.') : null), 'fxwx-wide');
    },
    pollen: function (m, ctx) {
      var g = pollenGuidance(F.now().getMonth(), m.loc.lat < 0);
      var air = ctx.air, live = air && (air.birch_pollen != null || air.grass_pollen != null || air.ragweed_pollen != null);
      return card('Pollen & allergies', 'fa-seedling', h('div', null,
        h('strong', null, g.season + ' · ' + g.level),
        h('p', { class: 'fx-muted' }, g.detail),
        live ? h('div', { class: 'fxwx-sunrow' }, stat('Birch', String(Math.round(air.birch_pollen || 0)), 'grains/m³'), stat('Grass', String(Math.round(air.grass_pollen || 0)), 'grains/m³'), stat('Ragweed', String(Math.round(air.ragweed_pollen || 0)), 'grains/m³'))
          : h('p', { class: 'fx-muted fxwx-note' }, 'Live pollen counts are only available for parts of Europe. Check your local allergy forecast for exact numbers; this is seasonal guidance.'),
        h('p', { class: 'fx-muted fxwx-note' }, 'Tips: shower after being outside, keep windows shut on dry windy days, and rinse your eyes if they itch.')));
    },
    air: function (m, ctx) {
      var a = ctx.air;
      if (!a || a.us_aqi == null) return card('Air quality', 'fa-lungs', h('p', { class: 'fx-muted' }, 'Air-quality data is not available right now.'));
      var v = a.us_aqi, lvl = v <= 50 ? ['Good', '#3EA72D'] : v <= 100 ? ['Moderate', '#FFD60A'] : v <= 150 ? ['Unhealthy for sensitive groups', '#F18B00'] : v <= 200 ? ['Unhealthy', '#E53210'] : ['Very unhealthy', '#B567A4'];
      return card('Air quality', 'fa-lungs', h('div', { class: 'fxwx-center' }, h('div', { class: 'fxwx-big', style: { color: lvl[1] } }, String(Math.round(v))), h('strong', null, lvl[0]), h('div', { class: 'fx-muted' }, 'US AQI · PM2.5 ' + Math.round(a.pm2_5 || 0) + ' µg/m³')));
    }
  };

  /* ====================== mount ====================== */
  function mount(root, cfg) {
    var season = cfg.season, units = F.store.get(UNITS_KEY, 'imperial'), loc = null, model = null, air = null, busy = 0;
    var status = h('div', { class: 'fxwx-status', role: 'status', 'aria-live': 'polite' });
    var out = h('div', { class: 'fxwx-grid' });
    var placeEl = h('div', { class: 'fxwx-place' });
    var searchInput = h('input', { class: 'fx-input', type: 'search', placeholder: 'Search a city…', 'aria-label': 'Search a city', autocomplete: 'off' });
    var results = h('ul', { class: 'fxwx-results', hidden: '' });
    var unitBtn = h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', 'aria-label': 'Switch units' });
    var geoBtn = h('button', { class: 'fx-btn fx-btn--sm', type: 'button' }, h('i', { class: 'fa-solid fa-location-crosshairs' }), 'Use my location');
    var bar = h('div', { class: 'fx-card fxwx-bar-top' },
      h('div', { class: 'fxwx-search' }, h('div', { class: 'fx-search' }, h('i', { class: 'fa-solid fa-magnifying-glass' }), searchInput), results),
      geoBtn, unitBtn, placeEl);
    root.appendChild(h('div', { class: 'fx-hero' }, h('span', { class: 'fx-eyebrow' }, cfg.eyebrow || 'Live conditions'), h('h2', { class: 'fx-h2' }, cfg.title), cfg.sub ? h('p', { class: 'fx-muted' }, cfg.sub) : null));
    root.appendChild(bar); root.appendChild(status); root.appendChild(out);

    function setUnitLabel() { unitBtn.textContent = units === 'imperial' ? '°F · mph' : '°C · km/h'; }
    function setPlace() { placeEl.innerHTML = ''; placeEl.appendChild(h('span', null, h('i', { class: 'fa-solid fa-location-dot' }), ' ' + loc.label)); }
    function say(msg, kind) { status.className = 'fxwx-status' + (kind ? ' is-' + kind : ''); status.textContent = msg || ''; }

    function draw(ctx) {
      out.innerHTML = '';
      if (!model) {
        out.appendChild(W.moon({ loc: loc }));
        out.appendChild(card('Seasonal guidance', 'fa-circle-info', h('div', null, h('p', { class: 'fx-muted' }, 'Live weather is not reachable right now, but the moon phase above works offline. Try again in a moment, or check a local forecast.'),
          F.seasons.get(season).id === 'spring' ? h('p', { class: 'fx-muted' }, pollenGuidance(F.now().getMonth(), loc.lat < 0).detail) : null)));
        return;
      }
      cfg.widgets.forEach(function (name) { if (W[name]) out.appendChild(W[name](model, ctx || { air: air })); });
    }

    function load(opts) {
      var ticket = ++busy;
      say('Loading the forecast…');
      var wanted = loc;
      Promise.all([fetchWeather(wanted, units), cfg.widgets.indexOf('pollen') >= 0 || cfg.widgets.indexOf('air') >= 0 ? fetchAir(wanted) : Promise.resolve(null)]).then(function (r) {
        if (ticket !== busy) return;
        model = r[0]; air = r[1];
        if (!model.mock) F.store.set(CACHE_KEY, model);
        say(model.mock ? 'Showing test data (' + model.mock + ').' : '', model.mock ? 'warn' : '');
        draw({ air: air });
      }, function () {
        if (ticket !== busy) return;
        var cached = F.store.get(CACHE_KEY, null);
        if (cached && cached.hourly && cached.units === units) {
          model = cached; model.stale = true;
          var mins = Math.round((Date.now() - cached.fetchedAt) / 60000);
          say('Offline. Showing the last forecast for ' + cached.loc.label + ' from ' + (mins < 90 ? mins + ' minutes ago' : Math.round(mins / 60) + ' hours ago') + '.', 'warn');
          loc = cached.loc; setPlace();
        } else { model = null; say('Could not reach the weather service. You can still use the moon phase below.', 'warn'); }
        draw({ air: null });
      });
    }

    function pick(l) { loc = { lat: l.lat, lon: l.lon, label: l.label }; F.geo.save(loc); setPlace(); results.hidden = true; searchInput.value = ''; load(); }
    var doSearch = F.dom.debounce(function () {
      var q = searchInput.value.trim();
      if (q.length < 2) { results.hidden = true; return; }
      F.geo.search(q).then(function (list) {
        results.innerHTML = '';
        if (!list.length) results.appendChild(h('li', { class: 'fx-muted' }, 'No matching places'));
        list.forEach(function (l) { results.appendChild(h('li', null, h('button', { type: 'button', onclick: function () { pick(l); } }, l.label))); });
        results.hidden = false;
      }, function () { results.innerHTML = ''; results.appendChild(h('li', { class: 'fx-muted' }, 'City search needs a connection')); results.hidden = false; });
    }, 300);
    searchInput.addEventListener('input', doSearch);
    document.addEventListener('click', function (e) { if (!bar.contains(e.target)) results.hidden = true; });
    geoBtn.addEventListener('click', function () {
      say('Finding you…');
      F.geo.get({ ask: true, season: season }).then(function (l) {
        if (l.source === 'device') { loc = l; setPlace(); load(); }
        else { say('Location is not available here, so showing ' + l.label + '. Use the search box to pick your city.', 'warn'); }
      });
    });
    unitBtn.addEventListener('click', function () { units = units === 'imperial' ? 'metric' : 'imperial'; F.store.set(UNITS_KEY, units); setUnitLabel(); load(); });

    setUnitLabel();
    F.geo.get({ season: season }).then(function (l) { loc = l; setPlace(); load(); });
    return { reload: load };
  }

  global.FestoWeather = { mount: mount, uvScale: uvScale, moonPhase: moonPhase, _pure: { uvScale: uvScale, moonPhase: moonPhase, beaufort: beaufort, compass: compass, wmo: wmo, spookScore: spookScore, lightShowScore: lightShowScore, pollenGuidance: pollenGuidance, tempColor: tempColor } };
})(window);
