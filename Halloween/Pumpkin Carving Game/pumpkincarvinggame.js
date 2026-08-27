/**
 * ==========================================================================
 * JACK-O'-LANTERN STUDIO & IDEA BOARD — MASTER ENGINE (script.js)
 * ==========================================================================
 * 
 * Features:
 * - 6 Feature Categories (Shapes, Eyes, Noses, Mouths, Ears/Brows, Knick-Knacks)
 * - Complete SVG-based Carving Stencils with Real-Time Illumination
 * - Candle Light Flicker & Darkened Night Stage Modes
 * - Curated Presets Library (Classic, Spooky Vampire, Goofy, Derp, Cyclops, etc.)
 * - Seed Code Generator & Stencil Recipe Copy Engine
 * - Collapsible Preset Drawer with Drag-to-Scroll Support
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Comprehensive Feature Stencil Database
     ========================================================================== */
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
          name: 'Toxic Slime Gourd',
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
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M18 76 Q10 48 28 25 Q50 8 72 25 Q90 48 82 76 Q50 90 18 76Z" fill="#2eb82e"/><circle cx="30" cy="42" r="5" fill="#85e085"/><circle cx="68" cy="62" r="6" fill="#85e085"/><circle cx="52" cy="28" r="4" fill="#85e085"/></svg>'
        },
        {
          id: 'shape-white-stacked',
          name: 'Moonlit Stack',
          type: 'shape',
          skin: 'pumpkinSkinGhost',
          scale: { rx: 62, ry: 98 },
          iconSvg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="63" rx="34" ry="22" fill="#c3cfe2"/><ellipse cx="50" cy="42" rx="30" ry="22" fill="#dfe6f0"/><ellipse cx="50" cy="24" rx="22" ry="16" fill="#f5f7fa"/></svg>'
        },
        {
          id: 'shape-mini',
          name: 'Mini Jack',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 48, ry: 88 },
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M20 76 Q16 48 30 28 Q50 14 70 28 Q84 48 80 76 Q50 88 20 76Z" fill="#e65c00"/><path d="M35 30 Q27 55 35 76 M65 30 Q73 55 65 76" fill="none" stroke="#802b00" stroke-width="5"/></svg>'
        },
        {
          id: 'shape-twisted',
          name: 'Twisted Gourd',
          type: 'shape',
          skin: 'pumpkinSkinClassic',
          scale: { rx: 58, ry: 118 },
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M20 78 Q32 60 22 38 Q35 14 52 25 Q68 10 80 35 Q68 57 80 78 Q50 91 20 78Z" fill="#e65c00"/><path d="M30 30 Q48 48 31 77 M62 25 Q48 50 68 78" fill="none" stroke="#802b00" stroke-width="5"/></svg>'
        },
        {
          id: 'shape-blue-moon',
          name: 'Blue Moon Gourd',
          type: 'shape',
          skin: 'pumpkinSkinGhost',
          scale: { rx: 60, ry: 112 },
          iconSvg: '<svg viewBox="0 0 100 100"><path d="M18 74 Q14 45 30 24 Q50 10 70 24 Q86 45 82 74 Q50 90 18 74Z" fill="#9aaaca"/><path d="M34 25 Q25 52 35 78 M66 25 Q75 52 65 78" fill="none" stroke="#687790" stroke-width="5"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 50"><polygon points="15,40 35,10 55,40" fill="#ff6a00"/><polygon points="45,40 65,10 85,40" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 50"><polygon points="10,20 45,40 40,10" fill="#ff6a00"/><polygon points="90,20 55,40 60,10" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 50"><circle cx="30" cy="25" r="16" fill="#ff6a00"/><circle cx="70" cy="25" r="16" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M 20,10 A 20,20 0 0,0 50,40 A 15,15 0 0,1 20,10 Z" fill="#ff6a00"/><path d="M 80,10 A 20,20 0 0,1 50,40 A 15,15 0 0,0 80,10 Z" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 50"><ellipse cx="50" cy="25" rx="26" ry="18" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 50"><rect x="15" y="15" width="25" height="25" fill="#ff6a00"/><circle cx="70" cy="28" r="12" fill="#ff6a00"/></svg>'
        },
        {
          id: 'eye-starbursts',
          name: 'Starry Glare',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><path d="M50 4 L56 22 L76 18 L62 31 L76 45 L56 40 L50 58 L44 40 L24 45 L38 31 L24 18 L44 22Z"/><path d="M130 4 L136 22 L156 18 L142 31 L156 45 L136 40 L130 58 L124 40 L104 45 L118 31 L104 18 L124 22Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M28 4 L33 18 L48 15 L37 25 L48 36 L33 33 L28 48 L23 33 L8 36 L19 25 L8 15 L23 18Z" fill="#ff6a00"/><path d="M72 4 L77 18 L92 15 L81 25 L92 36 L77 33 L72 48 L67 33 L52 36 L63 25 L52 15 L67 18Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'eye-sleepy-lids',
          name: 'Sleepy Lids',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><path d="M15 35 Q50 5 85 35 Q50 22 15 35Z"/><path d="M95 35 Q130 5 165 35 Q130 22 95 35Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M8 32 Q30 10 52 32 Q30 22 8 32Z" fill="#ff6a00"/><path d="M48 32 Q70 10 92 32 Q70 22 48 32Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'eye-pupils',
          name: 'Witchy Pupils',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><ellipse cx="50" cy="30" rx="27" ry="19"/><ellipse cx="130" cy="30" rx="27" ry="19"/><path d="M50 12 L50 48 M130 12 L130 48" stroke="#220d00" stroke-width="5"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><ellipse cx="28" cy="25" rx="20" ry="15" fill="#ff6a00"/><ellipse cx="72" cy="25" rx="20" ry="15" fill="#ff6a00"/><path d="M28 10 V40 M72 10 V40" stroke="#220d00" stroke-width="4"/></svg>'
        },
        {
          id: 'eye-crossed',
          name: 'Crossed-Out Eyes',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><path d="M20 12 L78 48 M78 12 L20 48 M102 12 L160 48 M160 12 L102 48" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M10 10 L40 40 M40 10 L10 40 M60 10 L90 40 M90 10 L60 40" fill="none" stroke="#ff6a00" stroke-width="6"/></svg>'
        },
        {
          id: 'eye-hex',
          name: 'Hexagonal Stare',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><polygon points="20,30 35,10 65,10 80,30 65,50 35,50"/><polygon points="100,30 115,10 145,10 160,30 145,50 115,50"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><polygon points="8,25 18,10 38,10 48,25 38,40 18,40" fill="#ff6a00"/><polygon points="52,25 62,10 82,10 92,25 82,40 62,40" fill="#ff6a00"/></svg>'
        },
        {
          id: 'eye-teardrops',
          name: 'Crying Spirits',
          slot: 'slotEyes',
          svg: '<svg viewBox="0 0 180 60" class="carve-svg-shape"><path d="M18 26 Q50 7 82 26 Q50 45 18 26Z"/><path d="M98 26 Q130 7 162 26 Q130 45 98 26Z"/><path d="M50 43 Q42 55 50 59 Q58 55 50 43 M130 43 Q122 55 130 59 Q138 55 130 43Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 50"><path d="M8 24 Q30 10 52 24 Q30 38 8 24Z" fill="#ff6a00"/><path d="M48 24 Q70 10 92 24 Q70 38 48 24Z" fill="#ff6a00"/><circle cx="30" cy="42" r="4" fill="#ff6a00"/><circle cx="70" cy="42" r="4" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="25,5 5,45 45,45" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="5,5 45,5 25,45" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 50 50"><path d="M 10,30 C 20,10 30,10 40,30 C 30,38 20,38 10,30 Z" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 50 50"><ellipse cx="18" cy="25" rx="5" ry="14" fill="#ff6a00"/><ellipse cx="32" cy="25" rx="5" ry="14" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="25,5 45,25 25,45 5,25" fill="#ff6a00"/></svg>'
        },
        {
          id: 'nose-heart',
          name: 'Heart Cut',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><path d="M24 37 L7 19 Q3 5 15 5 Q24 5 24 15 Q24 5 33 5 Q45 5 41 19Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><path d="M25 42 L7 23 Q3 7 15 7 Q25 7 25 17 Q25 7 35 7 Q47 7 43 23Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'nose-lightning',
          name: 'Lightning Slash',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><polygon points="29,2 7,24 22,24 16,40 41,15 27,15"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><polygon points="29,3 7,25 22,25 16,47 42,15 27,15" fill="#ff6a00"/></svg>'
        },
        {
          id: 'nose-moon',
          name: 'Crescent Nose',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><path d="M35 5 A19 19 0 1 0 35 37 A14 14 0 1 1 35 5Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><path d="M37 7 A20 20 0 1 0 37 43 A15 15 0 1 1 37 7Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'nose-skull',
          name: 'Skull Nose',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><path d="M9 24 Q9 7 24 5 Q39 7 39 24 Q35 32 29 29 L29 38 L19 38 L19 29 Q13 32 9 24Z"/><circle cx="18" cy="19" r="3" fill="#220d00"/><circle cx="30" cy="19" r="3" fill="#220d00"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><path d="M7 28 Q7 8 25 6 Q43 8 43 28 Q38 36 31 32 V44 H19 V32 Q12 36 7 28Z" fill="#ff6a00"/><circle cx="18" cy="20" r="3" fill="#220d00"/><circle cx="32" cy="20" r="3" fill="#220d00"/></svg>'
        },
        {
          id: 'nose-witch',
          name: 'Witch Hook',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><path d="M28 4 Q14 13 20 28 Q24 38 38 34 Q28 30 29 20 Q30 10 38 7Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><path d="M29 4 Q12 15 20 31 Q25 43 42 35 Q29 31 30 20 Q31 10 40 7Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'nose-button',
          name: 'Button Nose',
          slot: 'slotNose',
          svg: '<svg viewBox="0 0 48 42" class="carve-svg-shape"><circle cx="24" cy="21" r="15"/><circle cx="19" cy="17" r="2" fill="#220d00"/><circle cx="29" cy="17" r="2" fill="#220d00"/></svg>',
          iconSvg: '<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="17" fill="#ff6a00"/><circle cx="19" cy="20" r="3" fill="#220d00"/><circle cx="31" cy="20" r="3" fill="#220d00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 5,10 Q 50,38 95,10 L 85,22 L 75,22 L 75,16 Q 50,32 25,16 L 25,22 Z" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 10,10 Q 50,5 90,10 Q 50,38 10,10 Z" fill="#ff6a00"/><polygon points="28,9 35,26 42,10" fill="#220d00"/><polygon points="58,10 65,26 72,9" fill="#220d00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 5,8 Q 50,38 95,8 Q 50,22 5,8 Z" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 40"><line x1="10" y1="20" x2="90" y2="20" stroke="#ff6a00" stroke-width="4"/><line x1="25" y1="10" x2="25" y2="30" stroke="#ff6a00" stroke-width="3"/><line x1="50" y1="10" x2="50" y2="30" stroke="#ff6a00" stroke-width="3"/><line x1="75" y1="10" x2="75" y2="30" stroke="#ff6a00" stroke-width="3"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 40"><ellipse cx="50" cy="20" rx="24" ry="16" fill="#ff6a00"/></svg>'
        },
        {
          id: 'mouth-goofy-tongue',
          name: 'Goofy Tongue Out',
          slot: 'slotMouth',
          svg: `
            <svg viewBox="0 0 195 75" class="carve-svg-shape">
              <path d="M 25,25 Q 97,45 170,25 Q 97,80 25,25 Z"/>
              <path d="M 80,42 C 80,68 115,68 115,42 Z" fill="#ff4d4d"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M 15,12 Q 50,25 85,12 Q 50,38 15,12 Z" fill="#ff6a00"/><path d="M 40,22 C 40,36 60,36 60,22 Z" fill="#ff4d4d"/></svg>'
        },
        {
          id: 'mouth-jagged-grin',
          name: 'Jagged Grin',
          slot: 'slotMouth',
          svg: '<svg viewBox="0 0 195 75" class="carve-svg-shape"><path d="M10 22 Q97 55 185 22 L175 52 L158 40 L142 56 L124 42 L105 58 L88 42 L70 56 L52 40 L34 52Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M5 10 Q50 35 95 10 L88 32 L75 22 L62 34 L50 23 L38 34 L25 22 L12 32Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'mouth-octopus',
          name: 'Tentacle Smile',
          slot: 'slotMouth',
          svg: '<svg viewBox="0 0 195 75" class="carve-svg-shape"><path d="M15 25 Q50 8 75 28 Q97 48 120 28 Q145 8 180 25 Q150 62 125 42 Q97 68 70 42 Q45 62 15 25Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M5 15 Q25 4 38 18 Q50 31 62 18 Q75 4 95 15 Q78 37 63 25 Q50 40 37 25 Q22 37 5 15Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'mouth-silent-scream',
          name: 'Silent Scream',
          slot: 'slotMouth',
          svg: '<svg viewBox="0 0 195 75" class="carve-svg-shape"><ellipse cx="97" cy="38" rx="27" ry="31"/><path d="M84 28 Q97 18 110 28 M84 48 Q97 58 110 48" fill="none" stroke="#4d1d00" stroke-width="4"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><ellipse cx="50" cy="20" rx="18" ry="16" fill="#ff6a00"/><path d="M42 15 Q50 10 58 15 M42 25 Q50 30 58 25" fill="none" stroke="#4d1d00" stroke-width="3"/></svg>'
        },
        {
          id: 'mouth-bone-grin',
          name: 'Bone Grin',
          slot: 'slotMouth',
          svg: '<svg viewBox="0 0 195 75" class="carve-svg-shape"><path d="M15 28 Q97 10 180 28 Q97 60 15 28Z"/><path d="M45 22 V39 M75 18 V43 M105 18 V43 M135 22 V39" stroke="#4d1d00" stroke-width="5"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M5 16 Q50 5 95 16 Q50 38 5 16Z" fill="#ff6a00"/><path d="M28 12 V28 M50 10 V30 M72 12 V28" stroke="#4d1d00" stroke-width="4"/></svg>'
        },
        {
          id: 'mouth-witch-cackle',
          name: 'Witch Cackle',
          slot: 'slotMouth',
          svg: '<svg viewBox="0 0 195 75" class="carve-svg-shape"><path d="M12 25 Q45 55 75 32 Q97 68 120 32 Q150 55 183 25 Q155 70 125 52 Q97 75 70 52 Q40 70 12 25Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M5 14 Q25 33 40 18 Q50 38 60 18 Q75 33 95 14 Q78 38 62 29 Q50 40 38 29 Q22 38 5 14Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'mouth-pursed',
          name: 'Pursed O',
          slot: 'slotMouth',
          svg: '<svg viewBox="0 0 195 75" class="carve-svg-shape"><ellipse cx="97" cy="38" rx="48" ry="25"/><ellipse cx="97" cy="38" rx="22" ry="12" fill="#220d00"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><ellipse cx="50" cy="20" rx="28" ry="16" fill="#ff6a00"/><ellipse cx="50" cy="20" rx="13" ry="7" fill="#220d00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 30"><polygon points="10,5 45,20 40,25 5,10" fill="#ff6a00"/><polygon points="90,5 55,20 60,25 95,10" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 30"><polygon points="15,20 45,5 50,10 20,25" fill="#ff6a00"/><polygon points="85,20 55,5 50,10 80,25" fill="#ff6a00"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 100 40"><polygon points="15,35 5,5 35,20" fill="#ff6a00"/><polygon points="85,35 95,5 65,20" fill="#ff6a00"/></svg>'
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
          id: 'brow-scarred',
          name: 'Scarred Brows',
          slot: 'slotBrows',
          svg: '<svg viewBox="0 0 170 35" class="carve-svg-shape"><path d="M12 24 Q42 3 78 15 L74 23 Q42 15 15 32Z M158 24 Q128 3 92 15 L96 23 Q128 15 155 32Z"/><path d="M42 12 L35 27 M128 12 L135 27" stroke="#4d1d00" stroke-width="3"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 30"><path d="M8 23 Q28 5 48 14 L45 22 Q28 16 10 29Z M92 23 Q72 5 52 14 L55 22 Q72 16 90 29Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'ears-wolf',
          name: 'Wolf Ears',
          slot: 'slotEars',
          svg: '<svg viewBox="0 0 255 65" class="carve-svg-shape"><path d="M25 60 L5 4 L70 38Z M230 60 L250 4 L185 38Z"/><path d="M25 45 L18 20 L48 38 M230 45 L237 20 L207 38" fill="#4d1d00"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M18 37 L5 4 L42 24Z M82 37 L95 4 L58 24Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'ears-horns',
          name: 'Demon Horns',
          slot: 'slotEars',
          svg: '<svg viewBox="0 0 255 65" class="carve-svg-shape"><path d="M28 60 Q4 42 12 8 Q38 24 58 54Z M227 60 Q251 42 243 8 Q217 24 197 54Z"/></svg>',
          iconSvg: '<svg viewBox="0 0 100 40"><path d="M20 37 Q4 25 10 4 Q28 15 40 34Z M80 37 Q96 25 90 4 Q72 15 60 34Z" fill="#ff6a00"/></svg>'
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
              <rect x="68" y="74" width="84" height="8" fill="#ff6a00"/>
              <rect x="102" y="72" width="16" height="12" fill="#ffb800"/>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 100 60"><ellipse cx="50" cy="50" rx="45" ry="8" fill="#281a38"/><polygon points="50,5 25,48 75,48" fill="#281a38"/><rect x="28" y="44" width="44" height="4" fill="#ff6a00"/></svg>'
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
                <!-- Legs -->
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
          id: 'prop-monocle',
          name: 'Dapper Monocle',
          slot: 'slotProps',
          svg: `
            <svg viewBox="0 0 260 245" style="position:absolute; inset:0;">
              <g transform="translate(140, 75)">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#ffb800" stroke-width="4"/>
                <line x1="48" y1="42" x2="62" y2="110" stroke="#ffb800" stroke-width="2"/>
              </g>
            </svg>
          `,
          iconSvg: '<svg viewBox="0 0 50 50"><circle cx="22" cy="22" r="16" fill="none" stroke="#ffb800" stroke-width="3"/><line x1="35" y1="32" x2="45" y2="48" stroke="#ffb800" stroke-width="2"/></svg>'
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
          iconSvg: '<svg viewBox="0 0 60 30"><line x1="5" y1="20" x2="55" y2="10" stroke="#ff6a00" stroke-width="3"/><line x1="20" y1="8" x2="20" y2="24" stroke="#ff6a00" stroke-width="2"/><line x1="40" y1="4" x2="40" y2="20" stroke="#ff6a00" stroke-width="2"/></svg>'
        },
        {
          id: 'prop-candle',
          name: 'Candle Flame',
          slot: 'slotHeadAccessory',
          svg: '<svg viewBox="0 0 220 100" style="position:absolute; inset:0;"><rect x="98" y="48" width="24" height="38" rx="5" fill="#f0e2c8"/><path d="M110 48 Q92 31 110 5 Q128 31 110 48Z" fill="#ffaa00"/><path d="M110 38 Q103 27 110 16 Q117 27 110 38Z" fill="#fff2a3"/></svg>',
          iconSvg: '<svg viewBox="0 0 60 60"><rect x="22" y="25" width="16" height="28" fill="#f0e2c8"/><path d="M30 27 Q17 15 30 3 Q43 15 30 27Z" fill="#ff6a00"/></svg>'
        },
        {
          id: 'prop-bat-bow',
          name: 'Bat Bow',
          slot: 'slotHeadAccessory',
          svg: '<svg viewBox="0 0 220 100" style="position:absolute; inset:0;"><path d="M110 48 Q72 12 48 30 Q72 61 110 54 Q148 61 172 30 Q148 12 110 48Z" fill="#281a38" stroke="#ff6a00" stroke-width="3"/><circle cx="110" cy="49" r="10" fill="#ff6a00"/></svg>',
          iconSvg: '<svg viewBox="0 0 60 40"><path d="M30 20 Q12 4 4 12 Q14 31 30 23 Q46 31 56 12 Q48 4 30 20Z" fill="#281a38" stroke="#ff6a00" stroke-width="2"/></svg>'
        },
        {
          id: 'prop-cobweb',
          name: 'Cobweb Veil',
          slot: 'slotProps',
          svg: '<svg viewBox="0 0 260 245" style="position:absolute; inset:0;"><g transform="translate(170 38)" fill="none" stroke="#d6c9e8" stroke-width="2"><path d="M0 0 Q35 35 70 0 M0 18 Q35 45 70 18 M0 36 Q35 58 70 36 M0 54 Q35 70 70 54"/><path d="M35 0 V70 M15 8 L55 62 M55 8 L15 62"/></g></svg>',
          iconSvg: '<svg viewBox="0 0 60 60"><path d="M5 5 Q30 30 55 5 M5 20 Q30 38 55 20 M30 5 V55 M8 8 L52 52 M52 8 L8 52" fill="none" stroke="#d6c9e8" stroke-width="2"/></svg>'
        }
      ]
    }
  };

  /* ==========================================================================
     2. Curated Idea Presets Collection
     ========================================================================== */
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
      name: 'Count Gourdula',
      tag: 'Vampire Spooky',
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
      name: 'Monster Gourd',
      tag: 'Green Slime',
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
    },
    {
      id: 'preset-cyclops',
      emoji: '👁️',
      name: 'All-Seeing Eye',
      tag: 'Eerie Horror',
      recipe: {
        shapes: 'shape-ghost',
        eyes: 'eye-cyclops',
        noses: 'nose-double-slit',
        mouths: 'mouth-wide-screaming',
        ears: 'brow-angry-slant',
        props: 'prop-spider-crawl'
      }
    }
  ];

  /* ==========================================================================
     3. Active Stage State Management
     ========================================================================= */
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

  /* ==========================================================================
     4. UI Toast Notification Engine
     ========================================================================== */
  function showToast(message, icon = 'fa-wand-magic-sparkles') {
    let toast = document.getElementById('studio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'studio-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 125px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(29, 23, 43, 0.96);
        color: #ffffff;
        padding: 9px 18px;
        border-radius: 30px;
        border: 1px solid var(--accent-orange);
        box-shadow: 0 8px 24px rgba(0,0,0,0.7), 0 0 15px rgba(255,106,0,0.3);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        font-size: 0.8rem;
        font-weight: 700;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-orange);"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  /* ==========================================================================
     5. Stage Mounting & Stencil Application
     ========================================================================== */
  function flashStencilMount() {
    const flash = document.getElementById('stencilFlash');
    if (flash) {
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 250);
    }
  }

  function applyShape(shapeItem) {
    const pumpkinRibs = document.getElementById('pumpkinRibsGroup');
    if (!pumpkinRibs) return;

    const fillUrl = `url(#${shapeItem.skin})`;
    const ellipses = pumpkinRibs.querySelectorAll('ellipse');
    const scale = shapeItem.scale || { rx: 55, ry: 115 };
    const isStackedShape = shapeItem.id === 'shape-white-stacked';
    const isTwistedShape = shapeItem.id === 'shape-twisted';
    const stem = document.getElementById('pumpkinStem');
    const crownTop = isStackedShape ? 18 : Math.max(22, 165 - scale.ry);

    ellipses.forEach((el, index) => {
      el.setAttribute('fill', fillUrl);
      el.setAttribute('rx', Math.max(28, scale.rx - (index % 2) * 8));
      el.setAttribute('ry', Math.max(58, scale.ry - (index % 3) * 8));
      el.setAttribute('cy', isStackedShape ? 182 - index * 18 : 165);

      if (isTwistedShape) {
        el.setAttribute('transform', `rotate(${index % 2 === 0 ? -7 : 7} 170 165)`);
      } else {
        el.removeAttribute('transform');
      }
    });

    const wrapper = document.getElementById('pumpkinBodyWrapper');
    if (wrapper) {
      wrapper.style.setProperty('--shape-scale-x', `${Math.max(0.84, scale.rx / 55)}`);
      wrapper.style.setProperty('--shape-scale-y', `${Math.max(0.84, scale.ry / 115)}`);
      wrapper.classList.toggle('shape-stacked', isStackedShape);
    }

    if (stem) {
      stem.style.setProperty('--stem-top', `${crownTop - 38}px`);
      stem.style.setProperty('--stem-width', `${Math.max(18, Math.min(30, scale.rx * 0.42))}px`);
      stem.style.setProperty('--stem-height', `${Math.max(30, Math.min(44, scale.ry * 0.28))}px`);
    }

    currentCarvingState.shapes = shapeItem.id;
    flashStencilMount();
    renderOptionsGrid();
  }

  function mountCarvingFeature(category, itemId) {
    const catData = CATALOG_DATABASE[category];
    if (!catData) return;

    const item = catData.items.find(i => i.id === itemId);

    // Toggle off if currently mounted
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
      showToast(`Gourd skin: ${item.name}`, 'fa-shapes');
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

    // Clear existing slots first
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
    showToast(`Loaded Preset: ${preset.name}`, 'fa-book-skull');
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

    applyPreset({ name: 'Random Surprise', recipe: randomRecipe });
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
    showToast('Pumpkin Canvas Cleared', 'fa-rotate-left');
    renderOptionsGrid();
  }

  /* ==========================================================================
     6. Rendering Toolbox Grid & Categories
     ========================================================================== */
  function renderOptionsGrid() {
    const container = document.getElementById('optionsGridContainer');
    const catTitle = document.getElementById('toolboxCategoryTitle');
    const catSubtitle = document.getElementById('toolboxCategorySubtitle');
    const countBadge = document.getElementById('categoryItemCount');

    const catData = CATALOG_DATABASE[activeCategory];
    if (!catData || !container) return;

    if (catTitle) catTitle.textContent = catData.title;
    if (catSubtitle) catSubtitle.textContent = catData.subtitle;
    if (countBadge) countBadge.textContent = `${catData.items.length} Options`;

    const renderShapeIcon = (item) => {
      const skin = item.skin === 'pumpkinSkinGhost' ? '#c3cfe2' : item.skin === 'pumpkinSkinGoo' ? '#2eb82e' : '#e65c00';
      const rib = item.skin === 'pumpkinSkinGhost' ? '#687790' : item.skin === 'pumpkinSkinGoo' ? '#0f3d0f' : '#802b00';
      const body = item.id === 'shape-tall' ? 'M28 82 Q18 50 32 20 Q50 8 68 20 Q82 50 72 82 Q50 94 28 82Z' :
        item.id === 'shape-squat' ? 'M12 68 Q18 35 50 30 Q82 35 88 68 Q50 88 12 68Z' :
        item.id === 'shape-mini' ? 'M28 78 Q22 48 34 26 Q50 14 66 26 Q78 48 72 78 Q50 90 28 78Z' :
        item.id === 'shape-twisted' ? 'M20 78 Q32 58 22 38 Q36 14 52 25 Q68 10 80 36 Q68 58 80 78 Q50 92 20 78Z' :
        item.id === 'shape-white-stacked' ? '' :
        'M16 74 Q12 44 28 24 Q50 10 72 24 Q88 44 84 74 Q50 90 16 74Z';

      if (item.id === 'shape-white-stacked') {
        return `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="70" rx="32" ry="20" fill="${skin}"/><ellipse cx="50" cy="50" rx="28" ry="20" fill="${skin}"/><ellipse cx="50" cy="30" rx="22" ry="16" fill="${skin}"/><path d="M34 28 Q28 50 35 70 M50 20 V82 M66 28 Q72 50 65 70" fill="none" stroke="${rib}" stroke-width="4"/><rect x="46" y="11" width="8" height="12" rx="3" fill="#4d6600"/></svg>`;
      }

      return `<svg viewBox="0 0 100 100"><path d="${body}" fill="${skin}"/><path d="M35 24 Q27 50 35 76 M50 18 Q43 50 50 82 M65 24 Q73 50 65 76" fill="none" stroke="${rib}" stroke-width="4"/><path d="M50 20 Q45 12 50 5 Q58 10 55 20Z" fill="#4d6600"/><ellipse cx="50" cy="22" rx="15" ry="5" fill="#3f5600"/></svg>`;
    };

    container.innerHTML = catData.items.map(item => {
      const isSelected = currentCarvingState[activeCategory] === item.id;
      const icon = activeCategory === 'shapes' ? renderShapeIcon(item) : item.iconSvg;
      return `
        <article class="feature-card ${isSelected ? 'selected' : ''}" data-category="${activeCategory}" data-id="${item.id}" tabindex="0">
          <div class="feature-card-icon">
            ${icon}
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

  /* ==========================================================================
     7. Drag-To-Scroll Helper
     ========================================================================== */
  function setupDragToScroll(element) {
    if (!element) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    element.addEventListener('mousedown', (e) => {
      isDown = true;
      element.style.cursor = 'grabbing';
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    });

    element.addEventListener('mouseleave', () => { isDown = false; element.style.cursor = 'default'; });
    element.addEventListener('mouseup', () => { isDown = false; element.style.cursor = 'default'; });
    element.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 1.5;
      element.scrollLeft = scrollLeft - walk;
    });
  }

  /* ==========================================================================
     8. Event Listeners & Master Initializer
     ========================================================================== */
  function init() {
    renderOptionsGrid();
    renderPresetsCarousel();

    // Category Tabs Navigation
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

    // Options Grid Item Selection Delegation
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

    // Presets Carousel Selection Delegation
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
      setupDragToScroll(presetsCarousel);
    }

    // Toggle Candle Glow Light
    const toggleLightBtn = document.getElementById('toggleLightBtn');
    const pumpkinViewport = document.getElementById('pumpkinViewport');
    if (toggleLightBtn && pumpkinViewport) {
      toggleLightBtn.addEventListener('click', () => {
        isCandleLit = !isCandleLit;
        toggleLightBtn.classList.toggle('active', isCandleLit);
        pumpkinViewport.classList.toggle('candle-lit', isCandleLit);
        showToast(isCandleLit ? 'Candle Lit! Flickering glow active' : 'Candle Extinguished', 'fa-fire-flame-curved');
      });
    }

    // Toggle Dark Night Room Mode
    const toggleRoomBtn = document.getElementById('toggleRoomBtn');
    if (toggleRoomBtn && pumpkinViewport) {
      toggleRoomBtn.addEventListener('click', () => {
        isNightMode = !isNightMode;
        toggleRoomBtn.classList.toggle('active', isNightMode);
        pumpkinViewport.classList.toggle('night-mode', isNightMode);
        showToast(isNightMode ? 'Night Room Mode: ON' : 'Daylight Mode: ON', 'fa-moon');
      });
    }

    // Randomize Idea Button
    const randomBtn = document.getElementById('randomIdeaBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', randomizeCarving);
    }

    // Reset Stage Button
    const resetBtn = document.getElementById('resetStageBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetStage);
    }

    // Share Design Button
    const copyCodeBtn = document.getElementById('copyIdeaCodeBtn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        const seed = btoa(JSON.stringify(currentCarvingState));
        const shareText = `My Halloween pumpkin design: JACK-RECIPE-${seed}`;

        if (navigator.share) {
          navigator.share({ title: 'My Pumpkin Design', text: shareText }).then(() => {
            showToast('Design Shared!', 'fa-share-nodes');
          }).catch(() => {});
          return;
        }

        navigator.clipboard.writeText(shareText).then(() => {
          showToast('Design Link Copied!', 'fa-link');
        }).catch(() => {
          showToast('Design Recipe Generated!', 'fa-check');
        });
      });
    }

    // Export Card Notification
    const exportCardBtn = document.getElementById('exportIdeaCardBtn');
    if (exportCardBtn) {
      exportCardBtn.addEventListener('click', () => {
        showToast('Saving Stencil Idea Card...', 'fa-camera');
      });
    }

    // Collapsible Preset Drawer
    const drawerToggle = document.getElementById('drawerHeaderToggle');
    const presetDrawer = document.getElementById('presetDrawer');
    if (drawerToggle && presetDrawer) {
      drawerToggle.addEventListener('click', () => {
        isDrawerExpanded = !isDrawerExpanded;
        presetDrawer.classList.toggle('expanded', isDrawerExpanded);
      });
    }

    // Help Dialog Button
    const helpBtn = document.getElementById('helpModalBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        showToast('Tip: Select tabs below & mix and match features!', 'fa-lightbulb');
      });
    }

    // App Dock Navigation Switching
    document.querySelectorAll('.app-dock-nav .dock-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.app-dock-nav .dock-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
