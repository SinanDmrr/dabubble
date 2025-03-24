import { Component, HostListener } from '@angular/core';
import { IChannels } from '../../interfaces/ichannels';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './profile/userprofile.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, UserProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser?: IUser;
  searchQuery = "";
  isProfilePopupOpen : boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        console.log(this.currentUser);
    });
  }
  openProfilePopup(event: Event) {
    event.stopPropagation();
    this.isProfilePopupOpen = true;
  }

  closeProfilePopup() {
    this.isProfilePopupOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer && !profileContainer.contains(event.target as Node)) {
      this.closeProfilePopup();
    }
  }
}
