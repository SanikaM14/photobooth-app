/**
 * stripTemplates.js
 * Data definitions for all 39 photobooth strip templates.
 * Each template uses percentage-based slot coordinates (0–1) relative to canvas dimensions.
 *
 * Emojis are completely removed. We use Bootstrap Icons for categories and templates,
 * and elegant monochrome unicode vector symbols for canvas overlays.
 */

// ─── helpers ──────────────────────────────────────────────────────────────────
const pct = (x, y, w, h, rotation = 0, style = 'polaroid', extra = {}) =>
  ({ x, y, w, h, rotation, style, ...extra });

// ─── template list ────────────────────────────────────────────────────────────
export const STRIP_TEMPLATES = [

  /* ═══════════════════════════════════════════
     CATEGORY: Floral / Yellow / Sunflower
  ════════════════════════════════════════════ */
  {
    id: 'sunflower-scrap-3',
    name: 'Sunflower Memories',
    iconClass: 'bi bi-sun-fill',
    category: 'Floral',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#FFF9C4', '#FFE082', '#FFF176'],
    bgAngle: 135,
    accent: '#F9A825',
    textColor: '#5D4037',
    slots: [
      pct(0.04, 0.04, 0.62, 0.28, -4, 'polaroid'),
      pct(0.28, 0.36, 0.65, 0.27,  3, 'polaroid'),
      pct(0.06, 0.66, 0.60, 0.27, -2, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.82, y: 0.05, size: 56, color: '#F57F17', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.05, y: 0.88, size: 44, color: '#F57F17', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.75, y: 0.55, size: 28, color: '#F57F17', font: 'sans-serif' },
      { type: 'text', text: 'memories ♡', x: 0.55, y: 0.95, size: 16, color: '#8D6E63', font: 'cursive' },
    ],
  },

  {
    id: 'birthday-gold-3',
    name: 'Happy Birthday',
    iconClass: 'bi bi-cake2-fill',
    category: 'Floral',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#FFFDE7', '#FFF8E1', '#F3E5AB'],
    bgAngle: 160,
    accent: '#F9A825',
    textColor: '#5D4037',
    slots: [
      pct(0.08, 0.06, 0.58, 0.26, -2, 'polaroid'),
      pct(0.30, 0.36, 0.60, 0.26,  3, 'polaroid'),
      pct(0.06, 0.66, 0.58, 0.26, -1, 'polaroid'),
    ],
    overlays: [
      { type: 'text',  text: 'Happy Birthday', x: 0.62, y: 0.08, size: 18, color: '#B8860B', font: 'serif' },
      { type: 'text',  text: 'to you ✦', x: 0.65, y: 0.13, size: 15, color: '#B8860B', font: 'serif' },
      { type: 'text',  text: '♥', x: 0.85, y: 0.32, size: 40, color: '#B71C1C', font: 'sans-serif' },
      { type: 'text',  text: '★', x: 0.82, y: 0.60, size: 30, color: '#B8860B', font: 'sans-serif' },
      { type: 'text',  text: 'Make a Wish!', x: 0.55, y: 0.94, size: 16, color: '#A0522D', font: 'cursive' },
      { type: 'text',  text: 'Golden Moment', x: 0.53, y: 0.98, size: 13, color: '#8D6E63', font: 'cursive' },
    ],
  },

  {
    id: 'sunflower-simple-2',
    name: 'Sunny Day',
    iconClass: 'bi bi-brightness-high-fill',
    category: 'Floral',
    photoCount: 2,
    width: 600, height: 900,
    bg: ['#FFEE58', '#FFF176', '#FFCA28'],
    bgAngle: 90,
    accent: '#F57F17',
    textColor: '#4E342E',
    slots: [
      pct(0.08, 0.06, 0.84, 0.40, 0, 'soft'),
      pct(0.08, 0.54, 0.84, 0.38, 0, 'soft'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.05, y: 0.03, size: 50, color: '#F57F17', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.78, y: 0.88, size: 46, color: '#F57F17', font: 'sans-serif' },
      { type: 'text', text: '❀', x: 0.82, y: 0.04, size: 32, color: '#E65100', font: 'sans-serif' },
    ],
  },

  {
    id: 'pink-lily-1',
    name: 'Lily Bloom',
    iconClass: 'bi bi-flower1',
    category: 'Floral',
    photoCount: 1,
    width: 600, height: 800,
    bg: ['#FCE4EC', '#F8BBD9', '#F48FB1'],
    bgAngle: 150,
    accent: '#E91E8C',
    textColor: '#880E4F',
    slots: [
      pct(0.10, 0.25, 0.80, 0.50, 0, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.05, y: 0.04, size: 72, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.72, y: 0.78, size: 60, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '❀', x: 0.80, y: 0.12, size: 40, color: '#F48FB1', font: 'sans-serif' },
    ],
  },

  {
    id: 'red-lily-dark-1',
    name: 'Red Hibiscus',
    iconClass: 'bi bi-flower2',
    category: 'Floral',
    photoCount: 1,
    width: 600, height: 900,
    bg: ['#3E0000', '#7B0000', '#1A0000'],
    bgAngle: 45,
    accent: '#B71C1C',
    textColor: '#FFCDD2',
    slots: [
      pct(0.08, 0.18, 0.84, 0.58, 0, 'minimal', { borderColor: '#222' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.02, y: 0.02, size: 70, color: '#B71C1C', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.70, y: 0.80, size: 65, color: '#B71C1C', font: 'sans-serif' },
      { type: 'text', text: 'la beauté', x: 0.55, y: 0.95, size: 18, color: '#EF9A9A', font: 'cursive' },
    ],
  },

  {
    id: 'favorite-person-3',
    name: 'Favorite Person',
    iconClass: 'bi bi-people-fill',
    category: 'Floral',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#FCE4EC', '#F8BBD9', '#FFEEFF'],
    bgAngle: 120,
    accent: '#C2185B',
    textColor: '#880E4F',
    slots: [
      pct(0.10, 0.06, 0.55, 0.24, -3, 'polaroid'),
      pct(0.35, 0.34, 0.55, 0.24,  2, 'polaroid'),
      pct(0.08, 0.62, 0.58, 0.24, -1, 'polaroid'),
    ],
    overlays: [
      { type: 'text',  text: 'Favorite', x: 0.65, y: 0.08, size: 20, color: '#880E4F', font: 'serif' },
      { type: 'text',  text: 'person ♡', x: 0.62, y: 0.13, size: 18, color: '#880E4F', font: 'serif' },
      { type: 'text',  text: '❀', x: 0.82, y: 0.36, size: 36, color: '#C2185B', font: 'sans-serif' },
      { type: 'text',  text: '✿', x: 0.06, y: 0.88, size: 36, color: '#C2185B', font: 'sans-serif' },
      { type: 'text',  text: '♥', x: 0.80, y: 0.90, size: 30, color: '#880E4F', font: 'sans-serif' },
    ],
  },

  {
    id: 'scattered-memo-3',
    name: 'Scattered Memories',
    iconClass: 'bi bi-images',
    category: 'Floral',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#FAFAFA', '#F5F0E8', '#EDE0D4'],
    bgAngle: 0,
    accent: '#795548',
    textColor: '#5D4037',
    slots: [
      pct(0.05, 0.05, 0.55, 0.28, -8, 'polaroid'),
      pct(0.38, 0.32, 0.56, 0.28,  5, 'polaroid'),
      pct(0.10, 0.62, 0.54, 0.28, -3, 'polaroid'),
    ],
    overlays: [
      { type: 'text',  text: '❀', x: 0.78, y: 0.06, size: 32, color: '#8D6E63', font: 'sans-serif' },
      { type: 'text',  text: '✦ moments ✦', x: 0.35, y: 0.95, size: 15, color: '#795548', font: 'cursive' },
    ],
  },

  {
    id: 'golden-sunflower-3',
    name: 'Golden Fields',
    iconClass: 'bi bi-award-fill',
    category: 'Floral',
    photoCount: 3,
    width: 600, height: 1200,
    bg: ['#8B6914', '#B8860B', '#C9A227', '#E8C547'],
    bgAngle: 160,
    accent: '#F9A825',
    textColor: '#FFFDE7',
    slots: [
      pct(0.12, 0.07, 0.76, 0.24, -3, 'polaroid', { borderColor: '#F9A825' }),
      pct(0.12, 0.36, 0.76, 0.24,  2, 'polaroid', { borderColor: '#F9A825' }),
      pct(0.12, 0.65, 0.76, 0.24,  0, 'polaroid', { borderColor: '#F9A825' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.02, y: 0.91, size: 48, color: '#FFD54F', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.75, y: 0.02, size: 42, color: '#FFD54F', font: 'sans-serif' },
      { type: 'text', text: '❀', x: 0.80, y: 0.90, size: 36, color: '#FFE082', font: 'sans-serif' },
    ],
  },

  {
    id: 'golden-diagonal-2',
    name: 'Golden Tilt',
    iconClass: 'bi bi-lightning-charge-fill',
    category: 'Floral',
    photoCount: 2,
    width: 600, height: 1050,
    bg: ['#7B5E00', '#9E7D00', '#C49A00', '#E8C547'],
    bgAngle: 120,
    accent: '#FFD54F',
    textColor: '#FFFDE7',
    slots: [
      pct(0.08, 0.08, 0.72, 0.36, -10, 'polaroid'),
      pct(0.20, 0.55, 0.70, 0.35,   8, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.78, y: 0.04, size: 52, color: '#FFD54F', font: 'sans-serif' },
      { type: 'text', text: '❀', x: 0.04, y: 0.86, size: 44, color: '#FFE082', font: 'sans-serif' },
    ],
  },

  /* ═══════════════════════════════════════════
     CATEGORY: Purple / Lavender
  ════════════════════════════════════════════ */
  {
    id: 'purple-washi-3',
    name: 'Purple Washi',
    iconClass: 'bi bi-sticky-fill',
    category: 'Purple',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#EDE7F6', '#D1C4E9', '#B39DDB'],
    bgAngle: 180,
    accent: '#7B1FA2',
    textColor: '#4A148C',
    slots: [
      pct(0.10, 0.07, 0.62, 0.26, -5, 'tape'),
      pct(0.28, 0.37, 0.60, 0.26,  4, 'tape'),
      pct(0.08, 0.67, 0.62, 0.26, -2, 'tape'),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.80, y: 0.07, size: 36, color: '#7B1FA2', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.02, y: 0.88, size: 32, color: '#7B1FA2', font: 'sans-serif' },
      { type: 'text', text: '●', x: 0.84, y: 0.56, size: 20, color: '#9C27B0', font: 'sans-serif' },
    ],
  },

  {
    id: 'purple-scattered-3',
    name: 'Purple Scatter',
    iconClass: 'bi bi-grid-3x3-gap-fill',
    category: 'Purple',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#CE93D8', '#AB47BC', '#9C27B0'],
    bgAngle: 135,
    accent: '#E1BEE7',
    textColor: '#F3E5F5',
    slots: [
      pct(0.06, 0.06, 0.60, 0.28,  -6, 'polaroid'),
      pct(0.32, 0.37, 0.60, 0.26,   7, 'polaroid'),
      pct(0.06, 0.68, 0.60, 0.26,  -4, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.78, y: 0.10, size: 44, color: '#E1BEE7', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.80, y: 0.88, size: 36, color: '#E1BEE7', font: 'sans-serif' },
    ],
  },

  {
    id: 'lavender-butterfly-3',
    name: 'La Beauté',
    iconClass: 'bi bi-butterfly-fill',
    category: 'Purple',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#B39DDB', '#7E57C2', '#9575CD'],
    bgAngle: 160,
    accent: '#EDE7F6',
    textColor: '#F3E5F5',
    slots: [
      pct(0.08, 0.06, 0.62, 0.27, -4, 'rough'),
      pct(0.30, 0.37, 0.60, 0.26,  5, 'rough'),
      pct(0.08, 0.67, 0.60, 0.26, -2, 'rough'),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.78, y: 0.08, size: 48, color: '#EDE7F6', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.02, y: 0.84, size: 40, color: '#EDE7F6', font: 'sans-serif' },
      { type: 'text', text: 'la beauté', x: 0.55, y: 0.94, size: 16, color: '#EDE7F6', font: 'cursive' },
    ],
  },

  {
    id: 'bloom-softly-3',
    name: 'Bloom Softly',
    iconClass: 'bi bi-brightness-low-fill',
    category: 'Purple',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#EDE7F6', '#D1C4E9', '#C5CAE9'],
    bgAngle: 120,
    accent: '#7B1FA2',
    textColor: '#4A148C',
    slots: [
      pct(0.08, 0.06, 0.80, 0.24, 0, 'soft'),
      pct(0.08, 0.34, 0.80, 0.24, 0, 'soft'),
      pct(0.08, 0.62, 0.80, 0.24, 0, 'soft'),
    ],
    overlays: [
      { type: 'text',  text: '✦ Bloom softly ✦', x: 0.18, y: 0.92, size: 17, color: '#7B1FA2', font: 'cursive' },
      { type: 'text', text: '✿', x: 0.80, y: 0.06, size: 40, color: '#7B1FA2', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.04, y: 0.88, size: 36, color: '#7B1FA2', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.78, y: 0.54, size: 32, color: '#7B1FA2', font: 'sans-serif' },
    ],
  },

  {
    id: 'cream-knit-3',
    name: 'Cozy Knit',
    iconClass: 'bi bi-border-outer',
    category: 'Purple',
    photoCount: 3,
    width: 600, height: 1050,
    bg: ['#EFEBE9', '#D7CCC8', '#BCAAA4'],
    bgAngle: 0,
    accent: '#D4926A',
    textColor: '#5D4037',
    slots: [
      pct(0.06, 0.06, 0.62, 0.27, -6, 'rough', { borderColor: '#8D6E63' }),
      pct(0.30, 0.37, 0.60, 0.26,  5, 'rough', { borderColor: '#8D6E63' }),
      pct(0.08, 0.67, 0.62, 0.27, -3, 'rough', { borderColor: '#8D6E63' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.78, y: 0.05, size: 38, color: '#8D6E63', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.80, y: 0.90, size: 34, color: '#8D6E63', font: 'sans-serif' },
    ],
  },

  {
    id: 'dark-purple-1',
    name: 'Midnight Violet',
    iconClass: 'bi bi-moon-stars-fill',
    category: 'Purple',
    photoCount: 1,
    width: 600, height: 900,
    bg: ['#1A0030', '#2E0050', '#4A0080'],
    bgAngle: 45,
    accent: '#CE93D8',
    textColor: '#EDE7F6',
    slots: [
      pct(0.06, 0.10, 0.88, 0.72, 0, 'minimal', { borderColor: '#7B1FA2' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.70, y: 0.88, size: 60, color: '#CE93D8', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.02, y: 0.04, size: 48, color: '#CE93D8', font: 'sans-serif' },
    ],
  },

  {
    id: 'purple-gingham-bear-2',
    name: 'Purple Bear',
    iconClass: 'bi bi-balloon-fill',
    category: 'Purple',
    photoCount: 2,
    width: 600, height: 900,
    bg: ['#CE93D8', '#BA68C8', '#9C27B0'],
    bgAngle: 45,
    accent: '#F3E5F5',
    textColor: '#1A0030',
    slots: [
      pct(0.08, 0.06, 0.84, 0.38, 0, 'gingham'),
      pct(0.08, 0.52, 0.84, 0.38, 0, 'gingham'),
    ],
    overlays: [
      { type: 'text', text: '♥', x: 0.80, y: 0.88, size: 48, color: '#F3E5F5', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.04, y: 0.04, size: 32, color: '#F3E5F5', font: 'sans-serif' },
    ],
  },

  {
    id: 'purple-bow-polaroid-1',
    name: 'Purple Bow',
    iconClass: 'bi bi-hearts',
    category: 'Purple',
    photoCount: 1,
    width: 600, height: 800,
    bg: ['#F3E5F5', '#FFFFFF'],
    bgAngle: 180,
    accent: '#9C27B0',
    textColor: '#6A1B9A',
    slots: [
      pct(0.10, 0.10, 0.80, 0.68, 0, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '♥', x: 0.42, y: 0.83, size: 48, color: '#9C27B0', font: 'sans-serif' },
      { type: 'text', text: '●', x: 0.04, y: 0.04, size: 24, color: '#F3E5F5', font: 'sans-serif' },
      { type: 'text', text: '●', x: 0.88, y: 0.04, size: 24, color: '#F3E5F5', font: 'sans-serif' },
    ],
  },

  {
    id: 'purple-tech-camera-2',
    name: 'Purple Studio',
    iconClass: 'bi bi-camera-reels-fill',
    category: 'Purple',
    photoCount: 2,
    width: 600, height: 900,
    bg: ['#9C27B0', '#7B1FA2', '#6A1B9A'],
    bgAngle: 90,
    accent: '#E1BEE7',
    textColor: '#FFFFFF',
    slots: [
      pct(0.08, 0.08, 0.84, 0.36, 0, 'soft'),
      pct(0.08, 0.54, 0.84, 0.36, 0, 'soft'),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.04, y: 0.04, size: 36, color: '#E1BEE7', font: 'sans-serif' },
      { type: 'text', text: '♪', x: 0.80, y: 0.06, size: 28, color: '#E1BEE7', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.80, y: 0.88, size: 32, color: '#E1BEE7', font: 'sans-serif' },
    ],
  },

  {
    id: 'purple-script-tall-1',
    name: 'Script Purple',
    iconClass: 'bi bi-pen-fill',
    category: 'Purple',
    photoCount: 1,
    width: 500, height: 900,
    bg: ['#5C2D91', '#7B1FA2', '#6A1B9A'],
    bgAngle: 160,
    accent: '#CE93D8',
    textColor: '#F3E5F5',
    slots: [
      pct(0.08, 0.12, 0.84, 0.68, 0, 'soft'),
    ],
    overlays: [
      { type: 'text', text: '♥', x: 0.72, y: 0.86, size: 44, color: '#CE93D8', font: 'sans-serif' },
      { type: 'text',  text: 'souvenir ✦', x: 0.55, y: 0.95, size: 14, color: '#CE93D8', font: 'cursive' },
    ],
  },

  {
    id: 'purple-gingham-flower-1',
    name: 'Garden Purple',
    iconClass: 'bi bi-tree-fill',
    category: 'Purple',
    photoCount: 1,
    width: 600, height: 800,
    bg: ['#BA68C8', '#9C27B0', '#CE93D8'],
    bgAngle: 135,
    accent: '#F3E5F5',
    textColor: '#1A0030',
    slots: [
      pct(0.12, 0.16, 0.76, 0.60, 0, 'gingham'),
    ],
    overlays: [
      { type: 'text',  text: 'add photo', x: 0.32, y: 0.50, size: 22, color: 'rgba(0,0,0,0.3)', font: 'sans-serif' },
      { type: 'text', text: '❀', x: 0.04, y: 0.88, size: 42, color: '#CE93D8', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.78, y: 0.04, size: 36, color: '#CE93D8', font: 'sans-serif' },
    ],
  },

  /* ═══════════════════════════════════════════
     CATEGORY: Pink / Kawaii / Cute
  ════════════════════════════════════════════ */
  {
    id: 'camera-cute-2',
    name: 'Camera Kawaii',
    iconClass: 'bi bi-camera-fill',
    category: 'Pink',
    photoCount: 2,
    width: 600, height: 900,
    bg: ['#FCE4EC', '#F8BBD9', '#F48FB1'],
    bgAngle: 120,
    accent: '#E91E63',
    textColor: '#880E4F',
    slots: [
      pct(0.08, 0.06, 0.68, 0.35, -4, 'polaroid', { label: 'photo' }),
      pct(0.18, 0.52, 0.68, 0.34,  3, 'polaroid', { label: 'photo' }),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.78, y: 0.06, size: 52, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.78, y: 0.88, size: 44, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.04, y: 0.90, size: 30, color: '#E91E63', font: 'sans-serif' },
      { type: 'text',  text: 'lovers club', x: 0.14, y: 0.96, size: 14, color: '#880E4F', font: 'cursive' },
    ],
  },

  {
    id: 'music-aesthetic-1',
    name: 'Music Vibes',
    iconClass: 'bi bi-music-note-beamed',
    category: 'Pink',
    photoCount: 1,
    width: 600, height: 900,
    bg: ['#F8BBD9', '#CE93D8', '#FCE4EC'],
    bgAngle: 135,
    accent: '#E91E63',
    textColor: '#880E4F',
    slots: [
      pct(0.10, 0.18, 0.80, 0.52, 0, 'minimal', { borderColor: '#222' }),
    ],
    overlays: [
      { type: 'text', text: '♥', x: 0.76, y: 0.04, size: 50, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '♪', x: 0.04, y: 0.06, size: 36, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.04, y: 0.88, size: 32, color: '#E91E63', font: 'sans-serif' },
      { type: 'text',  text: '♪ you & me ♪', x: 0.22, y: 0.80, size: 14, color: '#880E4F', font: 'cursive' },
    ],
  },

  {
    id: 'pink-soft-floral-2',
    name: 'Soft Blush',
    iconClass: 'bi bi-flower3',
    category: 'Pink',
    photoCount: 2,
    width: 600, height: 900,
    bg: ['#FFDDE6', '#FFC0CB', '#FFB6C1'],
    bgAngle: 160,
    accent: '#E91E63',
    textColor: '#880E4F',
    slots: [
      pct(0.08, 0.06, 0.84, 0.40, 0, 'polaroid'),
      pct(0.08, 0.52, 0.84, 0.40, 0, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.82, y: 0.04, size: 44, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.04, y: 0.88, size: 40, color: '#E91E63', font: 'sans-serif' },
    ],
  },

  {
    id: 'birthday-scrapbook-6',
    name: 'Birthday Scrapbook',
    iconClass: 'bi bi-calendar-heart-fill',
    category: 'Pink',
    photoCount: 6,
    width: 600, height: 1400,
    bg: ['#FDECEA', '#FFF0F5', '#F8F0FF'],
    bgAngle: 150,
    accent: '#E91E63',
    textColor: '#880E4F',
    slots: [
      pct(0.04, 0.03, 0.58, 0.20, -3, 'polaroid'),
      pct(0.40, 0.06, 0.52, 0.18,  4, 'polaroid'),
      pct(0.04, 0.27, 0.52, 0.19, -2, 'polaroid'),
      pct(0.38, 0.28, 0.54, 0.19,  2, 'polaroid'),
      pct(0.04, 0.51, 0.52, 0.20, -1, 'polaroid'),
      pct(0.38, 0.53, 0.54, 0.18,  3, 'polaroid'),
    ],
    overlays: [
      { type: 'text',  text: '✦ Happy Birthday ✦', x: 0.16, y: 0.80, size: 20, color: '#C2185B', font: 'cursive' },
      { type: 'text', text: '★', x: 0.70, y: 0.80, size: 50, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.04, y: 0.92, size: 38, color: '#E91E63', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.82, y: 0.90, size: 34, color: '#E91E63', font: 'sans-serif' },
    ],
  },

  /* ═══════════════════════════════════════════
     CATEGORY: Blue / Navy
  ════════════════════════════════════════════ */
  {
    id: 'blue-viola-2',
    name: 'Blue Viola',
    iconClass: 'bi bi-droplet-fill',
    category: 'Blue',
    photoCount: 2,
    width: 600, height: 900,
    bg: ['#BBDEFB', '#90CAF9', '#64B5F6'],
    bgAngle: 180,
    accent: '#1565C0',
    textColor: '#0D47A1',
    slots: [
      pct(0.08, 0.06, 0.76, 0.38, 0, 'soft', { borderColor: '#1565C0' }),
      pct(0.16, 0.52, 0.76, 0.38, 0, 'soft', { borderColor: '#1565C0' }),
    ],
    overlays: [
      { type: 'text', text: '❀', x: 0.76, y: 0.04, size: 50, color: '#1565C0', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.40, y: 0.88, size: 44, color: '#1565C0', font: 'sans-serif' },
    ],
  },

  {
    id: 'navy-floral-3',
    name: 'Navy Florals',
    iconClass: 'bi bi-tree-fill',
    category: 'Blue',
    photoCount: 3,
    width: 600, height: 1200,
    bg: ['#0A1628', '#0D2137', '#102840'],
    bgAngle: 160,
    accent: '#4FC3F7',
    textColor: '#E3F2FD',
    slots: [
      pct(0.08, 0.06, 0.84, 0.26, 0, 'soft', { borderColor: '#4FC3F7' }),
      pct(0.08, 0.36, 0.84, 0.26, 0, 'soft', { borderColor: '#4FC3F7' }),
      pct(0.08, 0.66, 0.84, 0.26, 0, 'soft', { borderColor: '#4FC3F7' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.82, y: 0.04, size: 44, color: '#4FC3F7', font: 'sans-serif' },
      { type: 'text', text: '❀', x: 0.04, y: 0.88, size: 36, color: '#4FC3F7', font: 'sans-serif' },
    ],
  },

  {
    id: 'dark-lily-film-3',
    name: 'Dark Lily Film',
    iconClass: 'bi bi-film',
    category: 'Blue',
    photoCount: 3,
    width: 420, height: 1500,
    bg: ['#0A0A0A', '#1A1A1A', '#0D0D0D'],
    bgAngle: 0,
    accent: '#FF5252',
    textColor: '#FFFFFF',
    slots: [
      pct(0.08, 0.04, 0.84, 0.28, 0, 'film'),
      pct(0.08, 0.36, 0.84, 0.28, 0, 'film'),
      pct(0.08, 0.68, 0.84, 0.28, 0, 'film'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.70, y: 0.04, size: 48, color: '#FF5252', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.02, y: 0.94, size: 44, color: '#FF5252', font: 'sans-serif' },
    ],
  },

  /* ═══════════════════════════════════════════
     CATEGORY: Dark / Bold
  ════════════════════════════════════════════ */
  {
    id: 'diva-roses-3',
    name: 'Diva Vibes',
    iconClass: 'bi bi-gem',
    category: 'Bold',
    photoCount: 3,
    width: 600, height: 1200,
    bg: ['#B71C1C', '#7F0000', '#C62828'],
    bgAngle: 160,
    accent: '#FFCCBC',
    textColor: '#FFCCBC',
    slots: [
      pct(0.08, 0.10, 0.84, 0.24, 0, 'rough', { borderColor: '#FFF' }),
      pct(0.08, 0.38, 0.84, 0.24, 0, 'rough', { borderColor: '#FFF' }),
      pct(0.08, 0.66, 0.84, 0.24, 0, 'rough', { borderColor: '#FFF' }),
    ],
    overlays: [
      { type: 'text',  text: 'DIVA', x: 0.35, y: 0.06, size: 32, color: '#FFFFFF', font: 'bold serif' },
      { type: 'text',  text: 'Confident. Classy.', x: 0.20, y: 0.09, size: 11, color: '#FFCDD2', font: 'sans-serif' },
      { type: 'text', text: '♥', x: 0.04, y: 0.94, size: 32, color: '#FFCCBC', font: 'sans-serif' },
      { type: 'text',  text: 'Born to stand out', x: 0.24, y: 0.96, size: 13, color: '#FFCDD2', font: 'cursive' },
      { type: 'text', text: '✿', x: 0.80, y: 0.04, size: 40, color: '#FFCCBC', font: 'sans-serif' },
    ],
  },

  {
    id: 'maroon-lace-2',
    name: 'Maroon Lace',
    iconClass: 'bi bi-ribbon-fill',
    category: 'Bold',
    photoCount: 2,
    width: 600, height: 1000,
    bg: ['#3E0011', '#5D001E', '#6D002A'],
    bgAngle: 90,
    accent: '#F8BBD9',
    textColor: '#FCE4EC',
    slots: [
      pct(0.08, 0.08, 0.84, 0.36, 0, 'rough', { borderColor: '#F8BBD9' }),
      pct(0.08, 0.52, 0.84, 0.36, 0, 'rough', { borderColor: '#F8BBD9' }),
    ],
    overlays: [
      { type: 'text', text: '♥', x: 0.42, y: 0.90, size: 44, color: '#F8BBD9', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.04, y: 0.04, size: 36, color: '#F8BBD9', font: 'sans-serif' },
    ],
  },

  {
    id: 'endless-moments-3',
    name: 'Endless Moments',
    iconClass: 'bi bi-camera-video-fill',
    category: 'Bold',
    photoCount: 3,
    width: 380, height: 1200,
    bg: ['#2D0010', '#4A0020', '#3D0018'],
    bgAngle: 0,
    accent: '#EFEBE9',
    textColor: '#EFEBE9',
    slots: [
      pct(0.08, 0.04, 0.84, 0.28, 0, 'film', { borderColor: '#EFEBE9' }),
      pct(0.08, 0.36, 0.84, 0.28, 0, 'film', { borderColor: '#EFEBE9' }),
      pct(0.08, 0.68, 0.84, 0.28, 0, 'film', { borderColor: '#EFEBE9' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.65, y: 0.04, size: 40, color: '#EFEBE9', font: 'sans-serif' },
      { type: 'text',  text: 'Endless Moments', x: 0.15, y: 0.96, size: 16, color: '#EFEBE9', font: 'cursive' },
      { type: 'text', text: '♥', x: 0.10, y: 0.94, size: 28, color: '#EFEBE9', font: 'sans-serif' },
    ],
  },

  {
    id: 'double-maroon-strip-6',
    name: 'Double Strip',
    iconClass: 'bi bi-columns-gap',
    category: 'Bold',
    photoCount: 6,
    width: 800, height: 1050,
    bg: ['#F5F0E8', '#EDE0D4'],
    bgAngle: 0,
    accent: '#5D001E',
    textColor: '#3E0011',
    slots: [
      // Left strip
      pct(0.04, 0.04, 0.42, 0.28, 0, 'film', { borderColor: '#5D001E' }),
      pct(0.04, 0.36, 0.42, 0.28, 0, 'film', { borderColor: '#5D001E' }),
      pct(0.04, 0.68, 0.42, 0.28, 0, 'film', { borderColor: '#5D001E' }),
      // Right strip
      pct(0.54, 0.04, 0.42, 0.28, 0, 'film', { borderColor: '#5D001E' }),
      pct(0.54, 0.36, 0.42, 0.28, 0, 'film', { borderColor: '#5D001E' }),
      pct(0.54, 0.68, 0.42, 0.28, 0, 'film', { borderColor: '#5D001E' }),
    ],
    overlays: [
      { type: 'text',  text: 'Endless Moments', x: 0.10, y: 0.97, size: 14, color: '#5D001E', font: 'cursive' },
      { type: 'text',  text: 'Endless Moments', x: 0.58, y: 0.97, size: 14, color: '#5D001E', font: 'cursive' },
    ],
  },

  {
    id: 'vintage-cat-5',
    name: 'Vintage Garden',
    iconClass: 'bi bi-flower2',
    category: 'Bold',
    photoCount: 5,
    width: 600, height: 1200,
    bg: ['#F5E6CA', '#EDD9A3', '#E8D08A'],
    bgAngle: 120,
    accent: '#5D4037',
    textColor: '#3E2723',
    slots: [
      pct(0.06, 0.04, 0.54, 0.18, -3, 'polaroid'),
      pct(0.38, 0.06, 0.52, 0.18,  4, 'polaroid'),
      pct(0.06, 0.27, 0.52, 0.18, -2, 'polaroid'),
      pct(0.38, 0.29, 0.52, 0.18,  2, 'polaroid'),
      pct(0.12, 0.51, 0.76, 0.28,  0, 'polaroid'),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.76, y: 0.82, size: 42, color: '#5D4037', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.04, y: 0.84, size: 38, color: '#5D4037', font: 'sans-serif' },
      { type: 'text',  text: 'Favorite Person ♡', x: 0.22, y: 0.94, size: 15, color: '#5D403brown', font: 'cursive' },
    ],
  },

  /* ═══════════════════════════════════════════
     CATEGORY: Film / Vintage
  ════════════════════════════════════════════ */
  {
    id: 'classic-film-4',
    name: 'Classic Film Strip',
    iconClass: 'bi bi-film',
    category: 'Film',
    photoCount: 4,
    width: 380, height: 1600,
    bg: ['#111111', '#1A1A1A'],
    bgAngle: 0,
    accent: '#FFFFFF',
    textColor: '#FFFFFF',
    slots: [
      pct(0.08, 0.04, 0.84, 0.21, 0, 'film'),
      pct(0.08, 0.27, 0.84, 0.21, 0, 'film'),
      pct(0.08, 0.51, 0.84, 0.21, 0, 'film'),
      pct(0.08, 0.75, 0.84, 0.21, 0, 'film'),
    ],
    overlays: [
      { type: 'text', text: '© ROSE PHOTOBOOTH', x: 0.12, y: 0.97, size: 10, color: '#AAAAAA', font: 'monospace' },
    ],
  },

  {
    id: 'green-film-nature-3',
    name: 'Green Nature Film',
    iconClass: 'bi bi-flower1',
    category: 'Film',
    photoCount: 3,
    width: 420, height: 1400,
    bg: ['#1B5E20', '#2E7D32', '#1B5E20'],
    bgAngle: 0,
    accent: '#A5D6A7',
    textColor: '#E8F5E9',
    slots: [
      pct(0.08, 0.04, 0.84, 0.26, 0, 'film', { borderColor: '#A5D6A7' }),
      pct(0.08, 0.34, 0.84, 0.26, 0, 'film', { borderColor: '#A5D6A7' }),
      pct(0.08, 0.64, 0.84, 0.26, 0, 'film', { borderColor: '#A5D6A7' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.75, y: 0.02, size: 40, color: '#A5D6A7', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.38, y: 0.93, size: 32, color: '#A5D6A7', font: 'sans-serif' },
      { type: 'text', text: '★', x: 0.06, y: 0.93, size: 26, color: '#A5D6A7', font: 'sans-serif' },
    ],
  },

  {
    id: 'green-camera-film-4',
    name: 'Green Film Camera',
    iconClass: 'bi bi-camera-video-fill',
    category: 'Film',
    photoCount: 4,
    width: 420, height: 1600,
    bg: ['#1B5E20', '#2E7D32', '#388E3C'],
    bgAngle: 0,
    accent: '#C8E6C9',
    textColor: '#E8F5E9',
    slots: [
      pct(0.10, 0.03, 0.80, 0.22, 0, 'film', { borderColor: '#C8E6C9' }),
      pct(0.10, 0.27, 0.80, 0.22, 0, 'film', { borderColor: '#C8E6C9' }),
      pct(0.10, 0.51, 0.80, 0.22, 0, 'film', { borderColor: '#C8E6C9' }),
      pct(0.10, 0.75, 0.80, 0.22, 0, 'film', { borderColor: '#C8E6C9' }),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.04, y: 0.03, size: 36, color: '#C8E6C9', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.70, y: 0.04, size: 38, color: '#C8E6C9', font: 'sans-serif' },
      { type: 'text', text: '✿', x: 0.70, y: 0.94, size: 34, color: '#C8E6C9', font: 'sans-serif' },
    ],
  },

  {
    id: 'film-lily-3',
    name: 'Film & Lily',
    iconClass: 'bi bi-film',
    category: 'Film',
    photoCount: 3,
    width: 420, height: 1400,
    bg: ['#0A0A0A', '#1A0A0A'],
    bgAngle: 0,
    accent: '#FF8A80',
    textColor: '#FFCCBC',
    slots: [
      pct(0.08, 0.04, 0.84, 0.27, 0, 'film'),
      pct(0.08, 0.35, 0.84, 0.27, 0, 'film'),
      pct(0.08, 0.66, 0.84, 0.27, 0, 'film'),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.60, y: 0.94, size: 52, color: '#FF8A80', font: 'sans-serif' },
    ],
  },

  {
    id: 'camera-colorful-4',
    name: 'Camera Collage',
    iconClass: 'bi bi-palette-fill',
    category: 'Film',
    photoCount: 4,
    width: 600, height: 1050,
    bg: ['#FAFAFA', '#F0F0F0'],
    bgAngle: 0,
    accent: '#E91E63',
    textColor: '#333333',
    slots: [
      pct(0.04, 0.04, 0.44, 0.42, 0, 'soft', { borderColor: '#1565C0' }),
      pct(0.52, 0.04, 0.44, 0.42, 0, 'soft', { borderColor: '#E91E63' }),
      pct(0.04, 0.54, 0.44, 0.42, 0, 'soft', { borderColor: '#2E7D32' }),
      pct(0.52, 0.54, 0.44, 0.42, 0, 'soft', { borderColor: '#F9A825' }),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.44, y: 0.46, size: 36, color: '#E91E63', font: 'sans-serif' },
    ],
  },

  /* ═══════════════════════════════════════════
     CATEGORY: Vintage
  ════════════════════════════════════════════ */
  {
    id: 'butterfly-scatter-5',
    name: 'Butterfly Dreams',
    iconClass: 'bi bi-wind',
    category: 'Vintage',
    photoCount: 5,
    width: 600, height: 1200,
    bg: ['#CE93D8', '#9C27B0', '#7B1FA2'],
    bgAngle: 135,
    accent: '#EDE7F6',
    textColor: '#F3E5F5',
    slots: [
      pct(0.04, 0.04, 0.48, 0.20, -5, 'rough'),
      pct(0.48, 0.06, 0.48, 0.20,  6, 'rough'),
      pct(0.04, 0.28, 0.48, 0.20, -3, 'rough'),
      pct(0.48, 0.30, 0.48, 0.20,  4, 'rough'),
      pct(0.12, 0.54, 0.76, 0.26,  0, 'rough'),
    ],
    overlays: [
      { type: 'text', text: '✦', x: 0.80, y: 0.84, size: 50, color: '#EDE7F6', font: 'sans-serif' },
      { type: 'text', text: '✦', x: 0.04, y: 0.84, size: 42, color: '#EDE7F6', font: 'sans-serif' },
    ],
  },

  {
    id: 'maroon-double-real-6',
    name: 'Rose Double Strip',
    iconClass: 'bi bi-flower1-fill',
    category: 'Vintage',
    photoCount: 6,
    width: 800, height: 1000,
    bg: ['#FDECEA', '#FFF0F0'],
    bgAngle: 0,
    accent: '#5D001E',
    textColor: '#3E0011',
    slots: [
      pct(0.04, 0.04, 0.42, 0.28, 0, 'film', { borderColor: '#8D001F' }),
      pct(0.04, 0.36, 0.42, 0.28, 0, 'film', { borderColor: '#8D001F' }),
      pct(0.04, 0.68, 0.42, 0.28, 0, 'film', { borderColor: '#8D001F' }),
      pct(0.54, 0.04, 0.42, 0.28, 0, 'film', { borderColor: '#8D001F' }),
      pct(0.54, 0.36, 0.42, 0.28, 0, 'film', { borderColor: '#8D001F' }),
      pct(0.54, 0.68, 0.42, 0.28, 0, 'film', { borderColor: '#8D001F' }),
    ],
    overlays: [
      { type: 'text', text: '✿', x: 0.36, y: 0.88, size: 40, color: '#8D001F', font: 'sans-serif' },
      { type: 'text', text: 'Endless Moments', x: 0.08, y: 0.97, size: 13, color: '#8D001F', font: 'cursive' },
      { type: 'text', text: 'Endless Moments', x: 0.58, y: 0.97, size: 13, color: '#8D001F', font: 'cursive' },
    ],
  },
];

// ─── category list for filtering ──────────────────────────────────────────────
export const TEMPLATE_CATEGORIES = [
  { id: 'all',     label: 'All',       iconClass: 'bi bi-stars' },
  { id: 'Floral',  label: 'Floral',    iconClass: 'bi bi-flower1' },
  { id: 'Purple',  label: 'Purple',    iconClass: 'bi bi-heart-fill' },
  { id: 'Pink',    label: 'Kawaii',    iconClass: 'bi bi-bookmark-heart-fill' },
  { id: 'Blue',    label: 'Blue',      iconClass: 'bi bi-droplet-fill' },
  { id: 'Bold',    label: 'Bold',      iconClass: 'bi bi-gem' },
  { id: 'Film',    label: 'Film',      iconClass: 'bi bi-film' },
  { id: 'Vintage', label: 'Vintage',   iconClass: 'bi bi-book-half' },
];

export default STRIP_TEMPLATES;
