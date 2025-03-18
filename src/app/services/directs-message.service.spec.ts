import { TestBed } from '@angular/core/testing';

import { DirectsMessageService } from './directs-message.service';

describe('DirectsMessageService', () => {
  let service: DirectsMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectsMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
