import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements OnDestroy {
  private logSubscription: Subscription | null = null;
  private variableToLog$ = new BehaviorSubject<any>(null);

  constructor() { }

  startLogging(getVariable: () => any): void {
    if (this.logSubscription) {
      console.warn('Logging is already active');
      return;
    }

    this.logSubscription = interval(1000).subscribe(
      () => {
        const currentValue = getVariable();
        this.variableToLog$.next(currentValue);
        console.log(`Logged variable: ${currentValue}`);
      }
    );
  }

  stopLogging(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
      this.logSubscription = null;
      console.log('Logging stopped');
    }
  }

  ngOnDestroy(): void {
    this.stopLogging();
  }

  getLoggedVariable() {
    return this.variableToLog$.asObservable();
  }
}
