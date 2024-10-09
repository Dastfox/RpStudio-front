export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export const DEFAULT_STATS: CharacterStats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

export interface Character {
  name: string;
  class: string;
  background: string;
  level: number;
  stats: CharacterStats;
}

export const DEFAULT_CHARACTER: Character = {
  name: "New Character",
  class: "Fighter",
  background: "Criminal",
  level: 1,
  stats: DEFAULT_STATS
};
