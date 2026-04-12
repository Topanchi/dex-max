/**
 * TCG Pocket cards service — usa el repositorio público:
 * https://github.com/flibustier/pokemon-tcg-pocket-database
 *
 * Estrategia:
 *   1. Carga cards.extra.json (todos los sets, un solo fetch, cacheado 24 h)
 *   2. Carga sets.json para obtener los nombres de los sets
 *   3. Filtra las cartas por nombre con el mismo guard que el TCG clásico
 *      (evita que "Mew" coincida con "Mewtwo")
 */

import { fetcherSafe } from '@/lib/fetcher';
import type { TCGPocketCard } from '@/types/tcg';

const RAW_BASE  = 'https://raw.githubusercontent.com/flibustier/pokemon-tcg-pocket-database/main/dist';
const REVALIDATE = 86400; // 24 h

/** Constructs the card image URL using TCGdex's asset CDN. */
function buildImageUrl(set: string, number: number): string {
  const padded = String(number).padStart(3, '0');
  return `https://assets.tcgdex.net/en/tcgp/${set}/${padded}/high.webp`;
}

// ─── Raw types ────────────────────────────────────────────────────────────────

interface PocketCardRaw {
  set: string;
  number: number;
  rarity: string;
  name: string;
  image: string;
  packs: string[];
  element?: string;
  type?: string;
  stage?: string | number;
  health?: number;
  retreatCost?: number;
  weakness?: string;
  evolvesFrom?: string;
}

interface PocketSetRaw {
  code: string;
  releaseDate: string;
  count: number;
  name: { en: string; [lang: string]: string };
  packs: string[];
}

// sets.json is keyed by generation ("A", "B", …), each value is an array of sets
type SetsJson = Record<string, PocketSetRaw[]>;

// ─── Name matching ────────────────────────────────────────────────────────────

function isNameMatch(cardName: string, searchName: string): boolean {
  const card   = cardName.toLowerCase();
  const search = searchName.toLowerCase();
  if (card === search) return true;
  if (!card.startsWith(search)) return false;
  const nextChar = card[search.length];
  return nextChar !== undefined && !/[a-záéíóúüñ]/i.test(nextChar);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Builds a map of set code → English name from the sets.json response. */
function buildSetMap(setsJson: SetsJson): Map<string, string> {
  const map = new Map<string, string>();
  for (const sets of Object.values(setsJson)) {
    for (const s of sets) {
      map.set(s.code, s.name.en ?? s.code);
    }
  }
  return map;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns all TCG Pocket cards for the given Pokémon display name
 * (e.g. "Pikachu", "Mr. Mime").
 */
export async function searchTCGPocketCards(pokemonName: string): Promise<TCGPocketCard[]> {
  // Fetch data in parallel — both responses are cached for 24 h
  const [cards, setsJson] = await Promise.all([
    fetcherSafe<PocketCardRaw[]>(`${RAW_BASE}/cards.extra.json`, { revalidate: REVALIDATE }),
    fetcherSafe<SetsJson>(`${RAW_BASE}/sets.json`,               { revalidate: REVALIDATE }),
  ]);

  if (!cards?.length || !setsJson) return [];

  const setNames = buildSetMap(setsJson);

  return cards
    .filter(c => isNameMatch(c.name, pokemonName))
    .map(c => ({
      id:          `${c.set}-${c.number}`,
      name:        c.name,
      localId:     c.number,
      imageUrl:    buildImageUrl(c.set, c.number),
      rarity:      c.rarity ?? null,
      category:    c.type ?? 'pokemon',
      set:         { id: c.set, name: setNames.get(c.set) ?? c.set },
      types:       c.element ? [c.element] : undefined,
      hp:          c.health,
      illustrator: undefined,
    }));
}
