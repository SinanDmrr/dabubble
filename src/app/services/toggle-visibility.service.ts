import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleVisibilityService {
  private toggleVisibility = new BehaviorSubject<boolean>(true);
  toggle$ = this.toggleVisibility.asObservable();

  setToggle(value: boolean) {
    this.toggleVisibility.next(value);
    
  }

  constructor() { }
}
