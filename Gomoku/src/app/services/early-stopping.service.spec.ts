import { TestBed } from '@angular/core/testing';

import { EarlyStoppingService } from './early-stopping.service';

describe('EarlyStoppingService', () => {
  let service: EarlyStoppingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarlyStoppingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
