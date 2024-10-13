import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DnDCharacter, DnDCharacterStats} from '../models/character.model';
import {StatBlocksComponent} from '../stat-blocks/stat-blocks.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {DnD5eDataService, DnDBackground, DnDClass, DnDSpecies} from '../services/DnD/dnd-data.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';

type StatKey = keyof DnDCharacterStats;

@Component({
  selector: 'app-character-sheet',
  templateUrl: "./character-sheet.component.html",
  styleUrls: ['./character-sheet.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StatBlocksComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterSheetComponent implements OnInit {
  character: DnDCharacter = {
    name: '',
    species: '',
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

  species: DnDSpecies[] = [];
  classes: DnDClass[] = [];
  backgrounds: DnDBackground[] = [];
  selectedSpecies?: DnDSpecies;
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
    this.dndDataService.getSpecies().subscribe(species => {
      this.species = species;
      this.cdr.markForCheck();
    });
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

  onSpeciesChange() {
    if (this.character.species) {
      this.selectedSpecies = this.species.find(s => s.name === this.character.species);
      this.cdr.markForCheck();
    } else {
      this.selectedSpecies = undefined;
      this.cdr.markForCheck();
    }
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

  protected readonly length = length;
}

