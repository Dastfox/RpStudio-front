import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgFor} from '@angular/common';
import {StatBlockComponent} from './stat-block/stat-block.component';
import {CharacterStats} from '../models/character.model';

type StatKey = keyof CharacterStats;
type BumpType = 'one' | 'two' | null;

@Component({
  selector: 'app-stat-blocks',
  standalone: true,
  imports: [NgFor, StatBlockComponent],
  templateUrl: './stat-blocks.component.html',
  styleUrls: ['./stat-blocks.component.scss']
})
export class StatBlocksComponent {
  @Input() stats!: CharacterStats;
  @Input() focusedImprovements: Set<StatKey> = new Set();
  @Input() bumpableStats: StatKey[] = [];

  @Output() statChange = new EventEmitter<{ key: StatKey, value: number, is_bumped: BumpType }>();

  private bumpedStats: { [key in StatKey]?: BumpType } = {};

  get statEntries(): Array<{
    key: StatKey;
    value: number;
    canBeBumpedByOne: boolean;
    canBeBumpedByTwo: boolean;
    isFocusedImprovement: boolean;
  }> {
    const bumpedByTwo = Object.values(this.bumpedStats).includes('two');
    const bumpedByOneCount = Object.values(this.bumpedStats).filter(bump => bump === 'one').length;

    return (Object.entries(this.stats) as [StatKey, number][]).map(
      ([key, value]) => {
        const currentBump = this.bumpedStats[key];
        const canBeBumpedByOne = this.bumpableStats.includes(key) &&
          ((!bumpedByTwo && bumpedByOneCount < 3) || (bumpedByTwo && bumpedByOneCount < 1)) &&
          currentBump !== 'two';
        const canBeBumpedByTwo = this.bumpableStats.includes(key) &&
          !bumpedByTwo &&
          (bumpedByOneCount === 0 || (bumpedByOneCount === 1 && currentBump !== 'one')) &&
          currentBump !== 'two';
        console.log('Stat:', key, 'Bumped by one:', canBeBumpedByOne, 'Bumped by two:', canBeBumpedByTwo);

        return {
          key,
          value,
          canBeBumpedByOne,
          canBeBumpedByTwo,
          isFocusedImprovement: this.focusedImprovements.has(key)
        };
      }
    );
  }

  onStatChange(event: { key: StatKey, value: number, is_bumped: BumpType }): void {
    this.bumpedStats[event.key] = event.is_bumped;
    console.log('Stat change event:', event, 'Bumped stats:', this.bumpedStats);
    this.statChange.emit(event);
  }

  resetBumpedStats(): void {
    this.bumpedStats = {};
    // Reset the actual stat values
    for (const key in this.stats) {
      if (this.stats.hasOwnProperty(key)) {
        const statKey = key as StatKey;
        this.statChange.emit({key: statKey, value: this.stats[statKey], is_bumped: null});
      }
    }
  }
}
