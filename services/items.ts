import { fetcher, fetcherSafe } from '@/lib/fetcher';
import { GAME_CATALOG } from '@/lib/pokemonGames';
import type { Item, GameAppearance } from '@/types/items';
import { normalizePokemonName } from '@/utils/normalize';

const BASE = 'https://pokeapi.co/api/v2';
const REVALIDATE = 86400;

// Pockets to fully include (pokeballs has its own page; machines/key-items excluded)
const ITEM_POCKETS = ['medicine', 'held-items', 'berries', 'z-crystals'];

// Categories from the misc pocket that are worth showing (skip loot, mulch, all-machines, etc.)
const MISC_CATEGORY_WHITELIST = new Set(['evolution', 'collectibles']);

interface RawItemPocket {
  name: string;
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
  attributes: Array<{ name: string }>;
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

export async function fetchItems(): Promise<Item[]> {
  const [regularPockets, miscPocket] = await Promise.all([
    Promise.all(
      ITEM_POCKETS.map(pocket =>
        fetcherSafe<RawItemPocket>(`${BASE}/item-pocket/${pocket}/`, { revalidate: REVALIDATE }),
      ),
    ),
    fetcherSafe<RawItemPocket>(`${BASE}/item-pocket/misc/`, { revalidate: REVALIDATE }),
  ]);

  const allCategoryRefs = [
    ...regularPockets
      .filter((p): p is RawItemPocket => p !== null)
      .flatMap(p => p.categories.map(c => ({ url: c.url, pocket: p.name }))),
    // Only include whitelisted categories from misc pocket
    ...(miscPocket?.categories
      .filter(c => MISC_CATEGORY_WHITELIST.has(c.name))
      .map(c => ({ url: c.url, pocket: 'misc' })) ?? []),
  ];

  const categoryResults = await Promise.all(
    allCategoryRefs.map(({ url, pocket }) =>
      fetcherSafe<RawItemCategory>(url, { revalidate: REVALIDATE }).then(c =>
        c ? { items: c.items, pocket } : null,
      ),
    ),
  );

  const allItemRefs = categoryResults
    .filter((c): c is { items: Array<{ name: string; url: string }>; pocket: string } => c !== null)
    .flatMap(c => c.items.map(item => ({ url: item.url, pocket: c.pocket })));

  const itemResults = await Promise.all(
    allItemRefs.map(({ url, pocket }) =>
      fetcherSafe<RawItem>(url, { revalidate: REVALIDATE }).then(item =>
        item ? { item, pocket } : null,
      ),
    ),
  );

  return itemResults
    .filter((r): r is { item: RawItem; pocket: string } => r !== null)
    .map(({ item, pocket }) => {
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
        pocket,
        gameAppearances: buildAppearances(item.game_indices ?? []),
      };
    })
    .sort((a, b) => a.id - b.id);
}
