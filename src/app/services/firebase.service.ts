import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { IChannels } from '../interfaces/ichannels';
import { BehaviorSubject } from 'rxjs';
import { IDirectMessage } from '../interfaces/idirect-message';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);

  private channelListSubject = new BehaviorSubject<IChannels[]>([]);
  channelList$ = this.channelListSubject.asObservable();

  private directMessageListSubject = new BehaviorSubject<IDirectMessage[]>([]);
  directMessageList$ = this.directMessageListSubject.asObservable();

  private UserListSubject = new BehaviorSubject<IUser[]>([]);
  UserList$ = this.UserListSubject.asObservable();

  constructor() {
    this.subContactList();
    this.subDirectMessageList();
    this.subUserList();
  }

  subContactList() {
    onSnapshot(this.getColRef('channels'), (snapshot) => {
      const channels: IChannels[] = [];
      snapshot.forEach((doc) => {
        channels.push(this.setChannelData(doc.data(), doc.id));
      });
      this.channelListSubject.next(channels); // Daten an das Observable senden
    });
  }

  subDirectMessageList() {
    onSnapshot(this.getColRef('directMessages'), (snapshot) => {
      const directMessages: IDirectMessage[] = [];
      snapshot.forEach((doc) => {
        directMessages.push(this.setDirectMessageData(doc.data(), doc.id));
      });
      this.directMessageListSubject.next(directMessages); // Daten an das Observable senden
    });
  }

  subUserList() {
    onSnapshot(this.getColRef('users'), (snapshot) => {
      const users: IUser[] = [];
      snapshot.forEach((doc) => {
        users.push(this.setUserData(doc.data(), doc.id));
      });
      this.UserListSubject.next(users); // Daten an das Observable senden
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

  setDirectMessageData(obj: any, id: string): IDirectMessage {
    return {
      sender: obj.sender,
      receiver: obj.receiver,
      messages: obj.messages,
      id: id,
    };
  }

  setUserData(obj: any, id: string): IUser {
    return {
      email: obj.email,
      name: obj.name,
      picture: obj.picture,
      onlineStatus: obj.onlineStatus,
      id: id,
    };
  }

  async addToDatabase(colId: string, item: IChannels | IDirectMessage | IUser) {
    console.log('adding Data: ', item);

    try {
      await addDoc(this.getColRef(colId), item);
    } catch (error) {
      console.error('Error adding document', error);
    }
  }

  async updateDocument(
    colId: string,
    docId: string,
    updatedData: Partial<IChannels | IDirectMessage | IUser>,
  ) {
    try {
      await updateDoc(this.getSingleDocRef(colId, docId), updatedData);
    } catch (error) {
      console.error('Error updating document', error);
    }
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(this.getColRef(colId), docId);
  }

  async deleteDocument(colId: string, docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(colId, docId));
    } catch (error) {
      console.error('Error deleting document', error);
    }
  }

  // bitte nicht nachfragen was diese funktion tut, ich hab ka
  async checkIfUserExists(email: string): Promise<boolean> {
    const userQuery = query(
      this.getColRef('users'),
      where('email', '==', email),
    );
    const querySnapshot = await getDocs(userQuery);

    return !querySnapshot.empty;
  }

  ngOnDestroy() {
    this.subContactList();
    this.subDirectMessageList();
    this.subUserList();
  }
}
