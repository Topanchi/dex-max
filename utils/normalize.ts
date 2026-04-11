import type { VariantCategory } from '@/types/pokemon';

/** Extract numeric ID from a PokéAPI resource URL */
export function getIdFromUrl(url: string): number {
  const trimmed = url.replace(/\/$/, '');
  const parts = trimmed.split('/');
  return parseInt(parts[parts.length - 1], 10);
}

/**
 * Convert a hyphenated API name to a readable display name.
 * e.g. "mr-mime" → "Mr Mime", "ho-oh" → "Ho-Oh"
 */
export function normalizePokemonName(name: string): string {
  const preservedHyphens = new Set([
    'ho-oh',
    'porygon-z',
    'jangmo-o',
    'hakamo-o',
    'kommo-o',
    'wo-chien',
    'chien-pao',
    'ting-lu',
    'chi-yu',
  ]);

  if (preservedHyphens.has(name.toLowerCase())) {
    return name
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('-');
  }

  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .trim();
}

const FORM_LABEL_MAP: Record<string, string> = {
  mega: 'Mega',
  'mega-x': 'Mega X',
  'mega-y': 'Mega Y',
  gmax: 'Gigantamax',
  alola: 'Forma de Alola',
  galar: 'Forma de Galar',
  hisui: 'Forma de Hisui',
  paldea: 'Forma de Paldea',
  original: 'Forma Original',
  zen: 'Modo Zen',
  attack: 'Forma Ataque',
  defense: 'Forma Defensa',
  speed: 'Forma Velocidad',
  plant: 'Capa Planta',
  sandy: 'Capa Arena',
  trash: 'Capa Basura',
  heat: 'Forma Calor',
  wash: 'Forma Lavado',
  refrigerator: 'Forma Frigorífico',
  fan: 'Forma Ventilador',
  mow: 'Forma Cortacésped',
  sky: 'Forma Cielo',
  land: 'Forma Tierra',
  origin: 'Forma Origen',
  therian: 'Forma Totémica',
  ordinary: 'Forma Ordinaria',
  resolute: 'Forma Resuelta',
  black: 'Forma Negra',
  white: 'Forma Blanca',
  confined: 'Confinada',
  unbound: 'Liberada',
  midnight: 'Forma Medianoche',
  midday: 'Forma Mediodía',
  dusk: 'Forma Anochecer',
  '10': 'Forma 10%',
  complete: 'Forma Completa',
  'dusk-mane': 'Melena del Ocaso',
  'dawn-wings': 'Alas del Alba',
  ultra: 'Ultra',
  eternamax: 'Eternamax',
  crowned: 'Coronado',
  'single-strike': 'Golpe Único',
  'rapid-strike': 'Golpe Rápido',
  ice: 'Forma Hielo',
};

/** Return a human-readable label for a form/variant name */
export function normalizeFormDisplayName(fullName: string, baseName: string): string {
  const formPart = fullName.startsWith(baseName + '-')
    ? fullName.slice(baseName.length + 1)
    : fullName;

  if (FORM_LABEL_MAP[formPart]) return FORM_LABEL_MAP[formPart];

  return formPart
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Detect the variant category from its name */
export function inferVariantCategory(name: string): VariantCategory {
  const lower = name.toLowerCase();
  if (lower.includes('-mega')) return 'mega';
  if (lower.includes('-gmax')) return 'gigantamax';
  if (lower.includes('-alola')) return 'alolan';
  if (lower.includes('-galar')) return 'galarian';
  if (lower.includes('-hisui')) return 'hisuian';
  if (lower.includes('-paldea')) return 'paldean';
  return 'alternate';
}

const CATEGORY_LABELS: Record<VariantCategory, string> = {
  mega: 'Mega Evolución',
  gigantamax: 'Gigantamax',
  alolan: 'Forma de Alola',
  galarian: 'Forma de Galar',
  hisuian: 'Forma de Hisui',
  paldean: 'Forma de Paldea',
  alternate: 'Forma Alternativa',
  base: 'Base',
};

export function getCategoryLabel(category: VariantCategory): string {
  return CATEGORY_LABELS[category] ?? 'Variante';
}

/**
 * Strips form suffixes from a PokéAPI name so we can search for the base
 * Pokémon's cards. Does NOT split on hyphens that are part of the base name
 * (e.g. "mr-mime", "ho-oh", "porygon-z" are kept intact).
 */
export function normalizeTCGSearchName(pokemonName: string): string {
  return pokemonName
    .replace(/-mega(-[xy])?$/, '')
    .replace(/-gmax$/, '')
    .replace(/-alola$/, '')
    .replace(/-galar$/, '')
    .replace(/-hisui$/, '')
    .replace(/-paldea$/, '')
    // Female/male variants (e.g. nidoran-f, nidoran-m) — keep as-is so
    // toTCGName() can map them to ♀/♂ symbols
    .replace(/-(female|male)$/, '')
    // Battle-only/totem suffixes that don't affect the TCG name
    .replace(/-(totem|galar-zen|zen|origin|sky|therian|black|white|confined|unbound|midnight|midday|dusk|dawn|complete|eternamax|crowned)$/, '');
}

/** Format a number as a zero-padded Pokédex number, e.g. 25 → "#0025" */
export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

/** Format height from decimetres to a readable string */
export function formatHeight(decimetres: number): string {
  const metres = decimetres / 10;
  return `${metres.toFixed(1)} m`;
}

/** Format weight from hectograms to a readable string */
export function formatWeight(hectograms: number): string {
  const kg = hectograms / 10;
  return `${kg.toFixed(1)} kg`;
}
