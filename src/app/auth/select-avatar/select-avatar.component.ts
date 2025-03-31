import { Component, Input } from '@angular/core';
import { AvatarPictureService } from '../../services/avatar-picture.service';
import { IUser } from '../../interfaces/iuser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  @Input() userToRegister = {
    name: "",
    email: "",
    password: "",
  };
  availablePictures: string[] = [];
  choosenPicture: string = "";

  constructor(private avatarService: AvatarPictureService, private authService: AuthService) {}

  ngOnInit() {
    this.availablePictures = this.avatarService.avatarPictures;
  }

  changeAvatarPicture(index : number) {
    this.choosenPicture = this.availablePictures[index];
  }

  finishRegister() {
    this.authService.registerUserWithEmailAndPassword(this.userToRegister?.name, this.userToRegister?.email, this.userToRegister.password, this.choosenPicture);
  }
}
