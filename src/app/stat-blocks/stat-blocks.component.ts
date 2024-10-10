import {Component, Input, Output, EventEmitter, ViewChildren, QueryList} from '@angular/core';
import {NgFor} from '@angular/common';
import {StatBlockComponent} from './stat-block/stat-block.component';
import {DnDCharacterStats} from '../models/character.model';

type StatKey = keyof DnDCharacterStats;
type BumpType = 'one' | 'two' | null;

@Component({
  selector: 'app-stat-blocks',
  standalone: true,
  imports: [NgFor, StatBlockComponent],
  templateUrl: './stat-blocks.component.html',
  styleUrls: ['./stat-blocks.component.scss']
})
export class StatBlocksComponent {
  @Input() stats!: DnDCharacterStats;
  @Input() bumpableStats: StatKey[] = [];

  @Output() statChange = new EventEmitter<{ key: StatKey, value: number, is_bumped: BumpType }>();

  @ViewChildren(StatBlockComponent) statBlocks!: QueryList<StatBlockComponent>;

  private bumpedStats: { [key in StatKey]?: BumpType } = {};
  private pointBuyCosts: { [key: number]: number } = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
  };
  private totalPointBuyBudget = 27;
  private usedPoints = 0;

  get statEntries(): Array<{
    key: StatKey;
    value: number;
    canBeBumpedByOne: boolean;
    canBeBumpedByTwo: boolean;
    isFocusedImprovement: boolean;
    canBeIncreasedByPointBuy: boolean;
    canBeDecreasedByPointBuy: boolean;
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

        const baseStat = this.getBaseStatValue(key, value);
        const canBeIncreasedByPointBuy = baseStat < 15 && this.usedPoints + this.getPointCost(baseStat + 1) - this.getPointCost(baseStat) <= this.totalPointBuyBudget;
        const canBeDecreasedByPointBuy = baseStat > 8;

        return {
          key,
          value,
          canBeBumpedByOne,
          canBeBumpedByTwo,
          isFocusedImprovement: this.bumpableStats.includes(key),
          canBeIncreasedByPointBuy,
          canBeDecreasedByPointBuy
        };
      }
    );
  }

  onStatChange(event: { key: StatKey, value: number, is_bumped: BumpType }): void {
    const oldBaseValue = this.getBaseStatValue(event.key, this.stats[event.key]);
    const newBaseValue = this.getBaseStatValue(event.key, event.value);

    this.usedPoints += this.getPointCost(newBaseValue) - this.getPointCost(oldBaseValue);

    this.bumpedStats[event.key] = event.is_bumped;
    console.log('Stat change event:', event, 'Bumped stats:', this.bumpedStats, 'Used points:', this.usedPoints);
    this.statChange.emit(event);
  }

  resetBumpedStats(): void {
    this.bumpedStats = {};
    // this.usedPoints = 0;
    // Reset bumps on each StatBlockComponent
    this.statBlocks.forEach(statBlock => {
      statBlock.resetBumps();
    });
    // // Reset the actual stat values to 8
    // for (const key in this.stats) {
    //   if (this.stats.hasOwnProperty(key)) {
    //     const statKey = key as StatKey;
    //     this.statChange.emit({key: statKey, value: 10, is_bumped: null});
    //   }
    // }
  }

  private getBaseStatValue(key: StatKey, value: number): number {
    const bump = this.bumpedStats[key];
    return value - (bump === 'one' ? 1 : bump === 'two' ? 2 : 0);
  }

  private getPointCost(value: number): number {
    return this.pointBuyCosts[value] || 0;
  }
}
