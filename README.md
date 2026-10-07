# Festo

Live site: https://festoapp.com

A four-season lifestyle app: **Spring Haven**, **Summer Solstice**, **Halloween Hollow** and **Christmas Sanctuary**.
Every season has the same eight parts, each one built for that season: a book vault, a cinema vault, an activity wheel,
a game or studio (Halloween pumpkin studio, Christmas workshop, Summer Cone Stack arcade), a map, a shop, music and a
weather page. Plain HTML, CSS and JavaScript. No build step, no framework, no API keys.

## Run it

Open `index.html`, or serve the folder with any static server (`python -m http.server`). Both work. The browser asks
before it shares your location, and falls back to your saved city, a city search, or the season's default city.

## How it is put together

```
index.html + index.js         the hub (pick a season)
<Season>/<Landing>/           a season's home screen
<Season>/<Module>/            one folder per module: a small page, its script, and its data (store-data.js, ...)
shared/
  festo-core.js / .css        the shell (scene, app bar, tab bar, launcher), helpers, storage, fonts, shared styles
  seasons/index.js            the registry: names, routes, module list, tab choices, countdown, default city, counts
  seasons/<season>.facts.js   the daily facts
  scenes/<season>.js          the full-screen vector scene behind each season
  themes/<season>.css         each season's look: colours, type, buttons, cards, tab bar
  navs.js                     the second navigation style for each season
  engines/                    wheel, store, map, weather, music, studio, arcade, pumpkin, landing, covers, vault
tools/                        regen-pages.js (rebuilds the small module pages) and check-site.mjs (link + data audit)
```

Scripts are classic `<script>` tags, so every page also works from `file://`.

### Eight navigation styles

Every season has two, and you can switch between them from the round button at the top right of any page
(or add `?nav=1` / `?nav=2` to a URL). The choice is remembered per season. The book and movie pages keep their own layout.

| Season | Style 1 | Style 2 |
|---|---|---|
| Halloween | Lantern bar with a lit pumpkin button | Crypt Rail: an arched stone rail down the left edge |
| Christmas | Frost Dock: a floating glass bar with a gift button | Garland: ornaments hanging from a pine garland |
| Summer | Tide Bar: a navy bar with a wave crest and a sun button | Sun Dial: a sun that fans its buttons out in two arcs |
| Spring | Petal Dock: a cream bar with a scalloped crest and a flower button | Vine: a leafy vine up the right edge |

## Data and live services

- Books and films are real titles in `Book Data` / `Movie Data` folders. Cards are never invented. Covers come from
  Open Library and Wikipedia, with a title plate when none is found.
- Live services (all free, no key): Open-Meteo (weather, UV, air quality, city search), OpenStreetMap tiles and Overpass
  (places), FOSSGIS routing, Spotify embeds. If one is down the page still shows its built-in data.
- The shops list product **types** with a rough price tier and links to retailer searches. There is no checkout.
- Please respect the [OpenStreetMap tile policy](https://operations.osmfoundation.org/policies/tiles/) if traffic grows.

## Developer switches

Add to any URL: `?festoNow=2026-10-31T12:00` (pretend it is that date), `?festoOffline=1` (no network calls),
`?festoMock=uv11|snow|rain` (fake weather on the weather pages).

## Checks

```
node tools/check-site.mjs          every link, case-exact paths, empty files, font count, viewport
node tools/check-site.mjs --data   also audits the eight book and movie datasets
node tools/regen-pages.js          rebuild the small module pages from tools/pages.json
```
