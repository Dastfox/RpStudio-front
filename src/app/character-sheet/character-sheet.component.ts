import {Component} from '@angular/core';
import {Character} from '../models/character.model';
import {StatBlockComponent} from '../stat-block/stat-block.component';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  standalone: true,
  styleUrls: ['./character-sheet.component.scss'],
  imports: [StatBlockComponent, FormsModule]

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

  onStatChange(stat: string, value: number): void {
    this.character.stats[stat as keyof typeof this.character.stats] = value;
  }
}
