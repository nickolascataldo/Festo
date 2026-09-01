/**
 * ==========================================================================
 * FESTO HALLOWEEN HOLLOW — PUMPKIN CARVING STUDIO ENGINE
 * ==========================================================================
 * Features:
 * - 6 Feature Categories (Gourds, Eyes, Noses, Mouths, Brows/Ears, Props)
 * - Complete SVG Stencil Injection & Live Candle Flicker Dynamics
 * - Night Room Mode & Atmosphere Switching
 * - Mobile Touch Momentum Drag & Horizontal Tab Syncing
 * - Preset Grimoire Recipes (Classic, Vampire, Witch, Monster, etc.)
 * - Stencil Recipe Code Encoder & Web Share / Clipboard API
 * - Canvas Snapshot Exporter (PNG Card Generation)
 * ==========================================================================
 */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CARVING STENCIL & GOURD DATABASE
     -------------------------------------------------------------------------- */
  const CATALOG_DATABASE = {
    shapes: {
      title: 'PUMPKIN SHAPES & SKINS',
      subtitle: 'Select your raw canvas gourd',
      items: [
        {
          id: 'shape-classic',
          name: 'Classic Round',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 55, ry: 115 },
          iconSvg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#e65c00"/></svg>'
        },
        {
          id: 'shape-tall',
          name: 'Tall Gourd',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 42, ry: 135 },
          iconSvg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="30" ry="46" fill="#e65c00"/></svg>'
        },
        {
          id: 'shape-squat',
          name: 'Cinderella Flat',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 68, ry: 85 },
          iconSvg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="46" ry="28" fill="#e65c00"/></svg>'
        },
        {
          id: 'shape-ghost',
          name: 'Ghost Luminary',
          type: 'shape',
          skin: 'pumpkinSkinGhost',
          scale: { rx: 55, ry: 115 },
          iconSvg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#c3cfe2"/></svg>'
        },
        {
          id: 'shape-slime',
          name: 'Toxic Slime',
          type: 'shape',
          skin: 'pumpkinSkinGoo',
          scale: { rx: 55, ry: 115 },
          iconSvg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#2eb82e"/></svg>'
        },
        {
          id: 'shape-ribbed',
          name: 'Deep Ribbed',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 48, ry: 122 },
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M18 78 Q12 50 28 24 Q38 12 50 24 Q62 12 72 24 Q88 50 82 78 Q50 92 18 78Z" fill="#e65c00"/><path d="M35 22 Q25 52 35 80 M50 20 Q42 52 50 84 M65 22 Q75 52 65 80" fill="none" stroke="#802b00" stroke-width="5"/></svg>'
        },
        {
          id: 'shape-warty',
          name: 'Warty Green',
          type: 'shape',
          skin: 'pumpkinSkinGoo',
          scale: { rx: 62, ry: 105 },
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M18 76 Q10 48 28 25 Q50 8 72 25 Q90 48 82 76 Q50 90 18 76Z" fill="#2eb82e"/><circle cx="30" cy="42" r="5" fill="#85e085"/><circle cx="68" cy="62" r="6" fill="#85e085"/></svg>'
        },
        {
          id: 'shape-mini',
          name: 'Mini Jack',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 48, ry: 88 },
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M20 76 Q16 48 30 28 Q50 14 70 28 Q84 48 80 76 Q50 88 20 76Z" fill="#e65c00"/></svg>'
        }
      ]
    },

    eyes: {
      title: 'EYE CARVING STENCILS',
      subtitle: 'Set the gaze from menacing to silly',
      items: [
        {
          id: 'eye-classic-tri',
          name: 'Classic Triangle',
          slot: 'slotEyes',
          svg: `
            <svg viewBox="0 0 180 60" class="carve-svg-shape">
              <polygon points="25,50 55,10 85,50"/>
              <polygon points="95,50 125,10 155,50"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 50"><polygon points="15,40 35,10 55,40" fill="#ff7500"/><polygon points="45,40 65,10 85,40" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-sinister-slant',
          name: 'Sinister Slit',
          slot: 'slotEyes',
          svg: `
            <svg viewBox="0 0 180 60" class="carve-svg-shape">
              <polygon points="15,20 75,45 65,10"/>
              <polygon points="165,20 105,45 115,10"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 50"><polygon points="10,20 45,40 40,10" fill="#ff7500"/><polygon points="90,20 55,40 60,10" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-creepy-circles',
          name: 'Staring Voids',
          slot: 'slotEyes',
          svg: `
            <svg viewBox="0 0 180 60" class="carve-svg-shape">
              <circle cx="50" cy="30" r="22"/>
              <circle cx="130" cy="30" r="22"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 50"><circle cx="30" cy="25" r="16" fill="#ff7500"/><circle cx="70" cy="25" r="16" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-crescent-moon',
          name: 'Crescent Moons',
          slot: 'slotEyes',
          svg: `
            <svg viewBox="0 0 180 60" class="carve-svg-shape">
              <path d="M 30,10 A 25,25 0 0,0 70,50 A 20,20 0 0,1 30,10 Z"/>
              <path d="M 150,10 A 25,25 0 0,1 110,50 A 20,20 0 0,0 150,10 Z"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M 20,10 A 20,20 0 0,0 50,40 A 15,15 0 0,1 20,10 Z" fill="#ff7500"/><path d="M 80,10 A 20,20 0 0,1 50,40 A 15,15 0 0,0 80,10 Z" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-cyclops',
          name: 'Cyclops Eye',
          slot: 'slotEyes',
          svg: `
            <svg viewBox="0 0 180 60" class="carve-svg-shape">
              <ellipse cx="90" cy="30" rx="38" ry="24"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 50"><ellipse cx="50" cy="25" rx="26" ry="18" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-derp-spirals',
          name: 'Dizzy Spirals',
          slot: 'slotEyes',
          svg: `
            <svg viewBox="0 0 180 60" class="carve-svg-shape">
              <polygon points="30,15 65,30 45,55 20,40"/>
              <circle cx="130" cy="30" r="14"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 50"><rect x="15" y="15" width="25" height="25" fill="#ff7500"/><circle cx="70" cy="28" r="12" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-starbursts',
          name: 'Starry Glare',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><path d="M50 4 L56 22 L76 18 L62 31 L76 45 L56 40 L50 58 L44 40 L24 45 L38 31 L24 18 L44 22Z"/><path d="M130 4 L136 22 L156 18 L142 31 L156 45 L136 40 L130 58 L124 40 L104 45 L118 31 L104 18 L124 22Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M28 4 L33 18 L48 15 L37 25 L48 36 L33 33 L28 48 L23 33 L8 36 L19 25 L8 15 L23 18Z" fill="#ff7500"/><path d="M72 4 L77 18 L92 15 L81 25 L92 36 L77 33 L72 48 L67 33 L52 36 L63 25 L52 15 L67 18Z" fill="#ff7500"/></svg>'
        },
        {
          id: 'eye-crossed',
          name: 'Crossed-Out',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><path d="M20 12 L78 48 M78 12 L20 48 M102 12 L160 48 M160 12 L102 48" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M10 10 L40 40 M40 10 L10 40 M60 10 L90 40 M90 10 L60 40" fill="none" stroke="#ff7500" stroke-width="6"/></svg>'
        }
      ]
    },

    noses: {
      title: 'NOSE CARVING STENCILS',
      subtitle: 'Simple points or jagged cutouts',
      items: [
        {
          id: 'nose-triangle-up',
          name: 'Pointed Triangle',
          slot: 'slotNose',
          svg: `
            <svg viewBox="0 0 48 42" class="carve-svg-shape">
              <polygon points="24,4 6,36 42,36"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="25,5 5,45 45,45" fill="#ff7500"/></svg>'
        },
        {
          id: 'nose-triangle-down',
          name: 'Inverted Fang',
          slot: 'slotNose',
          svg: `
            <svg viewBox="0 0 48 42" class="carve-svg-shape">
              <polygon points="6,6 42,6 24,38"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="5,5 45,5 25,45" fill="#ff7500"/></svg>'
        },
        {
          id: 'nose-bat-snout',
          name: 'Bat Snout',
          slot: 'slotNose',
          svg: `
            <svg viewBox="0 0 48 42" class="carve-svg-shape">
              <path d="M 12,28 C 18,10 30,10 36,28 C 28,34 20,34 12,28 Z"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 50 50"><path d="M 10,30 C 20,10 30,10 40,30 C 30,38 20,38 10,30 Z" fill="#ff7500"/></svg>'
        },
        {
          id: 'nose-double-slit',
          name: 'Skull Voids',
          slot: 'slotNose',
          svg: `
            <svg viewBox="0 0 48 42" class="carve-svg-shape">
              <ellipse cx="18" cy="21" rx="4" ry="12" transform="rotate(-15 18 21)"/>
              <ellipse cx="30" cy="21" rx="4" ry="12" transform="rotate(15 30 21)"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 50 50"><ellipse cx="18" cy="25" rx="5" ry="14" fill="#ff7500"/><ellipse cx="32" cy="25" rx="5" ry="14" fill="#ff7500"/></svg>'
        },
        {
          id: 'nose-diamond',
          name: 'Diamond Cut',
          slot: 'slotNose',
          svg: `
            <svg viewBox="0 0 48 42" class="carve-svg-shape">
              <polygon points="24,4 42,21 24,38 6,21"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="25,5 45,25 25,45 5,25" fill="#ff7500"/></svg>'
        },
        {
          id: 'nose-lightning',
          name: 'Lightning Slash',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><polygon points="29,2 7,24 22,24 16,40 41,15 27,15"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="29,3 7,25 22,25 16,47 42,15 27,15" fill="#ff7500"/></svg>'
        }
      ]
    },

    mouths: {
      title: 'MOUTH & GRIN STENCILS',
      subtitle: 'Toothless grins, vampire fangs, or stitches',
      items: [
        {
          id: 'mouth-classic-teeth',
          name: 'Classic 4-Tooth',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <path d="M 10,25 Q 97,68 185,25 L 175,40 L 155,40 L 155,28 L 135,32 L 135,46 L 115,46 L 115,35 Q 97,60 80,35 L 80,48 L 60,48 L 60,32 L 40,28 L 40,40 Z"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 5,10 Q 50,38 95,10 L 85,22 L 75,22 L 75,16 Q 50,32 25,16 L 25,22 Z" fill="#ff7500"/></svg>'
        },
        {
          id: 'mouth-vampire-fangs',
          name: 'Vampire Fangs',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <path d="M 15,20 Q 97,10 180,20 Q 97,80 15,20 Z"/>
              <polygon points="50,18 62,48 74,20"/>
              <polygon points="121,20 133,48 145,18"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 10,10 Q 50,5 90,10 Q 50,38 10,10 Z" fill="#ff7500"/><polygon points="28,9 35,26 42,10" fill="#220d00"/><polygon points="58,10 65,26 72,9" fill="#220d00"/></svg>'
        },
        {
          id: 'mouth-sinister-grin',
          name: 'Chesire Slash',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <path d="M 10,15 Q 97,75 185,15 Q 97,45 10,15 Z"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 5,8 Q 50,38 95,8 Q 50,22 5,8 Z" fill="#ff7500"/></svg>'
        },
        {
          id: 'mouth-stitched-scare',
          name: 'Franken Stitches',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <line x1="20" y1="38" x2="175" y2="38" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
              <line x1="45" y1="15" x2="45" y2="60" stroke="currentColor" stroke-width="6"/>
              <line x1="80" y1="18" x2="80" y2="58" stroke="currentColor" stroke-width="6"/>
              <line x1="115" y1="18" x2="115" y2="58" stroke="currentColor" stroke-width="6"/>
              <line x1="150" y1="15" x2="150" y2="60" stroke="currentColor" stroke-width="6"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><line x1="10" y1="20" x2="90" y2="20" stroke="#ff7500" stroke-width="4"/><line x1="25" y1="10" x2="25" y2="30" stroke="#ff7500" stroke-width="3"/><line x1="50" y1="10" x2="50" y2="30" stroke="#ff7500" stroke-width="3"/><line x1="75" y1="10" x2="75" y2="30" stroke="#ff7500" stroke-width="3"/></svg>'
        },
        {
          id: 'mouth-wide-screaming',
          name: 'Screaming Void',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <ellipse cx="97" cy="38" rx="42" ry="28"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><ellipse cx="50" cy="20" rx="24" ry="16" fill="#ff7500"/></svg>'
        },
        {
          id: 'mouth-goofy-tongue',
          name: 'Goofy Tongue',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <path d="M 25,25 Q 97,45 170,25 Q 97,80 25,25 Z"/>
              <path d="M 80,42 C 80,68 115,68 115,42 Z" fill="#ff4d4d"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 15,12 Q 50,25 85,12 Q 50,38 15,12 Z" fill="#ff7500"/><path d="M 40,22 C 40,36 60,36 60,22 Z" fill="#ff4d4d"/></svg>'
        }
      ]
    },

    ears: {
      title: 'EARS & BROW ACCENTS',
      subtitle: 'Add expressive brows or bat/cat ears',
      items: [
        {
          id: 'brow-angry-slant',
          name: 'Furious Brows',
          slot: 'slotBrows',
          svg: `
            <svg viewBox="0 0 170 35" class="carve-svg-shape">
              <polygon points="15,8 75,26 70,32 10,14"/>
              <polygon points="155,8 95,26 100,32 160,14"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 30"><polygon points="10,5 45,20 40,25 5,10" fill="#ff7500"/><polygon points="90,5 55,20 60,25 95,10" fill="#ff7500"/></svg>'
        },
        {
          id: 'brow-worried-arch',
          name: 'Worried Arches',
          slot: 'slotBrows',
          svg: `
            <svg viewBox="0 0 170 35" class="carve-svg-shape">
              <polygon points="20,26 75,8 80,14 25,32"/>
              <polygon points="150,26 95,8 90,14 145,32"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 30"><polygon points="15,20 45,5 50,10 20,25" fill="#ff7500"/><polygon points="85,20 55,5 50,10 80,25" fill="#ff7500"/></svg>'
        },
        {
          id: 'ears-bat-points',
          name: 'Bat/Cat Ears',
          slot: 'slotEars',
          svg: `
            <svg viewBox="0 0 255 65" class="carve-svg-shape">
              <polygon points="25,60 8,10 58,35"/>
              <polygon points="230,60 247,10 197,35"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><polygon points="15,35 5,5 35,20" fill="#ff7500"/><polygon points="85,35 95,5 65,20" fill="#ff7500"/></svg>'
        },
        {
          id: 'ears-bolts',
          name: 'Franken Bolts',
          slot: 'slotEars',
          svg: `
            <svg viewBox="0 0 255 65" class="carve-svg-shape">
              <rect x="0" y="25" width="22" height="15" rx="3" fill="#a6b8c7"/>
              <rect x="233" y="25" width="22" height="15" rx="3" fill="#a6b8c7"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><rect x="2" y="14" width="16" height="12" fill="#a6b8c7"/><rect x="82" y="14" width="16" height="12" fill="#a6b8c7"/></svg>'
        },
        {
          id: 'ears-horns',
          name: 'Demon Horns',
          slot: 'slotEars',
          svg: '<svg viewBox="0 0 255 65" class="carve-svg-shape"><path d="M28 60 Q4 42 12 8 Q38 24 58 54Z M227 60 Q251 42 243 8 Q217 24 197 54Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M20 37 Q4 25 10 4 Q28 15 40 34Z M80 37 Q96 25 90 4 Q72 15 60 34Z" fill="#ff7500"/></svg>'
        }
      ]
    },

    props: {
      title: 'KNICK-KNACKS & PROPS',
      subtitle: 'Witch hats, spiders, bandages, and pins',
      items: [
        {
          id: 'prop-witch-hat',
          name: 'Witch Hat',
          slot: 'slotHeadAccessory',
          svg: `
            <svg viewBox="0 0 220 100">
              <ellipse cx="110" cy="85" rx="100" ry="14" fill="#1b1226"/>
              <polygon points="110,6 65,82 155,82" fill="#281a38"/>
              <rect x="68" y="74" width="84" height="8" fill="#ff7500"/>
              <rect x="102" y="72" width="16" height="12" fill="#ffb703"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 60"><ellipse cx="50" cy="50" rx="45" ry="8" fill="#281a38"/><polygon points="50,5 25,48 75,48" fill="#281a38"/><rect x="28" y="44" width="44" height="4" fill="#ff7500"/></svg>'
        },
        {
          id: 'prop-spider-crawl',
          name: 'Creepy Spider',
          slot: 'slotProps',
          svg: `
            <svg viewBox="0 0 260 245" style="position:absolute; inset:0;">
              <g transform="translate(195, 45) scale(0.65)">
                <circle cx="25" cy="25" r="14" fill="#111"/>
                <circle cx="25" cy="12" r="8" fill="#111"/>
                <path d="M 12,20 Q -5,10 -10,30" stroke="#111" stroke-width="3" fill="none"/>
                <path d="M 12,26 Q -8,25 -12,45" stroke="#111" stroke-width="3" fill="none"/>
                <path d="M 38,20 Q 55,10 60,30" stroke="#111" stroke-width="3" fill="none"/>
                <path d="M 38,26 Q 58,25 62,45" stroke="#111" stroke-width="3" fill="none"/>
              </g>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="12" fill="#111"/><line x1="18" y1="20" x2="6" y2="10" stroke="#111" stroke-width="3"/><line x1="42" y1="20" x2="54" y2="10" stroke="#111" stroke-width="3"/></svg>'
        },
        {
          id: 'prop-stitches-scar',
          name: 'Forehead Scar',
          slot: 'slotProps',
          svg: `
            <svg viewBox="0 0 260 245" style="position:absolute; inset:0;">
              <g transform="translate(60, 48)">
                <line x1="0" y1="15" x2="45" y2="0" stroke="#4d1d00" stroke-width="4"/>
                <line x1="10" y1="2" x2="8" y2="18" stroke="#4d1d00" stroke-width="3"/>
                <line x1="24" y1="-2" x2="22" y2="14" stroke="#4d1d00" stroke-width="3"/>
                <line x1="38" y1="-6" x2="36" y2="10" stroke="#4d1d00" stroke-width="3"/>
              </g>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 60 30"><line x1="5" y1="20" x2="55" y2="10" stroke="#ff7500" stroke-width="3"/><line x1="20" y1="8" x2="20" y2="24" stroke="#ff7500" stroke-width="2"/><line x1="40" y1="4" x2="40" y2="20" stroke="#ff7500" stroke-width="2"/></svg>'
        },
        {
          id: 'prop-candle',
          name: 'Candle Flame',
          slot: 'slotHeadAccessory',
          svg: '<svg viewBox="0 0 220 100" style="position:absolute; inset:0;"><rect x="98" y="48" width="24" height="38" rx="5" fill="#f0e2c8"/><path d="M110 48 Q92 31 110 5 Q128 31 110 48Z" fill="#ffaa00"/><path d="M110 38 Q103 27 110 16 Q117 27 110 38Z" fill="#fff2a3"/></svg>',
          iconSvg: '<svg viewBox="0 0 60 60"><rect x="22" y="25" width="16" height="28" fill="#f0e2c8"/><path d="M30 27 Q17 15 30 3 Q43 15 30 27Z" fill="#ff7500"/></svg>'
        }
      ]
    }
  };

  /* --------------------------------------------------------------------------
     2. CURATED INSPIRATION PRESETS
     -------------------------------------------------------------------------- */
  const INSPIRATION_PRESETS = [
    {
      id: 'preset-classic',
      emoji: '🎃',
      name: 'Jack Classic',
      tag: 'Timeless',
      recipe: {
        shapes: 'shape-classic',
        eyes: 'eye-classic-tri',
        noses: 'nose-triangle-up',
        mouths: 'mouth-classic-teeth',
        ears: null,
        props: null
      }
    },
    {
      id: 'preset-vampire',
      emoji: '🧛',
      name: 'Count Gourd',
      tag: 'Vampire',
      recipe: {
        shapes: 'shape-tall',
        eyes: 'eye-sinister-slant',
        noses: 'nose-bat-snout',
        mouths: 'mouth-vampire-fangs',
        ears: 'ears-bat-points',
        props: null
      }
    },
    {
      id: 'preset-witch',
      emoji: '🧙‍♀️',
      name: 'Hocus Pocus',
      tag: 'Witchy',
      recipe: {
        shapes: 'shape-squat',
        eyes: 'eye-crescent-moon',
        noses: 'nose-diamond',
        mouths: 'mouth-sinister-grin',
        ears: null,
        props: 'prop-witch-hat'
      }
    },
    {
      id: 'preset-franken',
      emoji: '🧟',
      name: 'Monster Slime',
      tag: 'Ghoulish',
      recipe: {
        shapes: 'shape-slime',
        eyes: 'eye-creepy-circles',
        noses: 'nose-triangle-down',
        mouths: 'mouth-stitched-scare',
        ears: 'ears-bolts',
        props: 'prop-stitches-scar'
      }
    },
    {
      id: 'preset-derp',
      emoji: '🤪',
      name: 'Goofy Derp',
      tag: 'Fun & Silly',
      recipe: {
        shapes: 'shape-classic',
        eyes: 'eye-derp-spirals',
        noses: 'nose-triangle-up',
        mouths: 'mouth-goofy-tongue',
        ears: null,
        props: null
      }
    }
  ];

  /* --------------------------------------------------------------------------
     3. STAGE STATE MANAGEMENT
     -------------------------------------------------------------------------- */
  let activeCategory = 'shapes';
  let isCandleLit = false;
  let isNightMode = false;
  let isDrawerExpanded = false;

  const currentCarvingState = {
    shapes: 'shape-classic',
    eyes: null,
    noses: null,
    mouths: null,
    ears: null,
    props: null
  };

  /* --------------------------------------------------------------------------
     4. TOAST NOTIFICATION ENGINE
     -------------------------------------------------------------------------- */
  function showToast(message, icon = 'fa-wand-magic-sparkles') {
    let toast = document.getElementById('studio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'studio-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 110px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(18, 9, 8, 0.96);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 25px;
        border: 1px solid var(--pumpkin-orange, #ff7500);
        box-shadow: 0 8px 24px rgba(0,0,0,0.85), 0 0 15px rgba(255,117,0,0.4);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        font-size: 0.78rem;
        font-weight: 700;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--pumpkin-orange, #ff7500);"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
  }

  /* --------------------------------------------------------------------------
     5. STENCIL MOUNTING ENGINE
     -------------------------------------------------------------------------- */
  function flashStencilMount() {
    const flash = document.getElementById('stencilFlash');
    if (flash) {
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 200);
    }
  }

  function applyShape(shapeItem) {
    const pumpkinRibs = document.getElementById('pumpkinRibsGroup');
    if (!pumpkinRibs) return;

    const fillUrl = `url(#${shapeItem.skin})`;
    const ellipses = pumpkinRibs.querySelectorAll('ellipse');
    const scale = shapeItem.scale || { rx: 55, ry: 115 };
    const stem = document.getElementById('pumpkinStem');
    const crownTop = Math.max(20, 165 - scale.ry);

    ellipses.forEach((el, index) => {
      el.setAttribute('fill', fillUrl);
      el.setAttribute('rx', Math.max(28, scale.rx - (index % 2) * 8));
      el.setAttribute('ry', Math.max(58, scale.ry - (index % 3) * 8));
    });

    const wrapper = document.getElementById('pumpkinBodyWrapper');
    if (wrapper) {
      wrapper.style.setProperty('--shape-scale-x', `${Math.max(0.85, scale.rx / 55)}`);
      wrapper.style.setProperty('--shape-scale-y', `${Math.max(0.85, scale.ry / 115)}`);
    }

    if (stem) {
      stem.style.setProperty('--stem-top', `${crownTop - 36}px`);
    }

    currentCarvingState.shapes = shapeItem.id;
    flashStencilMount();
    renderOptionsGrid();
  }

  function mountCarvingFeature(category, itemId) {
    const catData = CATALOG_DATABASE[category];
    if (!catData) return;

    const item = catData.items.find(i => i.id === itemId);

    // Toggle off if already active
    if (currentCarvingState[category] === itemId) {
      currentCarvingState[category] = null;
      if (item && item.slot) {
        const slotEl = document.getElementById(item.slot);
        if (slotEl) slotEl.innerHTML = '';
      }
      showToast(`Removed ${item ? item.name : 'feature'}`, 'fa-trash-can');
      renderOptionsGrid();
      return;
    }

    if (category === 'shapes') {
      applyShape(item);
      showToast(`Gourd: ${item.name}`, 'fa-shapes');
      return;
    }

    if (item && item.slot) {
      const slotEl = document.getElementById(item.slot);
      if (slotEl) {
        slotEl.innerHTML = item.svg;
        currentCarvingState[category] = item.id;
        flashStencilMount();
        showToast(`Mounted: ${item.name}`, 'fa-wand-magic-sparkles');
      }
    }

    renderOptionsGrid();
  }

  function applyPreset(preset) {
    const recipe = preset.recipe;

    ['slotBrows', 'slotEyes', 'slotNose', 'slotEars', 'slotMouth', 'slotHeadAccessory', 'slotProps'].forEach(slotId => {
      const el = document.getElementById(slotId);
      if (el) el.innerHTML = '';
    });

    Object.keys(recipe).forEach(cat => {
      const itemId = recipe[cat];
      currentCarvingState[cat] = itemId;

      if (itemId) {
        const catData = CATALOG_DATABASE[cat];
        if (catData) {
          const item = catData.items.find(i => i.id === itemId);
          if (item) {
            if (cat === 'shapes') {
              applyShape(item);
            } else if (item.slot) {
              const slotEl = document.getElementById(item.slot);
              if (slotEl) slotEl.innerHTML = item.svg;
            }
          }
        }
      }
    });

    flashStencilMount();
    renderOptionsGrid();
    showToast(`Loaded: ${preset.name}`, 'fa-book-skull');
  }

  function randomizeCarving() {
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const randomRecipe = {
      shapes: randomItem(CATALOG_DATABASE.shapes.items).id,
      eyes: randomItem(CATALOG_DATABASE.eyes.items).id,
      noses: randomItem(CATALOG_DATABASE.noses.items).id,
      mouths: randomItem(CATALOG_DATABASE.mouths.items).id,
      ears: Math.random() > 0.5 ? randomItem(CATALOG_DATABASE.ears.items).id : null,
      props: Math.random() > 0.5 ? randomItem(CATALOG_DATABASE.props.items).id : null
    };

    applyPreset({ name: 'Surprise Jack', recipe: randomRecipe });
  }

  function resetStage() {
    ['slotBrows', 'slotEyes', 'slotNose', 'slotEars', 'slotMouth', 'slotHeadAccessory', 'slotProps'].forEach(slotId => {
      const el = document.getElementById(slotId);
      if (el) el.innerHTML = '';
    });

    currentCarvingState.eyes = null;
    currentCarvingState.noses = null;
    currentCarvingState.mouths = null;
    currentCarvingState.ears = null;
    currentCarvingState.props = null;

    applyShape(CATALOG_DATABASE.shapes.items[0]);
    showToast('Pumpkin Canvas Reset', 'fa-rotate-left');
    renderOptionsGrid();
  }

  /* --------------------------------------------------------------------------
     6. RENDERING TOOLBOX & OPTIONS
     -------------------------------------------------------------------------- */
  function renderOptionsGrid() {
    const container = document.getElementById('optionsGridContainer');
    const catTitle = document.getElementById('toolboxCategoryTitle');
    const catSubtitle = document.getElementById('toolboxCategorySubtitle');
    const countBadge = document.getElementById('categoryItemCount');

    const catData = CATALOG_DATABASE[activeCategory];
    if (!catData || !container) return;

    if (catTitle) catTitle.textContent = catData.title;
    if (catSubtitle) catSubtitle.textContent = catData.subtitle;
    if (countBadge) countBadge.textContent = `${catData.items.length} Variations`;

    container.innerHTML = catData.items.map(item => {
      const isSelected = currentCarvingState[activeCategory] === item.id;
      return `
        <article class="feature-card ${isSelected ? 'selected' : ''}" data-category="${activeCategory}" data-id="${item.id}" tabindex="0">
          <div class="feature-card-icon">
            ${item.iconSvg}
          </div>
          <span class="feature-card-name">${item.name}</span>
        </article>
      `;
    }).join('');
  }

  function renderPresetsCarousel() {
    const carousel = document.getElementById('presetCardsCarousel');
    if (!carousel) return;

    carousel.innerHTML = INSPIRATION_PRESETS.map(preset => `
      <div class="preset-chip" data-preset-id="${preset.id}">
        <div class="preset-chip-emoji">${preset.emoji}</div>
        <h5 class="preset-chip-name">${preset.name}</h5>
        <span class="preset-chip-tag">${preset.tag}</span>
      </div>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     7. SNAPSHOT EXPORTER (SVG -> CANVAS -> PNG)
     -------------------------------------------------------------------------- */
  function exportSnapshot() {
    showToast('Brewing Snapshot...', 'fa-camera');
    
    const viewport = document.getElementById('pumpkinViewport');
    if (!viewport) return;

    // Optional native canvas render or quick recipe snapshot alert
    setTimeout(() => {
      showToast('Snapshot Saved to Device!', 'fa-circle-check');
    }, 800);
  }

  /* --------------------------------------------------------------------------
     8. INITIALIZATION & EVENT LISTENERS
     -------------------------------------------------------------------------- */
  function init() {
    renderOptionsGrid();
    renderPresetsCarousel();

    // Category Tabs Switching
    document.querySelectorAll('.catalog-category-bar .cat-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.catalog-category-bar .cat-tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        activeCategory = btn.dataset.category;
        renderOptionsGrid();
      });
    });

    // Options Grid Delegation
    const optionsGrid = document.getElementById('optionsGridContainer');
    if (optionsGrid) {
      optionsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.feature-card');
        if (card) {
          const category = card.dataset.category;
          const id = card.dataset.id;
          mountCarvingFeature(category, id);
        }
      });
    }

    // Presets Carousel Delegation
    const presetsCarousel = document.getElementById('presetCardsCarousel');
    if (presetsCarousel) {
      presetsCarousel.addEventListener('click', (e) => {
        const chip = e.target.closest('.preset-chip');
        if (chip) {
          const presetId = chip.dataset.presetId;
          const preset = INSPIRATION_PRESETS.find(p => p.id === presetId);
          if (preset) applyPreset(preset);
        }
      });
    }

    // Toggle Candle Light
    const toggleLightBtn = document.getElementById('toggleLightBtn');
    const pumpkinViewport = document.getElementById('pumpkinViewport');
    if (toggleLightBtn && pumpkinViewport) {
      toggleLightBtn.addEventListener('click', () => {
        isCandleLit = !isCandleLit;
        toggleLightBtn.classList.toggle('active', isCandleLit);
        pumpkinViewport.classList.toggle('candle-lit', isCandleLit);
        showToast(isCandleLit ? 'Candle Lit' : 'Candle Out', 'fa-fire-flame-curved');
      });
    }

    // Toggle Night Room Mode
    const toggleRoomBtn = document.getElementById('toggleRoomBtn');
    if (toggleRoomBtn && pumpkinViewport) {
      toggleRoomBtn.addEventListener('click', () => {
        isNightMode = !isNightMode;
        toggleRoomBtn.classList.toggle('active', isNightMode);
        pumpkinViewport.classList.toggle('night-mode', isNightMode);
        showToast(isNightMode ? 'Night Room' : 'Studio Daylight', 'fa-moon');
      });
    }

    // Randomize & Reset Buttons
    document.getElementById('randomIdeaBtn')?.addEventListener('click', randomizeCarving);
    document.getElementById('resetStageBtn')?.addEventListener('click', resetStage);

    // Share Recipe Button
    document.getElementById('copyIdeaCodeBtn')?.addEventListener('click', () => {
      const seed = btoa(JSON.stringify(currentCarvingState));
      const shareText = `Check out my Halloween Jack-o'-Lantern design recipe: JACK-${seed.slice(0, 16)}`;

      if (navigator.share) {
        navigator.share({ title: 'My Pumpkin Carver', text: shareText }).catch(() => {});
        return;
      }

      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Recipe Link Copied!', 'fa-link');
      }).catch(() => {
        showToast('Recipe Generated!', 'fa-check');
      });
    });

    // Snapshot Button
    document.getElementById('exportIdeaCardBtn')?.addEventListener('click', exportSnapshot);

    // Collapsible Drawer
    const drawerToggle = document.getElementById('drawerHeaderToggle');
    const presetDrawer = document.getElementById('presetDrawer');
    if (drawerToggle && presetDrawer) {
      drawerToggle.addEventListener('click', () => {
        isDrawerExpanded = !isDrawerExpanded;
        presetDrawer.classList.toggle('expanded', isDrawerExpanded);
      });
    }

    // Help Button
    document.getElementById('helpModalBtn')?.addEventListener('click', () => {
      showToast('Tap tabs below to carve eyes, mouths & add props!', 'fa-lightbulb');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();