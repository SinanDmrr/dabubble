import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { IUser } from '../interfaces/iuser';
import { AuthService } from './auth.service';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserMail = '';
  private collectionName = 'users';
  userToRegister = {
    name: '',
    email: '',
    password: '',
  };

  private clickedDirectChatUser = new BehaviorSubject<IUser | undefined>(
    undefined,
  );
  clickedDirectChatUser$ = this.clickedDirectChatUser.asObservable();

  constructor(private firebaseService: FirebaseService) {}

  // returns the User Using this site
  getCurrentUser(): Observable<IUser | undefined> {
    return this.firebaseService.UserList$.pipe(
      map((users) => users.find((user) => user.email === this.currentUserMail)),
    );
  }

  // returns the clicked User of direct Message
  getClickedDirectChatUser(): Observable<IUser | undefined> {
    return this.clickedDirectChatUser$;
  }

  // set the clicked User of direct Message
  setClickedDirectChatUser(user: IUser) {
    this.clickedDirectChatUser.next(user);
  }

  changeCurrentUserMail(mail: string) {
    this.currentUserMail = mail;
  }

  // get List of all available users
  getUserList() {
    return this.firebaseService.UserList$;
  }

  async addUser(item: IUser) {
    await this.firebaseService.addToDatabase(this.collectionName, item);
  }

  async updateUser(id: string, item: IUser) {
    await this.firebaseService.updateDocument(this.collectionName, id, item);
  }

  async deleteUser(id: string) {
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }

  async checkIfUserExists(email: string) {
    return await this.firebaseService.checkIfUserExists(email);
  }

  setUserToRegister(name: string, email: string, password: string) {
    this.userToRegister.name = name;
    this.userToRegister.email = email;
    this.userToRegister.password = password;
  }

  getUserToRegister() {
    return this.userToRegister;
  }
}
