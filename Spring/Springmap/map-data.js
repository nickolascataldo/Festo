/* Garden Trails map: categories and featured places. Coordinates were checked against OpenStreetMap (Nominatim).
   Gardens, trailheads, bird hides and picnic spots near you come from "Search this area" (OpenStreetMap). */
window.SPRING_MAP = {
  season: 'spring',
  storageKey: 'festo_spring_map',
  tiles: 'light',
  allowOsm: true,
  center: { lat: 39.5, lon: -96, zoom: 4 },
  filterTitle: 'Filters',
  categories: [
    { id: 'gardens', label: 'Gardens', icon: 'seedling', color: '#e8758f',
      osm: [{ k: 'leisure', v: 'garden', name: 'botanic|arboretum|garden|conservatory' }, { k: 'tourism', v: 'attraction|yes', name: 'botanic|arboretum|conservatory' }] },
    { id: 'blooms', label: 'Blooms', icon: 'spa', color: '#d6336c',
      osm: [{ k: 'tourism', v: 'attraction|yes', name: 'blossom|tulip|bluebonnet|wildflower|poppy|cherry' }] },
    { id: 'trails', label: 'Trails', icon: 'person-hiking', color: '#5b8c5a', osm: [{ k: 'highway', v: 'trailhead' }] },
    { id: 'birds', label: 'Bird Watching', icon: 'dove', color: '#3a86c8', osm: [{ k: 'leisure', v: 'bird_hide' }] },
    { id: 'picnic', label: 'Picnic Spots', icon: 'utensils', color: '#c9a24d', osm: [{ k: 'tourism', v: 'picnic_site' }, { k: 'leisure', v: 'picnic_table|park', name: 'picnic' }] }
  ],
  places: [
    { id: 'brooklynbg', cat: 'gardens', name: 'Brooklyn Botanic Garden', lat: 40.6677, lon: -73.9636, address: 'Brooklyn, NY', desc: 'A compact garden famous for its cherry blossom walk each spring.' },
    { id: 'descanso', cat: 'gardens', name: 'Descanso Gardens', lat: 34.2015, lon: -118.2121, address: 'La Cañada Flintridge, CA', desc: 'Camellias, a rose garden and a Japanese garden in the foothills.' },
    { id: 'longwood', cat: 'gardens', name: 'Longwood Gardens', lat: 39.8714, lon: -75.6748, address: 'Kennett Square, PA', desc: 'Large display gardens, fountains and conservatories.' },
    { id: 'mobot', cat: 'gardens', name: 'Missouri Botanical Garden', lat: 38.6134, lon: -90.2594, address: 'St. Louis, MO', desc: 'One of the oldest botanical gardens in the U.S., with a Japanese garden.' },
    { id: 'butchart', cat: 'gardens', name: 'The Butchart Gardens', lat: 48.5653, lon: -123.4696, address: 'Brentwood Bay, BC', desc: 'Spring bulbs, sunken gardens and a long tradition of flower displays.', note: 'Across the border in Canada.' },
    { id: 'tidal', cat: 'blooms', name: 'Tidal Basin Cherry Blossoms', lat: 38.8836, lon: -77.0379, address: 'Washington, DC', desc: 'Cherry trees circle the basin in a famous late-March bloom.', note: 'Peak bloom shifts each year.' },
    { id: 'laconner', cat: 'blooms', name: 'Skagit Valley Tulips', lat: 48.3919, lon: -122.4942, address: 'La Conner, WA', desc: 'Fields of tulips and daffodils each April.', note: 'Peak dates shift with the weather.' },
    { id: 'willowcity', cat: 'blooms', name: 'Willow City Loop', lat: 30.4008, lon: -98.7014, address: 'Hill Country, TX', desc: 'A scenic drive known for bluebonnets and other wildflowers in spring.', note: 'Mostly private land. Stay at the roadside.' },
    { id: 'mageemarsh', cat: 'birds', name: 'Magee Marsh Wildlife Area', lat: 41.6142, lon: -83.1721, address: 'Lake Erie, OH', desc: 'A boardwalk through woods that fill with migrating warblers in May.' },
    { id: 'centralpark', cat: 'picnic', name: 'Central Park', lat: 40.7828, lon: -73.9654, address: 'New York, NY', desc: 'Spread a blanket on the Great Lawn or in Sheep Meadow.' },
    { id: 'ggpark', cat: 'picnic', name: 'Golden Gate Park', lat: 37.7694, lon: -122.4822, address: 'San Francisco, CA', desc: 'Meadows, gardens and a Japanese Tea Garden to explore.' },
    { id: 'brightangel', cat: 'trails', name: 'Bright Angel Trailhead', lat: 36.0573, lon: -112.1436, address: 'Grand Canyon, AZ', desc: 'Spring is a comfortable season for the first miles of the canyon.', note: 'Carry water; check the trail status.' }
  ]
};
