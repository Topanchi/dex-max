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

export interface TCGCard {
  id: string;
  name: string;
  number: string | number;
  imageUrl: string | null;
  rarity: string | null;
  category: string;
  set: {
    id: string;
    name: string;
  };
  types?: string[];
  hp?: number;
  illustrator?: string;
}
