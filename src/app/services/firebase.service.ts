import { inject, Injectable } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { IChannels } from '../interfaces/ichannels';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private channelListSubject = new BehaviorSubject<IChannels[]>([]);
  channelList$ = this.channelListSubject.asObservable();
  constructor() { 
    this.subContactList();
  }

  subContactList() {
    onSnapshot(this.getColRef("channels"), (snapshot) => {
      const channels: IChannels[] = [];
      snapshot.forEach((doc) => {
        channels.push(this.setChannelData(doc.data(), doc.id));
      });
      this.channelListSubject.next(channels); // Daten an das Observable senden
    });
  }
  getColRef(colId: string) {
    return collection(this.firestore, colId);
  }

  setChannelData(obj: any, id: string): IChannels {
    return {
          creator: obj.creator,
          description: obj.description,
          id: id,
          messages: obj.messages,
          name: obj.name,
          users: obj.users,
    };
  }

  async addToDatabase(colId: string, item: IChannels) {
      try {
        await addDoc(this.getColRef(colId), item);
      }
      catch(error) {
        console.error('Error adding document', error);
      }
  }

  async updateDocument(colId: string, docId: string, updatedData: Partial<IChannels>) {
    try {
      await updateDoc(this.getSingleDocRef(colId, docId), updatedData);
    }
    catch(error) {
      console.error('Error updating document', error);
    }
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(this.getColRef(colId), docId);
  }
}
