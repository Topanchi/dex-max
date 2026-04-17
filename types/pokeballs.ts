export interface GameAppearance {
  /** PokéAPI version slug, e.g. "ruby" */
  versionName: string;
  /** Human-readable title, e.g. "Ruby / Sapphire" */
  title: string;
  year: number;
  generation: number;
  region: string;
}

export interface Pokeball {
  id: number;
  name: string;
  displayName: string;
  /** Default sprite URL from PokéAPI/sprites */
  sprite: string;
  cost: number;
  effect: string;
  description: string;
  /** PokéAPI category slug, e.g. "standard-balls" */
  category: string;
  /** Deduplicated list of game appearances, sorted by year */
  gameAppearances: GameAppearance[];
  /**
   * Sugimori official artwork from Bulbagarden Archives (694×694 px).
   * Undefined for balls without Sugimori art (e.g. Legends: Arceus balls).
   */
  artworkUrl?: string;
}
