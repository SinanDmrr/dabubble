import { TestBed } from '@angular/core/testing';

import { ChannelsServiceService } from './channels-service.service';

describe('ChannelsServiceService', () => {
  let service: ChannelsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
