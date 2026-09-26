/**
 * Clasificación "de catálogo" de una carta del TCG a partir de los datos que
 * devuelve la Pokémon TCG API: Era TCG oficial, tipo de expansión y variante
 * de impresión. Es la fuente única usada tanto por el servicio (para dejar
 * la carta ya clasificada en la respuesta) como por la UI.
 */

// ─── Era TCG ──────────────────────────────────────────────────────────────────

export interface TCGEra {
  id: number;
  name: string;
}

const SERIES_TO_ERA: Record<string, TCGEra> = {
  'Base':                     { id: 1,  name: 'Original / Wizards Era' },
  'Gym':                      { id: 1,  name: 'Original / Wizards Era' },
  'Neo':                      { id: 2,  name: 'Neo / e-Card Era' },
  'E-Card':                   { id: 2,  name: 'Neo / e-Card Era' },
  'EX':                       { id: 3,  name: 'EX Series' },
  'Diamond & Pearl':          { id: 4,  name: 'Diamond & Pearl / Platinum / HeartGold & SoulSilver' },
  'Platinum':                 { id: 4,  name: 'Diamond & Pearl / Platinum / HeartGold & SoulSilver' },
  'HeartGold & SoulSilver':   { id: 4,  name: 'Diamond & Pearl / Platinum / HeartGold & SoulSilver' },
  'Black & White':            { id: 5,  name: 'Black & White' },
  'XY':                       { id: 6,  name: 'XY' },
  'Sun & Moon':                { id: 7,  name: 'Sun & Moon' },
  'Sword & Shield':           { id: 8,  name: 'Sword & Shield' },
  'Scarlet & Violet':         { id: 9,  name: 'Scarlet & Violet' },
  'Mega Evolution':           { id: 10, name: 'Mega Evolution' },
};

/**
 * Series "cajón de sastre" (McDonald's, POP, Nintendo Black Star Promos,
 * Southern Islands, etc.) que no tienen un único bloque asociado en la API.
 * Para estas se usa la fecha de lanzamiento del set como respaldo.
 */
const FALLBACK_DATE_BOUNDARIES: Array<{ era: TCGEra; start: string }> = [
  { era: SERIES_TO_ERA['Base'],                   start: '1999-01-01' }, // Base
  { era: SERIES_TO_ERA['Neo'],                    start: '2000-12-16' }, // Neo Genesis
  { era: SERIES_TO_ERA['EX'],                      start: '2003-07-01' }, // EX Ruby & Sapphire
  { era: SERIES_TO_ERA['Diamond & Pearl'],         start: '2007-05-01' }, // Diamond & Pearl
  { era: SERIES_TO_ERA['Black & White'],           start: '2011-03-01' }, // BW Black Star Promos
  { era: SERIES_TO_ERA['XY'],                      start: '2013-10-01' }, // XY Black Star Promos
  { era: SERIES_TO_ERA['Sun & Moon'],              start: '2017-02-01' }, // Sun & Moon
  { era: SERIES_TO_ERA['Sword & Shield'],          start: '2019-11-01' }, // SWSH Black Star Promos
  { era: SERIES_TO_ERA['Scarlet & Violet'],        start: '2023-01-01' }, // Scarlet & Violet Black Star Promos
  { era: SERIES_TO_ERA['Mega Evolution'],          start: '2025-09-01' }, // Mega Evolution
];

function getEraByDate(releaseDate: string): TCGEra {
  const isoDate = releaseDate.replaceAll('/', '-');
  let era = FALLBACK_DATE_BOUNDARIES[0].era;
  for (const boundary of FALLBACK_DATE_BOUNDARIES) {
    if (isoDate < boundary.start) break;
    era = boundary.era;
  }
  return era;
}

/** Devuelve la Era TCG oficial (1-10) de un set a partir de su `series` (con la fecha como respaldo). */
export function getTCGEra(series: string, releaseDate: string): TCGEra {
  return SERIES_TO_ERA[series] ?? getEraByDate(releaseDate);
}

// ─── Tipo de set ──────────────────────────────────────────────────────────────

export type TCGSetType = 'MAIN' | 'SPECIAL' | 'PROMO' | 'OTHER';

const PROMO_SET_IDS = new Set([
  'basep', 'np', 'dpp', 'hsp', 'bwp', 'xyp', 'smp', 'swshp', 'svp',
]);

