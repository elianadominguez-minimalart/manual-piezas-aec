// Contenido del manual. Fuente: board "Especificaciones técnicas · Arcor en Casa" (Figma), bloque "Manual de piezas · v2".
// Zonas: [x, y, ancho, alto] relativos a la captura (0–1).

const VC = 'Sin audio, 30 fps (o 24), 6–15 s en loop, exportado con «Web optimized» / «Fast start».'
const PC = 'Primer cuadro del video. Precios, fechas y legales van en la portada, no en el video.'
export const VIDEO_NOTE =
  'Siempre se entrega con su portada: es lo primero que se ve mientras carga. YouTube / Vimeo: lo importante tiene que quedar en la franja central (zona segura). Recomendado: usar .mp4 propio.'
const NO_MOBILE = 'No se ve en mobile'
const SAME = 'Misma medida para desktop y mobile.'

export const RULES = {
  short: [
    ['Formato', 'imágenes .webp (o .avif) · videos .mp4 (H.264)'],
    ['Peso', 'ideal ≤ 100 KB por imagen · ≤ 1 MB por página'],
    ['Nombre', 'minúsculas y guiones, ej. aguila-2026-micrositio-hero-desktop'],
  ],
  all: [
    'Imágenes: .webp (preferido) o .avif (alternativa)',
    'Videos: .mp4 (H.264)',
    'Peso por imagen: ideal ≤ 100 KB',
    'Total de imágenes por página: ≤ 1 MB',
    'Evitar imágenes de +300 KB, especialmente GIFs',
    'Comprimir sin pérdida visible de calidad',
    'Nombre descriptivo: que se entienda qué es',
    'Siempre en minúsculas, palabras separadas con guiones medios (-)',
    'Sin espacios, tildes, caracteres especiales ni nombres genéricos',
    '✗ Banner Final 2 · IMG_Aguila-Copia · banner_promoción',
  ],
}

// Capturas en public/img
export const SHOTS = {
  'home-d': { w: 900, h: 2110, label: 'Home', view: 'Desktop' },
  'home-m': { w: 310, h: 2380, label: 'Home', view: 'Mobile' },
  'event-d': { w: 1400, h: 666, label: 'Home event', view: 'Desktop' },
  'event-m': { w: 353, h: 764, label: 'Home event', view: 'Mobile', solo: true },
  'sticky-d': { w: 1400, h: 671, label: 'Sticky', view: 'Desktop' },
  'sticky-m': { w: 798, h: 111, label: 'Sticky', view: 'Mobile', solo: true },
  'recetas-d': { w: 1100, h: 1299, label: 'Recetas', view: 'Desktop' },
  'recetas-m': { w: 520, h: 1088, label: 'Recetas', view: 'Mobile' },
  'mic1-d': { w: 1000, h: 1336, label: 'Micrositio · variante 1', view: 'Desktop' },
  'mic1-m': { w: 431, h: 948, label: 'Micrositio · variante 1', view: 'Mobile' },
  'mic2-d': { w: 1000, h: 1280, label: 'Micrositio · variante 2', view: 'Desktop' },
  'mic2-m': { w: 449, h: 867, label: 'Micrositio · variante 2', view: 'Mobile' },
  'mic3-d': { w: 900, h: 1366, label: 'Micrositio · variante 3', view: 'Desktop' },
  'mic3-m': { w: 431, h: 868, label: 'Micrositio · variante 3', view: 'Mobile' },
}

const videoPieces = (dev, vdim, vkb, pdim, pkb, z) => [
  { id: `video-${dev}`, name: 'Video', dev, dim: vdim, fmt: '.mp4', kb: vkb, note: VC, z },
  { id: `portada-${dev}`, name: 'Portada del video', dev, dim: pdim, fmt: '.webp', kb: pkb, note: PC, z },
]

const micBanner = (n, dz, mz) => [
  {
    id: 'banner-d', name: 'Banner del slider principal', dev: 'desktop', dim: '1920 × 480', fmt: '.webp', kb: '100 KB',
    z: { [`mic${n}-d`]: dz },
    video: videoPieces('desktop', '1920 × 480', '3 MB', '1280 × 320', '100 KB', { [`mic${n}-d`]: dz }),
  },
  {
    id: 'banner-m', name: 'Banner del slider principal', dev: 'mobile', dim: '1080 × 810', fmt: '.webp', kb: '50 KB',
    z: { [`mic${n}-m`]: mz },
    video: videoPieces('mobile', '720 × 540', '1,5 MB', '720 × 540', '50 KB', { [`mic${n}-m`]: mz }),
  },
]

