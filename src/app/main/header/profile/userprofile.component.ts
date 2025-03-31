import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces/iuser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarPictureService } from '../../../services/avatar-picture.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss'
})
export class UserProfileComponent {
  @Output() closePopup = new EventEmitter<void>();
  currentProfileView = "startView";
  currentPictureIndex = 0;
  currentPicture = ""
  currentUser?: IUser;
  newUsername: string = "";

  availablePictures : string[] = []

  constructor(private authService: AuthService, private userService: UserService, private avatarService: AvatarPictureService) { }

  ngOnInit() {
    this.availablePictures = this.avatarService.avatarPictures;
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.newUsername = this.currentUser!.name;
      this.getCurrentPictureIndex();
    })
    
  }

  closeMe() {
    this.closePopup.emit();
  }

  changeView(view: string) {
    this.currentProfileView = view;
  }

  logout() {
    this.authService.logout();
  }

  getCurrentPictureIndex() {
    this.availablePictures.forEach((element, index) => {
      if (element == this.currentUser?.picture) {
        this.currentPictureIndex = index;
        this.currentPicture = element;
      }
    });
  }

  previousPicture() {
    this.currentPictureIndex = this.currentPictureIndex - 1 < 0 ? this.availablePictures.length - 1 : this.currentPictureIndex - 1;
    this.currentPicture = this.availablePictures[this.currentPictureIndex];
  }

  nextPicture() {
    this.currentPictureIndex = this.currentPictureIndex + 1 == this.availablePictures.length ? 0 : this.currentPictureIndex + 1;
    this.currentPicture = this.availablePictures[this.currentPictureIndex];
  }

  acceptChanges() {
    this.currentUser!.name = this.newUsername;
    this.currentUser!.picture = this.currentPicture;

    this.userService.updateUser(this.currentUser!.id as string, this.currentUser!)
    this.currentProfileView = "editView";
  }
}
