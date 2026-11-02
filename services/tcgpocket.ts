/**
 * TCG Pocket cards service — usa el repositorio público:
 * https://github.com/PocketDecks/pokemon-tcg-pocket-cards
 *
 * Usa el esquema v5 (data/v5). El v4 "legacy" quedó congelado en B4b/Promo-B
 * y no incluye la Serie C (c1 "Dual Fusion", Promo-C, …).
 *
 * Estrategia:
 *   1. Carga data/v5/expansions.min.json (lista de expansiones con fecha de lanzamiento)
 *   2. Carga en paralelo el fragmento de cartas de cada expansión
 *      (data/v5/<id>/<id>.min.json). Se usan fragmentos y no el cards.min.json
 *      completo porque éste pesa ~5,7 MB y la caché de fetch de Next.js
 *      descarta respuestas de más de 2 MB; cada fragmento pesa < 600 KB.
 *   3. Filtra las cartas por nombre con el guard anti-Mewtwo
 */

import { fetcherSafe } from '@/lib/fetcher';
import type { TCGPocketCard } from '@/types/tcg';

const RAW_BASE   = 'https://raw.githubusercontent.com/PocketDecks/pokemon-tcg-pocket-cards/refs/heads/main';
const DATA_BASE  = `${RAW_BASE}/data/v5`;
const REVALIDATE = 86400; // 24 h

// ─── Raw types ────────────────────────────────────────────────────────────────

interface RawCard {
  id: string;                // "a1-001" | "pa-001"
  name: string;              // "Bulbasaur" | "Venusaur ex"
  set_code: string;          // "a1", "c1", "pa"
  set_name: string;          // "Genetic Apex"
  pack: string;              // "Mewtwo", "Pikachu", "Shared"
  type: string;              // "Pokémon" | "Trainer"
  subtype: string;           // Pokémon: "Grass", "Fire"… · Trainer: "Item", "Supporter"…
  rarity: string | null;     // "◊"…"◊◊◊◊", "☆"…"☆☆☆", "Crown Rare", "Promo"
  ex: boolean;
  art_style: string | null;  // "Full Art", "Illustration Art", "Parallel Foil", …
  health: number | null;
  artist: string;
  image: string;             // WEBP
  image_png: string;         // PNG
}

interface RawExpansion {
  id: string;                    // "a1", "a1a", "pa"
  name: string;                  // "Genetic Apex" | "Promo-A"
  release_date: string | null;   // "2024-10-30"; null en promos
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Las promos usan un prefijo propio: "pa" (Promo-A), "pb", "pc", … */
const PROMO_EXPANSION = /^p([a-z])$/;

/** "a2b" → "A" | "b1" → "B" | "c1" → "C" | "pa" (Promo-A) → "A" */
function getSeries(expansionId: string): string {
  const promo = expansionId.match(PROMO_EXPANSION);
  return (promo ? promo[1] : expansionId.charAt(0)).toUpperCase();
}

/** Rarezas que el v4 marcaba siempre como full art aunque no tengan art_style. */
const FULL_ART_RARITIES = new Set(['☆', '☆☆', '☆☆☆', 'Crown Rare']);

/**
 * Equivalente al antiguo `fullart: 'Yes'` del v4: cualquier arte especial
 * salvo "Parallel Foil" (misma ilustración con acabado brillante), más las
 * rarezas de estrella / corona.
 */
function isFullArt(card: RawCard): boolean {
  return (!!card.art_style && card.art_style !== 'Parallel Foil') ||
    (!!card.rarity && FULL_ART_RARITIES.has(card.rarity));
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
  const expansions = await fetcherSafe<RawExpansion[]>(
    `${DATA_BASE}/expansions.min.json`,
    { revalidate: REVALIDATE },
  );
  if (!expansions?.length) return [];

  // Si falla el fragmento de una expansión sólo faltan esas cartas; el resto
  // se sigue mostrando.
  const shards = await Promise.all(
    expansions.map(e =>
      fetcherSafe<RawCard[]>(`${DATA_BASE}/${e.id}/${e.id}.min.json`, { revalidate: REVALIDATE }),
    ),
  );
  const cards = shards.flatMap(shard => shard ?? []);
  if (!cards.length) return [];

  const setMap = new Map(expansions.map(e => [e.id, e.name]));
  // Orden de lanzamiento dentro de cada serie; las promos (sin fecha) van al
  // final de su serie.
  const releaseMap = new Map(expansions.map(e => [e.id, e.release_date ?? '9999-99-99']));
  const releaseOf  = (expansionId: string) => releaseMap.get(expansionId) ?? '9999-99-99';

  return cards
    .filter(c => isNameMatch(c.name, pokemonName))
    .map(c => {
      const expansionId = c.set_code;
      const localId     = c.id.split('-').pop() ?? c.id;
      return {
        id:          c.id,
        name:        c.name,
        localId,
        imageUrl:    c.image_png || c.image,
        rarity:      c.rarity   || null,
        set:         { id: expansionId, name: setMap.get(expansionId) ?? c.set_name ?? expansionId },
        series:      getSeries(expansionId),
        pack:        c.pack     || null,
        // El v4 exponía el tipo de energía en Pokémon y "Trainer" en Entrenadores
        type:        (c.type === 'Pokémon' ? c.subtype : c.type) || null,
        hp:          c.health   ?? null,
        illustrator: c.artist   || null,
        fullArt:     isFullArt(c),
        isEx:        c.ex       === true,
      };
    })
    // Serie (A, B, C, …) → expansión en orden de lanzamiento → número de carta
    .sort((a, b) =>
      a.series.localeCompare(b.series) ||
      releaseOf(a.set.id).localeCompare(releaseOf(b.set.id)) ||
      a.set.id.localeCompare(b.set.id) ||
      parseInt(a.localId, 10) - parseInt(b.localId, 10),
    );
}
