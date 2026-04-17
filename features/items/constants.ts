export const CATEGORY_LABELS: Record<string, string> = {
  // medicine
  'potions':            'Pociones',
  'status-cures':       'Curación de estado',
  'revival':            'Revivir',
  'vitamins':           'Vitaminas',
  'picky-healing':      'Curación selectiva',
  'hp-up':              'Incremento de PS',
  'pp-restores':        'Recuperación de PP',
  'flutes':             'Flautas',
  'healing':            'Curación',
  'other':              'Otros',
  // held-items
  'choice':             'Elección',
  'plates':             'Placas',
  'type-protection':    'Protección de tipo',
  'stat-boosts':        'Potenciadores',
  'misc-held-items':    'Varios retenidos',
  'drive':              'Discos',
  'mega-stones':        'Mega Piedras',
  'memory':             'Memorias',
  'species-specific':   'Específicos de especie',
  'other-held-items':   'Otros retenidos',
  'held-items':         'Objetos retenidos',
  // berries
  'in-a-pinch':         'Berries de aprieto',
  'pp-recovery':        'Recuperación de PP',
  'effort-training':    'Entrenamiento de EV',
  'baked-only':         'Solo cocción',
  'berries-other':      'Otras Berries',
  // z-crystals
  'z-crystals':         'Z-Cristales',
  // misc (evolution & collectibles)
  'evolution':          'Objetos evolutivos',
  'collectibles':       'Coleccionables',
};

// Color classes per pocket slug
export const POCKET_COLORS: Record<string, string> = {
  'medicine':    'text-emerald-400 bg-emerald-400/10',
  'held-items':  'text-blue-400 bg-blue-400/10',
  'berries':     'text-orange-400 bg-orange-400/10',
  'z-crystals':  'text-purple-400 bg-purple-400/10',
  'misc':        'text-amber-400 bg-amber-400/10',
};

// Pocket display names
export const POCKET_LABELS: Record<string, string> = {
  'medicine':    'Medicina',
  'held-items':  'Objetos retenidos',
  'berries':     'Bayas',
  'z-crystals':  'Z-Cristales',
  'misc':        'Especiales',
};
