import {Component} from '@angular/core';
import {CharacterSheetComponent} from './character-sheet/character-sheet.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CharacterSheetComponent
  ]
})
export class AppComponent {
  title = 'RpStudio';
}
