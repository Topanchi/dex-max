// Curated wild-encounter data for the Galar DLC areas (Isla de la Armadura &
// Nieves de la Corona). PokéAPI has no encounter data for generation 8, so the
// Pokémon lists below are sourced manually from WikiDex. Names use PokéAPI
// slugs so /api/pokemon-list can resolve sprites/ids.
//
// Coordinates (x, y) are percentages over each region's map image and are
// approximate (the maps are unlabeled illustrations).

export interface DlcLocation {
  slug: string;
  nameEs: string;
  x: number;
  y: number;
  pokemon: string[];
}

export const GALAR_DLC: Record<string, DlcLocation[]> = {
  'isle-of-armor': [
    {
      slug: 'prado-reverencia',
      nameEs: 'Prado Reverencia',
      x: 56, y: 38,
      pokemon: ['buneary','jigglypuff','abra','klefki','chansey','inkay','krabby','fomantis','ralts','blissey','blipbug','happiny','slowpoke-galar','tentacool','wingull','mantyke','tentacruel','pelipper','drifloon','kingler','rockruff','lopunny','starmie','toxapex','comfey','zorua','malamar','marill','pikachu','luxio','drednaw','wigglytuff','magikarp','remoraid','octillery'],
    },
    {
      slug: 'bosque-concentracion',
      nameEs: 'Bosque Concentración',
      x: 46, y: 44,
      pokemon: ['venipede','foongus','tangela','pikachu','passimian','oranguru','chansey','pawniard','croagunk','corphish','fomantis','silicobra','zorua','blissey','karrablast','happiny','skwovet','applin','emolga','arrokuda','cramorant','whiscash','barraskewda','magikarp','goldeen'],
    },
    {
      slug: 'humedal-frescor',
      nameEs: 'Humedal Frescor',
      x: 73, y: 46,
      pokemon: ['skorupi','dunsparce','wooper','bouffalant','lickitung','chansey','pawniard','croagunk','corphish','goomy','fomantis','blissey','shelmet','happiny','magikarp','barboach','whiscash','psyduck','chewtle','arrokuda','cramorant','golduck','barraskewda','drednaw','quagsire','drapion','comfey','malamar','zorua','scraggy','marill','poliwhirl'],
    },
    {
      slug: 'llano-entrenamiento',
      nameEs: 'Llano Entrenamiento',
      x: 56, y: 54,
      pokemon: ['lillipup','tauros','miltank','scyther','pinsir','heracross','chansey','inkay','shinx','fomantis','silicobra','blissey','blipbug','happiny','skwovet','applin','magikarp','carvanha','sharpedo'],
    },
    {
      slug: 'playa-desafio',
      nameEs: 'Playa Desafío',
      x: 72, y: 64,
      pokemon: ['magnemite','psyduck','dedenne','morpeko','chansey','inkay','shinx','fomantis','blissey','blipbug','buneary','jigglypuff','happiny','arrokuda','corphish','raichu','wigglytuff','golduck','magneton','kingler','starmie','marill','azumarill','pelipper','crawdaunt','drednaw','cramorant','skwovet','applin','magikarp','wishiwashi','dhelmise'],
    },
    {
      slug: 'cuenca-arenosa',
      nameEs: 'Cuenca Arenosa',
      x: 66, y: 22,
      pokemon: ['sandile','rhyhorn','torkoal','rufflet','vullaby','chansey','blissey','pawniard','jangmo-o','shinx','fletchling','silicobra','scraggy','marowak','rhydon','rhyperior','sandaconda','krokorok','krookodile','sandslash','braviary','mandibuzz'],
    },
    {
      slug: 'bahia-circular',
      nameEs: 'Bahía Circular',
      x: 40, y: 80,
      pokemon: ['clobbopus','wingull','mareanie','pincurchin','dwebble','chansey','inkay','krabby','fletchling','drifloon','blissey','sandygast','blipbug','happiny','tentacruel','gyarados','octillery','cloyster','lanturn','jellicent','magikarp','shellder','wigglytuff','talonflame','luxray','pelipper','alakazam','drednaw','zoroark','magnezone','grapploct','palossand'],
    },
    {
      slug: 'cueva-contienda',
      nameEs: 'Cueva Contienda',
      x: 52, y: 42,
      pokemon: ['whismur','woobat','poliwag','azurill','lickitung','chansey','psyduck','blissey','barboach'],
    },
    {
      slug: 'cueva-tenacidad',
      nameEs: 'Cueva Tenacidad',
      x: 62, y: 52,
      pokemon: ['chewtle','woobat','wimpod','pincurchin','dwebble','chansey','blissey','tentacool','clobbopus','crustle','druddigon','golisopod','swoobat','drednaw','shellder','cloyster','magikarp'],
    },
    {
      slug: 'isla-melosa',
      nameEs: 'Isla Melosa',
      x: 33, y: 18,
      pokemon: ['combee','petilil','chansey','blissey','blipbug','happiny','lilligant','comfey','magikarp','wishiwashi'],
    },
    {
      slug: 'gruta-calentamiento',
      nameEs: 'Gruta Calentamiento',
      x: 30, y: 40,
      pokemon: ['sandshrew','cubone','torkoal','kangaskhan','chansey','blissey'],
    },
    {
      slug: 'mar-gimnastico',
      nameEs: 'Mar Gimnástico',
      x: 50, y: 10,
      pokemon: ['wingull','tentacool','mantyke','clauncher','skrelp','gyarados','clawitzer','dragalge','tentacruel','jellicent','pelipper','lanturn','drifloon','magikarp','remoraid','octillery'],
    },
    {
      slug: 'mar-andana',
      nameEs: 'Mar Andana',
      x: 85, y: 55,
      pokemon: ['wingull','tentacool','mantyke','frillish','clauncher','skrelp','gyarados','clawitzer','dragalge','tentacruel','jellicent','pelipper','chinchou','lanturn','drifloon','magikarp','wishiwashi'],
    },
    {
      slug: 'mar-islejos',
      nameEs: 'Mar Islejos',
      x: 55, y: 90,
      pokemon: ['wingull','tentacool','mantyke','horsea','clauncher','skrelp','gyarados','clawitzer','dragalge','tentacruel','jellicent','pelipper','chinchou','lanturn','drifloon','magikarp','wishiwashi'],
    },
    {
      slug: 'mar-meloso',
      nameEs: 'Mar Meloso',
      x: 18, y: 55,
      pokemon: ['sharpedo','tentacool','wingull','mantyke','clauncher','skrelp','gyarados','clawitzer','dragalge','tentacruel','jellicent','pelipper','chinchou','lanturn','drifloon','magikarp','wishiwashi'],
    },
    {
      slug: 'ruta-desafio',
      nameEs: 'Ruta Desafío',
      x: 72, y: 38,
      pokemon: ['blipbug','roggenrola','mienfoo','happiny','pawniard','shinx','fletchling','silicobra','mienshao','lycanroc','rockruff','skarmory','salandit','chansey','scraggy','toxicroak','blissey','bisharp','jangmo-o','crustle','scizor','gallade','drifloon'],
    },
  ],
  'crown-tundra': [
    {
      slug: 'lecho-del-gigante',
      nameEs: 'Lecho del Gigante',
      x: 45, y: 52,
      pokemon: ['nidoran-f','nidoran-m','stonjourner','dubwool','bronzong','gurdurr','eevee','audino','swablu','linoone-galar','lampent','araquanid','electabuzz','galvantula','magmar','heatmor','durant','cryogonal','snorunt','vanillish','absol','hattrem','morgrem','mimikyu','clefairy','barboach','basculin','magikarp','feebas','skwovet','greedent','whiscash'],
    },
    {
      slug: 'villa-helada',
      nameEs: 'Villa Helada',
      x: 25, y: 45,
      pokemon: ['snom','delibird','snover','vanillite','swinub','cubchoo','wooloo','skwovet'],
    },
    {
      slug: 'campo-bajocero',
      nameEs: 'Campo Bajocero',
      x: 16, y: 26,
      pokemon: ['abomasnow','dubwool','jynx','amaura','audino','swablu','sneasel','magmar','cryogonal','vanillish','hattrem','gothorita','duosion','mimikyu','mime-jr','snover','smoochum','wooloo','magby','vanillite','hatenna','gothita','solosis','skwovet','greedent','weavile','vanilluxe','absol','eevee','glalie','beartic','delibird'],
    },
    {
      slug: 'desfiladero-nevado',
      nameEs: 'Desfiladero Nevado',
      x: 50, y: 16,
      pokemon: ['snom','beldum','dubwool','amaura','druddigon','audino','phantump','sneasel','magmar','cryogonal','snorunt','vanillish','beartic','delibird','darumaka','absol','morgrem','mimikyu','clefairy','mime-jr','wooloo','magby','vanillite','magikarp','basculin','gyarados'],
    },
    {
      slug: 'senda-blancacima',
      nameEs: 'Senda Blancacima',
      x: 44, y: 11,
      pokemon: ['frosmoth','snom','druddigon','audino','swablu','absol'],
    },
    {
      slug: 'lago-bolaguna',
      nameEs: 'Lago Bolaguna',
      x: 45, y: 80,
      pokemon: ['audino','swablu','skwovet','boltund','tyrunt','gossifleur','cottonee','corvisquire','shuckle','eevee','indeedee','noivern','araquanid','galvantula','electabuzz','carkol','magmar','cryogonal','vanillish','hattrem','mimikyu','barboach','magikarp','basculin','anorith','dratini','relicanth','dragonair','yamper','munchlax','dewpider','elekid'],
    },
    {
      slug: 'campo-deslizante',
      nameEs: 'Campo Deslizante',
      x: 62, y: 30,
      pokemon: ['dubwool','snom','piloswine','jynx','amaura','audino','swablu','sneasel','phantump','magmar','cryogonal','hatenna','impidimp','gothorita','duosion','mimikyu','mime-jr','smoochum','swinub','wooloo','magby','gothita','solosis','skwovet','greedent'],
    },
    {
      slug: 'suela-del-gigante',
      nameEs: 'Suela del Gigante',
      x: 40, y: 40,
      pokemon: ['audino','swablu','wooloo','munchlax','greedent','dubwool','altaria','snorlax','delibird','omanyte','kabuto','feebas','whiscash','basculin','omastar','kabutops','gyarados','milotic','relicanth','gossifleur','anorith','lileep','eldegoss','araquanid','armaldo','cradily','ferrothorn','butterfree','sneasel','impidimp','morgrem','grimmsnarl'],
    },
    {
      slug: 'encrucijada-tresvias',
      nameEs: 'Encrucijada Tresvías',
      x: 58, y: 42,
      pokemon: ['bronzong','avalugg','dubwool','claydol','golurk','audino','swablu','phantump','araquanid','galvantula','electabuzz','magmar','druddigon','heatmor','durant','cryogonal','vanillish','absol','hattrem','mimikyu','mime-jr','bronzor','bergmite','wooloo','dewpider','elekid','magby','vanillite','hatenna'],
    },
    {
      slug: 'gruta-del-lago',
      nameEs: 'Gruta del Lago',
      x: 38, y: 78,
      pokemon: ['zubat','aron','carbink','carkol','ferroseed','mawile','sableye','audino','aggron','ferrothorn','coalossal','lairon','noivern','terrakion'],
    },
    {
      slug: 'grutas-sonamar',
      nameEs: 'Grutas Sonamar',
      x: 72, y: 52,
      pokemon: ['zubat','carbink','piloswine','larvitar','deino','riolu','audino','golbat','lucario','hydreigon','tyranitar','omastar','kabutops','barboach','basculin','magikarp','omanyte','kabuto','feebas','vanillish'],
    },
    {
      slug: 'mar-gelido',
      nameEs: 'Mar Gélido',
      x: 88, y: 42,
      pokemon: ['avalugg','wailmer','eiscue','tirtouga','pincurchin','cryogonal','vanillish','lapras','magikarp','basculin','gyarados','dhelmise'],
    },
    {
      slug: 'colina-del-maxiarbol',
      nameEs: 'Colina del Maxiárbol',
      x: 52, y: 80,
      pokemon: ['audino','zubat','noibat','swablu','golbat','corvisquire','altaria','noivern','corviknight','crobat','delibird','woobat','swoobat','aerodactyl'],
    },
    {
      slug: 'tunel-ascension',
      nameEs: 'Túnel Ascensión',
      x: 45, y: 22,
      pokemon: ['zubat','carbink','snorunt','gible','clefairy','audino','bagon'],
    },
    {
      slug: 'viejo-cementerio',
      nameEs: 'Viejo Cementerio',
      x: 60, y: 42,
      pokemon: ['nidoran-f','nidoran-m','sinistea','drakloak','audino','lampent','phantump','araquanid','galvantula','electabuzz','magmar','heatmor','durant','cryogonal','vanillish','absol','hattrem','ponyta-galar','mimikyu','mime-jr','karrablast','dewpider','elekid','magby','vanillite','hatenna','polteageist','dragapult','trevenant','froslass','rapidash-galar'],
    },
    {
      slug: 'templo-corona',
      nameEs: 'Templo Corona',
      x: 43, y: 7,
      pokemon: ['calyrex'],
    },
  ],
};
