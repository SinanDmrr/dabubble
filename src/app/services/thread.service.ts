import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/ichannels';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  private threadMessageSubject = new BehaviorSubject<IMessage>({
    writer: "",
    message: "",
    answer: [],
    time: {
      hour: 0,
      minute: 0,
      day: 0,
      month: 0,
      year: 0,
      dayName: "",
      fullDate: ""
    },
    emojis: []
  });
  threadMessage$ = this.threadMessageSubject.asObservable();

  private showThreadSubject = new BehaviorSubject<Boolean>(false);
  showThread$ = this.showThreadSubject.asObservable();

  constructor() { }

  getShowThreadStatus(){
    return this.showThread$;
  }

  toogleThread() {
    this.showThreadSubject.next(!this.showThread$);
  }

  setThreadMessage(message: IMessage) {
    this.threadMessageSubject.next(message);
  }
}
