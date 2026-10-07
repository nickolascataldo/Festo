/* Spring Wheel: picnic dares and small spring quests. Map-related wedges deep-link into Garden Trails.
   "Today's pick" gives everyone the same wedge on a given date. */
window.SPRING_WHEEL = {
  season: 'spring',
  saveKey: 'festo_spring_plan',
  daily: true,
  eyebrow: 'A little push outside',
  headline: 'Spin a Spring Quest',
  emptyIcon: 'seedling',
  ariaLabel: 'Spring quest wheel',
  bulbA: '#f2c94c', bulbB: '#ffffff', rimA: '#6aa066', rimB: '#3f6e3c',
  segments: [
    { id: 'picnic', label: 'Picnic Dare', icon: 'basket-shopping', color: '#d8506f', pool: 'picnic' },
    { id: 'garden', label: 'Plant Something', icon: 'seedling', color: '#4f8a4c', pool: 'garden' },
    { id: 'bloom', label: 'Blossom Walk', icon: 'spa', color: '#e07a9a', pool: 'bloom' },
    { id: 'birds', label: 'Bird Quest', icon: 'dove', color: '#3a86c8', pool: 'birds' },
    { id: 'bake', label: 'Spring Bake', icon: 'cake-candles', color: '#c9902a', pool: 'bake' },
    { id: 'kite', label: 'Kite Day', icon: 'wind', color: '#6a7ad8', pool: 'kite' },
    { id: 'market', label: 'Market Haul', icon: 'carrot', color: '#d97a20', pool: 'market' },
    { id: 'rain', label: 'Puddle Walk', icon: 'umbrella', color: '#3f8f97', pool: 'rain' },
    { id: 'press', label: 'Press & Paint', icon: 'palette', color: '#8d7bc9', pool: 'press' },
    { id: 'clear', label: 'Fresh Start', icon: 'broom', color: '#5aa09a', pool: 'clear' }
  ],
  pools: {
    picnic: [
      { title: 'The Blanket Dare', blurb: 'Pick a park, then lay down the blanket in the first spot the group agrees on. No wandering for the perfect view.', cta: [{ label: 'Find picnic spots', module: 'map', query: 'cat=picnic&near=me', icon: 'location-dot' }] },
      { title: 'Mystery Basket', blurb: 'Each person packs a basket without telling anyone what is in it. Lunch is whatever turns up.', cta: [{ label: 'Find picnic spots', module: 'map', query: 'cat=picnic&near=me', icon: 'location-dot' }] },
      { title: 'Breakfast Picnic', blurb: 'Pastries, fruit and a thermos before the day gets busy.', cta: [{ label: 'Find picnic spots', module: 'map', query: 'cat=picnic&near=me', icon: 'location-dot' }] },
      { title: 'Cloud Reading Hour', blurb: 'Lie back after lunch and find three shapes. The best one wins dessert.' }
    ],
    garden: [
      { title: 'Plant a Windowsill Herb', blurb: 'Basil, mint or chives in a pot you can reach from the sink.', steps: ['Pick a pot with a drainage hole.', 'Fill with potting mix and water well.', 'Keep in a bright spot and pinch the tips to encourage growth.'] },
      { title: 'Sow Something Fast', blurb: 'Radishes and sunflowers sprout in days, which is good for the impatient.' },
      { title: 'Visit a Botanical Garden', blurb: 'Take a notebook and sketch the plants you cannot name.', cta: [{ label: 'Find gardens', module: 'map', query: 'cat=gardens&near=me', icon: 'location-dot' }] },
      { title: 'Seed Swap', blurb: 'Trade packets with a friend or a neighbour. Label them in your best handwriting.' }
    ],
    bloom: [
      { title: 'Cherry Blossom Walk', blurb: 'Go early on a weekday, and bring a camera for the petals on the ground.', cta: [{ label: 'Find blooms', module: 'map', query: 'cat=blooms&near=me', icon: 'location-dot' }] },
      { title: 'Tulip Fields Day Trip', blurb: 'Check the farm\'s bloom report before you drive. Peak weeks change from year to year.', cta: [{ label: 'Find blooms', module: 'map', query: 'cat=blooms&near=me', icon: 'location-dot' }] },
      { title: 'Wildflower Scavenger Hunt', blurb: 'Find five colours of flower and photograph them without picking any.', cta: [{ label: 'Find trails', module: 'map', query: 'cat=trails&near=me', icon: 'location-dot' }] },
      { title: 'Neighbourhood Blossom Map', blurb: 'Walk your street and note the three best trees. Revisit them in a week.' }
    ],
    birds: [
      { title: 'Dawn Chorus', blurb: 'Be outside thirty minutes before sunrise. Learn to tell two songs apart.', cta: [{ label: 'Find bird spots', module: 'map', query: 'cat=birds&near=me', icon: 'location-dot' }, { label: 'Meadow Music', module: 'music', icon: 'headphones', ghost: true }] },
      { title: 'Migration Watch', blurb: 'Spring warblers pass through in waves. Go after a night of southerly wind.', cta: [{ label: 'Find bird spots', module: 'map', query: 'cat=birds&near=me', icon: 'location-dot' }] },
      { title: 'Build a Birdbath', blurb: 'A shallow dish of fresh water and a flat stone for landing.' },
      { title: 'Five-Bird Challenge', blurb: 'Identify five species from your window or a bench. A free ID app is fine.' }
    ],
    bake: [
      { title: 'Lemon Loaf Afternoon', blurb: 'Bake one, glaze it while it is warm and share half with a neighbour.' },
      { title: 'Rhubarb or Strawberry Crumble', blurb: 'Whatever the market has. Serve with cream and an unreasonable amount of crumble.' },
      { title: 'Flower Cookie Decorating', blurb: 'Sugar cookies, thin icing and edible flowers from a trusted source.' },
      { title: 'Spring Tea Table', blurb: 'Scones, jam and a pot of something floral.' }
    ],
    kite: [
      { title: 'Fly a Kite', blurb: 'Pick an open field with no power lines and a steady breeze from behind you.', cta: [{ label: "Check today's wind", module: 'weather', icon: 'wind' }] },
      { title: 'Make Your Own Kite', blurb: 'Two sticks, a paper sail, some string and a tail of ribbon.', cta: [{ label: "Check today's wind", module: 'weather', icon: 'wind', ghost: true }] },
      { title: 'Bubble Afternoon', blurb: 'Giant bubbles from a mix of dish soap, water and a little glycerin.' },
      { title: 'Bike Ride to the Blossoms', blurb: 'Pack a snack, pick a trail and stop wherever the trees are best.', cta: [{ label: 'Find trails', module: 'map', query: 'cat=trails&near=me', icon: 'location-dot' }] }
    ],
    market: [
      { title: 'Farmers Market Breakfast', blurb: 'Buy whatever looks best, then eat it on a bench.' },
      { title: 'Ten-Dollar Dinner', blurb: 'Spend ten dollars on whatever is in season and cook from only those things.' },
      { title: 'Flowers for the Table', blurb: 'One bunch each, whatever the stall has.' },
      { title: 'Plant Sale Stroll', blurb: 'Browse the spring plant sales and bring home one thing you cannot name.' }
    ],
    rain: [
      { title: 'Puddle Walk', blurb: 'Rain boots, a big umbrella and a rule that you must jump in the biggest puddle.', cta: [{ label: 'Check the rain', module: 'weather', icon: 'cloud-rain' }] },
      { title: 'Rainy Day Reading', blurb: 'Open the window an inch, make tea and pick a spring read.', cta: [{ label: 'Spring Reads', module: 'books', icon: 'book-open', ghost: true }] },
      { title: 'Greenhouse Visit', blurb: 'A warm, humid room on a wet afternoon.', cta: [{ label: 'Find gardens', module: 'map', query: 'cat=gardens&near=me', icon: 'location-dot' }] },
      { title: 'Rain Gauge Project', blurb: 'Make a gauge from a straight-sided jar and measure for a week.' }
    ],
    press: [
      { title: 'Flower Pressing', blurb: 'Pick a few flat blooms, press them between paper in a heavy book and wait two weeks.', steps: ['Choose flat, dry flowers.', 'Sandwich between sheets of paper in a thick book.', 'Weigh it down and check after two weeks.'] },
      { title: 'Watercolour Garden', blurb: 'Paint the first flower you see, in ten minutes, without pencil.' },
      { title: 'Seed Bomb Crafts', blurb: 'Clay, compost and wildflower seeds. Ask before you throw them anywhere.' },
      { title: 'Paper Flower Bouquet', blurb: 'Tissue paper, pipe cleaners and an hour. A bunch that never wilts.' }
    ],
    clear: [
      { title: 'Open Every Window', blurb: 'An hour of fresh air, then a speedy tidy while the house is cool.' },
      { title: 'Closet Swap', blurb: 'Pull out the winter layers, set aside what you did not wear and pass it on.' },
      { title: 'Balcony Refresh', blurb: 'Sweep, scrub the furniture and put one plant out.' },
      { title: 'Declutter One Drawer', blurb: 'Just one. Set a timer for twenty minutes.' }
    ]
  }
};
