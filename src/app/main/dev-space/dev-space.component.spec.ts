import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevSpaceComponent } from './dev-space.component';

describe('DevSpaceComponent', () => {
  let component: DevSpaceComponent;
  let fixture: ComponentFixture<DevSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
