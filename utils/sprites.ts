const GITHUB_SPRITES =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getOfficialArtworkUrl(id: number): string {
  return `${GITHUB_SPRITES}/other/official-artwork/${id}.png`;
}

export function getOfficialShinyUrl(id: number): string {
  return `${GITHUB_SPRITES}/other/official-artwork/shiny/${id}.png`;
}

export function getFrontSpriteUrl(id: number): string {
  return `${GITHUB_SPRITES}/${id}.png`;
}
