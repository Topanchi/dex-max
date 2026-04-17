export interface GameAppearance {
  versionName: string;
  title: string;
  year: number;
  generation: number;
  region: string;
}

export interface Item {
  id: number;
  name: string;
  displayName: string;
  sprite: string;
  cost: number;
  effect: string;
  description: string;
  category: string;
  pocket: string;
  gameAppearances: GameAppearance[];
}
