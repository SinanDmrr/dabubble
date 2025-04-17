import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { IDirectMessage } from "../interfaces/idirect-message";
import { BehaviorSubject } from "rxjs";
import { IMessage } from "../interfaces/idirect-message";
import { DocumentReference } from "@angular/fire/firestore";

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

  // setDirectMessageBetweenTwo(messages: IDirectMessage[]) {
  //   this.dMBetweenTwoSubject.next(messages);
  // }
  setDirectMessageBetweenTwo(senderId: string, receiverId: string) {
    this.firebaseService.directMessageList$.subscribe((messages) => {
      const filteredMessages = messages.filter(
        (dm) =>
          (dm.sender === senderId && dm.receiver === receiverId) ||
          (dm.sender === receiverId && dm.receiver === senderId),
      );
      this.dMBetweenTwoSubject.next(filteredMessages);
    });
  }

  async addDirectMessages(item: IDirectMessage) {
    await this.firebaseService.addToDatabase(this.collectionName, item);
  }

  // async addMessageToConversation(id: string, message: IMessage) {
  //   await this.firebaseService.updateDocument(this.collectionName, id, {
  //     messages: [
  //       ...(this.dMBetweenTwoSubject.value.find((dm) => dm.id === id)
  //         ?.messages || []),
  //       message,
  //     ],
  //   });
  // }
  async addMessageToConversation(id: string, message: IMessage) {
    const directMessage = this.dMBetweenTwoSubject.value.find(
      (dm) => dm.id === id,
    );
    if (directMessage) {
      await this.firebaseService.updateDocument(this.collectionName, id, {
        messages: [...directMessage.messages, message],
      });
    }
  }

  async updateDirectMessages(id: string, item: IDirectMessage) {
    await this.firebaseService.updateDocument(this.collectionName, id, item);
  }

  async deleteDirectMessages(id: string) {
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }
}
