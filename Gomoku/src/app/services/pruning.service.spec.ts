import { TestBed } from '@angular/core/testing';

import { PruningService } from './pruning.service';

describe('PruningService', () => {
  let service: PruningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PruningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
