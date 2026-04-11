interface TypeColor {
  /** Tailwind bg class */
  bg: string;
  /** Tailwind text class */
  text: string;
  /** Hex for gradients / CSS */
  hex: string;
}

export const TYPE_COLORS: Record<string, TypeColor> = {
  normal:   { bg: 'bg-gray-500',    text: 'text-white',       hex: '#A8A878' },
  fire:     { bg: 'bg-orange-500',  text: 'text-white',       hex: '#F08030' },
  water:    { bg: 'bg-blue-500',    text: 'text-white',       hex: '#6890F0' },
  electric: { bg: 'bg-yellow-400',  text: 'text-yellow-900',  hex: '#F8D030' },
  grass:    { bg: 'bg-green-500',   text: 'text-white',       hex: '#78C850' },
  ice:      { bg: 'bg-cyan-400',    text: 'text-cyan-900',    hex: '#98D8D8' },
  fighting: { bg: 'bg-red-700',     text: 'text-white',       hex: '#C03028' },
  poison:   { bg: 'bg-purple-600',  text: 'text-white',       hex: '#A040A0' },
  ground:   { bg: 'bg-amber-600',   text: 'text-white',       hex: '#E0C068' },
  flying:   { bg: 'bg-indigo-400',  text: 'text-white',       hex: '#A890F0' },
  psychic:  { bg: 'bg-pink-500',    text: 'text-white',       hex: '#F85888' },
  bug:      { bg: 'bg-lime-500',    text: 'text-lime-900',    hex: '#A8B820' },
  rock:     { bg: 'bg-stone-500',   text: 'text-white',       hex: '#B8A038' },
  ghost:    { bg: 'bg-purple-800',  text: 'text-white',       hex: '#705898' },
  dragon:   { bg: 'bg-violet-700',  text: 'text-white',       hex: '#7038F8' },
  dark:     { bg: 'bg-gray-700',    text: 'text-white',       hex: '#705848' },
  steel:    { bg: 'bg-slate-400',   text: 'text-slate-900',   hex: '#B8B8D0' },
  fairy:    { bg: 'bg-pink-400',    text: 'text-pink-900',    hex: '#EE99AC' },
};

export const ALL_TYPES = Object.keys(TYPE_COLORS) as string[];

const FALLBACK: TypeColor = { bg: 'bg-gray-500', text: 'text-white', hex: '#A8A878' };

export function getTypeColor(type: string): TypeColor {
  return TYPE_COLORS[type] ?? FALLBACK;
}

/** Returns a CSS gradient for the first (or first two) types of a Pokemon */
export function getTypeGradient(types: string[]): string {
  if (types.length === 0) return 'linear-gradient(135deg, #1a1a2e, #2a2a4e)';
  const c1 = TYPE_COLORS[types[0]]?.hex ?? FALLBACK.hex;
  const c2 = types[1] ? (TYPE_COLORS[types[1]]?.hex ?? c1) : c1;
  return `linear-gradient(135deg, ${c1}33 0%, ${c2}22 100%)`;
}
