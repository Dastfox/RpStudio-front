import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Character, CharacterStats } from '../models/character.model';
import { StatBlocksComponent } from '../stat-blocks/stat-blocks.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { DnD5eDataService, DnDClass, DnDBackground } from '../services/dnd.service';

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
            <option *ngFor="let _class of classes" [value]="_class.name">{{_class.name}}</option>
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
            <option *ngFor="let bg of backgrounds" [value]="bg.name">{{bg.name}}</option>
          </select>
        </div>
      </div>

      <div *ngIf="selectedClass">
        <h3>Class Details</h3>
        <p>{{selectedClass.description}}</p>
        <p>Hit Die: {{selectedClass.hitDie}}</p>
        <p>Primary Ability: {{selectedClass.primaryAbility}}</p>
      </div>

      <div *ngIf="selectedBackground">
        <h3>Background Details</h3>
        <p>{{selectedBackground.description}}</p>
        <p>Feat: {{selectedBackground.feats[0]}}</p>
        <p>Skill Proficiencies: {{selectedBackground.skillProficiencies.join(', ')}}</p>
        <p>Ability Score Improvements:</p>
        <ul>
          <li *ngFor="let ability of selectedBackground.abilityScoreImprovements">{{ability}}</li>
        </ul>
        <button (click)="applyAbilityScores('balanced')">Apply +1 to three abilities</button>
        <button (click)="applyAbilityScores('focused')">Apply +2 to one, +1 to another</button>
      </div>

      <app-stat-blocks
        [stats]="character.stats"
        (statChange)="onCharacterStatChange($event)"
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

  classes: DnDClass[] = [];
  backgrounds: DnDBackground[] = [];
  selectedClass?: DnDClass;
  selectedBackground?: DnDBackground;

  constructor(
    private dndDataService: DnD5eDataService,
    private cdr: ChangeDetectorRef
  ) {}

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
        this.cdr.markForCheck();
      });
    } else {
      this.selectedBackground = undefined;
      this.cdr.markForCheck();
    }
  }

  onCharacterStatChange(event: { key: keyof CharacterStats; value: number }) {
    this.character.stats[event.key] = event.value;
    console.log(`${event.key} changed to ${event.value}`);
    this.cdr.markForCheck();
  }

  applyAbilityScores(method: 'balanced' | 'focused') {
    if (this.selectedBackground) {
      const abilities = this.selectedBackground.abilityScoreImprovements;
      if (method === 'balanced') {
        abilities.forEach(ability => {
          this.character.stats[ability.toLowerCase() as keyof CharacterStats] += 1;
        });
      } else {
        // For 'focused', you'd typically open a dialog or use some UI to let the user choose.
        // For this example, we'll just apply +2 to the first ability and +1 to the second.
        this.character.stats[abilities[0].toLowerCase() as keyof CharacterStats] += 2;
        this.character.stats[abilities[1].toLowerCase() as keyof CharacterStats] += 1;
      }
      this.cdr.markForCheck();
    }
  }
}
