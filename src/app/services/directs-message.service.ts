import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { IDirectMessage } from '../interfaces/idirect-message';

@Injectable({
  providedIn: 'root'
})
export class DirectsMessageService {

  private collectionName = "directMessages";

  constructor(private firebaseService: FirebaseService) { }

  getDirectMessages() {
    return this.firebaseService.directMessageList$;
  }

  async addDirectMessages(item: IDirectMessage) {
    await this.firebaseService.addToDatabase(this.collectionName, item);
  }

  async updateDirectMessages(id: string, item: IDirectMessage) {
    await this.firebaseService.updateDocument(this.collectionName, id, item);
  }

  async deleteDirectMessages(id: string) {
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }
}
