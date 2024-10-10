import {Component, EventEmitter, Input, numberAttribute, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {CharacterStats} from '../../models/character.model';

type StatKey = keyof CharacterStats;
type BumpType = 'one' | 'two' | null;

@Component({
  selector: 'app-stat-block',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './stat-block.component.html',
  styleUrls: ['./stat-block.component.scss']
})
export class StatBlockComponent {
  @Input() statKey!: StatKey;
  @Input({transform: numberAttribute}) min?: number;
  @Input({transform: numberAttribute}) max?: number;
  @Input() isEditable: boolean = true;
  @Input() canBeBumpedByOne: boolean = false;
  @Input() canBeBumpedByTwo: boolean = false;
  @Input() isFocusedImprovement: boolean = false;
  @Output() valueChanged = new EventEmitter<{ key: StatKey, value: number, is_bumped: BumpType }>();

  private _value_without_bumps!: number;
  private _value_with_bumps!: number;

  errorMessage: string = '';
  isBumpedOne: boolean = false;
  isBumpedTwo: boolean = false;

  @Input()
  set value(val: number) {
    this._value_without_bumps = val;
    this.updateValueWithBumps();
  }

  get value_without_bumps(): number {
    return this._value_without_bumps;
  }

  get value_with_bumps(): number {
    return this._value_with_bumps;
  }

  private updateValueWithBumps(): void {
    this._value_with_bumps = this._value_without_bumps + this.getBumpValue();
  }

  onValueChange(newValue: number) {
    if (isNaN(newValue)) {
      this.errorMessage = 'Please enter a valid number';
    } else {
      this.errorMessage = '';
      this.emitValueChange(this.clampValue(newValue));
    }
  }

  incrementValue() {
    if (this.canIncrement()) {
      this.emitValueChange(this.value_with_bumps + 1);
    }
  }

  decrementValue() {
    if (this.canDecrement()) {
      this.emitValueChange(this.value_with_bumps - 1);
    }
  }

  toggleBump(type: BumpType) {
    if (type === 'one') {
      this.isBumpedOne = !this.isBumpedOne;
    } else if (type === 'two') {
      this.isBumpedTwo = !this.isBumpedTwo;
    }
    this.updateValueWithBumps();
    this.emitValueChange(this.value_with_bumps);
  }

  private emitValueChange(newValue: number) {
    let bumpType: BumpType = null;
    if (this.isBumpedTwo) {
      bumpType = 'two';
    } else if (this.isBumpedOne) {
      bumpType = 'one';
    }
    this._value_without_bumps = newValue - this.getBumpValue();
    this.updateValueWithBumps();
    this.valueChanged.emit({key: this.statKey, value: this._value_without_bumps, is_bumped: bumpType});
  }

  private clampValue(value: number): number {
    const minWithBump = this.min !== undefined ? this.min - this.getBumpValue() : undefined;
    const maxWithBump = this.max !== undefined ? this.max + this.getBumpValue() : undefined;

    if (minWithBump !== undefined && value < minWithBump) {
      return minWithBump;
    }
    if (maxWithBump !== undefined && value > maxWithBump) {
      return maxWithBump;
    }
    return value;
  }

  canIncrement(): boolean {
    return this.max === undefined || this.value_with_bumps < this.max;
  }

  canDecrement(): boolean {
    return this.min === undefined || this.value_with_bumps > this.min;
  }

  private getBumpValue(): number {
    return (this.isBumpedTwo ? 2 : 0) + (this.isBumpedOne ? 1 : 0);
  }

  public getDndModifier(): number {
    return Math.floor((this.value_without_bumps - 10) / 2);
  }

  public getDndModifierString(): string {
    const modifier = this.getDndModifier();
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  public resetBumps(): void {
    this.isBumpedOne = false;
    this.isBumpedTwo = false;
    this.updateValueWithBumps();
    this.emitValueChange(this.value_with_bumps);
  }
}
