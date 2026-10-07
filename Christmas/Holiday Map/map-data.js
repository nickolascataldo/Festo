/* Holiday Light Radar: categories and featured places. Coordinates were checked against OpenStreetMap (Nominatim).
   Most of these are seasonal events, so every card says to check dates. Tree farms, sledding hills, rinks and
   light displays near you come from "Search this area" (OpenStreetMap). */
window.CHRISTMAS_MAP = {
  season: 'christmas',
  storageKey: 'festo_christmas_map',
  tiles: 'light',

  allowOsm: true,
  center: { lat: 39.5, lon: -96, zoom: 4 },
  filterTitle: 'Filters',
  categories: [
    { id: 'lights', label: 'Light Displays', icon: 'lightbulb', color: '#e0a526',
      osm: [{ k: 'tourism', v: 'attraction|yes|zoo|theme_park', name: 'lights|luminaria|light show|christmas|holiday' }] },
    { id: 'rinks', label: 'Ice Rinks', icon: 'person-skating', color: '#3a86c8', osm: [{ k: 'leisure', v: 'ice_rink' }] },
    { id: 'ski', label: 'Ski & Snowboard', icon: 'person-skiing', color: '#5c7cfa',
      osm: [{ k: 'landuse', v: 'winter_sports' }, { k: 'sport', v: 'skiing|snowboard' }] },
    { id: 'sled', label: 'Sledding Hills', icon: 'snowflake', color: '#7b8cde',
      osm: [{ k: 'sport', v: 'sledding|tobogganing' }, { k: 'piste:type', v: 'sled' }] },
    { id: 'trees', label: 'Tree Farms', icon: 'tree', color: '#1f7a5a',
      osm: [{ k: 'shop', v: 'garden_centre|farm|christmas|seasonal|florist|yes', name: 'christmas tree|tree farm|tree lot' }, { k: 'landuse', v: 'farmyard|farmland|orchard', name: 'christmas tree|tree farm' }] },
    { id: 'markets', label: 'Festive Markets', icon: 'shop', color: '#e8590c',
      osm: [{ k: 'amenity', v: 'marketplace', name: 'christmas|holiday|christkindl|winter|xmas' }, { k: 'tourism', v: 'attraction|yes', name: 'christmas market|christkindl|holiday market' }] },
    { id: 'santa', label: 'Santa Visits', icon: 'gift', color: '#d62839',
      osm: [{ k: 'tourism', v: 'attraction|theme_park|yes', name: 'santa' }] }
  ],
  places: [
    { id: 'rockefeller', cat: 'lights', name: 'Rockefeller Center Christmas Tree', lat: 40.7593, lon: -73.98, address: 'Midtown Manhattan, New York, NY', desc: 'The famous tree lighting and holiday windows, with an ice rink in the plaza.', note: 'Very crowded in December. Go on a weekday morning.' },
    { id: 'dyker', cat: 'lights', name: 'Dyker Heights Christmas Lights', lat: 40.6205, lon: -74.0117, address: 'Brooklyn, NY', desc: 'A Brooklyn neighborhood known for elaborate house-by-house displays.', note: 'Residential streets. Be quiet and respectful.' },
    { id: 'leavenworth', cat: 'lights', name: 'Leavenworth Village of Lights', lat: 47.5969, lon: -120.6611, address: 'Leavenworth, WA', desc: 'A Bavarian-style village that lights up its streets for the season.' },
    { id: 'longwood', cat: 'lights', name: 'Longwood Gardens Christmas', lat: 39.8714, lon: -75.6748, address: 'Kennett Square, PA', desc: 'Greenhouses and gardens hosting a large holiday light display.', note: 'Timed tickets. Check dates.' },
    { id: 'frankenmuth', cat: 'lights', name: "Bronner's CHRISTmas Wonderland", lat: 43.314, lon: -83.7372, address: 'Frankenmuth, MI', desc: 'A huge year-round Christmas store with a lit outdoor display.' },
    { id: 'gaylord', cat: 'lights', name: 'Gaylord Opryland Christmas', lat: 36.2116, lon: -86.6946, address: 'Nashville, TN', desc: 'A resort that turns its atriums and gardens into a holiday spectacle.', note: 'Event tickets may be required.' },
    { id: 'mobot', cat: 'lights', name: 'Missouri Botanical Garden Garden Glow', lat: 38.6134, lon: -90.2594, address: 'St. Louis, MO', desc: 'A lantern and light display across the botanical garden.', note: 'Timed entry. Check dates.' },
    { id: 'bryant', cat: 'markets', name: 'Bryant Park Winter Village', lat: 40.7538, lon: -73.9835, address: 'Midtown Manhattan, New York, NY', desc: 'A holiday shop village with a free-entry ice rink beside the library.' },
    { id: 'christkind', cat: 'markets', name: 'Christkindlmarket Chicago', lat: 41.8839, lon: -87.6302, address: 'Daley Plaza, Chicago, IL', desc: 'A German-style holiday market with mulled wine, ornaments and gifts.' },
    { id: 'bethlehem', cat: 'markets', name: 'Christkindlmarkt Bethlehem', lat: 40.6179, lon: -75.3787, address: 'Bethlehem, PA', desc: 'Known as Christmas City, with a market and a festive downtown.' },
    { id: 'millennium', cat: 'rinks', name: 'Millennium Park Skating Ribbon', lat: 41.8826, lon: -87.6225, address: 'Chicago, IL', desc: 'A ribbon-shaped rink under the Chicago skyline.' },
    { id: 'rock-rink', cat: 'rinks', name: 'The Rink at Rockefeller Center', lat: 40.7593, lon: -73.98, address: 'Midtown Manhattan, New York, NY', desc: 'Skating beneath the tree and the golden Prometheus statue.', note: 'Reserve a time in advance.' },
    { id: 'stowe', cat: 'ski', name: 'Stowe Mountain Resort', lat: 44.5298, lon: -72.7937, address: 'Stowe, VT', desc: 'A classic Vermont ski area with a charming village nearby.' },
    { id: 'killington', cat: 'ski', name: 'Killington Resort', lat: 43.6112, lon: -72.7926, address: 'Killington, VT', desc: 'One of the largest ski areas in the eastern U.S.' },
    { id: 'parkcity', cat: 'ski', name: 'Park City Mountain', lat: 40.6541, lon: -111.5624, address: 'Park City, UT', desc: 'A big Utah resort next to a historic mining town.' },
    { id: 'vail', cat: 'ski', name: 'Vail', lat: 39.5995, lon: -106.3395, address: 'Vail, CO', desc: 'A major Colorado ski resort with a pedestrian village.' },
    { id: 'macys', cat: 'santa', name: 'Macy\'s Santaland', lat: 40.7509, lon: -73.9893, address: 'Herald Square, New York, NY', desc: 'A long-running Santa visit inside the flagship store.', note: 'Reservations recommended.' },
    { id: 'santaclaus', cat: 'santa', name: 'Santa Claus, Indiana', lat: 38.1184, lon: -86.9204, address: 'Spencer County, IN', desc: 'A town named Santa Claus, with a post office that gets thousands of letters.' },
    { id: 'santasvillage', cat: 'santa', name: 'Santa\'s Village', lat: 44.427, lon: -71.4958, address: 'Jefferson, NH', desc: 'A Christmas-themed family park in the White Mountains.', note: 'Seasonal. Check opening dates.' },
    { id: 'northpole', cat: 'santa', name: 'North Pole, Alaska', lat: 64.751, lon: -147.3493, address: 'Fairbanks area, AK', desc: 'A town that goes all out with candy-cane street lights and a Santa Claus House.' }
  ]
};
