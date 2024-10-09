import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgFor, TitleCasePipe} from '@angular/common';
import {StatBlockComponent} from './stat-block/stat-block.component';
import {CharacterStats} from '../models/character.model';
import {FormsModule} from '@angular/forms';

type StatKey = keyof CharacterStats;

@Component({
  selector: 'app-stat-blocks',
  standalone: true,
  imports: [NgFor, StatBlockComponent, TitleCasePipe, FormsModule],
  templateUrl: './stat-blocks.component.html',
  styleUrls: [
    "./stat-blocks.component.scss"
  ]
})
export class StatBlocksComponent {
  @Input() stats!: CharacterStats;
  @Output() statChange = new EventEmitter<{ key: StatKey, value: number }>();

  get statEntries(): Array<{ key: StatKey; value: number }> {
    return (Object.entries(this.stats) as [StatKey, number][]).map(
      ([key, value]) => ({ key, value })
    );
  }

  onStatChange(event: { key: StatKey, value: number }): void {
    this.statChange.emit(event);
  }
}
