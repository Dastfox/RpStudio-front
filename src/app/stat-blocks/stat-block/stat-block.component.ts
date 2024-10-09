import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import { CharacterStats } from '../../models/character.model';

type StatKey = keyof CharacterStats;

@Component({
  selector: 'app-stat-block',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './stat-block.component.html',
  styleUrls: ['./stat-block.component.scss']
  // template: `
  //   <div class="stat-block">
  //     <label [attr.for]="statKey">{{ statKey | titlecase }}</label>
  //     <input
  //       [id]="statKey"
  //       type="number"
  //       [(ngModel)]="value"
  //       (ngModelChange)="onValueChange($event)"
  //     >
  //     @if (errorMessage) {
  //       <span class="error">{{ errorMessage }}</span>
  //     }
  //   </div>
  // `,
})
export class StatBlockComponent {
  @Input() statKey!: StatKey;
  @Input() value!: number;
  @Output() valueChanged = new EventEmitter<{ key: StatKey, value: number }>();

  errorMessage: string = '';

  onValueChange(newValue: number) {
    if (isNaN(newValue)) {
      this.errorMessage = 'Please enter a valid number';
    } else {
      this.errorMessage = '';
      this.valueChanged.emit({ key: this.statKey, value: newValue });
    }
  }
}
