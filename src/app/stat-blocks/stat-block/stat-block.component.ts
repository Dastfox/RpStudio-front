import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DnDCharacterStats } from '../../models/character.model';
import { DndPointBuyService } from '../../services/DnD/dnd-point-buy.service';

// Type definitions
type StatKey = keyof DnDCharacterStats;
type BumpType = 'one' | 'two' | null;

@Component({
  selector: 'app-stat-block',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './stat-block.component.html',
  styleUrls: ['./stat-block.component.scss']
})
export class StatBlockComponent implements OnChanges {
  // Input properties
  @Input() statKey!: StatKey;
  @Input() isEditable: boolean = true;
  @Input() canBeBumpedByOne: boolean = false;
  @Input() canBeBumpedByTwo: boolean = false;
  @Input() isFocusedImprovement: boolean = false;
  @Input() stats!: DnDCharacterStats;

  // Output property
  @Output() valueChanged = new EventEmitter<{ key: StatKey, value: number, is_bumped: BumpType }>();

  // Private properties
  private _valueWithoutBumps: number = 0;
  private _valueWithBumps: number = 0;
  private _maxStatValue: number = 20; // Default max value, can be adjusted if needed

  // Public properties
  errorMessage: string = '';

  constructor(private dndPointBuyService: DndPointBuyService) {}

  // Lifecycle hook
  ngOnChanges(changes: SimpleChanges) {
    if (changes['stats'] && this.stats && this.statKey) {
      this._valueWithoutBumps = this.stats[this.statKey];
      this.updateValueWithBumps();
      this.updateMaxStatValue();
    }
  }

  // Private methods
  private updateMaxStatValue(): void {
    this._maxStatValue = this.dndPointBuyService.getMaxStatValue(this.statKey, this.stats);
  }

  private updateValueWithBumps(): void {
    this._valueWithBumps = Math.min(
      this.dndPointBuyService.getStatWithBackgroundBump(this.stats, this.statKey),
      this._maxStatValue
    );
  }

  private emitValueChange(newValue: number) {
    this._valueWithoutBumps = Math.min(newValue, this._maxStatValue);
    this.updateValueWithBumps();
    const bumpType = this.dndPointBuyService.getBackgroundBump(this.statKey);
    this.valueChanged.emit({key: this.statKey, value: this._valueWithoutBumps, is_bumped: bumpType || null});
  }

  // Getters and setters
  get valueWithoutBumps(): number {
    return this._valueWithoutBumps;
  }

  set valueWithoutBumps(newValue: number) {
    this._valueWithoutBumps = Math.min(newValue, this._maxStatValue);
    this.updateValueWithBumps();
  }

  get valueWithBumps(): number {
    return this._valueWithBumps;
  }

  set valueWithBumps(newValue: number) {
    const closestAllowedValue = this.dndPointBuyService.setStatToClosestAllowedValue(
      this.stats, this.statKey, this._valueWithBumps, Math.min(newValue, this._maxStatValue)
    );

    if (closestAllowedValue !== this._valueWithBumps) {
      this._valueWithBumps = closestAllowedValue;
      this._valueWithoutBumps = this.dndPointBuyService.getStatWithoutBackgroundBump(this.stats, this.statKey);
      this.emitValueChange(this._valueWithoutBumps);
    }
  }

  get isBumpedOne(): boolean {
    return this.dndPointBuyService.getBackgroundBump(this.statKey) === 'one';
  }

  set isBumpedOne(value: boolean) {
    this.toggleBump(value ? 'one' : null);
  }

  get isBumpedTwo(): boolean {
    return this.dndPointBuyService.getBackgroundBump(this.statKey) === 'two';
  }

  set isBumpedTwo(value: boolean) {
    this.toggleBump(value ? 'two' : null);
  }

  get maxStatValue(): number {
    return this._maxStatValue;
  }

  // Public methods
  incrementValue() {
    if (this.canIncrement()) {
      this.emitValueChange(Math.min(this.valueWithoutBumps + 1, this._maxStatValue));
    }
  }

  decrementValue() {
    if (this.canDecrement()) {
      this.emitValueChange(this.valueWithoutBumps - 1);
    }
  }

  toggleBump(bumpType: BumpType) {
    if (bumpType && this.dndPointBuyService.canApplyBackgroundBump(this.stats, this.statKey, bumpType)) {
      this.dndPointBuyService.applyBackgroundBump(this.statKey, bumpType);
    } else {
      this.dndPointBuyService.removeBackgroundBump(this.statKey);
    }
    this.updateValueWithBumps();
    this.emitValueChange(this.valueWithoutBumps);
  }

  canIncrement(): boolean {
    return this.stats && this.valueWithBumps < this._maxStatValue && this.dndPointBuyService.canIncreaseStat(this.stats, this.statKey);
  }

  canDecrement(): boolean {
    return this.stats ? this.dndPointBuyService.canDecreaseStat(this.stats, this.statKey) : false;
  }

  getDndModifier(): number {
    return Math.floor((this.valueWithBumps - 10) / 2);
  }

  getDndModifierString(): string {
    const modifier = this.getDndModifier();
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  resetBumps(): void {
    this.dndPointBuyService.removeBackgroundBump(this.statKey);
    this.updateValueWithBumps();
    this.emitValueChange(this.valueWithoutBumps);
  }
}
