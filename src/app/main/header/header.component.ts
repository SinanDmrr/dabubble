import { Component, HostListener } from '@angular/core';
import { IChannels } from '../../interfaces/ichannels';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './profile/userprofile.component';
import { FilterMessagesService } from '../../services/filter-messages.service';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, UserProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser?: IUser;
  isDevSpaceVisible: boolean = false;
  screenWidth = window.innerWidth;
  searchQuery = "";
  isProfilePopupOpen: boolean = false;
  showThread: boolean = false;

  constructor(private userService: UserService, private filterMessageService: FilterMessagesService, private channelService: ChannelsService, private threadService: ThreadService) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.channelService.getIsDevSpaceVisible().subscribe(isDevSpaceVisible => {
      this.isDevSpaceVisible = isDevSpaceVisible;
    })
    this.threadService.getShowThreadStatus().subscribe((status) => {
      this.showThread = status;
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

  backToDevSpace() {
    if(this.showThread){
      this.threadService.hideThreadComponent();
    }
    this.channelService.setIsDevSpaceVisible(true);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer && !profileContainer.contains(event.target as Node)) {
      this.closeProfilePopup();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.screenWidth = (event.target as Window).innerWidth;
  }
}
