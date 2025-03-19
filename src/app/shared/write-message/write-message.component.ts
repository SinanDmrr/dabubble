import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  showTagList = false;
  showUserList = false;
  showChannelList = false;
  showEmojiList = false;

  tagStringHash: string = "";
  tagStringAt: string = "";

  startListeningHash = false;
  startListeningAt = false;

  message: string = "";
  textArea: any;
  @Output() messageSent = new EventEmitter<string>();

  ngOnInit() {
    this.textArea = document.getElementById("textArea");
  }

  openTagList(listToOpen: string) {
    this.showTagList = true;
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
    this.showTagList = false;
    this.showUserList = false;
    this.showChannelList = false;
  }

  closeEmojiList() {
    this.showEmojiList = false;
  }

  addEmoji(emoji: string) {
    this.message += emoji + ' ';
    this.textArea?.focus();
    this.closeEmojiList();
  }

  tagUser(userToTag: string) {
    if (this.message[this.message.length - 1] == '@') {
      this.message = this.message + userToTag;
    } else if (this.tagStringAt) {
      this.message = this.message.replace('@' + this.tagStringAt, '') + '@' + userToTag;
    } else {
      this.message = this.message + '@' + userToTag;
    }
    this.tagStringAt = "";
    this.startListeningAt = false;
    this.closeTagList();
  }

  tagChannel(channelToTag: string) {
    if (this.message[this.message.length - 1] == '#') {
      this.message = this.message + channelToTag;
    } else if (this.tagStringHash) {
      this.message = this.message.replace('#' + this.tagStringHash, '') + '#' + channelToTag;
    } else {
      this.message = this.message + '#' + channelToTag;
    }
    this.tagStringHash = "";
    this.startListeningHash = false;
    this.closeTagList()
  }

  sendMessage() {
    if (this.message.trim()) {
      this.messageSent.emit(this.message);
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
    let filteredUserList = this.exampleUsers.filter(user => user.toLowerCase().includes(filterString.toLowerCase()));
    return filteredUserList;
  }

  filterChannelList(filterString: string) {
    let filteredChannelList = this.exampleChannels.filter(channel => channel.toLowerCase().includes(filterString.toLowerCase()));
    return filteredChannelList;
  }

  getFilteredUserList(): string[] {
    return this.filterUserList(this.tagStringAt);
  }

  getFilteredChannelList(): string[] {
    return this.filterChannelList(this.tagStringHash);
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
