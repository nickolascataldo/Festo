/* Christmas Activity Wheel: ten wedges, from the brief's five (gingerbread, light crawl, ice skating,
   cocoa flight, tree tagging) plus five more. Map-related wedges deep-link into the Light Radar. */
window.CHRISTMAS_WHEEL = {
  season: 'christmas',
  saveKey: 'festo_christmas_plan',
  eyebrow: 'Holiday indecision, solved',
  headline: 'Spin for Tonight',
  emptyIcon: 'gift',
  ariaLabel: 'Holiday activity wheel',
  bulbA: '#ffd24a', bulbB: '#ffffff', rimA: '#9a2230', rimB: '#5e0f19',
  segments: [
    { id: 'gingerbread', label: 'Gingerbread', icon: 'house-chimney', color: '#b3202e', pool: 'gingerbread' },
    { id: 'lights', label: 'Light Crawl', icon: 'lightbulb', color: '#1f7a5a', pool: 'lights' },
    { id: 'skating', label: 'Ice Skating', icon: 'person-skating', color: '#3a86c8', pool: 'skating' },
    { id: 'cocoa', label: 'Cocoa Flight', icon: 'mug-hot', color: '#8a4b2a', pool: 'cocoa' },
    { id: 'trees', label: 'Tree Tagging', icon: 'tree', color: '#14705a', pool: 'trees' },
    { id: 'cookies', label: 'Cookie Swap', icon: 'cookie-bite', color: '#c98a1b', pool: 'cookies' },
    { id: 'sledding', label: 'Sledding', icon: 'snowflake', color: '#2c6aa0', pool: 'sledding' },
    { id: 'santa', label: 'Santa Visit', icon: 'gift', color: '#d62839', pool: 'santa' },
    { id: 'movies', label: 'Movie Night', icon: 'film', color: '#5b3a8c', pool: 'movies' },
    { id: 'carols', label: 'Craft & Carol', icon: 'music', color: '#1b5e43', pool: 'carols' }
  ],
  pools: {
    gingerbread: [
      { title: 'Build a Gingerbread House', blurb: 'Bake the walls the night before so they are firm, then decorate together.', steps: ['Bake the pieces and let them cool overnight.', 'Glue with thick royal icing; prop the walls with cans until set.', 'Decorate with candy, pretzel fences and a coconut-snow roof.'], cta: [{ label: 'Kits in the shop', module: 'store', query: '', icon: 'bag-shopping', ghost: true }] },
      { title: 'Gingerbread Village Contest', blurb: 'Everyone builds one house. Judges award Tallest, Tastiest and Most Likely to Collapse.' },
      { title: 'Graham-Cracker Houses', blurb: 'The quick version for kids: graham crackers, icing, candy and no oven.' },
      { title: 'Gingerbread People Decorating', blurb: 'Bake cutouts and set up an icing, sprinkles and candy button bar.' }
    ],
    lights: [
      { title: 'Neighborhood Light Crawl', blurb: 'Pick a loop, bring cocoa in a thermos, and rate every house out of ten.', cta: [{ label: 'Find light displays', module: 'map', query: 'cat=lights&near=me', icon: 'location-dot' }] },
      { title: 'Drive-Through Light Show', blurb: 'Book a timed ticket, turn the radio to the show station and keep the windows cracked for the smell of pine.', cta: [{ label: 'Find light displays', module: 'map', query: 'cat=lights&near=me', icon: 'location-dot' }] },
      { title: 'Walk the Botanical Lights', blurb: 'Gardens and zoos often run lantern trails after dark. Dress warmly and go on a weeknight.', cta: [{ label: 'Find light displays', module: 'map', query: 'cat=lights&near=me', icon: 'location-dot' }] },
      { title: 'Light Bulb Bingo', blurb: 'Make a card of things to spot: inflatable snowman, all-blue house, a house that blinks to music.' }
    ],
    skating: [
      { title: 'Outdoor Rink Evening', blurb: 'Find a rink with a fire pit or hot-drinks stand and stay for the second session.', cta: [{ label: 'Find ice rinks', module: 'map', query: 'cat=rinks&near=me', icon: 'location-dot' }] },
      { title: 'Skate and Cocoa Date', blurb: 'One lap per mug of cocoa. Loser carries the skates.', cta: [{ label: 'Find ice rinks', module: 'map', query: 'cat=rinks&near=me', icon: 'location-dot' }] },
      { title: 'Learn to Skate', blurb: 'Take a beginner lesson at your nearest rink. Helmets are a good idea.', cta: [{ label: 'Find ice rinks', module: 'map', query: 'cat=rinks&near=me', icon: 'location-dot' }] },
      { title: 'Rink-Side Photo Walk', blurb: 'Skip the skates and photograph the lights, the skaters and the steam.' }
    ],
    cocoa: [
      { title: 'Hot Cocoa Flight', blurb: 'Make four cocoas (classic, mint, spiced, white) and taste them in small cups.', steps: ['Heat milk gently; whisk in cocoa and a pinch of salt.', 'Split into four pans and flavor each.', 'Rate on a scorecard and crown a winner.'] },
      { title: 'Cocoa Bar', blurb: 'A pot of cocoa with toppings: marshmallows, crushed candy canes, caramel, whipped cream.' },
      { title: 'Cocoa Bomb Night', blurb: 'Melt chocolate into molds, fill with cocoa mix and marshmallows, and seal the halves.' },
      { title: 'Around the World Cocoa', blurb: 'Try the Spanish thick style, Mexican with cinnamon and the Italian cioccolata calda.' }
    ],
    trees: [
      { title: 'Tag Your Tree at a Farm', blurb: 'Visit a cut-your-own farm, tag the one you like and come back for pick-up weekend.', cta: [{ label: 'Find tree farms', module: 'map', query: 'cat=trees&near=me', icon: 'location-dot' }] },
      { title: 'Measure Before You Go', blurb: 'Bring a tape measure for the ceiling height and a rope for the roof.', cta: [{ label: 'Find tree farms', module: 'map', query: 'cat=trees&near=me', icon: 'location-dot' }] },
      { title: 'Tree Farm Cider Stop', blurb: 'Many farms sell cider and donuts. Make a morning of it.', cta: [{ label: 'Find tree farms', module: 'map', query: 'cat=trees&near=me', icon: 'location-dot' }] },
      { title: 'Trim the Tree Party', blurb: 'Hand everyone an ornament and one rule: it has to have a story.' }
    ],
    cookies: [
      { title: 'Cookie Swap', blurb: 'Each guest bakes one dozen of one kind and goes home with a mixed box.', steps: ['Invite six to ten friends and assign a dozen each.', 'Set out tins and labels, including allergens.', 'Taste, swap and vote on a favorite.'] },
      { title: 'Sugar Cookie Decorating', blurb: 'Rolled dough, a stack of cutters and three icing colors.' },
      { title: 'Cookies for the Neighbors', blurb: 'Bake a batch, plate a few and deliver them with a card.' },
      { title: 'Try a New Recipe', blurb: 'Pick one you have never baked: shortbread, snickerdoodles, thumbprints.' }
    ],
    sledding: [
      { title: 'Find a Sledding Hill', blurb: 'Look for gentle slopes with a long run-out and no trees or roads below.', cta: [{ label: 'Find sledding hills', module: 'map', query: 'cat=sled&near=me', icon: 'location-dot' }] },
      { title: 'Snow Tubing Day', blurb: 'Lifts take you back up, so the kids do the work of ten runs.', cta: [{ label: 'Find ski and snow areas', module: 'map', query: 'cat=ski&near=me', icon: 'location-dot' }] },
      { title: 'Backyard Snow Fort', blurb: 'Pack blocks in a loaf pan and stack them like bricks.' },
      { title: 'Snow Angel Contest', blurb: 'Judged on wingspan, symmetry and sound effects.' }
    ],
    santa: [
      { title: 'Meet Santa', blurb: 'Book a reserved slot at a mall or heritage railway so you skip the line.', cta: [{ label: 'Find Santa visits', module: 'map', query: 'cat=santa&near=me', icon: 'location-dot' }] },
      { title: 'Write Letters to the North Pole', blurb: 'Post them early; some places send a reply if you include a return address.' },
      { title: 'Polar Express Night', blurb: 'Pajamas, hot chocolate and a train ride, if there is a holiday railway near you.', cta: [{ label: 'Find Santa visits', module: 'map', query: 'cat=santa&near=me', icon: 'location-dot' }] }
    ],
    movies: [
      { title: 'Holiday Movie Marathon', blurb: 'Pick three: a classic, a comedy and a cozy romance. Blankets mandatory.', cta: [{ label: 'Pick a movie', module: 'movies', icon: 'film' }] },
      { title: 'Claymation Night', blurb: 'Rankin/Bass specials and stop-motion favorites for the whole family.', cta: [{ label: 'Pick a movie', module: 'movies', icon: 'film' }] },
      { title: 'Watch Party with a Snack Menu', blurb: 'Pair each film with a snack: popcorn tin, candy cane mochas, gingerbread bites.', cta: [{ label: 'Pick a movie', module: 'movies', icon: 'film' }] }
    ],
    carols: [
      { title: 'Carol Sing-Along', blurb: 'Print the lyrics and stand in a circle with candles (battery ones for little hands).', cta: [{ label: 'Open the music', module: 'music', icon: 'headphones' }] },
      { title: 'Paper Snowflake Night', blurb: 'Folded paper, sharp scissors and a window to tape them to.' },
      { title: 'Ornament Painting', blurb: 'Plain glass or wooden ornaments, paint pens and a date on the back.', cta: [{ label: 'Craft kits in the shop', module: 'store', icon: 'bag-shopping', ghost: true }] },
      { title: 'Make Wrapping Paper', blurb: 'Brown paper, stamps from cut potatoes and green and red ink.' }
    ]
  }
};
