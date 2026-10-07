/* Season registry: routes, module list, tab bar choices, countdown spec, default city, real counts.
   Module paths are relative to the season folder. The crawler (--data) verifies `counts` against the data files.
   Icons are Font Awesome names: no emoji anywhere in the UI. */
(function () {
  'use strict';
  var F = window.Festo;
  var JAKARTA = 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800';

  /* The hub (index.html) is a pseudo-season so it can use the same shell: its four modules are the seasons. */
  F.registerSeason('hub', {
    name: 'Festo', short: 'Home', icon: 'compass', fab: 'compass', root: '',
    landing: 'index.html',
    fontsQuery: 'family=Cinzel:wght@600;700;800&' + JAKARTA,
    tabs: ['spring', 'summer', 'halloween', 'christmas'],
    location: { lat: 38.8895, lon: -77.0353, label: 'Washington, DC' },
    countdown: { mode: 'date', month: 10, day: 31, label: 'Halloween', todayLabel: "It's Halloween!" },
    counts: { books: 2000, films: 2737 },
    modules: [
      { id: 'spring', label: 'Spring', title: 'Spring Haven', icon: 'fa-seedling', path: 'Spring/SpringLanding/SpringLanding.html' },
      { id: 'summer', label: 'Summer', title: 'Summer Solstice', icon: 'fa-sun', path: 'Summer/Summer Landing/SummerLanding.html' },
      { id: 'halloween', label: 'Halloween', title: 'Halloween Hollow', icon: 'fa-ghost', path: 'Halloween/Halloween Landing page/HalloweenLanding.html' },
      { id: 'christmas', label: 'Christmas', title: 'Christmas Sanctuary', icon: 'fa-tree', path: 'Christmas/Christmas Landing/ChristmasLanding.html' }
    ]
  });

  F.registerSeason('halloween', {
    name: 'Halloween Hollow', short: 'Home', icon: 'ghost', fab: 'ghost', root: 'Halloween',
    landing: 'Halloween Landing page/HalloweenLanding.html',
    fontsQuery: 'family=Creepster&' + JAKARTA,
    tabs: ['map', 'store', 'music'],
    location: { lat: 42.5195, lon: -70.8967, label: 'Salem, MA' },
    countdown: { mode: 'date', month: 10, day: 31, hour: 23, minute: 59, second: 59, label: 'Halloween', todayLabel: "It's Halloween!" },
    counts: { books: 500, films: 601 },
    modules: [
      { id: 'books', label: 'Reads', title: 'Spooky Reads', icon: 'fa-book-skull', path: 'Spooky Reads/spookyreads.html' },
      { id: 'movies', label: 'Cinema', title: 'Cinema', icon: 'fa-film', path: 'Halloween Movie List/HalloweenMovie.html' },
      { id: 'wheel', label: 'Wheel', title: 'Spin Wheel', icon: 'fa-dharmachakra', path: 'ActivityWheel/ActivityWheel.html' },
      { id: 'pumpkin', label: 'Carving', title: 'Pumpkin Studio', icon: 'fa-wand-magic-sparkles', path: 'Pumpkin Carving Game/pumpkincarvinggame.html' },
      { id: 'map', label: 'Map', title: 'Spectral Map', icon: 'fa-map-location-dot', path: 'Spectral Map/spectralmap.html' },
      { id: 'store', label: 'Shop', title: 'Coven Shop', icon: 'fa-bag-shopping', path: 'Halloween Store/halloweenstore.html' },
      { id: 'music', label: 'Music', title: 'Sound Vault', icon: 'fa-headphones', path: 'Halloween Music/halloweenmusic.html' },
      { id: 'weather', label: 'Weather', title: 'Moon & Mist', icon: 'fa-moon', path: 'Weather/Weather.html' }
    ]
  });

  F.registerSeason('christmas', {
    name: 'Christmas Sanctuary', short: 'Home', icon: 'tree', fab: 'gift', root: 'Christmas',
    landing: 'Christmas Landing/ChristmasLanding.html',
    fontsQuery: 'family=Playfair+Display:ital,wght@0,600;0,800;1,600&' + JAKARTA,
    tabs: ['map', 'store', 'music'],
    location: { lat: 40.7128, lon: -74.006, label: 'New York, NY' },
    countdown: { mode: 'date', month: 12, day: 25, hour: 0, minute: 0, second: 0, label: 'Christmas', todayLabel: 'Merry Christmas!' },
    counts: { books: 500, films: 1020 },
    modules: [
      { id: 'books', label: 'Reads', title: 'Fireside Reads', icon: 'fa-book-open', path: 'Book List/ChristmasBook.html' },
      { id: 'movies', label: 'Cinema', title: 'Cinema', icon: 'fa-film', path: 'Movie List/ChristmasMovie.html' },
      { id: 'wheel', label: 'Wheel', title: 'Spin Wheel', icon: 'fa-dharmachakra', path: 'ActivityWheel/ActivityWheel.html' },
      { id: 'workshop', label: 'Workshop', title: "Santa's Workshop", icon: 'fa-gift', path: 'Christmas Game/ChristmasGame.html' },
      { id: 'map', label: 'Radar', title: 'Light Radar', icon: 'fa-map-location-dot', path: 'Holiday Map/HolidayMap.html' },
      { id: 'store', label: 'Shop', title: 'Holiday Shop', icon: 'fa-bag-shopping', path: 'Store/Store.html' },
      { id: 'music', label: 'Music', title: 'Hearth Music', icon: 'fa-headphones', path: 'Holiday Music/HolidayMusic.html' },
      { id: 'weather', label: 'Weather', title: 'Snow & Frost', icon: 'fa-snowflake', path: 'Weather Alert/Weather.html' }
    ]
  });

  F.registerSeason('summer', {
    name: 'Summer Solstice', short: 'Home', icon: 'sun', fab: 'sun', root: 'Summer',
    landing: 'Summer Landing/SummerLanding.html',
    fontsQuery: 'family=Bebas+Neue&' + JAKARTA,
    tabs: ['map', 'store', 'weather'],
    location: { lat: 34.0195, lon: -118.4912, label: 'Santa Monica, CA' },
    countdown: { mode: 'window', start: { month: 6, day: 21 }, end: { month: 9, day: 22 }, label: 'Summer' },
    counts: { books: 500, films: 625 },
    modules: [
      { id: 'books', label: 'Reads', title: 'Beach Reads', icon: 'fa-umbrella-beach', path: 'Book List/SummerBook.html' },
      { id: 'movies', label: 'Cinema', title: 'Cinema', icon: 'fa-film', path: 'Movie List/SummerMovie.html' },
      { id: 'wheel', label: 'Wheel', title: 'Adventure Wheel', icon: 'fa-dharmachakra', path: 'ActivityWheel/ActivityWheel.html' },
      { id: 'game', label: 'Arcade', title: 'Summer Arcade', icon: 'fa-gamepad', path: 'Game/Summer.html' },
      { id: 'map', label: 'Map', title: 'Summer Map', icon: 'fa-map-location-dot', path: 'Summer Map/SummerMap.html' },
      { id: 'store', label: 'Shop', title: 'Summer Shop', icon: 'fa-bag-shopping', path: 'Store/SummerStore.html' },
      { id: 'music', label: 'Beats', title: 'Summer Beats', icon: 'fa-headphones', path: 'Summer Beats/SummerBeats.html' },
      { id: 'weather', label: 'Sun', title: 'Sun & Weather', icon: 'fa-temperature-three-quarters', path: 'Weather/Weather.html' }
    ]
  });

  F.registerSeason('spring', {
    name: 'Spring Haven', short: 'Home', icon: 'seedling', fab: 'seedling', root: 'Spring',
    landing: 'SpringLanding/SpringLanding.html',
    fontsQuery: 'family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&' + JAKARTA,
    tabs: ['map', 'store', 'music'],
    location: { lat: 38.8895, lon: -77.0353, label: 'Washington, DC' },
    countdown: { mode: 'window', start: { month: 3, day: 20 }, end: { month: 6, day: 20 }, label: 'Spring' },
    counts: { books: 500, films: 491 },
    modules: [
      { id: 'books', label: 'Reads', title: 'Spring Reads', icon: 'fa-book-open', path: 'Book List/SpringBook.html' },
      { id: 'movies', label: 'Cinema', title: 'Cinema', icon: 'fa-film', path: 'Movie list/SpringMovie.html' },
      { id: 'wheel', label: 'Wheel', title: 'Spin Wheel', icon: 'fa-dharmachakra', path: 'Activity Wheel/Activitywheel.html' },
      { id: 'map', label: 'Trails', title: 'Garden Trails', icon: 'fa-map-location-dot', path: 'Springmap/Springmap.html' },
      { id: 'store', label: 'Shop', title: 'Garden Shop', icon: 'fa-bag-shopping', path: 'Store/Store.html' },
      { id: 'music', label: 'Music', title: 'Meadow Music', icon: 'fa-headphones', path: 'Music area/Musicarea.html' },
      { id: 'weather', label: 'Weather', title: 'Pollen & Rain', icon: 'fa-cloud-sun', path: 'Weather/Weather.html' }
    ]
  });
})();
