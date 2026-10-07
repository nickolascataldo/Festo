/* Halloween Activity Wheel: 8 wedges across the 4 categories in the brief
   (DIY & party, Spirit Halloween, haunted attractions, paranormal & folklore).
   The Spirit and haunted ideas deep-link into the Spectral Map with the matching filter. */
window.HALLOWEEN_WHEEL = {
  season: 'halloween',
  saveKey: 'festo_halloween_plan',
  eyebrow: 'Midnight indecision, solved',
  headline: 'Spin the Wheel',
    emptyIcon: 'ghost',
  emptyText: 'Spin the wheel and the Hollow will pick tonight\'s plan.',
  ariaLabel: 'Halloween activity wheel',
  bulbA: '#ff9a3c', bulbB: '#66fcf1',
  segments: [
    { id: 'diy-party',  label: 'DIY Party',        icon: 'cake-candles', color: '#ff6f00', pool: 'diyParty' },
    { id: 'spirit',     label: 'Spirit Halloween', icon: 'store', color: '#7b2cbf', pool: 'spirit' },
    { id: 'haunted',    label: 'Haunted House',    icon: 'house-chimney-crack', color: '#9d0208', pool: 'haunted' },
    { id: 'ghost-hunt', label: 'Ghost Hunt',       icon: 'ghost', color: '#0e8f8a', pool: 'ghostHunt' },
    { id: 'diy-treats', label: 'Treats & Bakes',   icon: 'cookie-bite', color: '#e85d04', pool: 'treats' },
    { id: 'costume',    label: 'Costume Quest',    icon: 'hat-wizard', color: '#5a189a', pool: 'costume' },
    { id: 'scream',     label: 'Scream Park',      icon: 'skull', color: '#6a040f', pool: 'screamPark' },
    { id: 'folklore',   label: 'Folklore Stop',    icon: 'book-skull', color: '#134e5e', pool: 'folklore' }
  ],
  pools: {
    diyParty: [
      { title: 'Witch\'s Brew Punch Bar', blurb: 'A self-serve cauldron of "potions" that guests name and label themselves.', steps: ['Fill a big pot with lemon-lime soda and a few scoops of sherbet.', 'Float gummy worms and plastic spiders in the ice.', 'Set out blank paper labels so every guest invents a potion name.'], cta: [{ label: 'Shop party supplies', module: 'store', icon: 'fa-bag-shopping', ghost: true }] },
      { title: 'Mummy Doorway Photo Booth', blurb: 'Wrap a doorway in gauze or toilet paper, add flickering lights, and take turns posing.', steps: ['Tape strips across the doorframe in loose layers.', 'Tuck LED tea lights behind the wrapping for glowing eyes.', 'Put a prop basket (hats, masks, plastic bats) next to it.'] },
      { title: 'Glow Jar Graveyard', blurb: 'Mason jars, glow sticks and black paper cut-outs make a lawn full of tiny haunted lanterns.', steps: ['Cut tombstone shapes from black card and tape them to the jars.', 'Snap the glow sticks and drop them in just before dusk.', 'Line the path to your door.'] },
      { title: 'Pumpkin Carving Contest', blurb: 'Scariest, funniest, most original: pick judges, hand out candy prizes.', steps: ['Design a face first so nobody freezes at the pumpkin.', 'Set a 30 minute timer and a category list.', 'Light them all and vote by candlelight.'], cta: [{ label: 'Design a face in the studio', module: 'pumpkin', icon: 'fa-wand-magic-sparkles' }] },
      { title: 'Ghost Bowling', blurb: 'Paint ten empty bottles or paper cups as ghosts and bowl them down with a small pumpkin.', steps: ['Draw spooky faces on white cups with a marker.', 'Stack them in a pyramid at the end of a hallway.', 'Winner of each round picks the next ghost story.'] },
      { title: 'Spooky Movie Bingo Night', blurb: 'Make bingo cards of horror clichés (the cat jump scare, the basement, the flickering light) and watch a classic.', cta: [{ label: 'Pick a movie', module: 'movies', icon: 'fa-film' }] },
      { title: 'Monster Mash Dance-Off', blurb: 'Build a 20-song playlist, freeze-dance style, and award a golden skeleton to the last monster standing.', cta: [{ label: 'Open the Sound Vault', module: 'music', icon: 'fa-headphones' }] },
      { title: 'Murder Mystery Dinner', blurb: 'Hand out secret character cards and run a whodunit over a candlelit meal.', steps: ['Give every guest a character and one secret.', 'Serve three courses; a new clue is revealed with each.', 'Vote on the culprit before dessert.'] }
    ],
    treats: [
      { title: 'Mummy Dogs', blurb: 'Hot dogs wrapped in crescent-dough strips with mustard dot eyes.', steps: ['Cut dough into thin strips and wrap loosely, leaving a gap for the face.', 'Bake at 375°F (190°C) for about 12 minutes.', 'Dot on eyes with mustard once they are cool enough to handle.'] },
      { title: 'Graveyard Dirt Cups', blurb: 'Chocolate pudding, crushed cookie "soil", gummy worms and cookie tombstones in clear cups.', steps: ['Layer pudding and crushed cookies.', 'Bury a few gummy worms.', 'Write RIP on a cookie with icing and stand it up on top.'] },
      { title: 'Spiderweb Hot Chocolate', blurb: 'Swirl melted white chocolate into a spiral on top of a mug of cocoa, then drag a toothpick out from the center.' },
      { title: 'Roasted Pumpkin Seeds, Three Ways', blurb: 'Rinse and dry the seeds from your carving session, then roast in sweet, savory and spicy batches.', steps: ['Toss with oil and salt; bake at 325°F (165°C) for 20 to 25 minutes.', 'Split into three bowls: cinnamon sugar, garlic parmesan, chili lime.'] },
      { title: 'Monster Eyeball Cake Pops', blurb: 'Round cake pops dipped in white candy melts with a colored candy iris and a red icing vein or two.' },
      { title: 'Caramel Apple Bar', blurb: 'Dip apples and set out toppings (crushed cookies, sprinkles, nuts) so everybody builds their own.', steps: ['Chill the apples first so the caramel clings.', 'Dip, then roll in toppings.', 'Rest on parchment until set. Check labels for allergies before sharing.'] },
      { title: 'Bat Wing Pizza Night', blurb: 'Cut pepperoni or black olive slices into bat shapes and build a pizza sky.' }
    ],
    spirit: [
      { title: 'Prop Hunt at Spirit Halloween', blurb: 'Find the most over-the-top animatronic in the store and film everyone\'s reaction.', cta: [{ label: 'Find a Spirit Halloween', module: 'map', query: 'cat=spirit&near=me', icon: 'fa-location-dot' }] },
      { title: 'The $25 Porch Challenge', blurb: 'Everyone gets $25 to build the best porch display. Compare the results at home.', cta: [{ label: 'Find a Spirit Halloween', module: 'map', query: 'cat=spirit&near=me', icon: 'fa-location-dot' }] },
      { title: 'Five Scares Scavenger', blurb: 'Find five animatronics that make you jump and rank them from "meh" to "never again".', cta: [{ label: 'Find a Spirit Halloween', module: 'map', query: 'cat=spirit&near=me', icon: 'fa-location-dot' }] },
      { title: 'Mask Wall Selfies', blurb: 'Try on the weirdest masks in the shop and keep the winner for the party.', cta: [{ label: 'Find a Spirit Halloween', module: 'map', query: 'cat=spirit&near=me', icon: 'fa-location-dot' }] },
      { title: 'Inflatable Hunt', blurb: 'Pick the giant inflatable for your yard, then measure your car trunk before you commit.', cta: [{ label: 'Find a Spirit Halloween', module: 'map', query: 'cat=spirit&near=me', icon: 'fa-location-dot' }] }
    ],
    costume: [
      { title: 'Group Costume Brainstorm', blurb: 'Pick a theme (a movie, a decade, a board game) and give everyone a role.', cta: [{ label: 'Browse costume ideas', module: 'store', icon: 'fa-bag-shopping' }] },
      { title: 'The $30 Costume Cap', blurb: 'Build the best costume you can for $30 or less from thrift stores and what is in your closet.' },
      { title: 'Classic Monster Revival', blurb: 'Dracula, Frankenstein, the Mummy, the Wolf Man. Pick a classic and do it properly: makeup, posture, voice.' },
      { title: 'Pet Costume Parade', blurb: 'Dress the pets (only if they are happy about it), and hold a parade down the street with a treat for each finalist.' },
      { title: 'Make-a-Mask Hour', blurb: 'Papier-mâché, felt and paint: build a mask from scratch for your costume.', cta: [{ label: 'Craft supplies', module: 'store', icon: 'fa-bag-shopping', ghost: true }] }
    ],
    haunted: [
      { title: 'Brave the Haunt', blurb: 'Find the best-reviewed haunted house near you and go as a group.', steps: ['Check hours, age rules and whether you need timed tickets.', 'Agree on who leads and who walks at the back.', 'Go early on a weeknight for shorter lines.'], cta: [{ label: 'Find haunted attractions', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] },
      { title: 'Haunt Hop', blurb: 'Two attractions in one night: one gentle, one terrifying.', cta: [{ label: 'Find haunted attractions', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] },
      { title: 'Scare Actor Bingo', blurb: 'Make a card of classic tricks (the chainsaw, the clown, the floor-drop) and see who fills a row first.', cta: [{ label: 'Find haunted attractions', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] },
      { title: 'Straw-Draw Leader', blurb: 'Draw straws to decide who goes first. The loser also holds the flashlight.', cta: [{ label: 'Find haunted attractions', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] }
    ],
    screamPark: [
      { title: 'Corn Maze at Dusk', blurb: 'Pick a farm maze and go as the light fades. Bring a charged phone and a no-peeking rule.', cta: [{ label: 'Find scream parks', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] },
      { title: 'Haunted Hayride', blurb: 'A tractor, a trailer, a dark field and a few things that should not be in it.', cta: [{ label: 'Find scream parks', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] },
      { title: 'Pumpkin Patch + Fright Trail', blurb: 'Pick pumpkins in the daylight, then come back for the night-time trail on the same farm.', cta: [{ label: 'Find scream parks', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] },
      { title: 'Zombie Run', blurb: 'A 5K with zombies in the trees. Wear a flag belt and see how many you keep.', cta: [{ label: 'Find events', module: 'map', query: 'cat=haunted&near=me', icon: 'fa-location-dot' }] }
    ],
    ghostHunt: [
      { title: 'Home EMF Walkthrough', blurb: 'A ghost-hunt kit and a script for a harmless house investigation.', steps: ['Take a baseline reading in the daytime and note the fridge, router and wiring.', 'Hold a quiet question session: ask, then wait five seconds.', 'Log times and reactions, then review the recording at lunch the next day.'], cta: [{ label: 'Find paranormal sites', module: 'map', query: 'cat=paranormal&near=me', icon: 'fa-location-dot', ghost: true }] },
      { title: 'Ghost Tour Night', blurb: 'Book a guided tour in the nearest historic town and learn the legends from someone who tells them for a living.', cta: [{ label: 'Find ghost tours', module: 'map', query: 'cat=paranormal&near=me', icon: 'fa-location-dot' }] },
      { title: 'Cemetery Evening Walk', blurb: 'Visit a historic cemetery during open hours. Read the oldest stones and keep your voice low.', steps: ['Check the opening hours; many close at dusk.', 'Stay on paths and never lean on stones.', 'Take photographs only where allowed.'], cta: [{ label: 'Find historic cemeteries', module: 'map', query: 'cat=graveyard,historic&near=me', icon: 'fa-location-dot' }] },
      { title: 'Flashlight Séance (A Game)', blurb: 'Play a spirit-board game or tell ghost stories round a single flashlight. Entertainment only.' },
      { title: 'Orbs & Shadows Photo Walk', blurb: 'Photograph old buildings at blue hour and compare the oddest frames. (Dust is the usual culprit.)' }
    ],
    folklore: [
      { title: 'Legend Trip', blurb: 'Pick a local legend (a haunted bridge, a hollow, a lighthouse), research it, then visit in daylight.', steps: ['Ask the library\'s local-history desk for the story.', 'Visit during the day and stay on public property.', 'Compare versions of the tale.'], cta: [{ label: 'Find historic sites', module: 'map', query: 'cat=historic,paranormal&near=me', icon: 'fa-location-dot' }] },
      { title: 'Historic Jail or Courthouse Tour', blurb: 'Old jails and courthouses are full of stories. Many offer evening "history and mystery" tours in October.', cta: [{ label: 'Find historic sites', module: 'map', query: 'cat=historic&near=me', icon: 'fa-location-dot' }] },
      { title: 'Lighthouse Ghost Story', blurb: 'Many lighthouses have a keeper\'s ghost. Visit one and read the plaque.', cta: [{ label: 'Find historic sites', module: 'map', query: 'cat=historic&near=me', icon: 'fa-location-dot' }] },
      { title: 'Witch History Walk', blurb: 'Take a self-guided walk through a historic district with colonial-era stories and read about the people, not just the legends.', cta: [{ label: 'Find historic sites', module: 'map', query: 'cat=historic&near=me', icon: 'fa-location-dot' }] },
      { title: 'Library Ghost-Story Hunt', blurb: 'Ask a librarian for local ghost stories. They always have a favorite.' }
    ]
  }
};
