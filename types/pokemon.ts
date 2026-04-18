// ─── Raw API response types (PokéAPI) ───────────────────────────────────────

export interface RawPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface RawPokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface RawAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface RawStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

interface RawSpriteSet {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  front_gray?: string | null;
  back_gray?: string | null;
  animated?: {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
  };
}

export interface RawSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
  versions?: {
    'generation-i'?: { 'red-blue'?: RawSpriteSet; 'yellow'?: RawSpriteSet };
    'generation-ii'?: { 'crystal'?: RawSpriteSet; 'gold'?: RawSpriteSet; 'silver'?: RawSpriteSet };
    'generation-iii'?: { 'emerald'?: RawSpriteSet; 'firered-leafgreen'?: RawSpriteSet; 'ruby-sapphire'?: RawSpriteSet };
    'generation-iv'?: { 'diamond-pearl'?: RawSpriteSet; 'heartgold-soulsilver'?: RawSpriteSet; 'platinum'?: RawSpriteSet };
    'generation-v'?: { 'black-white'?: RawSpriteSet };
    'generation-vi'?: { 'omegaruby-alphasapphire'?: RawSpriteSet; 'x-y'?: RawSpriteSet };
    'generation-vii'?: { 'icons'?: Pick<RawSpriteSet, 'front_default' | 'front_shiny' | 'back_default' | 'back_shiny'>; 'ultra-sun-ultra-moon'?: RawSpriteSet };
    'generation-viii'?: { 'icons'?: Pick<RawSpriteSet, 'front_default' | 'front_shiny' | 'back_default' | 'back_shiny'> };
  };
}

export interface RawPokemon {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  types: RawPokemonType[];
  abilities: RawAbility[];
  stats: RawStat[];
  sprites: RawSprites;
  species: { name: string; url: string };
  forms: Array<{ name: string; url: string }>;
  cries: {
    latest: string | null;
    legacy: string | null;
  } | null;
  game_indices: Array<{ game_index: number; version: { name: string; url: string } }>;
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string; url: string };
      version_group: { name: string; url: string };
    }>;
  }>;
}

export interface RawFlavorText {
  flavor_text: string;
  language: { name: string };
  version: { name: string };
}

export interface RawSpeciesVariety {
  is_default: boolean;
  pokemon: { name: string; url: string };
}

export interface RawSpecies {
  id: number;
  name: string;
  flavor_text_entries: RawFlavorText[];
  genera: Array<{ genus: string; language: { name: string } }>;
  evolution_chain: { url: string };
  varieties: RawSpeciesVariety[];
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  color: { name: string };
  shape: { name: string } | null;
  generation: { name: string };
  pokedex_numbers: Array<{ entry_number: number; pokedex: { name: string; url: string } }>;
}

export interface RawEvolutionDetail {
  min_level: number | null;
  item: { name: string } | null;
  trigger: { name: string };
  min_happiness: number | null;
  held_item: { name: string } | null;
  time_of_day: string;
  location: { name: string } | null;
  known_move: { name: string } | null;
  min_beauty: number | null;
  needs_overworld_rain: boolean;
  trade_species: { name: string } | null;
  turn_upside_down: boolean;
}

export interface RawEvolutionNode {
  species: { name: string; url: string };
  evolution_details: RawEvolutionDetail[];
  evolves_to: RawEvolutionNode[];
  is_baby: boolean;
}

export interface RawEvolutionChain {
  id: number;
  chain: RawEvolutionNode;
}

// ─── Application types ───────────────────────────────────────────────────────

export interface PokemonBasic {
  id: number;
  name: string;
  types: string[];
  imageUrl: string | null;
  shinyImageUrl: string | null;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface SpriteEntry {
  /** Generation number (1–9). Used for grouping and sorting. */
  generation: number;
  /** Display label for the game title, e.g. "Rojo/Azul", "Oro", "X/Y" */
  game: string;
  /** Display label for the sprite angle, e.g. "Frontal", "Trasero Shiny" */
  label: string;
  url: string;
}

export interface PokemonSprites {
  official: string | null;
  officialShiny: string | null;
  dreamWorld: string | null;
  home: string | null;
  homeShiny: string | null;
  frontDefault: string | null;
  frontShiny: string | null;
  /** All per-generation sprites, sorted ascending by generation number. */
  generationSprites: SpriteEntry[];
}

export type VariantCategory =
  | 'mega'
  | 'gigantamax'
  | 'alolan'
  | 'galarian'
  | 'hisuian'
  | 'paldean'
  | 'alternate'
  | 'base';

export interface PokemonVariant {
  id: number;
  name: string;
  displayName: string;
  types: string[];
  imageUrl: string | null;
  category: VariantCategory;
  isDefault: boolean;
}

export interface EvolutionTrigger {
  trigger: string;
  minLevel: number | null;
  item: string | null;
  happiness: number | null;
}

export interface EvolutionNode {
  id: number;
  name: string;
  imageUrl: string | null;
  evolutionDetails: EvolutionTrigger[];
  evolvesTo: EvolutionNode[];
}

export interface SpeciesInfo {
  description: string;
  genus: string;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  color: string;
  generation: string;
}

export interface MoveInfo {
  slug: string;
  displayName: string;
  type: string;
  damageClass: string;
}

export interface VersionGroupMoves {
  versionGroup: string;
  label: string;
  generation: number;
  levelUp: Array<MoveInfo & { level: number }>;
  machine: MoveInfo[];
}

export interface RawMoveDetail {
  id: number;
  name: string;
  type: { name: string; url: string };
  damage_class: { name: string; url: string } | null;
  names: Array<{ name: string; language: { name: string } }>;
}

export interface GameAppearance {
  versionName: string;
  title: string;
  titleEs: string;
  year: number;
  generation: number;
  region: string;
  image?: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  species: SpeciesInfo;
  evolutionChain: EvolutionNode | null;
  variants: PokemonVariant[];
  cryUrl: string | null;
  gameAppearances: GameAppearance[];
  moves: VersionGroupMoves[];
}

export interface PokemonListPageResult {
  pokemon: PokemonBasic[];
  total: number;
  hasMore: boolean;
}

export interface TypePokemonEntry {
  slot: number;
  pokemon: { name: string; url: string };
}

export interface PokemonNameEntry {
  id: number;
  name: string;
}
