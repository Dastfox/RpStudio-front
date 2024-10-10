import { TestBed } from '@angular/core/testing';

import { DndPointBuyService } from './dnd-point-buy.service';

describe('DndPointBuyService', () => {
  let service: DndPointBuyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DndPointBuyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
