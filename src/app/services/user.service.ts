import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { IUser } from '../interfaces/iuser';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private collectionName = "users";

  private UserList$ = this.firebaseService.UserList$;
  private userList: IUser[] = [];

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { 
    this.UserList$.subscribe(users => {
      this.userList = users; 
    });
  }

  // returns the User Using this site
  getCurrentUser() {
    return this.userList.find(user => user.name === this.authService.currentUserName);
  }

  // get List of all available users
  getUserList() {
    return this.UserList$; 
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
}
