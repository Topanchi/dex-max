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

import { fetcher, fetcherSafe } from '@/lib/fetcher';
import { getTCGEra, getTCGSetType, getTCGVariant, getAvailableVariants } from '@/utils/tcgClassification';
import type { TCGCard } from '@/types/tcg';

const BASE = 'https://api.pokemontcg.io/v2';
const REVALIDATE = 86400; // 24 h
const SET_CODES_REVALIDATE = 604800; // 7 d — los códigos de set no cambian

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
  printedTotal?: number;
}

interface PTCGTcgplayer {
  prices?: Record<string, unknown>;
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
  tcgplayer?: PTCGTcgplayer;
}

interface PTCGResponse {
  data: PTCGCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

interface PTCGSetSummary {
  id: string;
  ptcgoCode?: string;
}

interface PTCGSetsResponse {
  data: PTCGSetSummary[];
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

/**
 * Returns true if the search name appears anywhere in the card name as a whole
 * word (bounded by non-letter characters or the string edges). Covers cards
 * whose name has a prefix before the Pokémon:
 *   - "Lance's Charizard V", "Blaine's Charizard", "Dark Charizard",
 *     "Shining Charizard", "Radiant Charizard", "Reshiram & Charizard-GX"
 *   - "Mewtwo & Mew-GX" when searching "Mew" → match (second occurrence)
 *   - "Mewtwo" when searching "Mew"           → reject
 */
function isNameContained(cardName: string, searchName: string): boolean {
  const card   = cardName.toLowerCase();
  const search = searchName.toLowerCase();
  const isLetter = (ch: string | undefined) => ch !== undefined && /[a-záéíóúüñ]/i.test(ch);

  let idx = card.indexOf(search);
  while (idx !== -1) {
    if (!isLetter(card[idx - 1]) && !isLetter(card[idx + search.length])) return true;
    idx = card.indexOf(search, idx + 1);
  }
  return false;
}

// ─── Códigos de set (ptcgoCode) ───────────────────────────────────────────────

/**
 * El endpoint /cards no incluye `ptcgoCode` en el `set` embebido de cada
 * carta, así que se resuelve aparte con una única llamada a /sets (barata y
 * cacheada 7 días, ya que estos códigos no cambian una vez asignados).
 */
let setCodesPromise: Promise<Record<string, string>> | null = null;

function fetchSetCodes(): Promise<Record<string, string>> {
  if (!setCodesPromise) {
    setCodesPromise = fetcherSafe<PTCGSetsResponse>(
      `${BASE}/sets?select=id,ptcgoCode`,
      { revalidate: SET_CODES_REVALIDATE },
    ).then(data => {
      const map: Record<string, string> = {};
      for (const set of data?.data ?? []) {
        if (set.ptcgoCode) map[set.id] = set.ptcgoCode;
      }
      return map;
    });
  }
  return setCodesPromise;
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapCard(raw: PTCGCard, setCodes: Record<string, string>): TCGCard {
  const availableVariants = getAvailableVariants(Object.keys(raw.tcgplayer?.prices ?? {}));

  return {
    id:                raw.id,
    name:              raw.name,
    number:            raw.number,
    imageUrl:          raw.images.large,
    rarity:            raw.rarity ?? null,
    variant:           getTCGVariant(raw.rarity, raw.set.name, raw.subtypes, availableVariants),
    availableVariants,
    category:          raw.supertype,
    set: {
      id:            raw.set.id,
      name:          raw.set.name,
      series:        raw.set.series,
      releaseDate:   raw.set.releaseDate,
      printedTotal:  raw.set.printedTotal ?? null,
      code:          setCodes[raw.set.id] ?? null,
      type:          getTCGSetType(raw.set.id, raw.set.name, raw.set.series),
    },
    era:               getTCGEra(raw.set.series, raw.set.releaseDate),
    types:             raw.types,
    hp:                raw.hp ? parseInt(raw.hp, 10) : undefined,
    illustrator:       raw.artist,
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
 * Fetches all pages for a given TCG API query and returns raw cards whose name
 * passes the `matches` guard.
 *
 * Uses the throwing `fetcher` (not `fetcherSafe`): a transient upstream
 * failure (rate-limit, timeout, 5xx) must propagate as an error instead of
 * silently resolving to an empty array, which would look identical to "this
 * Pokémon genuinely has 0 TCG cards" and get cached as such by the route.
 */
async function fetchAllPages(
  queryTerm: string,
  matches: (card: PTCGCard) => boolean,
): Promise<PTCGCard[]> {
  const query    = `name:"${queryTerm}*"`;
  const pageSize = 250; // API maximum
  const results: PTCGCard[] = [];
  let page = 1;

  while (true) {
    const url = `${BASE}/cards?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}`;
    const data = await fetcher<PTCGResponse>(url, { revalidate: REVALIDATE });
    if (!data.data.length) break;

    const matched = data.data.filter(matches);
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
 *
 * Only a failure of the *base* query propagates (so the caller can avoid
 * caching a transient failure as "this Pokémon has no cards"). The M/Mega
 * variant queries are best-effort: most Pokémon don't have Mega forms, so a
 * failure there just means those extra cards are missing this time, not
 * that the whole search should be treated as broken.
 */
export async function searchTCGCards(tcgName: string): Promise<TCGCard[]> {
  const startsWith = (term: string) => (card: PTCGCard) => isNameMatch(card.name, term);

  // The upstream name search matches any word of the card name, so "Charizard*"
  // already returns cards with a prefix (Lance's Charizard V, Dark Charizard,
  // Shining Charizard, Radiant Charizard…). Those are kept only when they are
  // Pokémon cards, so Trainer/Energy cards that merely mention the name in the
  // middle don't sneak in; Trainer cards that *start* with it (e.g. "Charizard
  // Spirit Link") keep matching as before.
  const baseMatch = (card: PTCGCard) =>
    isNameMatch(card.name, tcgName) ||
    (card.supertype === 'Pokémon' && isNameContained(card.name, tcgName));

  // Run all query variants in parallel:
  //   1. "Charizard*"      → base cards (plus prefixed Pokémon cards)
  //   2. "M Charizard*"    → shorthand Mega EX cards (M Charizard-EX)
  //   3. "Mega Charizard*" → written-out Mega cards (Mega Charizard Y ex)
  const [base, mVariant, megaVariant, setCodes] = await Promise.all([
    fetchAllPages(tcgName, baseMatch),
    fetchAllPages(`M ${tcgName}`,    startsWith(`M ${tcgName}`)).catch(() => [] as PTCGCard[]),
    fetchAllPages(`Mega ${tcgName}`, startsWith(`Mega ${tcgName}`)).catch(() => [] as PTCGCard[]),
    fetchSetCodes(),
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

  return sortCards(allCards).map(raw => mapCard(raw, setCodes));
}
