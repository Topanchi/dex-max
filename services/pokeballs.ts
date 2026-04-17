import { fetcher, fetcherSafe } from '@/lib/fetcher';
import { GAME_CATALOG } from '@/lib/pokemonGames';
import { SUGIMORI_ARTWORK } from '@/lib/bulbagardenArtwork';
import type { Pokeball, GameAppearance } from '@/types/pokeballs';
import { normalizePokemonName } from '@/utils/normalize';

const BASE = 'https://pokeapi.co/api/v2';
const REVALIDATE = 86400;

interface RawItemPocket {
  categories: Array<{ name: string; url: string }>;
}

interface RawItemCategory {
  items: Array<{ name: string; url: string }>;
}

interface RawItem {
  id: number;
  name: string;
  cost: number;
  sprites: { default: string | null };
  category: { name: string };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  effect_entries: Array<{
    short_effect: string;
    language: { name: string };
  }>;
  game_indices: Array<{
    game_index: number;
    version: { name: string; url: string };
  }>;
}

/** Build a deduplicated, chronologically sorted list of game appearances */
function buildAppearances(gameIndices: RawItem['game_indices']): GameAppearance[] {
  const seen = new Set<string>();
  const result: GameAppearance[] = [];

  for (const entry of gameIndices) {
    if (!entry.version?.name) continue;
    const meta = GAME_CATALOG[entry.version.name];
    if (!meta || seen.has(meta.title)) continue;
    seen.add(meta.title);
    result.push({ versionName: entry.version.name, ...meta });
  }

  return result.sort((a, b) => a.year - b.year || a.generation - b.generation);
}

export async function fetchPokeballs(): Promise<Pokeball[]> {
  const pocket = await fetcher<RawItemPocket>(
    `${BASE}/item-pocket/pokeballs/`,
    { revalidate: REVALIDATE },
  );

  const categoryResults = await Promise.all(
    pocket.categories.map(c =>
      fetcherSafe<RawItemCategory>(c.url, { revalidate: REVALIDATE }),
    ),
  );

  const allItemRefs = categoryResults
    .filter((c): c is RawItemCategory => c !== null)
    .flatMap(c => c.items);

  const itemResults = await Promise.all(
    allItemRefs.map(ref =>
      fetcherSafe<RawItem>(ref.url, { revalidate: REVALIDATE }),
    ),
  );

  const items = itemResults.filter((item): item is RawItem => item !== null);

  return items
    .map(item => {
      const enEffect = item.effect_entries.find(e => e.language.name === 'en');
      const enFlavor = item.flavor_text_entries.find(e => e.language.name === 'en');

      return {
        id: item.id,
        name: item.name,
        displayName: normalizePokemonName(item.name),
        sprite: item.sprites.default ?? '',
        cost: item.cost,
        effect: enEffect?.short_effect ?? '',
        description: enFlavor?.flavor_text?.replace(/[\n\f]/g, ' ') ?? '',
        category: item.category?.name ?? '',
        gameAppearances: buildAppearances(item.game_indices ?? []),
        artworkUrl: SUGIMORI_ARTWORK[item.name],
      };
    })
    .sort((a, b) => a.id - b.id);
}