/** Sets especiales conocidos que no son la expansión numerada principal de su era. */
const SPECIAL_SET_IDS = new Set([
  'si1',                        // Southern Islands
  'base6',                      // Legendary Collection
  'dv1',                        // Dragon Vault
  'g1',                         // Generations
  'sm35',                       // Shining Legends
  'sm75',                       // Dragon Majesty
  'det1',                       // Detective Pikachu
  'sm115', 'sma',               // Hidden Fates + Shiny Vault
  'swsh35',                     // Champion's Path
  'swsh45', 'swsh45sv',         // Shining Fates + Shiny Vault
  'cel25', 'cel25c',            // Celebrations + Classic Collection
  'pgo',                        // Pokémon GO
  'swsh12pt5', 'swsh12pt5gg',   // Crown Zenith + Galarian Gallery
  'sv3pt5',                     // Pokémon 151
  'sv4pt5',                     // Paldean Fates
  'sv6pt5',                     // Shrouded Fable
  'sv8pt5',                     // Prismatic Evolutions
  'me55', 'me55c',              // 30th Celebration + Classic Collection
]);

function isMcDonaldsOrCollab(setId: string, setName: string): boolean {
  return /^mcd\d+$/.test(setId) || /mcdonald/i.test(setName)
    || /rumble|futsal|best of game/i.test(setName);
}

function isGalleryOffshoot(setId: string, setName: string): boolean {
  return /trainer gallery|galarian gallery/i.test(setName) || /tg$/i.test(setId);
}

/** Clasifica un set como set principal, set especial, promo, o "otros" (cajón de sastre). */
export function getTCGSetType(setId: string, setName: string, series: string): TCGSetType {
  if (PROMO_SET_IDS.has(setId) || /black star promos?/i.test(setName)) return 'PROMO';
  if (SPECIAL_SET_IDS.has(setId) || isGalleryOffshoot(setId, setName)) return 'SPECIAL';
  if (series === 'Other' || series === 'POP' || series === 'NP') {
    return isMcDonaldsOrCollab(setId, setName) ? 'SPECIAL' : 'OTHER';
  }
  return 'MAIN';
}

// ─── Variante ─────────────────────────────────────────────────────────────────

/**
 * Etiquetas legibles para las claves de `tcgplayer.prices`: indican qué
 * variantes de impresión existen realmente para esa carta (no son precios,
 * solo las claves — p. ej. presencia de "reverseHolofoil" ⇒ existe versión
 * Reverse Holo de esa misma carta/número).
 */
const PRICE_KEY_LABELS: Record<string, string> = {
  normal:               'Normal',
  holofoil:             'Holo',
  reverseHolofoil:      'Reverse Holo',
  '1stEditionNormal':   '1st Edition',
  '1stEditionHolofoil': '1st Edition Holo',
  unlimited:            'Unlimited',
  unlimitedHolofoil:    'Unlimited Holo',
};

export function getAvailableVariants(priceKeys: string[]): string[] {
  return priceKeys.map(k => PRICE_KEY_LABELS[k] ?? k);
}

/**
 * Determina la variante "de catálogo" de una carta a partir de su rareza
 * cruda (la API mezcla rareza y variante en un solo campo, p. ej.
 * "Rare Holo VMAX", "Illustration Rare"), el nombre del set, y las variantes
 * de impresión detectadas vía TCGPlayer. Best-effort: no sustituye la
 * inspección física de la carta.
 */
export function getTCGVariant(
  rarity: string | null | undefined,
  setName: string,
  subtypes: string[] | undefined,
  availableVariants: string[],
): string | null {
  if (!rarity) return null;
  const r = rarity.toLowerCase();
  const s = setName.toLowerCase();

  if (s.includes('galarian gallery')) return 'Galarian Gallery';
  if (s.includes('trainer gallery'))  return 'Trainer Gallery';
  if (r.includes('ace spec'))         return 'ACE SPEC';
  if (r === 'special illustration rare') return 'Special Illustration Rare';
  if (r === 'illustration rare')      return 'Illustration Rare';
  if (r.includes('hyper'))            return 'Hyper Rare';
  if (r.includes('rainbow'))          return 'Rainbow Rare';
  if (r.includes('secret'))           return 'Secret Rare';
  if (r.includes('shiny'))            return 'Shiny';
  if (r === 'amazing rare')           return 'Amazing Rare';
  if (subtypes?.includes('Radiant')) return 'Radiant';
  if (r.includes('double'))           return 'Double Rare';
  if (r.includes('ultra'))            return 'Ultra Rare';
  if (r.includes('full art'))         return 'Full Art';
  if (r.includes('classic collection')) return 'Classic Collection';
  if (r === 'promo') {
    return s.includes('black star promos') ? 'Black Star Promo' : 'Promo';
  }
  if (r.includes('holo')) {
    const hasHolo    = availableVariants.includes('Holo');
    const hasReverse = availableVariants.includes('Reverse Holo');
    return hasReverse && !hasHolo ? 'Reverse Holo' : 'Holo';
  }
  return 'Normal';
}
