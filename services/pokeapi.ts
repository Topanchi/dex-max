import { fetcher, fetcherSafe } from '@/lib/fetcher';
import {
  getIdFromUrl,
  inferVariantCategory,
  normalizeFormDisplayName,
} from '@/utils/normalize';
import { getOfficialArtworkUrl, getOfficialShinyUrl } from '@/utils/sprites';
import { GAME_CATALOG } from '@/lib/pokemonGames';
import type {
  RawPokemon,
  RawSprites,
  RawSpecies,
  RawEvolutionChain,
  RawEvolutionNode,
  RawPokemonListResponse,
  PokemonBasic,
  PokemonDetail,
  PokemonStat,
  PokemonAbility,
  PokemonVariant,
  SpriteEntry,
  EvolutionNode,
  EvolutionTrigger,
  PokemonListPageResult,
  TypePokemonEntry,
  PokemonNameEntry,
  SpeciesInfo,
  GameAppearance,
  VersionGroupMoves,
  RawMoveDetail,
} from '@/types/pokemon';

const BASE = 'https://pokeapi.co/api/v2';
const REVALIDATE = 86400; // 24 h

// ─── Internal mappers ────────────────────────────────────────────────────────

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defensa Esp.',
  speed: 'Velocidad',
};

function mapStats(raw: RawPokemon['stats']): PokemonStat[] {
  return raw.map(s => ({
    name: STAT_NAMES[s.stat.name] ?? s.stat.name,
    value: s.base_stat,
  }));
}

function mapAbilities(raw: RawPokemon['abilities']): PokemonAbility[] {
  return raw
    .sort((a, b) => a.slot - b.slot)
    .map(a => ({ name: a.ability.name, isHidden: a.is_hidden }));
}

function mapEvolutionNode(node: RawEvolutionNode): EvolutionNode {
  const id = getIdFromUrl(node.species.url);
  const triggers: EvolutionTrigger[] = node.evolution_details.map(d => ({
    trigger: d.trigger.name,
    minLevel: d.min_level,
    item: d.item?.name ?? d.held_item?.name ?? null,
    happiness: d.min_happiness,
  }));
  return {
    id,
    name: node.species.name,
    imageUrl: getOfficialArtworkUrl(id),
    evolutionDetails: triggers,
    evolvesTo: node.evolves_to.map(mapEvolutionNode),
  };
}

