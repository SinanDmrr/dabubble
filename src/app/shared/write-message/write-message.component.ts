import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelsService } from '../../services/channels.service';
import { IChannels } from '../../interfaces/ichannels';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { Router } from '@angular/router';
import { user } from '@angular/fire/auth';
import { ActiveService } from '../../services/active.service';

@Component({
  selector: 'app-write-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './write-message.component.html',
  styleUrl: './write-message.component.scss'
})
export class WriteMessageComponent {
  exampleUsers = ["Frederik Beck (Du)", "Sofia Müller", "Noah Braun", "Elise Roth", "Elias Neumann", "Steffen Hoffmann"];
  exampleChannels = ["Allgemein", "Entwickler-Team", "Office-Team"];
  emojis = ['😊', '😂', '❤️', '👍', '🎉', '✨', '🌍', '🍕', '🌟', '🚀'];

  showUserList = false;
  showChannelList = false;
  showEmojiList = false;

  tagStringHash: string = "";
  tagStringAt: string = "";

  startListeningHash = false;
  startListeningAt = false;

  taggedStrings: string[] = [];

  message: string = "";
  @Output() messageSent = new EventEmitter<{ message: string, taggedStrings: string[] }>();
  @Input() messageTo: string = "";

  @ViewChild('textArea') textarea!: ElementRef<HTMLTextAreaElement>;

  currentChannel!: IChannels;
  channelsList: IChannels[] = [];

  userList: IUser[] = [];

  constructor(private channelService: ChannelsService, private userService: UserService, private router: Router, private activeService: ActiveService) {
    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });

    this.channelService.getChannels().subscribe((channelList) => {
      this.channelsList = channelList;
    })

    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList;
    })
  }

  ngAfterViewInit() {
    this.textarea.nativeElement.focus();
  }

  openTagList(listToOpen: string) {
    if (listToOpen == "channel") {
      this.showChannelList = true;
    } else if (listToOpen == "user") {
      this.showUserList = true;
    }
  }

  openEmojiList() {
    this.showEmojiList = true;
  }

  closeTagList() {
    this.showUserList = false;
    this.showChannelList = false;
  }

  closeEmojiList() {
    this.showEmojiList = false;
  }

  addEmoji(emoji: string) {
    this.message += emoji + ' ';
    this.textarea.nativeElement.focus();
    this.closeEmojiList();
  }

  tagUser(userToTag: string) {
    if (this.getLengthOfMessageBeforeAtSign(this.message) > 0) {
      if (this.message[this.message.length - 1] == '@') {
        this.message = this.message + userToTag;
      } else if (this.tagStringAt) {
        this.message = this.message.replace('@' + this.tagStringAt, '') + '@' + userToTag;
      } else {
        this.message = this.message + '@' + userToTag;
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

  getLengthOfMessageBeforeAtSign(message: string) {
    let position = message.indexOf('@');
    let cleanedText;
    if (position == -1){
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

  tagChannel(channelToTag: string) {
    if (this.message[this.message.length - 1] == '#') {
      this.message = this.message + channelToTag;
    } else if (this.tagStringHash) {
      this.message = this.message.replace('#' + this.tagStringHash, '') + '#' + channelToTag;
    } else {
      this.message = this.message + '#' + channelToTag;
    }
    this.channelService.setCurrentChannel(this.getChannelFromName(channelToTag)!);
    this.router.navigate(["/main"]);
    this.activeService.setActiveLi(this.getChannelFromName(channelToTag)?.id);
    this.tagStringHash = "";
    this.startListeningHash = false;
    this.closeTagList()
  }

  getChannelFromName(channelName: string) {
    let userObj = this.channelsList.find(channel => channel.name == channelName);
    return userObj;
  }

  sendMessage() {
    if (this.message.trim()) {
      this.messageSent.emit({ message: this.message, taggedStrings: this.taggedStrings });
      this.message = '';
    }
  }

  checkForAt(event: KeyboardEvent) {
    if (event.key === '@') {
      this.tagStringAt = "";
      this.showUserList = true;
      this.startListeningAt = true;
      this.checkIfUserListIncludesTagString(event);
      this.openTagList("user");
    } else if (event.key == "Backspace") {
      this.tagStringAt = this.tagStringAt.slice(0, -1);
    }
    this.checkIfListeningAt(event);
  }

  checkForHash(event: KeyboardEvent) {
    if (event.key === '#') {
      this.tagStringHash = "";
      this.showChannelList = true;
      this.startListeningHash = true;
      this.checkIfChannelListIncludesTagString(event);
      this.openTagList("channel");
    } else if (event.key == "Backspace") {
      this.tagStringHash = this.tagStringHash.slice(0, -1);
    }
    this.checkIfListeningHash(event);
  }


  checkIfListeningAt(event: KeyboardEvent) {
    if (this.startListeningAt || this.showUserList) {
      this.openTagList('user');
      this.checkIfUserListIncludesTagString(event);
    }
  }

  checkIfListeningHash(event: KeyboardEvent) {
    if (this.startListeningHash || this.showChannelList) {
      this.openTagList('channel');
      this.checkIfChannelListIncludesTagString(event);
    }
  }

  checkBackspace(event: KeyboardEvent) {
    if (event.key == 'Backspace') {
      if (this.message[this.message.length - 1] == '@') {
        this.stopListening();
      } else if (this.message[this.message.length - 1] == '#') {
        this.stopListening();
      };
    }
  }

  stopListening() {
    this.closeTagList();
    this.startListeningAt = false;
    this.startListeningHash = false;
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

  filterUserList(filterString: string) {
    let filteredUserList = this.currentChannel.users.filter(user => user.toLowerCase().includes(filterString.toLowerCase()));
    return filteredUserList;
  }

  filterChannelList(filterString: string) {
    let filteredChannelList = this.channelsList.filter(channel => channel.name.toLowerCase().includes(filterString.toLowerCase()));
    return filteredChannelList;
  }

  getFilteredUserList(): string[] {
    return this.filterUserList(this.tagStringAt);
  }

  getFilteredChannelList(): IChannels[] {
    return this.filterChannelList(this.tagStringHash);
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
