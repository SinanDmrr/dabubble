import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterMessagesService {

  private filterSubject = new BehaviorSubject<string>("");
  wordToFilter$ = this.filterSubject.asObservable();

  constructor() { }

  setfilterSubject(filterWord : string) {
    this.filterSubject.next(filterWord);
    
  }

  getfilterSubject() {
    return this.wordToFilter$;
  }
}
