import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

export interface DnDClass {
  name: string;
  description: string;
  hitDie: string;
  primaryAbility?: string;
  savingThrowProficiencies: string[];
}

export interface DnDBackground {
  name: string;
  description: string;
  skillProficiencies: string[];
  feats: string[];
  abilityScoreImprovements: string[];
}

export interface DnDSubclass {
  name: string;
  parentClass: string;
  description: string;
}

export interface DnDSpecies {
  name: string;
  description: string;
  creatureType: string;
  size: string[];
  speed: number;
  traits: {
    [key: string]: string;
  };
  specialAbilities?: {
    [key: string]: string;
  };
  spells?: {
    [key: string]: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DnD5eDataService {
  private classes: DnDClass[] = [
    {
      name: 'Barbarian',
      description: 'A fierce warrior who can enter a battle rage',
      hitDie: 'd12',
      primaryAbility: 'Strength',
      savingThrowProficiencies: ['Strength', 'Constitution']
    },
    {
      name: 'Bard',
      description: 'An inspiring magician whose music creates magic',
      hitDie: 'd8',
      primaryAbility: 'Charisma',
      savingThrowProficiencies: ['Dexterity', 'Charisma']
    },
    {
      name: 'Cleric',
      description: 'A priestly champion who wields divine magic',
      hitDie: 'd8',
      primaryAbility: 'Wisdom',
      savingThrowProficiencies: ['Wisdom', 'Charisma']
    },
    {
      name: 'Druid',
      description: 'A priest of the Old Faith, wielding the powers of nature',
      hitDie: 'd8',
      primaryAbility: 'Wisdom',
      savingThrowProficiencies: ['Intelligence', 'Wisdom']
    },
    {
      name: 'Fighter',
      description: 'A master of martial combat, skilled with a variety of weapons and armor',
      hitDie: 'd10',
      primaryAbility: 'Strength or Dexterity',
      savingThrowProficiencies: ['Strength', 'Constitution']
    },
    {
      name: 'Monk',
      description: 'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection',
      hitDie: 'd8',
      primaryAbility: 'Dexterity & Wisdom',
      savingThrowProficiencies: ['Strength', 'Dexterity']
    },
    {
      name: 'Paladin',
      description: 'A holy warrior bound to a sacred oath',
      hitDie: 'd10',
      primaryAbility: 'Strength & Charisma',
      savingThrowProficiencies: ['Wisdom', 'Charisma']
    },
    {
      name: 'Ranger',
      description: 'A warrior who combats threats on the edges of civilization',
      hitDie: 'd10',
      primaryAbility: 'Dexterity & Wisdom',
      savingThrowProficiencies: ['Strength', 'Dexterity']
    },
    {
      name: 'Rogue',
      description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies',
      hitDie: 'd8',
      primaryAbility: 'Dexterity',
      savingThrowProficiencies: ['Dexterity', 'Intelligence']
    },
    {
      name: 'Sorcerer',
      description: 'A spellcaster who draws on inherent magic from a gift or bloodline',
      hitDie: 'd6',
      primaryAbility: 'Charisma',
      savingThrowProficiencies: ['Constitution', 'Charisma']
    },
    {
      name: 'Warlock',
      description: 'A wielder of magic that is derived from a bargain with an extraplanar entity',
      hitDie: 'd8',
      primaryAbility: 'Charisma',
      savingThrowProficiencies: ['Wisdom', 'Charisma']
    },
    {
      name: 'Wizard',
      description: 'A scholarly magic-user capable of manipulating the structures of reality',
      hitDie: 'd6',
      primaryAbility: 'Intelligence',
      savingThrowProficiencies: ['Intelligence', 'Wisdom']
    }
  ];

  private species: DnDSpecies[] = [
    {
    name: "Aasimar",
    creatureType: "Humanoid",
    size: ["Medium", "Small"],
    speed: 30,
    description: "Aasimar are mortals with a touch of the divine, carrying a spark of celestial power within their souls. They often have unique physical features that hint at their otherworldly heritage.",
    traits: {
      "Celestial Resistance": "Resistance to Necrotic damage and Radiant damage",
      "Darkvision": "60 feet",
      "Healing Hands": "Magic action to heal, roll d4s equal to Proficiency Bonus",
      "Light Bearer": "Know the Light cantrip",
    },
    specialAbilities: {
      "Celestial Revelation": "Transform at level 3, choose between Heavenly Wings, Inner Radiance, or Necrotic Shroud",
    },
  },
  {
    name: "Dragonborn",
    creatureType: "Humanoid",
    size: ["Medium"],
    speed: 30,
    description: "Dragonborn are humanoids with draconic ancestry, possessing scales and draconic features. They inherit some of the power and majesty of dragons.",
    traits: {
      "Draconic Ancestry": "Choose dragon type, affects Breath Weapon and Damage Resistance",
      "Breath Weapon": "Exhale magical energy in a 15-foot Cone or 30-foot Line",
      "Damage Resistance": "Resistance to damage type determined by Draconic Ancestry",
      "Darkvision": "60 feet",
    },
    specialAbilities: {
      "Draconic Flight": "Gain temporary flight at level 5",
    },
  },
  {
    name: "Dwarf",
    creatureType: "Humanoid",
    size: ["Medium"],
    speed: 30,
    description: "Dwarves are stout, hardy folk known for their craftsmanship and resilience. They have a strong connection to stone and metal, often living in mountain strongholds.",
    traits: {
      "Darkvision": "120 feet",
      "Dwarven Resilience": "Resistance to Poison damage, Advantage on Poison saving throws",
      "Dwarven Toughness": "Increased Hit Point maximum",
      "Stonecunning": "Gain Tremorsense on stone surfaces",
    },
  },
  {
    name: "Elf",
    creatureType: "Humanoid",
    size: ["Medium"],
    speed: 30,
    description: "Elves are graceful, long-lived beings with a deep connection to nature and magic. They possess keen senses and a natural affinity for the arcane.",
    traits: {
      "Darkvision": "60 feet",
      "Fey Ancestry": "Advantage on saving throws against being Charmed",
      "Keen Senses": "Proficiency in Insight, Perception, or Survival",
      "Trance": "4-hour trance instead of sleep",
    },
    specialAbilities: {
      "Elven Lineage": "Choose between Drow, High Elf, or Wood Elf",
    },
    spells: {
      "Drow": ["Dancing Lights", "Faerie Fire", "Darkness"],
      "High Elf": ["Prestidigitation", "Detect Magic", "Misty Step"],
      "Wood Elf": ["Druidcraft", "Longstrider", "Pass without Trace"],
    },
  },
  {
    name: "Gnome",
    creatureType: "Humanoid",
    size: ["Small"],
    speed: 30,
    description: "Gnomes are small, clever humanoids with a natural aptitude for magic and invention. They are known for their curiosity and mischievous nature.",
    traits: {
      "Darkvision": "60 feet",
      "Gnomish Cunning": "Advantage on Intelligence, Wisdom, and Charisma saving throws",
    },
    specialAbilities: {
      "Gnomish Lineage": "Choose between Forest Gnome or Rock Gnome",
    },
    spells: {
      "Forest Gnome": ["Minor Illusion", "Speak with Animals"],
      "Rock Gnome": ["Mending", "Prestidigitation"],
    },
  },
  {
    name: "Goliath",
    creatureType: "Humanoid",
    size: ["Medium"],
    speed: 35,
    description: "Goliaths are large, powerful humanoids with a heritage tied to giants. They are known for their great strength and endurance, often thriving in harsh mountainous environments.",
    traits: {
      "Powerful Build": "Advantage on checks to end Grappled condition, count as one size larger for carrying capacity",
    },
    specialAbilities: {
      "Giant Ancestry": "Choose one supernatural boon from giant ancestry",
      "Large Form": "Can change size to Large at level 5",
    },
  },
  {
    name: "Halfling",
    creatureType: "Humanoid",
    size: ["Small"],
    speed: 30,
    description: "Halflings are small, nimble humanoids known for their luck and bravery. They are often underestimated due to their size but possess a resilient and adventurous spirit.",
    traits: {
      "Brave": "Advantage on saving throws against being Frightened",
      "Halfling Nimbleness": "Can move through spaces of creatures one size larger",
      "Luck": "Can reroll 1s on D20 Tests",
      "Naturally Stealthy": "Can Hide when obscured by larger creatures",
    },
  },
  {
    name: "Human",
    creatureType: "Humanoid",
    size: ["Medium", "Small"],
    speed: 30,
    description: "Humans are versatile and adaptable, found throughout the multiverse. They are known for their ambition, creativity, and ability to excel in various fields.",
    traits: {
      "Resourceful": "Gain Heroic Inspiration after Long Rest",
      "Skillful": "Gain proficiency in one skill of choice",
      "Versatile": "Gain an Origin feat of choice",
    },
  },
  {
    name: "Orc",
    creatureType: "Humanoid",
    size: ["Medium"],
    speed: 30,
    description: "Orcs are strong, resilient humanoids with a proud warrior culture. They are known for their physical prowess and endurance, often excelling in combat and survival skills.",
    traits: {
      "Adrenaline Rush": "Can Dash as Bonus Action and gain Temporary Hit Points",
      "Darkvision": "120 feet",
      "Relentless Endurance": "Can drop to 1 HP instead of 0 HP once per Long Rest",
    },
  },
  {
    name: "Tiefling",
    creatureType: "Humanoid",
    size: ["Medium", "Small"],
    speed: 30,
    description: "Tieflings are humanoids with fiendish ancestry, often bearing subtle physical traits that hint at their otherworldly heritage. They possess innate magical abilities tied to their lineage.",
    traits: {
      "Darkvision": "60 feet",
      "Otherworldly Presence": "Know the Thaumaturgy cantrip",
    },
    specialAbilities: {
      "Fiendish Legacy": "Choose between Abyssal, Chthonic, or Infernal legacy",
    },
    spells: {
      "Abyssal": ["Poison Spray", "Ray of Sickness", "Hold Person"],
      "Chthonic": ["Chill Touch", "False Life", "Ray of Enfeeblement"],
      "Infernal": ["Fire Bolt", "Hellish Rebuke", "Darkness"],
    },
  },
];


  private backgrounds: DnDBackground[] = [
    {
      name: 'Acolyte',
      description: 'You have spent your life in service to a temple',
      feats: ['Magic Initiate'],
      skillProficiencies: ['Insight', 'Religion'],
      abilityScoreImprovements: ['Wisdom', 'Intelligence', 'Charisma']
    },
    {
      name: 'Artisan',
      description: 'You have a talent for working with your hands',
      feats: ['Crafter'],
      skillProficiencies: ['Persuasion', 'Choose one from Arcana, History, Investigation, Medicine, Nature, or Religion'],
      abilityScoreImprovements: ['Intelligence', 'Dexterity', 'Constitution']
    },
    {
      name: 'Charlatan',
      description: 'You have a way with people and rely on your wit',
      feats: ['Skilled'],
      skillProficiencies: ['Deception', 'Sleight of Hand'],
      abilityScoreImprovements: ['Charisma', 'Dexterity', 'Intelligence']
    },
    {
      name: 'Criminal',
      description: 'You have a history of breaking the law',
      feats: ['Alert'],
      skillProficiencies: ['Stealth', 'Choose one from Athletics, Deception, Intimidation, or Sleight of Hand'],
      abilityScoreImprovements: ['Dexterity', 'Intelligence', 'Charisma']
    },
    {
      name: 'Entertainer',
      description: 'You thrive in front of an audience',
      feats: ['Skilled'],
      skillProficiencies: ['Acrobatics', 'Performance'],
      abilityScoreImprovements: ['Charisma', 'Dexterity', 'Constitution']
    },
    {
      name: 'Farmer',
      description: 'You come from an agricultural background',
      feats: ['Tough'],
      skillProficiencies: ['Animal Handling', 'Nature'],
      abilityScoreImprovements: ['Constitution', 'Wisdom', 'Strength']
    },
    {
      name: 'Guard',
      description: 'You have served as a guard, protecting people or property',
      feats: ['Alert'],
      skillProficiencies: ['Insight', 'Choose one from Athletics, Intimidation, or Perception'],
      abilityScoreImprovements: ['Strength', 'Constitution', 'Wisdom']
    },
    {
      name: 'Guide',
      description: 'You\'re skilled at leading others through dangerous places',
      feats: ['Magic Initiate'],
      skillProficiencies: ['Survival', 'Choose one from Animal Handling, Athletics, History, or Nature'],
      abilityScoreImprovements: ['Wisdom', 'Dexterity', 'Intelligence']
    },
    {
      name: 'Laborer',
      description: 'You\'re used to long hours of hard work',
      feats: ['Tough'],
      skillProficiencies: ['Athletics', 'Choose one from Animal Handling, Medicine, or Survival'],
      abilityScoreImprovements: ['Strength', 'Constitution', 'Wisdom']
    },
    {
      name: 'Noble',
      description: 'You understand wealth, power, and privilege',
      feats: ['Skilled'],
      skillProficiencies: ['History', 'Persuasion'],
      abilityScoreImprovements: ['Charisma', 'Intelligence', 'Wisdom']
    },
    {
      name: 'Pilgrim',
      description: 'Your life has been dedicated to a personal quest',
      feats: ['Lucky'],
      skillProficiencies: ['Religion', 'Choose one from Insight, Medicine, or Survival'],
      abilityScoreImprovements: ['Wisdom', 'Constitution', 'Charisma']
    },
    {
      name: 'Sage',
      description: 'You have a thirst for knowledge',
      feats: ['Magic Initiate'],
      skillProficiencies: ['Arcana', 'History'],
      abilityScoreImprovements: ['Intelligence', 'Wisdom', 'Charisma']
    },
    {
      name: 'Sailor',
      description: 'You have spent your life aboard ships',
      feats: ['Tavern Brawler'],
      skillProficiencies: ['Athletics', 'Choose one from Acrobatics, Nature, or Perception'],
      abilityScoreImprovements: ['Strength', 'Dexterity', 'Wisdom']
    },
    {
      name: 'Soldier',
      description: 'You have been trained in military service',
      feats: ['Tough'],
      skillProficiencies: ['Athletics', 'Intimidation'],
      abilityScoreImprovements: ['Strength', 'Constitution', 'Wisdom']
    },
    {
      name: 'Urchin',
      description: 'You grew up on the streets',
      feats: ['Lucky'],
      skillProficiencies: ['Sleight of Hand', 'Stealth'],
      abilityScoreImprovements: ['Dexterity', 'Constitution', 'Wisdom']
    },
    {
      name: 'Custom',
      description: 'You have a unique background',
      feats: ['Choose one'],
      skillProficiencies: ['Choose two'],
      abilityScoreImprovements: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']
    }
  ];


  private subclasses: DnDSubclass[] = [
    {
      name: 'Path of the Berserker',
      parentClass: 'Barbarian',
      description: 'For some barbarians, rage is a means to an end—that end being violence'
    },
    {
      name: 'College of Lore',
      parentClass: 'Bard',
      description: 'Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales'
    },
    {
      name: 'Life Domain',
      parentClass: 'Cleric',
      description: 'The Life domain focuses on the vibrant positive energy that sustains all life'
    },
    {
      name: 'Circle of the Land',
      parentClass: 'Druid',
      description: 'The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition'
    },
    {
      name: 'Champion',
      parentClass: 'Fighter',
      description: 'The archetypal Champion focuses on the development of raw physical power honed to deadly perfection'
    },
    {
      name: 'Way of the Open Hand',
      parentClass: 'Monk',
      description: 'Monks of the Way of the Open Hand are the ultimate masters of martial arts combat, whether armed or unarmed'
    },
    {
      name: 'Oath of Devotion',
      parentClass: 'Paladin',
      description: 'The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order'
    },
    {
      name: 'Hunter',
      parentClass: 'Ranger',
      description: 'Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness'
    },
    {
      name: 'Thief',
      parentClass: 'Rogue',
      description: 'You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype'
    },
    {
      name: 'Draconic Bloodline',
      parentClass: 'Sorcerer',
      description: 'Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors'
    },
    {
      name: 'The Fiend',
      parentClass: 'Warlock',
      description: 'You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims'
    },
    {
      name: 'School of Evocation',
      parentClass: 'Wizard',
      description: 'You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid'
    },
  ];

  constructor() {
  }

  getClasses(): Observable<DnDClass[]> {
    return of(this.classes);
  }

  getSpecies(): Observable<DnDSpecies[]> {
    return of(this.species);
  }

  getBackgrounds(): Observable<DnDBackground[]> {
    return of(this.backgrounds);
  }

  getClassByName(className: string): Observable<DnDClass | undefined> {
    return of(this.classes.find(c => c.name.toLowerCase() === className.toLowerCase()));
  }

  getBackgroundByName(backgroundName: string): Observable<DnDBackground | undefined> {
    return of(this.backgrounds.find(b => b.name.toLowerCase() === backgroundName.toLowerCase()));
  }
  
}
