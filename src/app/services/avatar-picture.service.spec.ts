import { TestBed } from '@angular/core/testing';

import { AvatarPictureService } from './avatar-picture.service';

describe('AvatarPictureService', () => {
  let service: AvatarPictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarPictureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
