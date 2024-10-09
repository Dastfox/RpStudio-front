import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Character, CharacterStats} from '../models/character.model';
import {StatBlocksComponent} from '../stat-blocks/stat-blocks.component';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    StatBlocksComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterSheetComponent {
  character: Character = {
    name: '',
    class: '',
    level: 1,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }
  };

  constructor(private _cdr: ChangeDetectorRef) {}

  onCharacterStatChange(event: { key: keyof CharacterStats, value: number }) {
    this.character.stats[event.key] = event.value;
    console.log(`${event.key} changed to ${event.value}`);
  }
}

