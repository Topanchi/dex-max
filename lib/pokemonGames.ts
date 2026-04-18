/** Maps PokéAPI version slugs to display metadata */
export interface GameMeta {
  title: string;
  year: number;
  generation: number;
  region: string;
}

export const GAME_CATALOG: Record<string, GameMeta> = {
  // Gen I
  red:               { title: 'Red / Blue',                        year: 1996, generation: 1, region: 'Kanto' },
  blue:              { title: 'Red / Blue',                        year: 1996, generation: 1, region: 'Kanto' },
  yellow:            { title: 'Yellow',                            year: 1998, generation: 1, region: 'Kanto' },
  // Gen II
  gold:              { title: 'Gold / Silver',                     year: 1999, generation: 2, region: 'Johto' },
  silver:            { title: 'Gold / Silver',                     year: 1999, generation: 2, region: 'Johto' },
  crystal:           { title: 'Crystal',                           year: 2000, generation: 2, region: 'Johto' },
  // Gen III
  ruby:              { title: 'Ruby / Sapphire',                   year: 2002, generation: 3, region: 'Hoenn' },
  sapphire:          { title: 'Ruby / Sapphire',                   year: 2002, generation: 3, region: 'Hoenn' },
  firered:           { title: 'FireRed / LeafGreen',               year: 2004, generation: 3, region: 'Kanto' },
  leafgreen:         { title: 'FireRed / LeafGreen',               year: 2004, generation: 3, region: 'Kanto' },
  emerald:           { title: 'Emerald',                           year: 2004, generation: 3, region: 'Hoenn' },
  // Gen IV
  diamond:           { title: 'Diamond / Pearl',                   year: 2006, generation: 4, region: 'Sinnoh' },
  pearl:             { title: 'Diamond / Pearl',                   year: 2006, generation: 4, region: 'Sinnoh' },
  platinum:          { title: 'Platinum',                          year: 2008, generation: 4, region: 'Sinnoh' },
  heartgold:         { title: 'HeartGold / SoulSilver',            year: 2009, generation: 4, region: 'Johto' },
  soulsilver:        { title: 'HeartGold / SoulSilver',            year: 2009, generation: 4, region: 'Johto' },
  // Gen V
  black:             { title: 'Black / White',                     year: 2010, generation: 5, region: 'Unova' },
  white:             { title: 'Black / White',                     year: 2010, generation: 5, region: 'Unova' },
  'black-2':         { title: 'Black 2 / White 2',                 year: 2012, generation: 5, region: 'Unova' },
  'white-2':         { title: 'Black 2 / White 2',                 year: 2012, generation: 5, region: 'Unova' },
  // Gen VI
  x:                 { title: 'X / Y',                             year: 2013, generation: 6, region: 'Kalos' },
  y:                 { title: 'X / Y',                             year: 2013, generation: 6, region: 'Kalos' },
  'omega-ruby':      { title: 'Omega Ruby / Alpha Sapphire',       year: 2014, generation: 6, region: 'Hoenn' },
  'alpha-sapphire':  { title: 'Omega Ruby / Alpha Sapphire',       year: 2014, generation: 6, region: 'Hoenn' },
  // Gen VII
  sun:               { title: 'Sun / Moon',                        year: 2016, generation: 7, region: 'Alola' },
  moon:              { title: 'Sun / Moon',                        year: 2016, generation: 7, region: 'Alola' },
  'ultra-sun':       { title: 'Ultra Sun / Ultra Moon',            year: 2017, generation: 7, region: 'Alola' },
  'ultra-moon':      { title: 'Ultra Sun / Ultra Moon',            year: 2017, generation: 7, region: 'Alola' },
  // Gen VIII
  sword:             { title: 'Sword / Shield',                    year: 2019, generation: 8, region: 'Galar' },
  shield:            { title: 'Sword / Shield',                    year: 2019, generation: 8, region: 'Galar' },
  'brilliant-diamond': { title: 'Brilliant Diamond / Shining Pearl', year: 2021, generation: 8, region: 'Sinnoh' },
  'shining-pearl':   { title: 'Brilliant Diamond / Shining Pearl', year: 2021, generation: 8, region: 'Sinnoh' },
  'legends-arceus':  { title: 'Legends: Arceus',                   year: 2022, generation: 8, region: 'Hisui' },
  // Gen IX
  scarlet:           { title: 'Scarlet / Violet',                  year: 2022, generation: 9, region: 'Paldea' },
  violet:            { title: 'Scarlet / Violet',                  year: 2022, generation: 9, region: 'Paldea' },
  // Gen X
  'legends-za':      { title: 'Legends: Z-A',                      year: 2025, generation: 10, region: 'Kalos' },
};

export const GEN_COLORS: Record<number, { text: string; bg: string; dot: string }> = {
  1: { text: 'text-red-400',    bg: 'bg-red-500/15',    dot: 'bg-red-400' },
  2: { text: 'text-yellow-400', bg: 'bg-yellow-500/15', dot: 'bg-yellow-400' },
  3: { text: 'text-green-400',  bg: 'bg-green-500/15',  dot: 'bg-green-400' },
  4: { text: 'text-blue-400',   bg: 'bg-blue-500/15',   dot: 'bg-blue-400' },
  5: { text: 'text-slate-400',  bg: 'bg-slate-500/15',  dot: 'bg-slate-400' },
  6: { text: 'text-teal-400',   bg: 'bg-teal-500/15',   dot: 'bg-teal-400' },
  7: { text: 'text-orange-400', bg: 'bg-orange-500/15', dot: 'bg-orange-400' },
  8: { text: 'text-purple-400', bg: 'bg-purple-500/15', dot: 'bg-purple-400' },
  9:  { text: 'text-pink-400',   bg: 'bg-pink-500/15',   dot: 'bg-pink-400' },
  10: { text: 'text-cyan-400',  bg: 'bg-cyan-500/15',   dot: 'bg-cyan-400' },
};
