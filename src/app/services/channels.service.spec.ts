import { TestBed } from '@angular/core/testing';
import { ChannelsService } from './channels.service';


describe('ChannelsServiceService', () => {
  let service: ChannelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
