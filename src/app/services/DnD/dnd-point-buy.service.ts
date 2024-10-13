import {Injectable} from '@angular/core';
import {DnDCharacterStats, PointBuyConfig} from '../../models/character.model';

type StatKey = keyof DnDCharacterStats;
type BumpType = 'one' | 'two';

@Injectable({
  providedIn: 'root'
})
export class DndPointBuyService {
  private pointBuyConfig: PointBuyConfig = {
    totalPoints: 27,
    minScore: 8,
    maxScore: 15,
    pointCosts: {
      8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    }
  };

  private backgroundBumps: Partial<Record<StatKey, BumpType>> = {};

  constructor() {
  }

  initializeStats(): DnDCharacterStats {
    return {
      strength: this.pointBuyConfig.minScore,
      dexterity: this.pointBuyConfig.minScore,
      constitution: this.pointBuyConfig.minScore,
      intelligence: this.pointBuyConfig.minScore,
      wisdom: this.pointBuyConfig.minScore,
      charisma: this.pointBuyConfig.minScore
    };
  }

  calculatePointsSpent(stats: DnDCharacterStats): number {
    return Object.values(stats).reduce((total, stat) => {
      return total + this.pointBuyConfig.pointCosts[stat];
    }, 0);
  }

  getRemainingPoints(stats: DnDCharacterStats): number {
    const pointsSpent = this.calculatePointsSpent(stats);
    return this.pointBuyConfig.totalPoints - pointsSpent;
  }

  canIncreaseStat(stats: DnDCharacterStats, stat: StatKey, newValue?: number | undefined): boolean {
    const currentValue = stats[stat];
    const nextValue = newValue ? newValue : currentValue + 1;
    const remainingPoints = this.getRemainingPoints(stats);
    const pointCost = this.pointBuyConfig.pointCosts[nextValue] - this.pointBuyConfig.pointCosts[currentValue];

    return (nextValue <= this.pointBuyConfig.maxScore && pointCost <= remainingPoints);
  }

  canDecreaseStat(stats: DnDCharacterStats, stat: StatKey, newValue?: number | undefined): boolean {
    newValue = newValue ? newValue : stats[stat] - 1;
    return newValue > this.pointBuyConfig.minScore;
  }

  increaseStat(stats: DnDCharacterStats, stat: StatKey): DnDCharacterStats {
    if (this.canIncreaseStat(stats, stat)) {
      return {...stats, [stat]: stats[stat] + 1};
    }
    return stats;
  }

  decreaseStat(stats: DnDCharacterStats, stat: StatKey): DnDCharacterStats {
    if (this.canDecreaseStat(stats, stat)) {
      return {...stats, [stat]: stats[stat] - 1};
    }
    return stats;
  }

  setStatToClosestAllowedValue(stats: DnDCharacterStats, stat: StatKey, actual_value: number, target_value: number): number {
    const direction = Math.sign(target_value - actual_value);

    const canAdjustStat = direction > 0
      ? () => this.canIncreaseStat(stats, stat, actual_value + direction)
      : () => this.canDecreaseStat(stats, stat, actual_value - direction);

    const adjustStat = direction > 0
      ? () => this.increaseStat(stats, stat)
      : () => this.decreaseStat(stats, stat);

    while (actual_value !== target_value && canAdjustStat()) {
      stats = adjustStat();
      actual_value += direction;
    }
    console.log('setStatToClosestAllowedValue ', actual_value);

    return actual_value;
  }


// New methods for background stat bumps

  applyBackgroundBump(stat: StatKey, bumpType: BumpType): void {
    this.backgroundBumps[stat] = bumpType;
  }

  removeBackgroundBump(stat: StatKey): void {
    delete this.backgroundBumps[stat];
  }

  getBackgroundBump(stat: StatKey): BumpType | undefined {
    return this.backgroundBumps[stat];
  }

  hasBackgroundBump(stat: StatKey): boolean {
    return stat in this.backgroundBumps;
  }


  getStatWithBackgroundBump(stats: DnDCharacterStats, stat: StatKey): number {
    const baseStat = stats[stat];
    const bump = this.backgroundBumps[stat];
    return baseStat + (bump === 'one' ? 1 : bump === 'two' ? 2 : 0);
  }

  getStatWithoutBackgroundBump(stats: DnDCharacterStats, stat: StatKey): number {
    return stats[stat];
  }

  getAllStatsWithBackgroundBumps(stats: DnDCharacterStats): DnDCharacterStats {
    const bumpedStats = {...stats};
    for (const stat of Object.keys(stats) as StatKey[]) {
      bumpedStats[stat] = this.getStatWithBackgroundBump(stats, stat);
    }
    return bumpedStats;
  }

  getMaxStatValue(stat: StatKey, stats: DnDCharacterStats): number {
    const remaining_points = this.getRemainingPoints(stats);
    const current_stat = stats[stat];
    const max_stat = this.pointBuyConfig.maxScore;
    let max_stat_value = current_stat;
    for (let i = current_stat; i <= max_stat; i++) {
      if (this.pointBuyConfig.pointCosts[i] <= remaining_points) {
        max_stat_value = i;
      }
    }
    return max_stat_value;
  }

  canApplyBackgroundBump(stats
                           :
                           DnDCharacterStats, stat
                           :
                           StatKey, bumpType
                           :
                           BumpType
  ):
    boolean {
    const currentBump = this.backgroundBumps[stat];
    if (currentBump === bumpType) return false;
    if (currentBump === 'two' || (currentBump === 'one' && bumpType === 'two')) return false;

    const totalBumps = Object.values(this.backgroundBumps).filter(b => b === 'one').length +
      Object.values(this.backgroundBumps).filter(b => b === 'two').length * 2;

    const newTotalBumps = totalBumps - (currentBump === 'one' ? 1 : 0) + (bumpType === 'one' ? 1 : 2);

    return newTotalBumps <= 3 && this.getStatWithBackgroundBump(stats, stat) + (bumpType === 'one' ? 1 : 2) <= 20;
  }
}
