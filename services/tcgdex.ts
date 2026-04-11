/**
 * TCG cards service — usa la Pokémon TCG API (api.pokemontcg.io/v2).
 *
 * Motivo del cambio desde TCGdex:
 *   - El endpoint de búsqueda de TCGdex (/cards?q=...) devuelve objetos resumidos
 *     sin `set`, `rarity` ni `category`, por lo que el mapeo a TCGCard fallaba
 *     silenciosamente devolviendo siempre un array vacío.
 *   - La Pokémon TCG API soporta búsqueda por nombre con prefijo en una sola
 *     llamada y devuelve objetos completos.
 *   - No requiere API key (1 000 req/día en modo anónimo).
 */

import { fetcherSafe } from '@/lib/fetcher';
import type { TCGCard } from '@/types/tcg';

const BASE = 'https://api.pokemontcg.io/v2';
const REVALIDATE = 86400; // 24 h

// ─── Raw Pokémon TCG API types ────────────────────────────────────────────────

interface PTCGCardImages {
  small: string;
  large: string;
}

interface PTCGSet {
  id: string;
  name: string;
  series: string;
  releaseDate: string;
}

interface PTCGCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  images: PTCGCardImages;
  set: PTCGSet;
  artist?: string;
}

interface PTCGResponse {
  data: PTCGCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

// ─── Name normalization ───────────────────────────────────────────────────────

/**
 * Some Pokémon have API names (lowercase hyphenated) that differ from TCG card
 * names. This map handles the known edge cases.
 */
const TCG_NAME_OVERRIDES: Record<string, string> = {
  'mr-mime':       'Mr. Mime',
  'mime-jr':       'Mime Jr.',
  'mr-rime':       'Mr. Rime',
  'ho-oh':         'Ho-Oh',
  'porygon-z':     'Porygon-Z',
  'jangmo-o':      'Jangmo-o',
  'hakamo-o':      'Hakamo-o',
  'kommo-o':       'Kommo-o',
  'wo-chien':      'Wo-Chien',
  'chien-pao':     'Chien-Pao',
  'ting-lu':       'Ting-Lu',
  'chi-yu':        'Chi-Yu',
  'type-null':     'Type: Null',
  'nidoran-f':     'Nidoran ♀',
  'nidoran-m':     'Nidoran ♂',
  'farfetchd':     "Farfetch'd",
  'sirfetchd':     "Sirfetch'd",
  'flabebe':       'Flabébé',
  'great-tusk':    'Great Tusk',
  'scream-tail':   'Scream Tail',
  'brute-bonnet':  'Brute Bonnet',
  'flutter-mane':  'Flutter Mane',
  'slither-wing':  'Slither Wing',
  'sandy-shocks':  'Sandy Shocks',
  'iron-treads':   'Iron Treads',
  'iron-bundle':   'Iron Bundle',
  'iron-hands':    'Iron Hands',
  'iron-jugulis':  'Iron Jugulis',
  'iron-moth':     'Iron Moth',
  'iron-thorns':   'Iron Thorns',
  'roaring-moon':  'Roaring Moon',
  'iron-valiant':  'Iron Valiant',
  'iron-leaves':   'Iron Leaves',
  'walking-wake':  'Walking Wake',
};

/**
 * Converts a PokéAPI name (e.g. "mr-mime") to the TCG card name ("Mr. Mime").
 * Falls back to capitalizing the first letter for standard names.
 */
export function toTCGName(pokemonApiName: string): string {
  if (TCG_NAME_OVERRIDES[pokemonApiName]) return TCG_NAME_OVERRIDES[pokemonApiName];
  // Standard case: just capitalize first letter (pikachu → Pikachu)
  return pokemonApiName.charAt(0).toUpperCase() + pokemonApiName.slice(1);
}

// ─── Matching ────────────────────────────────────────────────────────────────

/**
 * Returns true if the TCG card name belongs to the searched Pokémon.
 *
 * Strategy: the card name must either be an exact match OR start with the
 * search name followed by a non-letter character. This correctly handles:
 *   - "Pikachu V", "Pikachu-GX", "Pikachu VMAX"  → match (space / hyphen)
 *   - "Charizard☆" (Star), "Charizard◇"           → match (non-letter symbol)
 *   - "Mewtwo" when searching "Mew"               → reject ('t' is a letter)
 */
function isNameMatch(cardName: string, searchName: string): boolean {
  const card   = cardName.toLowerCase();
  const search = searchName.toLowerCase();
  if (card === search) return true;
  if (!card.startsWith(search)) return false;
  // The character immediately after the search term must NOT be a letter,
  // so "Mew" doesn't accidentally match "Mewtwo".
  const nextChar = card[search.length];
  return nextChar !== undefined && !/[a-záéíóúüñ]/i.test(nextChar);
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapCard(raw: PTCGCard): TCGCard {
  return {
    id:        raw.id,
    name:      raw.name,
    number:    raw.number,
    imageUrl:  raw.images.large,
    rarity:    raw.rarity ?? null,
    category:  raw.supertype,
    set: {
      id:   raw.set.id,
      name: raw.set.name,
    },
    types:       raw.types,
    hp:          raw.hp ? parseInt(raw.hp, 10) : undefined,
    illustrator: raw.artist,
  };
}

// ─── Sorting ─────────────────────────────────────────────────────────────────

/** Most recent set first. */
function sortCards(cards: PTCGCard[]): PTCGCard[] {
  return [...cards].sort((a, b) =>
    b.set.releaseDate.localeCompare(a.set.releaseDate),
  );
}

// ─── Fetcher ─────────────────────────────────────────────────────────────────

/**
 * Fetches all pages for a given TCG API query term and returns raw cards that
 * pass the name-match guard against `matchName`.
 */
async function fetchAllPages(queryTerm: string, matchName: string): Promise<PTCGCard[]> {
  const query    = `name:"${queryTerm}*"`;
  const pageSize = 250; // API maximum
  const results: PTCGCard[] = [];
  let page = 1;

  while (true) {
    const url = `${BASE}/cards?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}`;
    const data = await fetcherSafe<PTCGResponse>(url, { revalidate: REVALIDATE });
    if (!data?.data?.length) break;

    const matched = data.data.filter(c => isNameMatch(c.name, matchName));
    results.push(...matched);

    if (results.length >= data.totalCount || data.data.length < pageSize) break;
    page++;
  }

  return results;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns all English TCG cards for the given Pokémon name, including
 * prefixed variants like "M Charizard-EX" and "Mega Charizard Y ex".
 * Results are deduplicated by card ID and sorted newest-set-first.
 */
export async function searchTCGCards(tcgName: string): Promise<TCGCard[]> {
  // Run all query variants in parallel:
  //   1. "Charizard*"      → base cards
  //   2. "M Charizard*"    → shorthand Mega EX cards (M Charizard-EX)
  //   3. "Mega Charizard*" → written-out Mega cards (Mega Charizard Y ex)
  const [base, mVariant, megaVariant] = await Promise.all([
    fetchAllPages(tcgName,          tcgName),
    fetchAllPages(`M ${tcgName}`,   `M ${tcgName}`),
    fetchAllPages(`Mega ${tcgName}`, `Mega ${tcgName}`),
  ]);

  // Deduplicate by card ID (some sets may overlap between queries)
  const seen = new Set<string>();
  const allCards: PTCGCard[] = [];
  for (const card of [...base, ...mVariant, ...megaVariant]) {
    if (!seen.has(card.id)) {
      seen.add(card.id);
      allCards.push(card);
    }
  }

  return sortCards(allCards).map(mapCard);
}
