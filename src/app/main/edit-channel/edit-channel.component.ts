import { Component, ElementRef, ViewChild } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { FormsModule } from '@angular/forms';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ActiveService } from '../../services/active.service';
import { IChannels } from '../../interfaces/ichannels';
import { IUser } from '../../interfaces/iuser';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [WriteMessageComponent, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchText: string = "";
  showUserList = false;
  showChannelList = false;
  showMailList = false;

  tagStringHash: string = "";
  tagStringAt: string = "";

  startListeningHash = false;
  startListeningAt = false;

  taggedStrings: string[] = [];

  currentChannel!: IChannels;
  channelsList: IChannels[] = [];
  userList: IUser[] = [];

  constructor(
    private channelService: ChannelsService,
    private userService: UserService,
    private router: Router,
    private activeService: ActiveService
  ) {
    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });

    this.channelService.getChannels().subscribe((channelList) => {
      this.channelsList = channelList;
    });

    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList;
    });
  }

  closeTagList() {
    this.showUserList = false;
    this.showChannelList = false;
  }

  checkForAt(event: KeyboardEvent) {
    if (event.key === '@') {
      this.tagStringAt = "";
      this.showUserList = true;
      this.startListeningAt = true;
      this.checkIfUserListIncludesTagString(event);
    } else if (event.key == "Backspace") {
      this.tagStringAt = this.tagStringAt.slice(0, -1);
    }
    this.checkIfListeningAt(event);
  }

  checkForMail(event: KeyboardEvent) {
    if (this.searchText === "") {
      this.showMailList = false;
      this.showChannelList = false;
      this.showUserList = false;
    } else if (this.searchText !== "@" && this.searchText !== "#" && event.key !== "@" && event.key !== "#") {
      this.showMailList = true;
    } else {
      this.showMailList = false;
    }
  }

  checkForHash(event: KeyboardEvent) {
    if (event.key === '#') {
      this.tagStringHash = "";
      this.showChannelList = true;
      this.startListeningHash = true;
      this.checkIfChannelListIncludesTagString(event);
    } else if (event.key == "Backspace") {
      this.tagStringHash = this.tagStringHash.slice(0, -1);
    }
    this.checkIfListeningHash(event);
  }

  checkBackspace(event: KeyboardEvent) {

    if (event.key == 'Backspace') {
      if (this.searchText[this.searchText.length - 1] == '@') {
        this.stopListening();
      } else if (this.searchText[this.searchText.length - 1] == '#') {
        this.stopListening();
      }
    }


  }

  stopListening() {
    this.closeTagList();
    this.startListeningAt = false;
    this.startListeningHash = false;
  }

  checkIfListeningAt(event: KeyboardEvent) {
    if (this.startListeningAt || this.showUserList) {
      this.checkIfUserListIncludesTagString(event);
    }
  }

  checkIfListeningHash(event: KeyboardEvent) {
    if (this.startListeningHash || this.showChannelList) {
      this.checkIfChannelListIncludesTagString(event);
    }
  }

  checkIfUserListIncludesTagString(event: KeyboardEvent) {
    if (/^[a-zA-Z\s]$/.test(event.key)) {
      this.tagStringAt += event.key;
      if (this.filterUserList(this.tagStringAt).length < 1) {
        this.closeTagList();
      }
    }
  }

  checkIfChannelListIncludesTagString(event: KeyboardEvent) {
    if (/^[a-zA-Z\s]$/.test(event.key)) {
      this.tagStringHash += event.key;
      if (this.filterChannelList(this.tagStringHash).length < 1) {
        this.closeTagList();
      }
    }
  }

  tagUser(userToTag: string) {
    if (this.getLengthOfMessageBeforeAtSign(this.searchText) > 0) {
      if (this.searchText[this.searchText.length - 1] == '@') {
        this.searchText = this.searchText + userToTag;
      } else if (this.tagStringAt) {
        this.searchText = this.searchText.replace('@' + this.tagStringAt, '') + '@' + userToTag;
      } else {
        this.searchText = this.searchText + '@' + userToTag;
      }
      this.taggedStrings.push(userToTag);
    } else {
      this.userService.setClickedDirectChatUser(this.getUserFromName(userToTag)!);
      this.router.navigate(["/direct"]);
      this.activeService.setActiveLi(this.getUserFromName(userToTag)?.id)
    }

    this.tagStringAt = "";
    this.startListeningAt = false;
    this.closeTagList();
  }

  tagChannel(channelToTag: string) {
    if (this.searchText[this.searchText.length - 1] == '#') {
      this.searchText = this.searchText + channelToTag;
    } else if (this.tagStringHash) {
      this.searchText = this.searchText.replace('#' + this.tagStringHash, '') + '#' + channelToTag;
    } else {
      this.searchText = this.searchText + '#' + channelToTag;
    }
    this.channelService.setCurrentChannel(this.getChannelFromName(channelToTag)!);
    this.router.navigate(["/main"]);
    this.activeService.setActiveLi(this.getChannelFromName(channelToTag)?.id);
    this.tagStringHash = "";
    this.startListeningHash = false;
    this.closeTagList();
  }

  getLengthOfMessageBeforeAtSign(message: string) {
    let position = message.indexOf('@');
    let cleanedText;
    if (position == -1) {
      return -1;
    } else {
      cleanedText = message.slice(0, position).replace(/\s/g, '');
    }
    return cleanedText.length;
  }

  getUserFromName(userName: string) {
    let userObj = this.userList.find(user => user.name == userName);
    return userObj;
  }

  getUsernameFromMail(email: string): string {
    return this.userList.find((user) => user.email == email)!.name || this.userList[0].name;
  }

  getChannelFromName(channelName: string) {
    let userObj = this.channelsList.find(channel => channel.name == channelName);
    return userObj;
  }

  filterUserList(filterString: string) {
    return this.userList
      .map(user => user.name)
      .filter(name => name.toLowerCase().includes(filterString.toLowerCase()));
  }

  filterUserListEmail(filterString: string) {
    return this.userList
      .map(user => user.email)
      .filter(email => email.toLowerCase().includes(filterString.toLowerCase()));
  }

  filterChannelList(filterString: string) {
    return this.channelsList.filter(channel =>
      channel.name.toLowerCase().includes(filterString.toLowerCase())
    );
  }

  getFilteredUserList(): string[] {
    return this.filterUserList(this.tagStringAt);
  }

  getFilteredChannelList(): IChannels[] {
    return this.filterChannelList(this.tagStringHash);
  }

  getFilteredMailList(): string[] {
    return this.filterUserListEmail(this.searchText)
  }
}