// ─── TCGdex API response types ───────────────────────────────────────────────

export interface TCGdexCardBrief {
  id: string;
  localId: string | number;
  name: string;
  image?: string;
}

export interface TCGdexSetBrief {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: {
    total: number;
    official: number;
  };
}

export interface TCGdexCardDetail {
  id: string;
  localId: string | number;
  name: string;
  image?: string;
  illustrator?: string;
  rarity?: string;
  category: string;
  hp?: number;
  types?: string[];
  description?: string;
  stage?: string;
  attacks?: Array<{
    name: string;
    damage: string;
    description: string;
    cost: string[];
  }>;
  weaknesses?: Array<{ type: string; value: string }>;
  resistances?: Array<{ type: string; value: string }>;
  retreat?: number;
  set: TCGdexSetBrief;
  variants?: {
    normal: boolean;
    reverse: boolean;
    holo: boolean;
    firstEdition: boolean;
  };
}

// ─── Application TCG types ────────────────────────────────────────────────────

export interface TCGPocketCard {
  id: string;
  name: string;
  localId: string;
  imageUrl: string;
  rarity: string | null;
  set: { id: string; name: string };
  pack: string | null;
  type: string | null;
  hp: number | null;
  illustrator: string | null;
  fullArt: boolean;
  isEx: boolean;
}

export interface TCGCard {
  id: string;
  name: string;
  number: string | number;
  imageUrl: string | null;
  rarity: string | null;
  /** Variante "de catálogo" derivada de rareza + variantes de impresión (best-effort). */
  variant: string | null;
  /** Variantes de impresión detectadas (p. ej. "Normal", "Holo", "Reverse Holo"). */
  availableVariants: string[];
  category: string;
  set: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
    /** Total de cartas "impresas" del set (denominador, p. ej. 165 en 006/165). */
    printedTotal: number | null;
    /** Código del set en Pokémon TCG Online/Live (p. ej. "MEW"). */
    code: string | null;
    /** MAIN (expansión numerada principal) · SPECIAL (set especial) · PROMO · OTHER. */
    type: 'MAIN' | 'SPECIAL' | 'PROMO' | 'OTHER';
  };
  /** Era TCG oficial (Original/Wizards, Neo/e-Card, EX, ..., Mega Evolution). */
  era: {
    id: number;
    name: string;
  };
  types?: string[];
  hp?: number;
  illustrator?: string;
}
