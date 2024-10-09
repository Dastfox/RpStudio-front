import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
    }
  ];


  private subclasses: DnDSubclass[] = [
    { name: 'Path of the Berserker', parentClass: 'Barbarian', description: 'For some barbarians, rage is a means to an end—that end being violence' },
    { name: 'College of Lore', parentClass: 'Bard', description: 'Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales' },
    { name: 'Life Domain', parentClass: 'Cleric', description: 'The Life domain focuses on the vibrant positive energy that sustains all life' },
    { name: 'Circle of the Land', parentClass: 'Druid', description: 'The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition' },
    { name: 'Champion', parentClass: 'Fighter', description: 'The archetypal Champion focuses on the development of raw physical power honed to deadly perfection' },
    { name: 'Way of the Open Hand', parentClass: 'Monk', description: 'Monks of the Way of the Open Hand are the ultimate masters of martial arts combat, whether armed or unarmed' },
    { name: 'Oath of Devotion', parentClass: 'Paladin', description: 'The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order' },
    { name: 'Hunter', parentClass: 'Ranger', description: 'Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness' },
    { name: 'Thief', parentClass: 'Rogue', description: 'You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype' },
    { name: 'Draconic Bloodline', parentClass: 'Sorcerer', description: 'Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors' },
    { name: 'The Fiend', parentClass: 'Warlock', description: 'You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims' },
    { name: 'School of Evocation', parentClass: 'Wizard', description: 'You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid' },
  ];

  constructor() { }

  getClasses(): Observable<DnDClass[]> {
    return of(this.classes);
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