const bgColor = {
  id: 'hex', name: 'Color de fondo del sitio', dev: 'ambos', dim: 'Código hex', fmt: 'ej. #123456', kb: '',
  note: 'Es el color de fondo (bg) de toda la página del micrositio, el que se ve detrás del patrón. No es un archivo: definí el código hex y pasalo junto con el patrón.',
  z: {},
}

export const CONTEXTS = {
  home: {
    pieces: [
      { id: 'bp-d', name: 'Banner principal', dev: 'desktop', dim: '1800 × 525', fmt: '.webp', kb: '100 KB', z: { 'home-d': [0.095, 0.047, 0.822, 0.114] },
        video: videoPieces('desktop', '1920 × 560', '3 MB', '1200 × 350', '100 KB', { 'home-d': [0.095, 0.047, 0.822, 0.114] }) },
      { id: 'bi-d', name: 'Banner intermedio', dev: 'desktop', dim: '1800 × 338', fmt: '.webp', kb: '100 KB', z: { 'home-d': [0.095, 0.591, 0.822, 0.078] } },
      { id: 'bp-m', name: 'Banner principal', dev: 'mobile', dim: '1080 × 810', fmt: '.webp', kb: '50 KB', z: { 'home-m': [0.043, 0.079, 0.915, 0.092] },
        video: videoPieces('mobile', '720 × 540', '1,5 MB', '360 × 270', '50 KB', { 'home-m': [0.043, 0.079, 0.915, 0.092] }) },
      { id: 'bi-m', name: 'Banner intermedio', dev: 'mobile', dim: '1080 × 810', fmt: '.webp', kb: '50 KB', z: { 'home-m': [0, 0.662, 1, 0.102] } },
      { id: 'bt', name: 'Banner tarjeta', dev: 'ambos', dim: '428 × 525', fmt: '.webp', kb: '50 KB', note: 'Un mismo archivo para desktop y mobile.',
        z: { 'home-d': [0.706, 0.198, 0.211, 0.103], 'home-m': [0.156, 0.22, 0.6, 0.113] } },
    ],
  },
  event: {
    pieces: [
      { id: 'he-d', name: 'Home event (popup)', dev: 'desktop', dim: '1200 × 900', fmt: '.webp', kb: '100 KB', z: { 'event-d': [0.251, 0.084, 0.515, 0.839] } },
      { id: 'st-d', name: 'Sticky', dev: 'desktop', dim: '1095 × 108', fmt: '.webp', kb: '50 KB', z: { 'sticky-d': [0.273, 0.839, 0.464, 0.129] } },
      { id: 'he-m', name: 'Home event (popup)', dev: 'mobile', dim: '885 × 1268', fmt: '.webp', kb: '100 KB', z: { 'event-m': [0, 0, 1, 1] } },
      { id: 'st-m', name: 'Sticky', dev: 'mobile', dim: '810 × 68', fmt: '.webp', kb: '50 KB', z: { 'sticky-m': [0, 0, 1, 1] } },
    ],
  },
  recetas: {
    pieces: [
      { id: 'b-d', name: 'Banner', dev: 'desktop', dim: '1920 × 480', fmt: '.webp', kb: '100 KB', z: { 'recetas-d': [0.069, 0.117, 0.856, 0.199] } },
      { id: 'b-m', name: 'Banner', dev: 'mobile', dim: '1080 × 810', fmt: '.webp', kb: '50 KB', z: { 'recetas-m': [0, 0.257, 1, 0.362] } },
    ],
  },
  mic1: {
    pieces: [
      ...micBanner(1, [0.085, 0.091, 0.851, 0.165], [0.12, 0.205, 0.76, 0.275]),
      { id: 'footer', name: 'Footer', dev: 'ambos', dim: '1850 × 245', fmt: '.webp', kb: '50 KB', note: SAME, chips: [NO_MOBILE], z: { 'mic1-d': [0, 0.696, 1, 0.096] } },
      { id: 'patron', name: 'Patrón de fondo', dev: 'ambos', dim: '355 × 815', fmt: '.webp', kb: '50 KB',
        note: `Entregarlo en .webp sin fondo y definir aparte el color hex de fondo del sitio. ${SAME}`, chips: [NO_MOBILE], z: { 'mic1-d': [0.908, 0.306, 0.092, 0.34] } },
      { id: 'botones', name: 'Botones', dev: 'ambos', dim: '800 × 360', fmt: '.webp', kb: '50 KB', note: SAME,
        z: { 'mic1-d': [0.254, 0.25, 0.155, 0.055], 'mic1-m': [0.06, 0.5, 0.88, 0.08] } },
      bgColor,
    ],
  },
  mic2: {
    pieces: [
      ...micBanner(2, [0.074, 0.091, 0.85, 0.173], [0.138, 0.252, 0.676, 0.277]),
      { id: 'footer', name: 'Footer lateral', dev: 'ambos', dim: '1850 × 245', fmt: '.webp', kb: '50 KB', note: SAME, chips: [NO_MOBILE], z: { 'mic2-d': [0, 0.703, 1, 0.085] } },
      { id: 'patron', name: 'Patrón lateral', dev: 'ambos', dim: '1850 × 700', fmt: '.webp', kb: '50 KB',
        note: `Los elementos gráficos van solo en los laterales, la zona central queda libre. ${SAME}`, chips: [NO_MOBILE], z: { 'mic2-d': [0, 0.297, 1, 0.393] } },
      bgColor,
    ],
  },
  mic3: {
    pieces: [
      ...micBanner(3, [0.087, 0.095, 0.826, 0.153], [0.109, 0.243, 0.782, 0.452]),
      { id: 'footer', name: 'Footer', dev: 'ambos', dim: '1850 × 245', fmt: '.webp', kb: '50 KB', note: SAME, chips: [NO_MOBILE], z: { 'mic3-d': [0, 0.819, 0.126, 0.082] } },
      { id: 'botones', name: 'Botones', dev: 'ambos', dim: '800 × 360', fmt: '.webp', kb: '50 KB', note: SAME,
        z: { 'mic3-d': [0.754, 0.556, 0.18, 0.069], 'mic3-m': [0.145, 0.85, 0.7, 0.08] } },
      { id: 'chico', name: 'Banner chico', dev: 'ambos', dim: '878 × 465', fmt: '.webp', kb: '50 KB', note: SAME, z: { 'mic3-d': [0.494, 0.647, 0.44, 0.14] } },
    ],
  },
  ficha: {
    pieces: [
      { id: 'video', name: 'Video de la galería', dev: 'ambos', dim: '1920 × 1080', fmt: '.mp4 (H.264 + AAC)', kb: '20 MB',
        note: 'También vale 1280 × 720. Horizontal 16:9, de 15 a 60 s, audio opcional. Evitar: video vertical 9:16, menos de 1280 px de ancho, MOV de iPhone (HEVC). En YouTube / Vimeo las medidas no importan, pero conviene horizontal.',
        z: { ficha: true } },
      { id: 'poster', name: 'Póster', dev: 'ambos', dim: '640 × 360', fmt: '.jpg o .webp', kb: '100 KB', note: 'Sin póster se usa la miniatura de YouTube.', chips: ['Opcional'], z: { ficha: true } },
    ],
  },
}

export const TOP = [
  ['home', 'Home'],
  ['event', 'Home event'],
  ['recetas', 'Recetas'],
  ['mic', 'Micrositio'],
  ['ficha', 'Ficha de producto'],
]

export const VARIANTS = [
  ['mic1', 'Variante 1', 'Patrón de fondo y botones'],
  ['mic2', 'Variante 2', 'Patrón lateral y footer lateral'],
  ['mic3', 'Variante 3', 'Botones y banner chico'],
]

export const DEVICES = [
  ['desktop', 'Desktop', 'solo se ven en compu'],
  ['mobile', 'Mobile', 'solo se ven en celular'],
  ['ambos', 'Desktop y mobile', 'un mismo archivo para los dos'],
]

export const HASH = {
  home: 'home', event: 'home-event', recetas: 'recetas',
  mic1: 'micrositio-1', mic2: 'micrositio-2', mic3: 'micrositio-3', ficha: 'ficha',
}

export const devName = (d) => (d === 'ambos' ? 'Desktop y mobile' : d === 'desktop' ? 'Desktop' : 'Mobile')
