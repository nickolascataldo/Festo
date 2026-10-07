/* Summer Adventure Wheel: ten kinds of summer day. "Today's pick" is the same for everyone on a given date.
   Map-related wedges deep-link into the Summer Map. */
window.SUMMER_WHEEL = {
  season: 'summer',
  saveKey: 'festo_summer_plan',
  daily: true,
  eyebrow: 'No plans yet?',
  headline: 'Spin an Adventure',
  emptyIcon: 'umbrella-beach',
  ariaLabel: 'Summer adventure wheel',
  bulbA: '#ffc933', bulbB: '#ffffff', rimA: '#1a5a80', rimB: '#0b3550',
  segments: [
    { id: 'beach', label: 'Beach Day', icon: 'umbrella-beach', color: '#0a93b8', pool: 'beach' },
    { id: 'splash', label: 'Splash', icon: 'water-ladder', color: '#2b6fd6', pool: 'splash' },
    { id: 'picnic', label: 'Picnic & BBQ', icon: 'drumstick-bite', color: '#e0561f', pool: 'picnic' },
    { id: 'stars', label: 'Stargazing', icon: 'star', color: '#6a45d8', pool: 'stars' },
    { id: 'hike', label: 'Trail & Swim', icon: 'person-hiking', color: '#2f9e44', pool: 'hike' },
    { id: 'frozen', label: 'Frozen Treats', icon: 'ice-cream', color: '#e8478f', pool: 'frozen' },
    { id: 'fest', label: 'Festival Night', icon: 'music', color: '#d6336c', pool: 'fest' },
    { id: 'market', label: 'Market Run', icon: 'carrot', color: '#d98a00', pool: 'market' },
    { id: 'yard', label: 'Backyard Games', icon: 'baseball', color: '#0a8a8a', pool: 'yard' },
    { id: 'sunset', label: 'Sunset Chase', icon: 'sun', color: '#ff5a3c', pool: 'sunset' }
  ],
  pools: {
    beach: [
      { title: 'Sunrise Beach Walk', blurb: 'Go before the crowds, bring a bag for shells and a thermos for coffee.', steps: ['Check the tide table and sunrise time.', 'Bring water, sunscreen and a towel.', 'Walk the tide line and take one photo of anything strange.'], cta: [{ label: 'Find beaches', module: 'map', query: 'cat=beaches&near=me', icon: 'location-dot' }, { label: 'Check UV', module: 'weather', icon: 'sun', ghost: true }] },
      { title: 'Sandcastle Contest', blurb: 'Thirty minutes, a bucket and a spade each. Judges award Tallest, Weirdest and Best Moat.', cta: [{ label: 'Find beaches', module: 'map', query: 'cat=beaches&near=me', icon: 'location-dot' }] },
      { title: 'Tide Pool Explorers', blurb: 'Visit at low tide, step on bare rock only and put every creature back where you found it.', cta: [{ label: 'Find beaches', module: 'map', query: 'cat=beaches&near=me', icon: 'location-dot' }] },
      { title: 'Beach Bonfire Evening', blurb: 'Check whether fires are allowed first. Bring marshmallows and a bucket of water.', cta: [{ label: 'Find beaches', module: 'map', query: 'cat=beaches&near=me', icon: 'location-dot' }] }
    ],
    splash: [
      { title: 'Public Pool Afternoon', blurb: 'Pack a towel, goggles and a lock for the locker. Arrive early on hot weekends.', cta: [{ label: 'Find pools', module: 'map', query: 'cat=pools&near=me', icon: 'location-dot' }] },
      { title: 'Water Balloon Tournament', blurb: 'Teams of two, one tosses and one catches. Step back a pace after each round.' },
      { title: 'Sprinkler Day', blurb: 'The cheapest holiday going. Run through it, then lie on the warm grass.' },
      { title: 'Learn a New Stroke', blurb: 'Pick one: backstroke, butterfly or a proper tumble turn. Ask a lifeguard for tips.', cta: [{ label: 'Find pools', module: 'map', query: 'cat=pools&near=me', icon: 'location-dot' }] }
    ],
    picnic: [
      { title: 'Park Picnic', blurb: 'A blanket, a cooler and a rule: nobody carries anything back to the car twice.', cta: [{ label: 'Find farmers markets', module: 'map', query: 'cat=markets&near=me', icon: 'location-dot' }] },
      { title: 'Build-Your-Own Burger Night', blurb: 'Grill the patties, then set out every topping and let people stack their own.' },
      { title: 'Corn and Watermelon Night', blurb: 'Grilled corn, cold watermelon and a seed-spitting contest.' },
      { title: 'Potluck in the Shade', blurb: 'Everyone brings one dish and one folding chair.' }
    ],
    stars: [
      { title: 'Dark-Sky Stargazing', blurb: 'Drive somewhere with no streetlights, let your eyes adjust for twenty minutes and look for the Milky Way.', steps: ['Check the moon phase and cloud cover.', 'Bring a red flashlight and warm layers.', 'Lie back and count the satellites.'], cta: [{ label: 'Find dark skies', module: 'map', query: 'cat=stars&near=me', icon: 'location-dot' }, { label: 'Moon phase', module: 'weather', icon: 'moon', ghost: true }] },
      { title: 'Meteor Shower Night', blurb: 'The Perseids peak in mid-August. Face northeast, skip the telescope and just look up.', cta: [{ label: 'Find dark skies', module: 'map', query: 'cat=stars&near=me', icon: 'location-dot' }] },
      { title: 'Backyard Constellation Hunt', blurb: 'Use a free sky-map app to find three constellations and one planet.' },
      { title: 'Planetarium Visit', blurb: 'A cool, dark room on a hot afternoon. Check for a laser-light show.', cta: [{ label: 'Find dark skies', module: 'map', query: 'cat=stars&near=me', icon: 'location-dot' }] }
    ],
    hike: [
      { title: 'Early Hike to a Swimming Hole', blurb: 'Start before nine, carry two liters of water each and plan to be done before the afternoon heat.', cta: [{ label: 'Find trails', module: 'map', query: 'cat=trails&near=me', icon: 'location-dot' }, { label: 'Check UV', module: 'weather', icon: 'sun', ghost: true }] },
      { title: 'Waterfall Walk', blurb: 'A short, shaded trail that ends somewhere cool.', cta: [{ label: 'Find trails', module: 'map', query: 'cat=trails&near=me', icon: 'location-dot' }] },
      { title: 'Summit Sunset', blurb: 'Pack a headlamp. You will want it on the way back down.', cta: [{ label: 'Find trails', module: 'map', query: 'cat=trails&near=me', icon: 'location-dot' }] },
      { title: 'Trail Bingo', blurb: 'Make a card: a lizard, a wildflower, a stream crossing, a stranger with a dog.' }
    ],
    frozen: [
      { title: 'Ice Cream Crawl', blurb: 'Three shops, one scoop each, then a vote. Bring napkins.' },
      { title: 'Homemade Popsicles', blurb: 'Blend fruit with a little juice, pour into molds and freeze overnight.' },
      { title: 'Shaved Ice Taste Test', blurb: 'Rank five flavors from one to five and defend the winner.' },
      { title: 'Ice Cream Sandwich Bar', blurb: 'Cookies, scoops and a tray of toppings. Freeze for ten minutes before serving.' }
    ],
    fest: [
      { title: 'Outdoor Concert', blurb: 'Bring a blanket, earplugs and a plan for where to meet if you get separated.', cta: [{ label: 'Find festivals', module: 'map', query: 'cat=festivals&near=me', icon: 'location-dot' }, { label: 'Summer Beats', module: 'music', icon: 'headphones', ghost: true }] },
      { title: 'County Fair', blurb: 'Rides, livestock barns and one fried thing you will remember all year.', cta: [{ label: 'Find festivals', module: 'map', query: 'cat=festivals&near=me', icon: 'location-dot' }] },
      { title: 'Fireworks Night', blurb: 'Find a hill with a view, arrive early and bring a flashlight.', cta: [{ label: 'Find festivals', module: 'map', query: 'cat=festivals&near=me', icon: 'location-dot' }] },
      { title: 'Open-Air Movie', blurb: 'Park screenings and drive-ins are the best of both worlds.', cta: [{ label: 'Pick a movie', module: 'movies', icon: 'film', ghost: true }] }
    ],
    market: [
      { title: 'Farmers Market Breakfast', blurb: 'Buy whatever looks best, then eat it on a bench.', cta: [{ label: 'Find markets', module: 'map', query: 'cat=markets&near=me', icon: 'location-dot' }] },
      { title: 'Peach and Berry Day', blurb: 'Find a pick-your-own farm and make jam when you get home.', cta: [{ label: 'Find markets', module: 'map', query: 'cat=markets&near=me', icon: 'location-dot' }] },
      { title: 'Flower Stall Treat', blurb: 'One bunch each for the kitchen table.', cta: [{ label: 'Find markets', module: 'map', query: 'cat=markets&near=me', icon: 'location-dot' }] },
      { title: 'Cook What You Find', blurb: 'Spend ten dollars, buy five things and make dinner from only those.' }
    ],
    yard: [
      { title: 'Backyard Olympics', blurb: 'Sack race, egg-and-spoon, water-balloon toss and a closing ceremony.' },
      { title: 'Cornhole Tournament', blurb: 'Bracket, trophy and trash talk allowed in moderation.' },
      { title: 'Lawn Chess or Giant Jenga', blurb: 'Slow games for hot afternoons. Lemonade supplied by the loser.' },
      { title: 'Glow-in-the-Dark Tag', blurb: 'Glow sticks, a dark yard and one rule: no running near the pool.' }
    ],
    sunset: [
      { title: 'Sunset Picnic', blurb: 'Pick a west-facing spot, bring a jacket and stay until the last colour is gone.', cta: [{ label: 'Find beaches', module: 'map', query: 'cat=beaches&near=me', icon: 'location-dot' }, { label: "Today's sun times", module: 'weather', icon: 'sun', ghost: true }] },
      { title: 'Golden-Hour Photo Walk', blurb: 'One hour before sunset, shoot long shadows and warm faces.', cta: [{ label: "Today's sun times", module: 'weather', icon: 'sun' }] },
      { title: 'Bike to the Water', blurb: 'Take the slow way to a lake or river and watch the light change.' },
      { title: 'Rooftop or Hilltop Sundown', blurb: 'Find the highest spot you can safely get to.' }
    ]
  }
};
