import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {

    private activeLiIdSubject = new BehaviorSubject<string | undefined>("");
    activeLiId$ = this.activeLiIdSubject.asObservable();

  constructor() { }

  setActiveLi(id: string | undefined){
    this.activeLiIdSubject.next(id);
  }

  getActiveLi(){
    return this.activeLiId$;
  }
}
