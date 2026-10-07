/* Summer Map: categories and featured places. Coordinates were checked against OpenStreetMap (Nominatim).
   Beaches, pools, markets and trails near you come from "Search this area" (OpenStreetMap). */
window.SUMMER_MAP = {
  season: 'summer',
  storageKey: 'festo_summer_map',
  tiles: 'light',
  allowOsm: true,
  center: { lat: 39.5, lon: -96, zoom: 4 },
  filterTitle: 'Filters',
  categories: [
    { id: 'beaches', label: 'Beaches', icon: 'umbrella-beach', color: '#00a6c7',
      osm: [{ k: 'natural', v: 'beach' }] },
    { id: 'pools', label: 'Public Pools', icon: 'water-ladder', color: '#2b8cff',
      osm: [{ k: 'leisure', v: 'swimming_pool|water_park', name: 'pool|aquatic|water park|swim|splash' }] },
    { id: 'festivals', label: 'Festivals', icon: 'music', color: '#d6336c',
      osm: [{ k: 'tourism', v: 'attraction|yes', name: 'festival|fair|fest' }] },
    { id: 'markets', label: 'Farmers Markets', icon: 'carrot', color: '#2f9e44',
      osm: [{ k: 'amenity', v: 'marketplace', name: 'farmer|farm|market' }] },
    { id: 'stars', label: 'Stargazing', icon: 'star', color: '#7048e8',
      osm: [{ k: 'tourism', v: 'attraction|viewpoint|yes', name: 'observatory|dark sky|stargaz|planetarium' }] },
    { id: 'trails', label: 'Hiking Trails', icon: 'person-hiking', color: '#e8590c',
      osm: [{ k: 'highway', v: 'trailhead' }] }
  ],
  places: [
    { id: 'santamonica', cat: 'beaches', name: 'Santa Monica State Beach', lat: 34.0171, lon: -118.5062, address: 'Santa Monica, CA', desc: 'A wide, sandy beach beside the pier, bike path and Pacific Park.' },
    { id: 'venice', cat: 'beaches', name: 'Venice Beach', lat: 33.98, lon: -118.4688, address: 'Los Angeles, CA', desc: 'A beach with a famous boardwalk, skate park and street performers.' },
    { id: 'southbeach', cat: 'beaches', name: 'South Beach', lat: 25.7744, lon: -80.1332, address: 'Miami Beach, FL', desc: 'A famous stretch of sand with Art Deco buildings along the shore.' },
    { id: 'vabeach', cat: 'beaches', name: 'Virginia Beach Oceanfront', lat: 36.8489, lon: -75.9748, address: 'Atlantic Avenue, Virginia Beach, VA', desc: 'A long boardwalk and beach, with a summer events calendar.' },
    { id: 'waikiki', cat: 'beaches', name: 'Waikiki Beach', lat: 21.2741, lon: -157.8243, address: 'Honolulu, HI', desc: 'The classic surf-lesson beach in front of Diamond Head.' },
    { id: 'myrtle', cat: 'beaches', name: 'Myrtle Beach', lat: 33.6956, lon: -78.89, address: 'Myrtle Beach, SC', desc: 'A long beach town with a boardwalk, a skywheel and a lot of mini golf.' },
    { id: 'cannon', cat: 'beaches', name: 'Cannon Beach', lat: 45.89, lon: -123.9619, address: 'Cannon Beach, OR', desc: 'A cool-weather beach known for Haystack Rock and tide pools.', note: 'Pack a jacket. The Pacific here is cold.' },
    { id: 'hatteras', cat: 'beaches', name: 'Cape Hatteras Lighthouse', lat: 35.2505, lon: -75.5288, address: 'Outer Banks, NC', desc: 'A black-and-white striped lighthouse above a national seashore.' },
    { id: 'frontier', cat: 'festivals', name: 'Cheyenne Frontier Days', lat: 41.1555, lon: -104.8357, address: 'Cheyenne, WY', desc: 'A long-running rodeo and Western festival held each July.', note: 'Dates vary each year.' },
    { id: 'summerfest', cat: 'festivals', name: 'Summerfest', lat: 43.0309, lon: -87.8996, address: 'Milwaukee, WI', desc: 'A big lakefront music festival with many stages.', note: 'Dates vary each year.' },
    { id: 'lolla', cat: 'festivals', name: 'Lollapalooza', lat: 41.8827, lon: -87.6187, address: 'Grant Park, Chicago, IL', desc: 'A large music festival held in Chicago\'s lakefront park.', note: 'Dates vary each year.' },
    { id: 'fortadams', cat: 'festivals', name: 'Newport Folk and Jazz Festivals', lat: 41.4758, lon: -71.3388, address: 'Fort Adams, Newport, RI', desc: 'Harborside festivals with the sea behind the stage.', note: 'Dates vary each year.' },
    { id: 'pike', cat: 'markets', name: 'Pike Place Market', lat: 47.6094, lon: -122.3414, address: 'Seattle, WA', desc: 'A historic public market with produce, flowers, seafood and crafts.' },
    { id: 'dane', cat: 'markets', name: "Dane County Farmers' Market", lat: 43.0747, lon: -89.3861, address: 'Capitol Square, Madison, WI', desc: 'A Saturday market that circles the state capitol.' },
    { id: 'cherry', cat: 'stars', name: 'Cherry Springs State Park', lat: 41.6628, lon: -77.8222, address: 'Potter County, PA', desc: 'A designated dark-sky park with a night-sky viewing area.' },
    { id: 'bigbend', cat: 'stars', name: 'Big Bend National Park', lat: 29.3332, lon: -103.1943, address: 'Brewster County, TX', desc: 'One of the darkest night skies in the lower 48.' },
    { id: 'joshua', cat: 'stars', name: 'Joshua Tree National Park', lat: 33.8971, lon: -115.9511, address: 'California', desc: 'A desert park with dark skies, strange boulders and Joshua trees.' },
    { id: 'maunakea', cat: 'stars', name: 'Mauna Kea Visitor Information Station', lat: 19.7591, lon: -155.456, address: 'Hawaii Island, HI', desc: 'A stargazing program at high altitude, below the summit observatories.', note: 'High altitude. Check the road and program status.' },
    { id: 'greatbasin', cat: 'stars', name: 'Great Basin National Park', lat: 38.9442, lon: -114.2349, address: 'White Pine County, NV', desc: 'A remote park with very dark skies and astronomy programs.' },
    { id: 'brightangel', cat: 'trails', name: 'Bright Angel Trailhead', lat: 36.0573, lon: -112.1436, address: 'Grand Canyon, AZ', desc: 'The classic descent into the Grand Canyon.', note: 'Summer heat is extreme. Start early and carry water.' },
    { id: 'rainier', cat: 'trails', name: 'Paradise, Mount Rainier', lat: 46.7583, lon: -121.9827, address: 'Mount Rainier National Park, WA', desc: 'Wildflower meadows and trails with big mountain views.' }
  ]
};
