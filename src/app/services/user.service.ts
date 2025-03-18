import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private collectionName = "users";

  constructor(private firebaseService: FirebaseService) { }

  getChannels() {
    return this.firebaseService.channelList$;
  }

  async addChannel(item: IUser) {
    await this.firebaseService.addToDatabase(this.collectionName, item);
  }

  async updateChannel(id: string, item: IUser) {
    await this.firebaseService.updateDocument(this.collectionName, id, item);
  }

  async deleteChannel(id: string) {
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }
}
