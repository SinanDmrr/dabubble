import { Component, HostListener } from '@angular/core';
import { IChannels } from '../../interfaces/ichannels';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './profile/userprofile.component';
import { FilterMessagesService } from '../../services/filter-messages.service';

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

  constructor(private userService: UserService, private filterMessageService: FilterMessagesService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
    });
  }

  changeFilterWord() {
    this.filterMessageService.setfilterSubject(this.searchQuery);
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
