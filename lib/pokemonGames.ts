/** Maps PokéAPI version slugs to display metadata */
export interface GameMeta {
  title: string;
  titleEs: string;
  year: number;
  generation: number;
  region: string;
  image?: string;
}

export const GAME_CATALOG: Record<string, GameMeta> = {
  // Gen I
  red:               { title: 'Red / Blue',                       titleEs: 'Rojo / Azul',                   year: 1996, generation: 1,  region: 'Kanto',   image: '/games/red-blue.svg' },
  blue:              { title: 'Red / Blue',                       titleEs: 'Rojo / Azul',                   year: 1996, generation: 1,  region: 'Kanto',   image: '/games/red-blue.svg' },
  yellow:            { title: 'Yellow',                           titleEs: 'Amarillo',                      year: 1998, generation: 1,  region: 'Kanto',   image: '/games/yellow.svg' },
  // Gen II
  gold:              { title: 'Gold / Silver',                    titleEs: 'Oro / Plata',                   year: 1999, generation: 2,  region: 'Johto',   image: '/games/gold-silver.svg' },
  silver:            { title: 'Gold / Silver',                    titleEs: 'Oro / Plata',                   year: 1999, generation: 2,  region: 'Johto',   image: '/games/gold-silver.svg' },
  crystal:           { title: 'Crystal',                          titleEs: 'Cristal',                       year: 2000, generation: 2,  region: 'Johto',   image: '/games/crystal.svg' },
  // Gen III
  ruby:              { title: 'Ruby / Sapphire',                  titleEs: 'Rubí / Zafiro',                 year: 2002, generation: 3,  region: 'Hoenn',   image: '/games/ruby-sapphire.svg' },
  sapphire:          { title: 'Ruby / Sapphire',                  titleEs: 'Rubí / Zafiro',                 year: 2002, generation: 3,  region: 'Hoenn',   image: '/games/ruby-sapphire.svg' },
  firered:           { title: 'FireRed / LeafGreen',              titleEs: 'Rojo Fuego / Verde Hoja',       year: 2004, generation: 3,  region: 'Kanto',   image: '/games/firered-leafgreen.svg' },
  leafgreen:         { title: 'FireRed / LeafGreen',              titleEs: 'Rojo Fuego / Verde Hoja',       year: 2004, generation: 3,  region: 'Kanto',   image: '/games/firered-leafgreen.svg' },
  emerald:           { title: 'Emerald',                          titleEs: 'Esmeralda',                     year: 2004, generation: 3,  region: 'Hoenn',   image: '/games/emerald.svg' },
  // Gen IV
  diamond:           { title: 'Diamond / Pearl',                  titleEs: 'Diamante / Perla',              year: 2006, generation: 4,  region: 'Sinnoh',  image: '/games/diamond-pearl.svg' },
  pearl:             { title: 'Diamond / Pearl',                  titleEs: 'Diamante / Perla',              year: 2006, generation: 4,  region: 'Sinnoh',  image: '/games/diamond-pearl.svg' },
  platinum:          { title: 'Platinum',                         titleEs: 'Platino',                       year: 2008, generation: 4,  region: 'Sinnoh',  image: '/games/platinum.svg' },
  heartgold:         { title: 'HeartGold / SoulSilver',           titleEs: 'HeartGold / SoulSilver',        year: 2009, generation: 4,  region: 'Johto',   image: '/games/heartgold-soulsilver.svg' },
  soulsilver:        { title: 'HeartGold / SoulSilver',           titleEs: 'HeartGold / SoulSilver',        year: 2009, generation: 4,  region: 'Johto',   image: '/games/heartgold-soulsilver.svg' },
  // Gen V
  black:             { title: 'Black / White',                    titleEs: 'Negro / Blanco',                year: 2010, generation: 5,  region: 'Unova',   image: '/games/black-white.svg' },
  white:             { title: 'Black / White',                    titleEs: 'Negro / Blanco',                year: 2010, generation: 5,  region: 'Unova',   image: '/games/black-white.svg' },
  'black-2':         { title: 'Black 2 / White 2',                titleEs: 'Negro 2 / Blanco 2',            year: 2012, generation: 5,  region: 'Unova',   image: '/games/black2-white2.svg' },
  'white-2':         { title: 'Black 2 / White 2',                titleEs: 'Negro 2 / Blanco 2',            year: 2012, generation: 5,  region: 'Unova',   image: '/games/black2-white2.svg' },
  // Gen VI
  x:                 { title: 'X / Y',                            titleEs: 'X / Y',                         year: 2013, generation: 6,  region: 'Kalos',   image: '/games/x-y.svg' },
  y:                 { title: 'X / Y',                            titleEs: 'X / Y',                         year: 2013, generation: 6,  region: 'Kalos',   image: '/games/x-y.svg' },
  'omega-ruby':      { title: 'Omega Ruby / Alpha Sapphire',      titleEs: 'Rubí Omega / Zafiro Alfa',      year: 2014, generation: 6,  region: 'Hoenn',   image: '/games/oras.svg' },
  'alpha-sapphire':  { title: 'Omega Ruby / Alpha Sapphire',      titleEs: 'Rubí Omega / Zafiro Alfa',      year: 2014, generation: 6,  region: 'Hoenn',   image: '/games/oras.svg' },
  // Gen VII
  sun:               { title: 'Sun / Moon',                       titleEs: 'Sol / Luna',                    year: 2016, generation: 7,  region: 'Alola',   image: '/games/sun-moon.svg' },
  moon:              { title: 'Sun / Moon',                       titleEs: 'Sol / Luna',                    year: 2016, generation: 7,  region: 'Alola',   image: '/games/sun-moon.svg' },
  'ultra-sun':       { title: 'Ultra Sun / Ultra Moon',           titleEs: 'Ultrasol / Ultraluna',          year: 2017, generation: 7,  region: 'Alola',   image: '/games/ultra-sun-moon.svg' },
  'ultra-moon':      { title: 'Ultra Sun / Ultra Moon',           titleEs: 'Ultrasol / Ultraluna',          year: 2017, generation: 7,  region: 'Alola',   image: '/games/ultra-sun-moon.svg' },
  // Gen VIII
  sword:             { title: 'Sword / Shield',                   titleEs: 'Espada / Escudo',               year: 2019, generation: 8,  region: 'Galar',   image: '/games/sword-shield.svg' },
  shield:            { title: 'Sword / Shield',                   titleEs: 'Espada / Escudo',               year: 2019, generation: 8,  region: 'Galar',   image: '/games/sword-shield.svg' },
  'brilliant-diamond': { title: 'Brilliant Diamond / Shining Pearl', titleEs: 'Diamante Brillante / Perla Reluciente', year: 2021, generation: 8, region: 'Sinnoh', image: '/games/bdsp.svg' },
  'shining-pearl':   { title: 'Brilliant Diamond / Shining Pearl', titleEs: 'Diamante Brillante / Perla Reluciente', year: 2021, generation: 8, region: 'Sinnoh', image: '/games/bdsp.svg' },
  'legends-arceus':  { title: 'Legends: Arceus',                  titleEs: 'Leyendas: Arceus',              year: 2022, generation: 8,  region: 'Hisui',   image: '/games/legends-arceus.svg' },
  // Gen IX
  scarlet:           { title: 'Scarlet / Violet',                 titleEs: 'Escarlata / Violeta',           year: 2022, generation: 9,  region: 'Paldea',  image: '/games/scarlet-violet.svg' },
  violet:            { title: 'Scarlet / Violet',                 titleEs: 'Escarlata / Violeta',           year: 2022, generation: 9,  region: 'Paldea',  image: '/games/scarlet-violet.svg' },
  // Gen X
  'legends-za':      { title: 'Legends: Z-A',                     titleEs: 'Leyendas: Z-A',                 year: 2025, generation: 10, region: 'Kalos',   image: '/games/legends-za.svg' },
};

export const GEN_COLORS: Record<number, { text: string; bg: string; dot: string }> = {
  1:  { text: 'text-red-400',    bg: 'bg-red-500/15',    dot: 'bg-red-400' },
  2:  { text: 'text-yellow-400', bg: 'bg-yellow-500/15', dot: 'bg-yellow-400' },
  3:  { text: 'text-green-400',  bg: 'bg-green-500/15',  dot: 'bg-green-400' },
  4:  { text: 'text-blue-400',   bg: 'bg-blue-500/15',   dot: 'bg-blue-400' },
  5:  { text: 'text-slate-400',  bg: 'bg-slate-500/15',  dot: 'bg-slate-400' },
  6:  { text: 'text-teal-400',   bg: 'bg-teal-500/15',   dot: 'bg-teal-400' },
  7:  { text: 'text-orange-400', bg: 'bg-orange-500/15', dot: 'bg-orange-400' },
  8:  { text: 'text-purple-400', bg: 'bg-purple-500/15', dot: 'bg-purple-400' },
  9:  { text: 'text-pink-400',   bg: 'bg-pink-500/15',   dot: 'bg-pink-400' },
  10: { text: 'text-cyan-400',   bg: 'bg-cyan-500/15',   dot: 'bg-cyan-400' },
};
