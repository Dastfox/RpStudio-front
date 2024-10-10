import {Component, Input, Output, EventEmitter, numberAttribute} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { CharacterStats } from '../../models/character.model';

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
  @Input() value!: number;
  @Input() isEditable: boolean = true;
  @Input() canBeBumpedByOne: boolean = false;
  @Input() canBeBumpedByTwo: boolean = false;
  @Input() isFocusedImprovement: boolean = false;
  @Input({transform: numberAttribute}) min?: number;
  @Input({transform: numberAttribute}) max?: number;
  @Output() valueChanged = new EventEmitter<{ key: StatKey, value: number, is_bumped: BumpType }>();

  errorMessage: string = '';
  isBumpedOne: boolean = false;
  isBumpedTwo: boolean = false;

  onValueChange(newValue: number) {
    if (isNaN(newValue)) {
      this.errorMessage = 'Please enter a valid number';
    } else {
      this.errorMessage = '';
      console.log('New value:', newValue, 'Min:', this.min, 'Max:', this.max);
      this.emitValueChange(this.clampValue(newValue));
    }
  }

  incrementValue() {
    if (this.canIncrement()) {
      this.emitValueChange(this.value + 1);
    }
  }

  decrementValue() {
    if (this.canDecrement()) {
      this.emitValueChange(this.value - 1);
    }
  }

  toggleBump(type: BumpType) {
    let valueChange = 0;
    if (type === 'one') {
      valueChange = this.isBumpedOne ? -1 : 1;
      this.isBumpedOne = !this.isBumpedOne;
    } else if (type === 'two') {
      valueChange = this.isBumpedTwo ? -2 : 2;
      this.isBumpedTwo = !this.isBumpedTwo;
    }
    console.log('Toggling: Bump 1:', this.isBumpedOne, 'Bump 2:', this.isBumpedTwo);
    this.emitValueChange(this.value + valueChange);
  }

  private emitValueChange(newValue: number) {
    let bumpType: BumpType = null;
    if (this.isBumpedTwo) {
      bumpType = 'two';
    } else if (this.isBumpedOne) {
      bumpType = 'one';
    }
    console.log('Final value:', newValue, 'Bump type:', bumpType);
    this.valueChanged.emit({key: this.statKey, value: newValue, is_bumped: bumpType});
  }

  private clampValue(value: number): number {
    const bumpValue = this.getBumpValue();
    if (this.min !== undefined && value < this.min - bumpValue) {
      return this.min - bumpValue;
    }
    if (this.max !== undefined && value > this.max + bumpValue) {
      return this.max + bumpValue;
    }
    return value;
  }

  canIncrement(): boolean {
    const bumpValue = this.getBumpValue();
    return this.max === undefined || this.value < this.max + bumpValue;
  }

  canDecrement(): boolean {
    const bumpValue = this.getBumpValue();
    return this.min === undefined || this.value > this.min + bumpValue;
  }

  public get_value_without_bump(): number {
    return this.value - this.getBumpValue();
  }

  private getBumpValue(): number {
    return (this.isBumpedTwo ? 2 : 0) + (this.isBumpedOne ? 1 : 0);
  }
}
