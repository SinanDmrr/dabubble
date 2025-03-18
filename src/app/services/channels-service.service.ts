import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { IChannels } from '../interfaces/ichannels';

@Injectable({
  providedIn: 'root'
})
export class ChannelsServiceService {
  private collectionName = "channels";

  constructor(private firebaseService: FirebaseService) { }

  getChannels() {
    return this.firebaseService.channelList$;
  }

  async addChannel(item: IChannels){
    await this.firebaseService.addToDatabase(this.collectionName, item);
  }

  async updateChannel(id: string, item: IChannels){
    await this.firebaseService.updateDocument(this.collectionName, id, item);
  }

  async deleteChannel(id: string){
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }
}
