import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { ChannelsService } from '../../services/channels.service';
import { filter, Observable } from 'rxjs';
import { IChannels, IMessage } from '../../interfaces/ichannels';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../../shared/profile/profile.component';
import { SingleMessageComponent } from '../../shared/single-message/single-message.component';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { user } from '@angular/fire/auth';
import { FilterMessagesService } from '../../services/filter-messages.service';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [
    WriteMessageComponent,
    EditChannelComponent,
    FormsModule,
    ProfileComponent,
    SingleMessageComponent,
  ],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss',
})
export class MainChatComponent {
  currentChannel!: IChannels;
  currentUser!: IUser;

  iMessages: IMessage[] = [];
  editOpen: boolean = false;

  members: string[] = ['Frederik Beck (Du)', 'Sofia Müller'];

  membersOpen: boolean = false;
  addMemberOpen: boolean = false;
  memberToAdd: string = '';
  membersAdded: string[] = [];
  channelMembers: string[] = [];
  userList: IUser[] = [];
  inputValid = false;

  profileOpen = false;
  profileToOpen!: IUser;

  filterWord: string = "";

  @ViewChild('chatcontainer') chatContainer!: ElementRef<HTMLDivElement>;
  

  constructor(
    private channelService: ChannelsService,
    private userService: UserService,
    private filterService: FilterMessagesService
  ) {
    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
      this.iMessages = channel.messages;
      this.channelMembers = channel.users;
      this.scrollToBottom()
    });

    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList;
      
    });

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.filterService.getfilterSubject().subscribe((filterWord) => {
      this.filterWord = filterWord;
    });
  }

  getUserImage(email: string): string {
    let foundUser = this.userList.find(userElem => userElem.email == email);
    return foundUser ? foundUser.picture : "";
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  addMessage(event: { message: string; taggedStrings: string[] }) {
    let newMessageToAdd: IMessage = {
      writer: this.currentUser.name,
      message: event.message,
      time: this.styleTime(),
      emojis: [],
      taggedStrings: event.taggedStrings
    };
    this.currentChannel.messages.push(newMessageToAdd);
    this.channelService.updateChannel(
      this.currentChannel.id!,
      this.currentChannel
    );
  }

  styleTime() {
    let time = new Date();
    return {
      hour: time.getHours(),
      minute: time.getMinutes(),
      day: time.getDate(),
      month: time.getMonth(),
      year: time.getFullYear(),
      dayName: time.toLocaleDateString('de-DE', { weekday: 'long' }),
      fullDate: time.toDateString(),
    };
  }

  openEdit() {
    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
  }

  openMembers() {
    this.membersOpen = true;
  }

  closeMembers() {
    this.membersOpen = false;
  }

  openAddMember() {
    this.addMemberOpen = true;
  }

  closeAddMember() {
    this.addMemberOpen = false;
    this.membersAdded.forEach((newUser) => {
      this.currentChannel.users.push(newUser);
    });
    this.channelService.updateChannel(
      this.currentChannel.id!,
      this.currentChannel
    );
    this.membersAdded = [];
    this.memberToAdd = '';
  }

  openProfile(member: string) {
    this.profileToOpen = this.getUserFromMail(member);
    this.closeMembers();
    this.profileOpen = true;
  }

  getUserFromName(name: string): IUser {
    return this.userList.find((user) => user.name === name) || this.userList[0];
  }

  getUserFromMail(email: string): IUser {
    return this.userList.find((user) => user.email === email) || this.userList[0];
  }

  getUsernameFromMail(email: string): string {
    return this.userList.find((user) => user.email == email)!.name || this.userList[0].name;
  }

  getMailFromUsername(name: string): string {
    return this.userList.find((user) => user.name == name)!.email || this.userList[0].email;
  }

  closeProfile() {
    this.profileOpen = false;
  }

  goToAddMember() {
    this.closeMembers();
    this.openAddMember();
  }

  addToMembers() {
    this.membersAdded.forEach((newMember) => {
      this.members.push(newMember);
    });
    this.closeAddMember();
  }

  addToMembersAdded(newMember?: string) { //hier kommt die Mail des Member rein
    if (newMember) {
      this.membersAdded.push(newMember);
    } else {
      this.membersAdded.push(this.getMailFromUsername(this.memberToAdd));
    }

    this.memberToAdd = '';
  }

  deleteFromMembersAdded(member: string) {
    let index = this.membersAdded.indexOf(member);
    if (index !== -1) {
      this.membersAdded.splice(index, 1);
    }
  }

  getFilteredMembers() {
    /* let filteredMembers = this.userList;
    filteredMembers = filteredMembers.filter(
      (member) => member.name.toLowerCase().includes(this.memberToAdd.toLowerCase()) && !this.membersAdded.includes( member.name) &&
        !this.members.includes( member.name)
    ); old version of filter method */ 

    let filteredUsers = this.userList.filter(user =>
      ![...this.channelMembers, ...this.membersAdded].some(member => member == user.email) && user.name.toLowerCase().includes(this.memberToAdd.toLowerCase())
    );
    return filteredUsers;
  }

  checkIfInputValid(): boolean {
    if (this.membersAdded.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  getDate(message: IMessage) {
    let date = '';
    let today = new Date();
    if (message.time.fullDate == today.toDateString()) {
      date = 'Heute';
    } else {
      date =
        message.time.dayName +
        ', ' +
        message.time.day +
        '. ' +
        this.getMonthName(message.time.month) +
        ' ' +
        message.time.year;
    }
    return date;
  }

  getMonthName(month: number) {
    let months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return months[month];
  }

  newDay(index: number): boolean {
    if (index > 0) {
      if (this.iMessages[index].time.day > this.iMessages[index - 1].time.day) {
        return true;
      }
    }
    return false;
  }

  getFilteredMessages(messages: IMessage []){
    let filteredMessages = messages.filter(msg => 
      msg.message.toLowerCase().includes(this.filterWord.toLowerCase())
    );
    return filteredMessages;
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
