import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { IChannels } from '../interfaces/ichannels';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  private collectionName = "channels";

  private isDevSpaceVisible =  new BehaviorSubject<boolean>(true);
  devSpaceVisibility$ = this.isDevSpaceVisible.asObservable();

  private currentChannelSubject = new BehaviorSubject<IChannels>({
      creator: "",
      description: "",
      messages: [],
      name: "",
      users: []
    });
    currentChannel$ = this.currentChannelSubject.asObservable();

  constructor(private firebaseService: FirebaseService) { }

  setCurrentChannel(channel: IChannels) {
    this.currentChannelSubject.next(channel);
  }

  getCurrentChannel() {
    return this.currentChannel$;
  }

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

  setIsDevSpaceVisible(isVisible: boolean) {
    this.isDevSpaceVisible.next(isVisible)
  }

  getIsDevSpaceVisible() {
    return this.devSpaceVisibility$;
  }
}
