/**
 * TCG Pocket cards service — usa el repositorio público:
 * https://github.com/chase-manning/pokemon-tcg-pocket-cards
 *
 * Estrategia:
 *   1. Carga v4.json (todas las cartas, URLs de imagen directas, cacheado 24 h)
 *   2. Carga expansions.json para obtener los nombres de los sets
 *   3. Filtra las cartas por nombre con el guard anti-Mewtwo
 */

import { fetcherSafe } from '@/lib/fetcher';
import type { TCGPocketCard } from '@/types/tcg';

const RAW_BASE   = 'https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main';
const REVALIDATE = 86400; // 24 h

// ─── Raw types ────────────────────────────────────────────────────────────────

interface RawCard {
  id: string;          // "a1-001"
  name: string;        // "Bulbasaur" | "Venusaur ex"
  rarity: string;      // "◊", "◊◊", "◊◊◊", "◊◊◊◊"
  pack: string;        // "Mewtwo", "Pikachu", "Charizard"
  health: string;      // "70" (string)
  image: string;       // full HTTPS URL
  fullart: 'Yes' | 'No';
  ex: 'Yes' | 'No';
  artist: string;
  type: string;        // "Grass", "Fire", "Water", …
}

interface RawExpansion {
  id: string;          // "a1", "a1a", "promo-a"
  name: string;        // "Genetic Apex"
  packs: { id: string; name: string; image: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "a1-001" → "a1" | "promo-a-001" → "promo-a" */
function getExpansionId(cardId: string): string {
  return cardId.replace(/-\d+$/, '');
}

/**
 * Acepta una carta si el nombre del Pokémon buscado aparece como palabra completa
 * en cualquier posición del nombre de la carta.
 *
 * - "Charizard"         ✓ búsqueda "Charizard"
 * - "Charizard ex"      ✓ búsqueda "Charizard"
 * - "Mega Charizard X ex" ✓ búsqueda "Charizard"
 * - "Mewtwo"            ✗ búsqueda "Mew"  (la 't' que sigue es letra)
 */
function isNameMatch(cardName: string, searchName: string): boolean {
  const card   = cardName.toLowerCase();
  const search = searchName.toLowerCase();

  let idx = 0;
  while ((idx = card.indexOf(search, idx)) !== -1) {
    const prevChar = idx > 0 ? card[idx - 1] : ' ';
    const nextChar = card[idx + search.length];
    const validBefore = !/[a-záéíóúüñ]/i.test(prevChar);
    const validAfter  = nextChar === undefined || !/[a-záéíóúüñ]/i.test(nextChar);
    if (validBefore && validAfter) return true;
    idx++;
  }
  return false;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function searchTCGPocketCards(pokemonName: string): Promise<TCGPocketCard[]> {
  const [cards, expansions] = await Promise.all([
    fetcherSafe<RawCard[]>(`${RAW_BASE}/v4.json`,         { revalidate: REVALIDATE }),
    fetcherSafe<RawExpansion[]>(`${RAW_BASE}/expansions.json`, { revalidate: REVALIDATE }),
  ]);

  if (!cards?.length || !expansions?.length) return [];

  const setMap = new Map(expansions.map(e => [e.id, e.name]));

  return cards
    .filter(c => isNameMatch(c.name, pokemonName))
    .map(c => {
      const expansionId = getExpansionId(c.id);
      const localId     = c.id.split('-').pop() ?? c.id;
      return {
        id:          c.id,
        name:        c.name,
        localId,
        imageUrl:    c.image,
        rarity:      c.rarity   || null,
        set:         { id: expansionId, name: setMap.get(expansionId) ?? expansionId },
        pack:        c.pack     || null,
        type:        c.type     || null,
        hp:          c.health   ? parseInt(c.health, 10) : null,
        illustrator: c.artist   || null,
        fullArt:     c.fullart  === 'Yes',
        isEx:        c.ex       === 'Yes',
      };
    });
}
