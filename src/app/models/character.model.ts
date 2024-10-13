export interface DnDCharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface PointBuyConfig {
  totalPoints: number;
  minScore: number;
  maxScore: number;
  pointCosts: { [key: number]: number };
}

export const DEFAULT_STATS: DnDCharacterStats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

export interface DnDCharacter {
  name: string;
  species: string;
  class: string;
  background: string;
  level: number;
  stats: DnDCharacterStats;
}

export const DEFAULT_CHARACTER: DnDCharacter = {
  name: "New Character",
  class: "Fighter",
  species: "Human",
  background: "Criminal",
  level: 1,
  stats: DEFAULT_STATS
};
