import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {NgFor} from '@angular/common';
import {StatBlockComponent} from './stat-block/stat-block.component';
import {DnDCharacterStats} from '../models/character.model';
import {DndPointBuyService} from '../services/DnD/dnd-point-buy.service';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

type StatKey = keyof DnDCharacterStats;
type BumpType = 'one' | 'two' | null;

@Component({
  selector: 'app-stat-blocks',
  standalone: true,
  imports: [
    NgFor, StatBlockComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './stat-blocks.component.html',
  styleUrls: ['./stat-blocks.component.scss']
})
export class StatBlocksComponent implements OnInit {
  @Input() stats!: DnDCharacterStats;
  @Input() bumpableStats: StatKey[] = [];

  @Output() statChange = new EventEmitter<{ key: StatKey, value: number, is_bumped: BumpType }>();

  @ViewChildren(StatBlockComponent) statBlocks!: QueryList<StatBlockComponent>;

  public max_points: number = 27;

  constructor(private dndPointBuyService: DndPointBuyService) {
  }

  ngOnInit() {
    if (!this.stats) {
      this.stats = this.dndPointBuyService.initializeStats();
    }
  }

  get pointCount(): number {
    return this.dndPointBuyService.calculatePointsSpent(this.stats);
  }

  get statEntries(): Array<{
    key: StatKey;
    value: number;
    canBeBumpedByOne: boolean;
    canBeBumpedByTwo: boolean;
    isFocusedImprovement: boolean;
    canBeIncreasedByPointBuy: boolean;
    canBeDecreasedByPointBuy: boolean;
  }> {
    if (!this.stats) return [];

    return (Object.entries(this.stats) as [StatKey, number][]).map(
      ([key, value]) => {
        const currentBump = this.dndPointBuyService.getBackgroundBump(key);
        const canBeBumpedByOne = this.bumpableStats.includes(key) &&
          this.dndPointBuyService.canApplyBackgroundBump(this.stats, key, 'one');
        const canBeBumpedByTwo = this.bumpableStats.includes(key) &&
          this.dndPointBuyService.canApplyBackgroundBump(this.stats, key, 'two');

        return {
          key,
          value: this.dndPointBuyService.getStatWithBackgroundBump(this.stats, key),
          canBeBumpedByOne,
          canBeBumpedByTwo,
          isFocusedImprovement: this.bumpableStats.includes(key),
          canBeIncreasedByPointBuy: this.dndPointBuyService.canIncreaseStat(this.stats, key),
          canBeDecreasedByPointBuy: this.dndPointBuyService.canDecreaseStat(this.stats, key)
        };
      }
    );
  }

  onStatChange(event: { key: StatKey, value: number, is_bumped: BumpType }): void {
    const oldValue = this.stats[event.key];
    const newValue = event.value;

    if (newValue > oldValue && this.dndPointBuyService.canIncreaseStat(this.stats, event.key)) {
      this.stats = this.dndPointBuyService.increaseStat(this.stats, event.key);
    } else if (newValue < oldValue && this.dndPointBuyService.canDecreaseStat(this.stats, event.key)) {
      this.stats = this.dndPointBuyService.decreaseStat(this.stats, event.key);
    }

    if (event.is_bumped) {
      this.dndPointBuyService.applyBackgroundBump(event.key, event.is_bumped);
    } else {
      this.dndPointBuyService.removeBackgroundBump(event.key);
    }

    console.log('Stat change event:', event, 'Remaining points:', this.dndPointBuyService.getRemainingPoints(this.stats));
    this.statChange.emit(event);
  }

  resetBumpedStats(): void {
    for (const key of Object.keys(this.stats) as StatKey[]) {
      this.dndPointBuyService.removeBackgroundBump(key);
    }
    this.statBlocks.forEach(statBlock => {
      statBlock.resetBumps();
    });
  }

  getRemainingPoints(): number {
    return this.dndPointBuyService.getRemainingPoints(this.stats);
  }
}
