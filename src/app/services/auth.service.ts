import { Injectable, Injector } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();

  provider = new GoogleAuthProvider();

  currentUserMail: string = "";

  constructor(private auth: Auth, private userService: UserService) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    // onAuthStateChanged(this.auth, (user) => {
    //   if (user) {
    //     this.authSubject.next(true);
    //   } else {
    //     this.authSubject.next(false);
    //   }
    // })
  }

  async registerUserWithEmailAndPassword(name: string, email: string, password: string, avatar: string) {

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        this.createNewUser(name, email, avatar);
      }
    } catch (error) {
      console.error('Registration Error', error);
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        this.authSubject.next(true);
        this.userService.changeCurrentUserMail(userCredential.user.email as string);
      }
    } catch (error) {
      console.error('login Error', error);
    }
  }

  async forceLogin() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      if (userCredential.user) {
        this.authSubject.next(true);
        this.userService.changeCurrentUserMail("guest@mail.com");
      }
    } catch (error) {
      console.error('Guest login Error', error);
    }
  }

  async loginWithGoogleAccount() {
    try {
      const userCredential = await signInWithPopup(this.auth, this.provider);
      if (userCredential.user) {
        const userData = userCredential.user;

        this.authSubject.next(true);

        const userExists = await this.userService.checkIfUserExists(userData.email as string);

      if (!userExists) {
        this.createNewUser(userData.displayName as string, userData.email as string, "assets/avatars/avatar_1.png");
      } 

        this.userService.changeCurrentUserMail(userData.email as string);
      }
    } catch (error) {
      console.error('Google login Error', error);
    }
  }

  createNewUser(name: string, email: string, avatar: string) {
    let newUser: IUser = {
      email: email,
      name: name,
      picture: avatar,
      onlineStatus: true,
    }
    this.userService.addUser(newUser);
  }
}
