import {Injectable} from '@angular/core';
import {DnDCharacterStats, PointBuyConfig} from '../../models/character.model';

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

  canIncreaseStat(stats: DnDCharacterStats, stat: keyof DnDCharacterStats): boolean {
    const currentValue = stats[stat];
    const nextValue = currentValue + 1;
    const remainingPoints = this.getRemainingPoints(stats);
    const pointCost = this.pointBuyConfig.pointCosts[nextValue] - this.pointBuyConfig.pointCosts[currentValue];

    return nextValue <= this.pointBuyConfig.maxScore && pointCost <= remainingPoints;
  }

  canDecreaseStat(stats: DnDCharacterStats, stat: keyof DnDCharacterStats): boolean {
    return stats[stat] > this.pointBuyConfig.minScore;
  }

  increaseStat(stats: DnDCharacterStats, stat: keyof DnDCharacterStats): DnDCharacterStats {
    if (this.canIncreaseStat(stats, stat)) {
      return {...stats, [stat]: stats[stat] + 1};
    }
    return stats;
  }

  decreaseStat(stats: DnDCharacterStats, stat: keyof DnDCharacterStats): DnDCharacterStats {
    if (this.canDecreaseStat(stats, stat)) {
      return {...stats, [stat]: stats[stat] - 1};
    }
    return stats;
  }
}
