import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { StatBlockComponent } from './stat-block/stat-block.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CharacterSheetComponent, StatBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'RpStudio';
}
