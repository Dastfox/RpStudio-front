import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CharacterStats } from '../models/character.model';
import {NgForOf, TitleCasePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-stat-block',
  templateUrl: './stat-block.component.html',
  standalone: true,
  imports: [
    TitleCasePipe,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./stat-block.component.scss']
})
export class StatBlockComponent {
  @Input() stats!: CharacterStats;
  @Output() statChange = new EventEmitter<{stat: string, value: number}>();

  onStatChange(stat: string, value: string): void {
    this.statChange.emit({stat, value: parseInt(value) || 0});
  }

  get statEntries(): [string, number][] {
    return Object.entries(this.stats);
  }
}
