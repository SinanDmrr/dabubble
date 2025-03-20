import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces/iuser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Output() closePopup = new EventEmitter<void>();
  currentProfileView = "startView";
  currentUser? : IUser;
  newUsername : string = "";

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
      
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

  cancelChangeUsername(){

  }

  changeUsername() {
    
  }
}
