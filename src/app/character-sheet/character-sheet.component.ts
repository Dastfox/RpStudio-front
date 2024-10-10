import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Character, CharacterStats} from '../models/character.model';
import {StatBlocksComponent} from '../stat-blocks/stat-blocks.component';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {DnD5eDataService, DnDClass, DnDBackground} from '../services/dnd.service';

type StatKey = keyof CharacterStats;

@Component({
  selector: 'app-character-sheet',
  template: `
    <div class="character-sheet">
      <h2>Character Sheet</h2>
      <div class="character-info">
        <div>
          <label for="name">Name:</label>
          <input id="name" [(ngModel)]="character.name" (ngModelChange)="onFieldChange()">
        </div>
        <div>
          <label for="class">Class:</label>
          <select id="class" [(ngModel)]="character.class" (ngModelChange)="onClassChange()">
            <option value="">Select a class</option>
            <option *ngFor="let _class of classes" [value]="_class.name">{{ _class.name }}</option>
          </select>
        </div>
        <div>
          <label for="level">Level:</label>
          <input id="level" type="number" [(ngModel)]="character.level" (ngModelChange)="onFieldChange()">
        </div>
        <div>
          <label for="background">Background:</label>
          <select id="background" [(ngModel)]="character.background" (ngModelChange)="onBackgroundChange()">
            <option value="">Select a background</option>
            <option *ngFor="let bg of backgrounds" [value]="bg.name">{{ bg.name }}</option>
          </select>
        </div>
      </div>

      <div *ngIf="selectedClass">
        <h3>Class Details</h3>
        <p>{{ selectedClass.description }}</p>
        <p>Hit Die: {{ selectedClass.hitDie }}</p>
        <p>Primary Ability: {{ selectedClass.primaryAbility }}</p>
      </div>

      <div *ngIf="selectedBackground">
        <h3>Background Details</h3>
        <p>{{ selectedBackground.description }}</p>
        <p>Feat: {{ selectedBackground.feats[0] }}</p>
        <p>Skill Proficiencies: {{ selectedBackground.skillProficiencies.join(', ') }}</p>
      </div>

      <app-stat-blocks
        [stats]="character.stats"
        [bumpableStats]="Array.from(bumpableStats)"
        (statChange)="onCharacterStatChange($event)"
        #statBlocks
      ></app-stat-blocks>
    </div>
  `,
  styleUrls: ['./character-sheet.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    StatBlocksComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterSheetComponent implements OnInit {
  character: Character = {
    name: '',
    class: '',
    level: 1,
    background: '',
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }
  };

   @ViewChild('statBlocks') statBlocksComponent!: StatBlocksComponent;

  classes: DnDClass[] = [];
  backgrounds: DnDBackground[] = [];
  selectedClass?: DnDClass;
  selectedBackground?: DnDBackground;
  bumpableStats: Set<StatKey> = new Set();

  Array = Array;

  constructor(
    private dndDataService: DnD5eDataService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.dndDataService.getClasses().subscribe(classes => {
      this.classes = classes;
      this.cdr.markForCheck();
    });
    this.dndDataService.getBackgrounds().subscribe(backgrounds => {
      this.backgrounds = backgrounds;
      this.cdr.markForCheck();
    });
  }

  onFieldChange() {
    this.cdr.markForCheck();
  }

  onClassChange() {
    if (this.character.class) {
      this.dndDataService.getClassByName(this.character.class).subscribe(classData => {
        this.selectedClass = classData;
        this.cdr.markForCheck();
      });
    } else {
      this.selectedClass = undefined;
      this.cdr.markForCheck();
    }
  }

  onBackgroundChange() {
    if (this.character.background) {
      this.dndDataService.getBackgroundByName(this.character.background).subscribe(backgroundData => {
        this.selectedBackground = backgroundData;
        this.bumpableStats.clear();
        if (backgroundData && backgroundData.abilityScoreImprovements) {
          backgroundData.abilityScoreImprovements.forEach(stat => {
            this.bumpableStats.add(stat.toLowerCase() as StatKey);
          });
        }
        this.resetBumpedStats();
        this.cdr.markForCheck();
      });
    } else {
      this.selectedBackground = undefined;
      this.bumpableStats.clear();
      this.resetBumpedStats();
      this.cdr.markForCheck();
    }
  }

  resetBumpedStats() {
    if (this.statBlocksComponent) {
      console.log('Resetting bumped stats');
      this.statBlocksComponent.resetBumpedStats();
    }
  }


  onCharacterStatChange(event: { key: StatKey; value: number }) {
    this.character.stats[event.key] = event.value;
    console.log(`${event.key} changed to ${event.value}`);
    this.cdr.markForCheck();
  }

}