function getSpanishFlavour(species: RawSpecies): string {
  const es = species.flavor_text_entries.find(e => e.language.name === 'es');
  const en = species.flavor_text_entries.find(e => e.language.name === 'en');
  const raw = (es ?? en)?.flavor_text ?? '';
  return raw.replace(/[\f\n]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getGenus(species: RawSpecies): string {
  const es = species.genera.find(g => g.language.name === 'es');
  const en = species.genera.find(g => g.language.name === 'en');
  return (es ?? en)?.genus ?? '';
}

// ─── Generation sprite extraction ────────────────────────────────────────────

interface GameConfig {
  gameKey: string;
  label: string;
}

interface GenConfig {
  gen: number;
  genKey: keyof NonNullable<RawSprites['versions']>;
  games: GameConfig[];
}

const GEN_CONFIG: GenConfig[] = [
  {
    gen: 1, genKey: 'generation-i',
    games: [
      { gameKey: 'red-blue', label: 'Rojo/Azul' },
      { gameKey: 'yellow',   label: 'Amarillo' },
    ],
  },
  {
    gen: 2, genKey: 'generation-ii',
    games: [
      { gameKey: 'gold',    label: 'Oro' },
      { gameKey: 'silver',  label: 'Plata' },
      { gameKey: 'crystal', label: 'Cristal' },
    ],
  },
  {
    gen: 3, genKey: 'generation-iii',
    games: [
      { gameKey: 'ruby-sapphire',    label: 'Rubí/Zafiro' },
      { gameKey: 'emerald',          label: 'Esmeralda' },
      { gameKey: 'firered-leafgreen', label: 'RojoFuego/VerdеHoja' },
    ],
  },
  {
    gen: 4, genKey: 'generation-iv',
    games: [
      { gameKey: 'diamond-pearl',         label: 'Diamante/Perla' },
      { gameKey: 'platinum',              label: 'Platino' },
      { gameKey: 'heartgold-soulsilver',  label: 'OroHeartGold/PlataAlma' },
    ],
  },
  {
    gen: 5, genKey: 'generation-v',
    games: [{ gameKey: 'black-white', label: 'Negro/Blanco' }],
  },
  {
    gen: 6, genKey: 'generation-vi',
    games: [
      { gameKey: 'x-y',                      label: 'X/Y' },
      { gameKey: 'omegaruby-alphasapphire',   label: 'OmegaRubí/AlphaZafiro' },
    ],
  },
  {
    gen: 7, genKey: 'generation-vii',
    games: [{ gameKey: 'ultra-sun-ultra-moon', label: 'UltraSol/UltraLuna' }],
  },
];

type RawSpriteSetLike = {
  front_default?: string | null;
  front_shiny?: string | null;
  back_default?: string | null;
  back_shiny?: string | null;
  animated?: {
    front_default?: string | null;
    front_shiny?: string | null;
    back_default?: string | null;
    back_shiny?: string | null;
  };
};

function spritesFromSet(
  set: RawSpriteSetLike | undefined | null,
  generation: number,
  game: string,
): SpriteEntry[] {
  if (!set) return [];
  const entries: SpriteEntry[] = [];
  if (set.front_default) entries.push({ generation, game, label: 'Frontal',             url: set.front_default });
  if (set.front_shiny)   entries.push({ generation, game, label: 'Frontal Shiny',       url: set.front_shiny });
  if (set.back_default)  entries.push({ generation, game, label: 'Trasero',             url: set.back_default });
  if (set.back_shiny)    entries.push({ generation, game, label: 'Trasero Shiny',       url: set.back_shiny });
  const anim = set.animated;
  if (anim?.front_default) entries.push({ generation, game, label: 'Frontal Anim.',       url: anim.front_default });
  if (anim?.front_shiny)   entries.push({ generation, game, label: 'Frontal Shiny Anim.', url: anim.front_shiny });
  if (anim?.back_default)  entries.push({ generation, game, label: 'Trasero Anim.',       url: anim.back_default });
  if (anim?.back_shiny)    entries.push({ generation, game, label: 'Trasero Shiny Anim.', url: anim.back_shiny });
  return entries;
}

function extractGenerationSprites(raw: RawPokemon): SpriteEntry[] {
  const versions = raw.sprites.versions;
  if (!versions) return [];

  const entries: SpriteEntry[] = [];

  for (const { gen, genKey, games } of GEN_CONFIG) {
    const genData = versions[genKey] as Record<string, RawSpriteSetLike> | undefined;
    if (!genData) continue;

    for (const { gameKey, label } of games) {
      const set = genData[gameKey];
      entries.push(...spritesFromSet(set, gen, label));
    }
  }

  // Modern sprites (Home, Dream World) treated as generation 8/9
  const home = raw.sprites.other.home;
  if (home.front_default) entries.push({ generation: 8, game: 'Pokémon HOME', label: 'Frontal',       url: home.front_default });
  if (home.front_shiny)   entries.push({ generation: 8, game: 'Pokémon HOME', label: 'Frontal Shiny', url: home.front_shiny });

  const dw = raw.sprites.other.dream_world.front_default;
  if (dw) entries.push({ generation: 5, game: 'Dream World', label: 'Frontal', url: dw });

  // Sort ascending by generation, then keep insertion order within each gen
  entries.sort((a, b) => a.generation - b.generation);

  return entries;
}

// Maps PokéAPI Pokédex slugs to the version names in GAME_CATALOG.
// game_indices only covers Gen 1–5 reliably; pokedex_numbers fills Gen 6–9.
const POKEDEX_VERSIONS: Record<string, string[]> = {
  'kanto':              ['red', 'blue', 'yellow'],
  'updated-kanto':      ['firered', 'leafgreen'],
  'original-johto':     ['gold', 'silver', 'crystal'],
  'updated-johto':      ['heartgold', 'soulsilver'],
  'extended-sinnoh':    ['heartgold', 'soulsilver'],
  'hoenn':              ['ruby', 'sapphire', 'emerald'],
  'updated-hoenn':      ['omega-ruby', 'alpha-sapphire'],
  'original-sinnoh':    ['diamond', 'pearl', 'platinum'],
  'updated-sinnoh':     ['brilliant-diamond', 'shining-pearl'],
  'original-unova':     ['black', 'white'],
  'updated-unova':      ['black-2', 'white-2'],
  'kalos-central':      ['x', 'y'],
  'kalos-coastal':      ['x', 'y'],
  'kalos-mountain':     ['x', 'y'],
  'original-alola':     ['sun', 'moon'],
  'original-melemele':  ['sun', 'moon'],
  'original-akala':     ['sun', 'moon'],
  'original-ulaula':    ['sun', 'moon'],
  'original-poni':      ['sun', 'moon'],
  'updated-alola':      ['ultra-sun', 'ultra-moon'],
  'updated-melemele':   ['ultra-sun', 'ultra-moon'],
  'updated-akala':      ['ultra-sun', 'ultra-moon'],
  'updated-ulaula':     ['ultra-sun', 'ultra-moon'],
  'updated-poni':       ['ultra-sun', 'ultra-moon'],
  'original-galar':     ['sword', 'shield'],
  'galar':              ['sword', 'shield'],
  'isle-of-armor':      ['sword', 'shield'],
  'crown-tundra':       ['sword', 'shield'],
  'hisui':              ['legends-arceus'],
  'paldea':             ['scarlet', 'violet'],
  'original-paldea':    ['scarlet', 'violet'],
  'kitakami':           ['scarlet', 'violet'],
  'blueberry':          ['scarlet', 'violet'],
  'legends-za':         ['legends-za'],
  'lumiose-city':       ['legends-za'],
};

function buildGameAppearances(
  gameIndices: RawPokemon['game_indices'],
  pokedexNames: string[],
): GameAppearance[] {
  const seen = new Set<string>();
  const result: GameAppearance[] = [];

  const addVersion = (versionName: string) => {
    const meta = GAME_CATALOG[versionName];
    if (!meta || seen.has(meta.title)) return;
    seen.add(meta.title);
    result.push({ versionName, ...meta });
  };

  for (const entry of gameIndices) {
    if (entry.version?.name) addVersion(entry.version.name);
  }

  for (const pokedexName of pokedexNames) {
    for (const versionName of POKEDEX_VERSIONS[pokedexName] ?? []) {
      addVersion(versionName);
    }
  }

  return result.sort((a, b) => a.year - b.year || a.generation - b.generation);
}

// ─── Move processing ─────────────────────────────────────────────────────────

const VERSION_GROUP_META: Record<string, { label: string; generation: number }> = {
  'red-blue':                            { label: 'Rojo/Azul',           generation: 1 },
  'yellow':                              { label: 'Amarillo',             generation: 1 },
  'gold-silver':                         { label: 'Oro/Plata',            generation: 2 },
  'crystal':                             { label: 'Cristal',              generation: 2 },
  'ruby-sapphire':                       { label: 'Rubí/Zafiro',          generation: 3 },
  'emerald':                             { label: 'Esmeralda',            generation: 3 },
  'firered-leafgreen':                   { label: 'RJ/VH',                generation: 3 },
  'diamond-pearl':                       { label: 'Diamante/Perla',       generation: 4 },
  'platinum':                            { label: 'Platino',              generation: 4 },
  'heartgold-soulsilver':                { label: 'OHG/PA',               generation: 4 },
  'black-white':                         { label: 'Negro/Blanco',         generation: 5 },
  'black-2-white-2':                     { label: 'Negro 2/Blanco 2',     generation: 5 },
  'x-y':                                 { label: 'X/Y',                  generation: 6 },
  'omega-ruby-alpha-sapphire':           { label: 'OR/AS',                generation: 6 },
  'sun-moon':                            { label: 'Sol/Luna',             generation: 7 },
  'ultra-sun-ultra-moon':                { label: 'UltraSol/UltraLuna',  generation: 7 },
  'lets-go-pikachu-lets-go-eevee':       { label: "Let's Go",             generation: 7 },
  'sword-shield':                        { label: 'Espada/Escudo',        generation: 8 },
  'the-isle-of-armor':                   { label: 'Isla Armadura',        generation: 8 },
  'the-crown-tundra':                    { label: 'Tierra Corona',        generation: 8 },
  'brilliant-diamond-and-shining-pearl': { label: 'BD/SP',                generation: 8 },
  'legends-arceus':                      { label: 'Leyendas: Arceus',     generation: 8 },
  'scarlet-violet':                      { label: 'Escarlata/Violeta',    generation: 9 },
  'the-teal-mask':                       { label: 'Máscara Turquesa',     generation: 9 },
  'the-indigo-disk':                     { label: 'Disco Índigo',         generation: 9 },
  'legends-za':                          { label: 'Leyendas: Z-A',        generation: 10 },
};

const VG_ORDER = Object.keys(VERSION_GROUP_META);

function formatMoveName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

type MoveDetailMap = Map<string, { type: string; damageClass: string; displayName: string }>;

async function fetchAllMoveDetails(rawMoves: RawPokemon['moves']): Promise<MoveDetailMap> {
  const unique = new Map(rawMoves.map(m => [m.move.name, m.move.url]));
  const results = await Promise.all(
    Array.from(unique.entries()).map(async ([name, url]) => {
      const detail = await fetcherSafe<RawMoveDetail>(url, { revalidate: REVALIDATE });
      return [name, detail] as const;
    }),
  );
  const map: MoveDetailMap = new Map();
  for (const [name, detail] of results) {
    if (detail) {
      const esName = detail.names.find(n => n.language.name === 'es')?.name
        ?? detail.names.find(n => n.language.name === 'en')?.name
        ?? formatMoveName(name);
      map.set(name, {
        type: detail.type.name,
        damageClass: detail.damage_class?.name ?? 'status',
        displayName: esName,
      });
    }
  }
  return map;
}

function processMoves(rawMoves: RawPokemon['moves'], detailMap: MoveDetailMap): VersionGroupMoves[] {
  const groups = new Map<string, {
    levelUp: Map<string, number>;
    machine: Set<string>;
  }>();

  for (const moveEntry of rawMoves) {
    const slug = moveEntry.move.name;
    for (const detail of moveEntry.version_group_details) {
      const vg = detail.version_group.name;
      if (!VERSION_GROUP_META[vg]) continue;

      if (!groups.has(vg)) groups.set(vg, { levelUp: new Map(), machine: new Set() });
      const group = groups.get(vg)!;
      const method = detail.move_learn_method.name;

      if (method === 'level-up') {
        group.levelUp.set(slug, detail.level_learned_at);
      } else if (method === 'machine') {
        group.machine.add(slug);
      }
    }
  }

  const getMoveInfo = (slug: string) => {
    const d = detailMap.get(slug);
    return {
      displayName: d?.displayName ?? formatMoveName(slug),
      type: d?.type ?? 'normal',
      damageClass: d?.damageClass ?? 'status',
    };
  };

  const result: VersionGroupMoves[] = [];
  for (const [vg, data] of groups) {
    const meta = VERSION_GROUP_META[vg]!;
    result.push({
      versionGroup: vg,
      label: meta.label,
      generation: meta.generation,
      levelUp: Array.from(data.levelUp.entries())
        .map(([slug, level]) => ({ slug, level, ...getMoveInfo(slug) }))
        .sort((a, b) => a.level - b.level || a.displayName.localeCompare(b.displayName)),
      machine: Array.from(data.machine)
        .map(slug => ({ slug, ...getMoveInfo(slug) }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName)),
    });
  }

  return result.sort((a, b) => {
    if (a.generation !== b.generation) return a.generation - b.generation;
    return VG_ORDER.indexOf(a.versionGroup) - VG_ORDER.indexOf(b.versionGroup);
  });
}

function extractImageUrl(raw: RawPokemon): string | null {
  return (
    raw.sprites.other['official-artwork'].front_default ??
    raw.sprites.other.home.front_default ??
    raw.sprites.front_default ??
    null
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchAllPokemonNames(): Promise<PokemonNameEntry[]> {
  const list = await fetcher<RawPokemonListResponse>(
    `${BASE}/pokemon?limit=10000&offset=0`,
    { revalidate: REVALIDATE },
  );
  return list.results.map(item => ({
    id: getIdFromUrl(item.url),
    name: item.name,
  }));
}

export async function fetchRawPokemon(idOrName: number | string): Promise<RawPokemon> {
  return fetcher<RawPokemon>(`${BASE}/pokemon/${idOrName}`, { revalidate: REVALIDATE });
}

export async function fetchPokemonBasic(idOrName: number | string): Promise<PokemonBasic> {
  const raw = await fetchRawPokemon(idOrName);
  return {
    id: raw.id,
    name: raw.name,
    types: raw.types.map(t => t.type.name),
    imageUrl: extractImageUrl(raw),
    shinyImageUrl:
      raw.sprites.other['official-artwork'].front_shiny ??
      raw.sprites.other.home.front_shiny ??
      raw.sprites.front_shiny ??
      null,
  };
}

export async function fetchPokemonPage(
  offset: number,
  limit: number,
): Promise<PokemonListPageResult> {
  const list = await fetcher<RawPokemonListResponse>(
    `${BASE}/pokemon?limit=${limit}&offset=${offset}`,
    { revalidate: REVALIDATE },
  );

  const ids = list.results.map(item => getIdFromUrl(item.url));

  const pokemon = await Promise.all(
    ids.map(id =>
      fetcherSafe<RawPokemon>(`${BASE}/pokemon/${id}`, { revalidate: REVALIDATE }).then(
        raw =>
          raw
            ? ({
                id: raw.id,
                name: raw.name,
                types: raw.types.map(t => t.type.name),
                imageUrl: extractImageUrl(raw),
                shinyImageUrl:
                  raw.sprites.other['official-artwork'].front_shiny ?? null,
              } satisfies PokemonBasic)
            : null,
      ),
    ),
  );

  return {
    pokemon: pokemon.filter((p): p is PokemonBasic => p !== null),
    total: list.count,
    hasMore: list.next !== null,
  };
}

export async function fetchPokemonByGeneration(
  generationId: number,
  offset: number,
  limit: number,
): Promise<PokemonListPageResult> {
  const genData = await fetcher<{
    pokemon_species: Array<{ name: string; url: string }>;
  }>(`${BASE}/generation/${generationId}`, { revalidate: REVALIDATE });

  // Sort by species ID ascending so we get a predictable order
  const allSpecies = genData.pokemon_species
    .map(s => ({ name: s.name, id: getIdFromUrl(s.url) }))
    .sort((a, b) => a.id - b.id);

  const total = allSpecies.length;
  const pageSpecies = allSpecies.slice(offset, offset + limit);

  const pokemon = await Promise.all(
    pageSpecies.map(species =>
      fetcherSafe<RawPokemon>(`${BASE}/pokemon/${species.id}`, { revalidate: REVALIDATE }).then(
        raw =>
          raw
            ? ({
                id: raw.id,
                name: raw.name,
                types: raw.types.map(t => t.type.name),
                imageUrl: extractImageUrl(raw),
                shinyImageUrl: raw.sprites.other['official-artwork'].front_shiny ?? null,
              } satisfies PokemonBasic)
            : null,
      ),
    ),
  );

  return {
    pokemon: pokemon.filter((p): p is PokemonBasic => p !== null),
    total,
    hasMore: offset + limit < total,
  };
}

export async function fetchPokemonByType(
  typeName: string,
  offset: number,
  limit: number,
): Promise<PokemonListPageResult> {
  const typeData = await fetcher<{ pokemon: TypePokemonEntry[]; name: string }>(
    `${BASE}/type/${typeName}`,
    { revalidate: REVALIDATE },
  );

  // Only keep slot-1 entries (the Pokemon's primary or secondary type)
  const allEntries = typeData.pokemon;
  const pageEntries = allEntries.slice(offset, offset + limit);
  const total = allEntries.length;

  const pokemon = await Promise.all(
    pageEntries.map(entry =>
      fetcherSafe<RawPokemon>(entry.pokemon.url, { revalidate: REVALIDATE }).then(
        raw =>
          raw
            ? ({
                id: raw.id,
                name: raw.name,
                types: raw.types.map(t => t.type.name),
                imageUrl: extractImageUrl(raw),
                shinyImageUrl:
                  raw.sprites.other['official-artwork'].front_shiny ?? null,
              } satisfies PokemonBasic)
            : null,
      ),
    ),
  );

  return {
    pokemon: pokemon.filter((p): p is PokemonBasic => p !== null),
    total,
    hasMore: offset + limit < total,
  };
}

async function fetchSpeciesAndChain(
  raw: RawPokemon,
): Promise<{ species: SpeciesInfo; evolutionChain: EvolutionNode | null; pokedexNames: string[] }> {
  const speciesId = getIdFromUrl(raw.species.url);
  const speciesData = await fetcherSafe<RawSpecies>(
    `${BASE}/pokemon-species/${speciesId}`,
    { revalidate: REVALIDATE },
  );

  const species: SpeciesInfo = speciesData
    ? {
        description: getSpanishFlavour(speciesData),
        genus: getGenus(speciesData),
        isLegendary: speciesData.is_legendary,
        isMythical: speciesData.is_mythical,
        isBaby: speciesData.is_baby,
        color: speciesData.color.name,
        generation: speciesData.generation.name,
      }
    : {
        description: '',
        genus: '',
        isLegendary: false,
        isMythical: false,
        isBaby: false,
        color: 'unknown',
        generation: 'unknown',
      };

  const pokedexNames = speciesData?.pokedex_numbers?.map(p => p.pokedex.name) ?? [];

  let evolutionChain: EvolutionNode | null = null;
  if (speciesData?.evolution_chain?.url) {
    const chainId = getIdFromUrl(speciesData.evolution_chain.url);
    const chain = await fetcherSafe<RawEvolutionChain>(
      `${BASE}/evolution-chain/${chainId}`,
      { revalidate: REVALIDATE },
    );
    if (chain) evolutionChain = mapEvolutionNode(chain.chain);
  }

  return { species, evolutionChain, pokedexNames };
}

async function fetchVariants(raw: RawPokemon): Promise<PokemonVariant[]> {
  const speciesId = getIdFromUrl(raw.species.url);
  const speciesData = await fetcherSafe<RawSpecies>(
    `${BASE}/pokemon-species/${speciesId}`,
    { revalidate: REVALIDATE },
  );

  if (!speciesData) return [];

  const nonDefault = speciesData.varieties.filter(v => !v.is_default);
  if (nonDefault.length === 0) return [];

  const results = await Promise.all(
    nonDefault.map(async variety => {
      const variantRaw = await fetcherSafe<RawPokemon>(variety.pokemon.url, {
        revalidate: REVALIDATE,
      });
      if (!variantRaw) return null;

      const category = inferVariantCategory(variety.pokemon.name);
      const displayName = normalizeFormDisplayName(variety.pokemon.name, raw.name);

      return {
        id: variantRaw.id,
        name: variantRaw.name,
        displayName,
        types: variantRaw.types.map(t => t.type.name),
        imageUrl: extractImageUrl(variantRaw),
        category,
        isDefault: false,
      } satisfies PokemonVariant;
    }),
  );

  // Deduplicate by id
  const seen = new Set<number>();
  return results.filter(v => {
    if (!v || seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  }) as PokemonVariant[];
}

export async function fetchPokemonDetail(
  idOrName: number | string,
): Promise<PokemonDetail> {
  const raw = await fetchRawPokemon(idOrName);

  const [{ species, evolutionChain, pokedexNames }, variants, moveDetailMap] = await Promise.all([
    fetchSpeciesAndChain(raw),
    fetchVariants(raw),
    fetchAllMoveDetails(raw.moves ?? []),
  ]);

  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    types: raw.types.map(t => t.type.name),
    abilities: mapAbilities(raw.abilities),
    stats: mapStats(raw.stats),
    sprites: {
      official: raw.sprites.other['official-artwork'].front_default ?? getOfficialArtworkUrl(raw.id),
      officialShiny: raw.sprites.other['official-artwork'].front_shiny ?? getOfficialShinyUrl(raw.id),
      dreamWorld: raw.sprites.other.dream_world.front_default ?? null,
      home: raw.sprites.other.home.front_default ?? null,
      homeShiny: raw.sprites.other.home.front_shiny ?? null,
      frontDefault: raw.sprites.front_default ?? null,
      frontShiny: raw.sprites.front_shiny ?? null,
      generationSprites: extractGenerationSprites(raw),
    },
    species,
    evolutionChain,
    variants,
    cryUrl: raw.cries?.latest ?? null,
    gameAppearances: buildGameAppearances(raw.game_indices ?? [], pokedexNames),
    moves: processMoves(raw.moves ?? [], moveDetailMap),
  };
}
