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

    console.log('Toggling: Bump 1:', this.isBumpedOne, 'Bump 2:', this.isBumpedTwo);
    if (type === 'one') {
      valueChange = this.isBumpedOne ? 1 : -1;
    } else if (type === 'two') {
      valueChange = this.isBumpedTwo ? 2 : -2;
    }
    console.log('Toggling2: Bump 1:', this.isBumpedOne, 'Bump 2:', this.isBumpedTwo);
    this.emitValueChange(this.value + valueChange);
  }

  private emitValueChange(newValue: number) {
    let bumpType: BumpType = null;
    console.log('New Value:', newValue, 'Min:', this.min, 'Max:', this.max, this.isBumpedTwo, this.isBumpedOne);
    if (this.isBumpedTwo) {
      bumpType = 'two';
    } else if (this.isBumpedOne) {
      bumpType = 'one';
    }
    this.valueChanged.emit({key: this.statKey, value: newValue, is_bumped: bumpType});
  }

  private clampValue(value: number): number {
    console.log('Clamping value:', value, 'Min:', this.min, 'Max:', this.max, "bumpValue", this.getBumpValue());
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

  // New method to calculate D&D modifier
  public getDndModifier(): number {
    const baseValue = this.get_value_without_bump();
    return Math.floor((baseValue - 10) / 2);
  }

  // New method to get the formatted D&D modifier string
  public getDndModifierString(): string {
    const modifier = this.getDndModifier();
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  public resetBumps(): void {
    console.log('Resetting bumps');
    this.isBumpedOne = false;
    this.isBumpedTwo = false
  }
}
