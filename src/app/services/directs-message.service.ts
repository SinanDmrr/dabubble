import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { IDirectMessage } from "../interfaces/idirect-message";
import { BehaviorSubject } from "rxjs";
import { IMessage } from "../interfaces/idirect-message";

@Injectable({
  providedIn: "root",
})
export class DirectsMessageService {
  private collectionName = "directMessages";
  private dMBetweenTwoSubject = new BehaviorSubject<IDirectMessage[]>([]);
  public dMBetweenTwo$ = this.dMBetweenTwoSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.directMessageList$.subscribe((messages) => {
      this.dMBetweenTwoSubject.next(messages);
    });
  }

  getDirectMessages() {
    return this.firebaseService.directMessageList$;
  }

  setDirectMessageBetweenTwo(messages: IDirectMessage[]) {
    this.dMBetweenTwoSubject.next(messages);
  }

  async addDirectMessages(item: IDirectMessage) {
    await this.firebaseService.addToDatabase(this.collectionName, item);
  }

  async addMessageToConversation(id: string, message: IMessage) {
    await this.firebaseService.updateDocument(this.collectionName, id, {
      messages: [
        ...(this.dMBetweenTwoSubject.value.find((dm) => dm.id === id)
          ?.messages || []),
        message,
      ],
    });
  }

  async updateDirectMessages(id: string, item: IDirectMessage) {
    await this.firebaseService.updateDocument(this.collectionName, id, item);
  }

  async deleteDirectMessages(id: string) {
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }
}
