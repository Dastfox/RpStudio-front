import { TestBed } from '@angular/core/testing';

// @ts-ignore
import { DndService } from './dnd.service';

describe('DndService', () => {
  let service: DndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
