/* Spectral Map: categories and featured places.
   Coordinates were checked against OpenStreetMap (Nominatim) at build time.
   Spirit Halloween shops are seasonal pop-ups, so they are NOT hard-coded: use "Search this area" (OpenStreetMap)
   or the official locator. Descriptions are deliberately general; hours, tours and events change every year. */
window.HALLOWEEN_MAP = {
  season: 'halloween',
  storageKey: 'festo_halloween_map',
  tiles: 'dark',
  allowOsm: true,
  center: { lat: 39.5, lon: -96, zoom: 4 },
  filterTitle: 'Filters',
  categories: [
    { id: 'paranormal', label: 'Paranormal Investigations', icon: 'ghost', color: '#ff6f00',
      osm: [{ k: 'tourism', v: 'attraction|museum|information|yes', name: 'ghost|haunted|paranormal' }] },
    { id: 'haunted', label: 'Haunted Houses & Scream Parks', icon: 'house-chimney-crack', color: '#e63946',
      osm: [{ k: 'tourism', v: 'attraction|theme_park|yes', name: 'haunt|fright|scream|terror|nightmare|fear farm' }] },
    { id: 'spirit', label: 'Spirit Halloween', icon: 'masks-theater', color: '#9d4edd',
      osm: [{ k: 'shop', v: 'costume|party|seasonal|variety_store|department_store|clothes|yes', name: 'spirit halloween' }] },
    { id: 'historic', label: 'Historic Sites', icon: 'landmark', color: '#94a3b8',
      osm: [{ k: 'historic', v: 'castle|manor|ruins|fort' }, { k: 'tourism', v: 'museum', name: 'witch|poe|ghost|history' }] },
    { id: 'graveyard', label: 'Graveyards & Cemeteries', icon: 'cross', color: '#3ddc84',
      osm: [{ k: 'landuse', v: 'cemetery' }, { k: 'amenity', v: 'grave_yard' }] }
  ],
  places: [
    /* ---- Historic sites ---- */
    { id: 'witch-house', cat: 'historic', name: 'The Witch House (Jonathan Corwin House)', lat: 42.5216, lon: -70.8989, address: 'Essex Street, Salem, MA', desc: 'The only building still standing in Salem with a direct link to the 1692 witch trials.', note: 'Hours and tours change by season; check before you go.' },
    { id: 'witch-museum', cat: 'historic', name: 'Salem Witch Museum', lat: 42.5237, lon: -70.8912, address: 'Washington Square, Salem, MA', desc: 'A museum that tells the story of the 1692 Salem witch trials.', note: 'Busy through October. Book ahead when you can.' },
    { id: 'gallows-hill', cat: 'historic', name: 'Gallows Hill Park', lat: 42.5160, lon: -70.9129, address: 'Salem, MA', desc: 'Traditionally linked with the 1692 executions, though historians now place them at nearby Proctor\'s Ledge.', note: 'A public park. Visit in daylight.' },
    { id: 'salem-memorial', cat: 'historic', name: 'Salem Witch Trials Memorial', lat: 42.5208, lon: -70.8921, address: 'Charter Street, Salem, MA', desc: 'A quiet memorial with a stone bench for each of the twenty people executed in 1692.' },
    { id: 'old-dutch-church', cat: 'historic', name: 'Old Dutch Church of Sleepy Hollow', lat: 41.0904, lon: -73.8619, address: 'North Broadway, Sleepy Hollow, NY', desc: 'A church dating to 1685 and made famous by Washington Irving\'s "The Legend of Sleepy Hollow".' },
    { id: 'poe-richmond', cat: 'historic', name: 'Edgar Allan Poe Museum', lat: 37.5322, lon: -77.4261, address: 'East Main Street, Richmond, VA', desc: 'A museum devoted to Poe in the city where he grew up.' },
    { id: 'poe-philly', cat: 'historic', name: 'Edgar Allan Poe National Historic Site', lat: 39.962, lon: -75.15, address: 'Philadelphia, PA', desc: 'The house where Poe lived in the 1840s, run by the National Park Service.' },
    { id: 'poe-baltimore', cat: 'historic', name: 'Edgar Allan Poe House', lat: 39.2913, lon: -76.6331, address: 'North Amity Street, Baltimore, MD', desc: 'A small row house where Poe lived in the 1830s.' },
    { id: 'alcatraz', cat: 'historic', name: 'Alcatraz Island', lat: 37.8267, lon: -122.4228, address: 'San Francisco, CA', desc: 'The former island prison; evening tours are offered in some seasons.', note: 'Reach it by ferry. Reserve tickets well ahead.' },
    /* ---- Graveyards ---- */
    { id: 'old-burying-point', cat: 'graveyard', name: 'Charter Street Cemetery (Old Burying Point)', lat: 42.5204, lon: -70.8922, address: 'Charter Street, Salem, MA', desc: 'Salem\'s oldest burial ground, dating to 1637. Includes the grave of a judge from the witch trials.', note: 'Open during the day. Stay on the paths.' },
    { id: 'sleepy-hollow-ny', cat: 'graveyard', name: 'Sleepy Hollow Cemetery (New York)', lat: 41.0954, lon: -73.8603, address: 'Sleepy Hollow, NY', desc: 'Next to the Old Dutch Church. Washington Irving is buried here.' },
    { id: 'sleepy-hollow-concord', cat: 'graveyard', name: 'Sleepy Hollow Cemetery (Concord)', lat: 42.464, lon: -71.343, address: 'Concord, MA', desc: 'Authors Ridge, where Emerson, Thoreau, Hawthorne and the Alcotts are buried.' },
    { id: 'lafayette-1', cat: 'graveyard', name: 'Lafayette Cemetery No. 1', lat: 29.9288, lon: -90.0854, address: 'Garden District, New Orleans, LA', desc: 'A cemetery from the 1830s with above-ground tombs, in the Garden District.' },
    { id: 'st-louis-1', cat: 'graveyard', name: 'St. Louis Cemetery No. 1', lat: 29.9594, lon: -90.0715, address: 'New Orleans, LA', desc: 'The oldest surviving cemetery in New Orleans, famous for its above-ground tombs.', note: 'Entry is usually by guided tour only. Check current rules.' },
    { id: 'bonaventure', cat: 'graveyard', name: 'Bonaventure Cemetery', lat: 32.0443, lon: -81.0468, address: 'Savannah, GA', desc: 'A Savannah cemetery under live oaks draped in Spanish moss.' },
    { id: 'laurel-hill', cat: 'graveyard', name: 'Laurel Hill Cemetery', lat: 40.0017, lon: -75.1886, address: 'Philadelphia, PA', desc: 'A Victorian garden cemetery from 1836 above the Schuylkill River.' },
    { id: 'green-wood', cat: 'graveyard', name: 'Green-Wood Cemetery', lat: 40.6522, lon: -73.9911, address: 'Brooklyn, NY', desc: 'A National Historic Landmark cemetery founded in 1838, with sweeping hills and Gothic gates.' },
    { id: 'mount-auburn', cat: 'graveyard', name: 'Mount Auburn Cemetery', lat: 42.3707, lon: -71.144, address: 'Cambridge and Watertown, MA', desc: 'Often described as America\'s first garden cemetery (1831). Also a bird-watching hotspot.' },
    /* ---- Paranormal ---- */
    { id: 'stanley', cat: 'paranormal', name: 'The Stanley Hotel', lat: 40.383, lon: -105.5194, address: 'Estes Park, CO', desc: 'A 1909 hotel said to have inspired Stephen King\'s "The Shining". Offers ghost tours.', note: 'Reserve tours in advance. Tour schedules change.' },
    { id: 'waverly', cat: 'paranormal', name: 'Waverly Hills Sanatorium', lat: 38.1303, lon: -85.8409, address: 'Louisville, KY', desc: 'A former tuberculosis hospital that now offers history tours and seasonal events.' },
    { id: 'eastern-state', cat: 'paranormal', name: 'Eastern State Penitentiary', lat: 39.9683, lon: -75.1727, address: 'Philadelphia, PA', desc: 'A ruined prison that opened in 1829. Runs a well-known fall event called Halloween Nights.', note: 'The autumn event needs its own tickets. Check the official site.' },
    { id: 'queen-mary', cat: 'paranormal', name: 'RMS Queen Mary', lat: 33.7537, lon: -118.1922, address: 'Long Beach, CA', desc: 'A retired ocean liner that is permanently docked, known for ghost tours and seasonal haunted events.' },
    { id: 'wv-pen', cat: 'paranormal', name: 'West Virginia Penitentiary', lat: 39.916, lon: -80.7423, address: 'Moundsville, WV', desc: 'A former prison (1876 to 1995) that offers history and ghost-hunt style tours.' },
    { id: 'lalaurie', cat: 'paranormal', name: 'LaLaurie Mansion (exterior only)', lat: 29.9619, lon: -90.0612, address: 'Royal Street, New Orleans, LA', desc: 'A French Quarter mansion with a grim local legend, popular on walking ghost tours.', note: 'A private residence. View from the sidewalk only.' },
    { id: 'st-aug-light', cat: 'paranormal', name: 'St. Augustine Lighthouse & Museum', lat: 29.8854, lon: -81.2885, address: 'St. Augustine, FL', desc: 'A working lighthouse and museum known for evening ghost tours.' },
    { id: 'winchester', cat: 'paranormal', name: 'Winchester Mystery House', lat: 37.3183, lon: -121.951, address: 'San Jose, CA', desc: 'A sprawling Victorian mansion famous for its odd staircases and doors, with special tours around Halloween.' },
    /* ---- Haunted attractions & big seasonal events ---- */
    { id: 'erebus', cat: 'haunted', name: 'Erebus Haunted Attraction', lat: 42.6363, lon: -83.2907, address: 'Downtown Pontiac, MI', desc: 'A large multi-floor haunted attraction in a former downtown building.', note: 'Open in the autumn only. Check dates and age advice.' },
    { id: 'headless-horseman-hayrides', cat: 'haunted', name: 'Headless Horseman Hayrides & Haunted Houses', lat: 41.8516, lon: -73.9718, address: 'Ulster Park, NY', desc: 'A big seasonal attraction with hayrides, haunted houses and shows in the Hudson Valley.', note: 'Seasonal. Check dates, tickets and age advice.' },
    { id: 'philipsburg', cat: 'haunted', name: 'Philipsburg Manor (Horseman\'s Hollow)', lat: 41.0886, lon: -73.864, address: 'Sleepy Hollow, NY', desc: 'A historic site that hosts a Sleepy Hollow themed fall event.', note: 'Event details change each year. Check the official site.' },
    { id: 'disneyland', cat: 'haunted', name: 'Disneyland (Halloween Time)', lat: 33.8137, lon: -117.9197, address: 'Anaheim, CA', desc: 'The park runs seasonal Halloween decor and the Haunted Mansion Holiday overlay in autumn.', note: 'Park tickets and event dates are set by the park.' },
    { id: 'knotts', cat: 'haunted', name: 'Knott\'s Berry Farm (Scary Farm)', lat: 33.8438, lon: -118.0006, address: 'Buena Park, CA', desc: 'Home of Knott\'s Scary Farm, a long-running Halloween event.', note: 'Event nights need separate tickets and sell out.' },
    { id: 'universal-hollywood', cat: 'haunted', name: 'Universal Studios Hollywood (Halloween Horror Nights)', lat: 34.1392, lon: -118.3544, address: 'Universal City, CA', desc: 'Hosts Halloween Horror Nights with scare houses and scare zones.', note: 'Separate event ticket; intense content.' },
    { id: 'universal-orlando', cat: 'haunted', name: 'Universal Studios Florida (Halloween Horror Nights)', lat: 28.4772, lon: -81.4697, address: 'Orlando, FL', desc: 'Hosts Halloween Horror Nights with scare houses and scare zones.', note: 'Separate event ticket; intense content.' },
    { id: 'busch-tampa', cat: 'haunted', name: 'Busch Gardens Tampa Bay (Howl-O-Scream)', lat: 28.0371, lon: -82.4213, address: 'Tampa, FL', desc: 'Home of the Howl-O-Scream fall event.', note: 'Event dates and tickets vary; check the official site.' },
    { id: 'magic-mountain', cat: 'haunted', name: 'Six Flags Magic Mountain (Fright Fest)', lat: 34.4251, lon: -118.597, address: 'Valencia, CA', desc: 'Hosts the Fright Fest season with haunted mazes and scare zones.', note: 'Check the park for dates and age advice.' }
  ],
  searchLinks: {
    spirit: { label: 'Spirit Halloween near me (Google Maps)', url: 'https://www.google.com/maps/search/Spirit+Halloween' }
  }
};
