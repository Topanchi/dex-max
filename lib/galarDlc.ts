// Curated wild-encounter data for regions PokéAPI has no encounter data for
// (generation 8): the Galar DLC areas (Isla de la Armadura & Nieves de la
// Corona) and Hisui (Leyendas Arceus). Pokémon lists are sourced manually from
// WikiDex; names use PokéAPI slugs so /api/pokemon-list can resolve sprites/ids
// (the endpoint also normalises Hisui "-hisuian" forms).
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

export const CURATED_LOCATIONS: Record<string, DlcLocation[]> = {
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
  hisui: [
    {
      slug: 'jubilife-village',
      nameEs: 'Villa Jubileo',
      x: 33, y: 62,
      pokemon: ['bidoof','starly','shinx'],
    },
    {
      slug: 'obsidian-fieldlands',
      nameEs: 'Pradera Obsidiana',
      x: 18, y: 48,
      pokemon: ['magikarp','combee','shellos','scyther','qwilfish-hisui','machoke','buneary','psyduck','gastrodon','machop','chimchar','gyarados','happiny','chansey','monferno','starly','geodude','kricketot','wurmple','shinx','staravia','bidoof','buizel','luxio','beautifly','stantler','luxray','abra','paras','aipom','kricketune','bibarel','mime-jr','ponyta','staraptor','mothim','mr-mime','pichu','pikachu'],
    },
    {
      slug: 'crimson-mirelands',
      nameEs: 'Pantanal Carmesí',
      x: 45, y: 65,
      pokemon: ['carnivine','yanma','teddiursa','barboach','hippopotas','goomy','whiscash','combee','unown','turtwig','grotle','croagunk','paras','stunky','tangela','psyduck','budew','geodude','graveler','roselia','petilil','parasect','bidoof','kricketot','kricketune','rhyhorn','bibarel','ralts','togetic','raichu','onix','ursaring','torterra','vespiquen','pachirisu','skuntank','hippowdon','toxicroak','lickilicky','tangrowth','yanmega','sliggoo-hisui'],
    },
    {
      slug: 'cobalt-coastlands',
      nameEs: 'Costa Cobalto',
      x: 76, y: 52,
      pokemon: ['remoraid','mothim','aipom','shellos','toxicroak','buizel','combee','parasect','stantler','gyarados','bibarel','graveler','growlithe-hisui','golduck','tentacool','floatzel','glameow','magmar','piplup','purugly','gastrodon','octillery','magby','prinplup','phione','staraptor','mantyke','qwilfish-hisui','finneon','starly','staravia','beautifly','skorupi','basculin-white-striped','tentacruel','mantine','spheal','machop','chatot','sealeo','tangela','ambipom','chansey','eevee','pikachu','vulpix','ninetales'],
    },
    {
      slug: 'coronet-highlands',
      nameEs: 'Ladera Corona',
      x: 45, y: 38,
      pokemon: ['gligar','roselia','nosepass','carnivine','bronzor','bronzong','luxio','magikarp','sneasel-hisui','chimecho','chingling','toxicroak','gible','luxray','golduck','voltorb-hisui','sudowoodo','basculin-white-striped','budew','rhyhorn','electabuzz','golbat','ursaring','onix','scyther','gyarados','machoke','skuntank','hippowdon','croagunk','goomy','rhydon','whiscash','psyduck','zubat','teddiursa','shinx','stunky','hippopotas','sliggoo-hisui','elekid','machop','golem','crobat','steelix','mothim','gabite','rhyperior','electivire','gliscor','probopass','goodra-hisui','magnezone','yanma','parasect','geodude','yanmega','paras','heracross','stantler','rotom'],
    },
    {
      slug: 'alabaster-icelands',
      nameEs: 'Tundra Alba',
      x: 38, y: 13,
      pokemon: ['bergmite','aipom','rufflet','basculin-white-striped','swinub','bibarel','ambipom','misdreavus','electabuzz','machoke','piloswine','bronzong','lickitung','kadabra','gligar','snorunt','snover','purugly','chingling','blissey','zorua-hisui','avalugg-hisui','gible','riolu','machop','elekid','bidoof','ralts','abomasnow','chansey','bronzor','haunter','graveler','abra','glameow','chimecho','gastly','kirlia','buneary','eevee','happiny','zubat','golbat','lickilicky','gabite','zoroark-hisui','lucario','lopunny','snorlax','munchlax','crobat','braviary-hisui','glalie','sneasel-hisui','machamp','garchomp','mamoswine','gallade','froslass'],
    },
  ],
  paldea: [
    {
      slug: 'paldea-sur-1', nameEs: 'Área 1 del sur', x: 42, y: 84,
      pokemon: ['psyduck','gastly','drowzee','magikarp','pichu','igglybuff','hoppip','sunkern','wooper','ralts','surskit','azurill','combee','buizel','happiny','fletchling','scatterbug','oricorio','bounsweet','skwovet','chewtle','lechonk','tarountula','pawmi','fidough'],
    },
    {
      slug: 'paldea-sur-2', nameEs: 'Área 2 del sur', x: 33, y: 70,
      pokemon: ['meowth','diglett','fletchling','pikachu','starly','combee','pachirisu','pawmi','tandemaus','tinkatink','mareep','hoppip','maschiff','bounsweet','pichu','applin','charcadet','flabebe','jigglypuff','fidough','smoliv','eevee','rockruff','nacli','makuhita'],
    },
    {
      slug: 'paldea-sur-3', nameEs: 'Área 3 del sur', x: 22, y: 62,
      pokemon: ['jigglypuff','dunsparce','growlithe','klawf','charcadet','hariyama','talonflame','nymble','rookidee','gulpin','slakoth','pawmi','oricorio','squawkabilly','fidough','dachsbun','shinx','spoink','shuppet'],
    },
    {
      slug: 'paldea-sur-4', nameEs: 'Área 4 del sur', x: 55, y: 75,
      pokemon: ['pikachu','psyduck','shellder','magikarp','gyarados','scyther','marill','pineco','houndour','dunsparce','phanpy','luvdisc','wooper','makuhita','meditite','buizel','riolu','rufflet','deerling','skiddo','flabebe','goomy','rockruff','gumshoos','dreepy','latias','ho-oh'],
    },
    {
      slug: 'paldea-sur-5', nameEs: 'Área 5 del sur', x: 62, y: 64,
      pokemon: ['mankey','skiploom','dunsparce','stantler','shroomish','vigoroth','zangoose','seviper','luxio','stunky','deerling','litleo','larvitar','swablu','bagon','axew','rufflet','mudbray','charcadet','clodsire','dreepy','snom','pawniard','flittle'],
    },
    {
      slug: 'paldea-sur-6', nameEs: 'Área 6 del sur', x: 50, y: 56,
      pokemon: ['dragonair','hawlucha','chansey','flareon','flaaffy','ampharos','donphan','medicham','altaria','hariyama','gallade','gothitelle','gogoat','sylveon','klefki','lycanroc','mudsdale','copperajah','toxtricity','dachsbun','espathra','scovillain','bombirdier','drifblim','honchkrow'],
    },
    {
      slug: 'paldea-este-1', nameEs: 'Área 1 del este', x: 76, y: 58,
      pokemon: ['pikachu','venonat','tauros-paldea-combat-breed','skiploom','dunsparce','gulpin','deerling','litleo','rookidee','lechonk','oinkologne','pawmo','oricorio','tandemaus','squawkabilly','pineco','teddiursa','komala','applin','charcadet','lurantis','spidops','swablu','pyroar','nacli'],
    },
    {
      slug: 'paldea-este-2', nameEs: 'Área 2 del este', x: 82, y: 44,
      pokemon: ['buizel','chewtle','crabrawler','cyclizar','deerling','dunsparce','finizen','grimer','gyarados','magnemite','makuhita','mareanie','nacli','oinkologne','pincurchin','psyduck','sandygast','squawkabilly','tadbulb','wattrel','wiglett','growlithe','tauros'],
    },
    {
      slug: 'paldea-este-3', nameEs: 'Área 3 del este', x: 74, y: 32,
      pokemon: ['pawniard','pawmo','pawmi','bramblin','yungoos','gumshoos','rookidee','buizel','floatzel','clodsire','chewtle','drednaw','fidough','rolycoly','carkol','salandit','cufant','nacli','bagon','larvitar','orthworm','espeon','falinks','pyroar','entei'],
    },
    {
      slug: 'paldea-oeste-1', nameEs: 'Área 1 del oeste', x: 22, y: 52,
      pokemon: ['mankey','nymble','phanpy','numel','mudbray','capsakid','bombirdier','gible','wingull','pelipper','tynamo','eelektrik','petilil','lilligant','falinks','sinistea'],
    },
    {
      slug: 'paldea-oeste-2', nameEs: 'Área 2 del oeste', x: 26, y: 40,
      pokemon: ['diglett','dugtrio','dunsparce','meditite','makuhita','hariyama','sableye','larvitar','bagon','gible','noibat','salandit','glimmet','charcadet','slowpoke','shellos','crabrawler','wiglett','kilowattrel','donphan','orthworm','larvesta','girafarig','cyclizar','flamigo','rotom','varoom','ditto'],
    },
    {
      slug: 'paldea-oeste-3', nameEs: 'Área 3 del oeste', x: 14, y: 34,
      pokemon: ['meowth','persian','scyther','ditto','tropius','staraptor','pachirisu','zorua','sawsbuck','lechonk','mabosstiff','primeape','sudowoodo','breloom','zoroark','greavard','ursaring','sliggoo','jolteon','voltorb','dedenne','cetoddle','dachsbun'],
    },
    {
      slug: 'paldea-norte-1', nameEs: 'Área 1 del norte', x: 46, y: 32,
      pokemon: ['foongus','venomoth','primeape','ursaring','honchkrow','brambleghast','sunflora','vivillon','lurantis','jumpluff','blissey','clodsire','drakloak','altaria','dratini','mismagius','fraxure','bellibolt','hawlucha','gogoat','lycanroc','espathra','lucario','deino','salazzle','eiscue','gastrodon','skrelp','dragalge'],
    },
    {
      slug: 'paldea-norte-2', nameEs: 'Área 2 del norte', x: 62, y: 22,
      pokemon: ['dragonite','slaking','corviknight','mimikyu','arcanine','heracross','bisharp','oranguru','passimian','falinks','grumpig','lucario','braviary','indeedee','houndoom','camerupt','noivern','lurantis','chi-yu','kubfu','cobalion','latios'],
    },
    {
      slug: 'paldea-norte-3', nameEs: 'Área 3 del norte', x: 38, y: 18,
      pokemon: ['sylveon','gastrodon','wugtrio','jumpluff','sunflora','florges','dedenne','vivillon','golduck','barraskewda','flamigo','drakloak','bellibolt','gogoat','naclstack','honchkrow','copperajah','beartic','frosmoth','houndstone','cetitan','froslass','glaceon','salazzle','eiscue'],
    },
    {
      slug: 'paldea-area-cero', nameEs: 'Área Cero', x: 50, y: 48,
      pokemon: ['koraidon','miraidon','great-tusk','scream-tail','brute-bonnet','flutter-mane','slither-wing','sandy-shocks','iron-treads','iron-moth','iron-thorns','iron-hands','iron-jugulis','iron-bundle','roaring-moon','iron-valiant','raichu','golduck','hypno','gabite','weavile','bisharp','garganacl','glimmora','volcarona','dreepy','espathra','donphan'],
    },
  ],
  kitakami: [
    {
      slug: 'campos-pristinos', nameEs: 'Campos Prístinos de Noroteo', x: 42, y: 18,
      pokemon: ['pikachu','vulpix','mankey','primeape','growlithe','geodude','graveler','spinarak','ariados','sudowoodo','aipom','yanma','dunsparce','gligar','sneasel','houndoom','stantler','mightyena','nuzleaf','gardevoir','nosepass','staraptor','luxray','munchlax','riolu','gallade','pawniard','goomy','rockruff','lycanroc','lurantis','greedent','dudunsparce','bombirdier','gyarados','quagsire','annihilape'],
    },
    {
      slug: 'monte-ogro', nameEs: 'Monte Ogro', x: 10, y: 48,
      pokemon: ['ekans','pikachu','sandshrew','clefairy','vulpix','mankey','growlithe','geodude','graveler','gastly','haunter','koffing','gyarados','noctowl','sudowoodo','heracross','sneasel','houndoom','stantler','mightyena','nuzleaf','gardevoir','nosepass','whiscash','feebas','staraptor','luxray','bronzong','gible','gabite','lucario','mienfoo','carbink','noibat','lycanroc','mimikyu','hakamo-o','glimmora','dudunsparce','poltchageist'],
    },
    {
      slug: 'lago-cristalino', nameEs: 'Lago Cristalino', x: 27, y: 46,
      pokemon: ['ekans','clefairy','vulpix','growlithe','graveler','koffing','cleffa','yanma','dunsparce','slugma','houndoom','barboach','feebas','duskull','chimecho','chingling','bronzor','gible','gabite','timburr','litwick','carbink','trevenant','noibat','rockruff','salandit','arrokuda','hatenna','glimmet','glimmora'],
    },
    {
      slug: 'gruta-del-pavor', nameEs: 'Gruta del Pavor', x: 48, y: 48,
      pokemon: ['ogerpon'],
    },
    {
      slug: 'cueva-aguafria', nameEs: 'Cueva Aguafría', x: 63, y: 30,
      pokemon: ['vulpix','geodude','graveler','magikarp','gyarados','wooper','quagsire','dunsparce','sneasel','swinub','piloswine','houndoom','spoink','duskull','snorunt','chingling','bronzor','tynamo','mienfoo','carbink','goomy','rockruff','mimikyu','arrokuda','barraskewda','dudunsparce'],
    },
    {
      slug: 'fauces-del-ogro', nameEs: 'Fauces del Ogro', x: 20, y: 57,
      pokemon: ['arbok','vulpix','growlithe','geodude','magikarp','pichu','wooper','swinub','nosepass','bonsly','riolu','timburr','noibat','salandit','arrokuda','hatenna','morpeko','tandemaus','orthworm'],
    },
    {
      slug: 'desfiladero-del-cuerno', nameEs: 'Desfiladero del Cuerno', x: 76, y: 46,
      pokemon: ['ekans','arbok','vulpix','poliwag','poliwhirl','geodude','graveler','gyarados','noctowl','ariados','aipom','quagsire','gligar','heracross','houndoom','nuzleaf','illumise','whiscash','crawdaunt','duskull','staraptor','luxray','bronzor','lucario','gallade','gurdurr','swanna','pawniard','goomy','noibat','charjabug','lycanroc','greedent','drednaw','barraskewda','bombirdier'],
    },
    {
      slug: 'ribera-confluencia', nameEs: 'Ribera Confluencia', x: 80, y: 76,
      pokemon: ['ekans','arbok','vulpix','growlithe','poliwhirl','weepinbell','gengar','magikarp','furret','noctowl','ariados','aipom','yanma','quagsire','heracross','stantler','nuzleaf','gardevoir','masquerain','whiscash','crawdaunt','kricketune','pachirisu','riolu','gurdurr','leavanny','ribombee','rockruff','hakamo-o','applin','flapple','appletun','poltchageist'],
    },
    {
      slug: 'eliseo-baldio', nameEs: 'Elíseo Baldío', x: 13, y: 18,
      pokemon: ['pikachu','sandshrew','sandslash','vulpix','mankey','growlithe','geodude','graveler','gastly','noctowl','sudowoodo','aipom','yanma','gligar','houndoom','mightyena','nuzleaf','kirlia','surskit','nosepass','shinx','luxio','bronzor','gible','munchlax','riolu','gurdurr','mienfoo','vullaby','charjabug','rockruff','mudbray','fomantis','jangmo-o','cramorant','indeedee','morpeko','tandemaus','bombirdier','orthworm'],
    },
    {
      slug: 'soto-sempiterno', nameEs: 'Soto Sempiterno', x: 72, y: 13,
      pokemon: ['pikachu','vulpix','primeape','growlithe','graveler','snorlax','noctowl','ariados','sudowoodo','aipom','yanma','quagsire','dunsparce','gligar','sneasel','stantler','houndoom','mightyena','nuzleaf','kirlia','masquerain','dusclops','luxray','pachirisu','munchlax','gallade','sliggoo','phantump','trevenant','vikavolt','lurantis','mimikyu','grimmsnarl','indeedee','toedscruel','annihilape','dudunsparce','kingambit'],
    },
    {
      slug: 'paso-del-averno', nameEs: 'Paso del Averno', x: 24, y: 36,
      pokemon: ['clefairy','vulpix','growlithe','geodude','graveler','koffing','magikarp','houndoom','lotad','spoink','duskull','chimecho','chingling','bronzor','timburr','litwick','lampent','vullaby','rockruff','mimikyu','hatenna','glimmet','slugma'],
    },
    {
      slug: 'senda-jarana', nameEs: 'Senda Jarana', x: 63, y: 68,
      pokemon: ['vulpix','poliwag','geodude','magikarp','furret','spinarak','cleffa','aipom','wooper','heracross','swinub','stantler','nuzleaf','ralts','illumise','corphish','dusclops','kricketune','pachirisu','riolu','petilil','swanna','phantump','noibat','rockruff','fomantis','salandit','hatenna','morpeko','tandemaus','orthworm','poltchageist'],
    },
    {
      slug: 'colina-manzanar', nameEs: 'Colina Manzanar', x: 25, y: 76,
      pokemon: ['ekans','pikachu','vulpix','mankey','growlithe','bellsprout','geodude','gastly','furret','spinarak','poochyena','lombre','illumise','starly','bonsly','munchlax','timburr','sewaddle','mienfoo','noibat','grubbin','fomantis','salandit','applin','hatenna','morpeko','tandemaus','orthworm','poltchageist'],
    },
    {
      slug: 'pradera-glicina', nameEs: 'Pradera Glicina', x: 12, y: 68,
      pokemon: ['ekans','pikachu','sandshrew','vulpix','mankey','geodude','graveler','gastly','noctowl','sudowoodo','aipom','yanma','gligar','mightyena','lombre','kirlia','nosepass','illumise','shinx','luxio','bronzor','gible','munchlax','riolu','gurdurr','leavanny','oricorio','ribombee','rockruff','mudbray','jangmo-o','hatenna','tandemaus','bombirdier'],
    },
  ],
  biodomo: [
    {
      slug: 'area-polar', nameEs: 'Área Polar', x: 33, y: 30,
      pokemon: ['sandshrew-alola','vulpix-alola','magnemite','seel','dewgong','horsea','seadra','electabuzz','lapras','cyndaquil','girafarig','snubbull','granbull','qwilfish-hisui','scizor','skarmory','smeargle','hitmontop','torchic','plusle','minun','camerupt','altaria','beldum','metang','chimchar','piplup','lumineon','abomasnow','rotom','oshawott','excadrill','scrafty','cinccino','reuniclus','beartic','golurk','crabominable','minior','duraludon'],
    },
    {
      slug: 'area-costera', nameEs: 'Área Costera', x: 65, y: 32,
      pokemon: ['bulbasaur','oddish','vileplume','venonat','tentacruel','exeggutor-alola','horsea','seadra','chikorita','lanturn','bellossom','granbull','smeargle','blissey','mudkip','slaking','camerupt','torkoal','zangoose','seviper','luvdisc','lumineon','rotom','whimsicott','sawsbuck','alomomola','froakie','talonflame','meowstic','inkay','popplio','toucannon','crabrawler','oricorio','araquanid','comfey','minior','bruxish','grookey','milcery'],
    },
    {
      slug: 'area-escarpada', nameEs: 'Área Escarpada', x: 33, y: 68,
      pokemon: ['squirtle','magneton','hitmonlee','hitmonchan','horsea','seadra','scyther','electabuzz','magmar','lanturn','scizor','skarmory','smeargle','hitmontop','treecko','plusle','minun','altaria','beldum','metang','turtwig','cranidos','shieldon','rotom','tepig','excadrill','krookodile','scrafty','cinccino','sawsbuck','alomomola','eelektross','fraxure','golurk','chespin','litten','minior','sinistea','kleavor'],
    },
    {
      slug: 'area-arida', nameEs: 'Área Árida', x: 66, y: 68,
      pokemon: ['charmander','venomoth','dodrio','exeggutor','rhydon','chansey','scyther','electabuzz','magmar','tauros','totodile','girafarig','scizor','smeargle','blissey','trapinch','flygon','happiny','rotom','snivy','zebstrika','krookodile','sawsbuck','eelektross','braviary','mandibuzz','fennekin','pyroar','rowlet','dewpider','bruxish','sobble','rabsca','farigiraf'],
    },
  ],
  galar: [
    {
      slug: 'galar-route-1', nameEs: 'Ruta 1', x: 50, y: 92,
      pokemon: ['skwovet','rookidee','wooloo','nickit','blipbug','caterpie','grubbin','hoothoot'],
    },
    {
      slug: 'galar-route-2', nameEs: 'Ruta 2', x: 43, y: 84,
      pokemon: ['blipbug','rookidee','lotad','seedot','purrloin','hoothoot','skwovet','nickit','chewtle','yamper','zigzagoon-galar','magikarp','arrokuda','feebas','gossifleur','barraskewda','gyarados','drednaw','lapras'],
    },
    {
      slug: 'galar-route-3', nameEs: 'Ruta 3', x: 34, y: 62,
      pokemon: ['zigzagoon-galar','gossifleur','vulpix','growlithe','stunky','trubbish','tyrogue','corvisquire','sizzlipede','klink','mudbray','machop','pancham','rookidee','rolycoly','skwovet','cherubi'],
    },
    {
      slug: 'galar-route-4', nameEs: 'Ruta 4', x: 22, y: 58,
      pokemon: ['electrike','meowth-galar','yamper','pumpkaboo','pikachu','eevee','diglett','ferroseed','budew','cutiefly','joltik','milcery','wooloo','magikarp','chewtle','goldeen','skwovet'],
    },
    {
      slug: 'galar-route-5', nameEs: 'Ruta 5', x: 40, y: 56,
      pokemon: ['stufful','swirlix','spritzee','minccino','wobbuffet','farfetchd','drifloon','eldegoss','dottler','espurr','nuzleaf','lombre','applin','dewpider','nincada','magikarp','chewtle','goldeen','skwovet','toxel'],
    },
    {
      slug: 'galar-route-6', nameEs: 'Ruta 6', x: 12, y: 61,
      pokemon: ['yamask-galar','helioptile','dugtrio','maractus','axew','trapinch','silicobra','durant','heatmor','duskull','skorupi','hippopotas','torkoal','hawlucha','magikarp','drednaw','goldeen','greedent','dracozolt','arctozolt','dracovish','arctovish'],
    },
    {
      slug: 'galar-route-7', nameEs: 'Ruta 7', x: 38, y: 47,
      pokemon: ['perrserker','thievul','galvantula','liepard','inkay','morpeko','toxel','karrablast','shelmet','corviknight','meowstic','seismitoad','greedent'],
    },
    {
      slug: 'galar-route-8', nameEs: 'Ruta 8', x: 60, y: 40,
      pokemon: ['golett','gurdurr','boldore','pawniard','rufflet','vullaby','togedemaru','solrock','lunatone','crustle','falinks','sandaconda','rhyhorn','dusclops','haunter','bronzong','hippowdon','drapion','snom','snorunt','sneasel','vanillish','sawk','throh','snover','delibird','darumaka'],
    },
    {
      slug: 'galar-route-9', nameEs: 'Ruta 9 (Bahía Circular)', x: 80, y: 46,
      pokemon: ['pelipper','mareanie','jellicent','gastrodon','pyukumuku','cramorant','octillery','kingler','pincurchin','wishiwashi','qwilfish','mantyke','clobbopus','toxapex','barbaracle','bergmite','dhelmise','inkay','wailmer','mantine','wailord','lapras','remoraid','greedent','perrserker','thievul','liepard','morpeko'],
    },
    {
      slug: 'galar-route-10', nameEs: 'Ruta 10', x: 45, y: 13,
      pokemon: ['mr-mime-galar','cubchoo','snover','glalie','vanilluxe','klang','vanillish','rhydon','snom','darumaka-galar','abomasnow','beartic','sneasel','duraludon','stonjourner','eiscue'],
    },
    {
      slug: 'pradera-radiante', nameEs: 'Pradera Radiante', x: 38, y: 84,
      pokemon: ['combee','bunnelby','metapod','tyrogue','ralts','wingull','electrike','vulpix','growlithe','vanillite','delibird','baltoy','pancham','minccino','bounsweet','oddish','budew','nuzleaf','lotad','joltik','swinub','dwebble','golett','munna','natu','diglett','roggenrola','butterfree','pidove'],
    },
    {
      slug: 'valle-entrepuentes', nameEs: 'Valle Entrepuentes', x: 50, y: 70,
      pokemon: ['zigzagoon-galar','cutiefly','wobbuffet','noibat','elgyem','toxel','cufant','scraggy','croagunk','sawk','throh','stufful','bronzor','cramorant','frillish','maractus','baltoy','cubchoo','sneasel','bonsly','munna','thievul','inkay','liepard','palpitoad','ferroseed','togepi','karrablast','diggersby','shelmet'],
    },
    {
      slug: 'llanura-petrea', nameEs: 'Llanura Pétrea', x: 55, y: 75,
      pokemon: ['bounsweet','machop','tyrogue','scraggy','croagunk','dewpider','cramorant','toxel','pikachu','maractus','salandit','cubchoo','sneasel','ferroseed','bonsly','dwebble','hatenna','munna','nickit','ninjask','baltoy','golett','machoke','zigzagoon'],
    },
    {
      slug: 'cuenca-polvorienta', nameEs: 'Cuenca Polvorienta', x: 45, y: 68,
      pokemon: ['nickit','koffing','scraggy','croagunk','hitmonlee','hitmonchan','electrike','palpitoad','hippopotas','growlithe','vulpix','drilbur','cubchoo','sneasel','vanillish','delibird','snover','mawile','swinub','shuckle','wobbuffet','duskull','sableye','gothorita','eldegoss','dubwool','hattrem','applin'],
    },
    {
      slug: 'lago-del-enfado', nameEs: 'Lago del Enfado', x: 35, y: 64,
      pokemon: ['beheeyem','braviary','mandibuzz','golurk','sigilyph','ditto','garbodor','drapion','weezing','hitmontop','drakloak','seismitoad','araquanid','golisopod','rotom','galvantula','noivern','haxorus','morpeko','ninetales','arcanine','durant','heatmor','lampent','flygon','glalie','vanilluxe','abomasnow','bergmite','klinklang'],
    },
  ],
};
