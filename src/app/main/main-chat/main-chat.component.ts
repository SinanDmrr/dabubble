import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { ChannelsService } from '../../services/channels.service';
import { Observable } from 'rxjs';
import { IChannels, IMessage } from '../../interfaces/ichannels';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../../shared/profile/profile.component';
import { SingleMessageComponent } from '../../shared/single-message/single-message.component';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { user } from '@angular/fire/auth';

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

  @ViewChild('chatcontainer') chatContainer!: ElementRef;

  constructor(
    private channelService: ChannelsService,
    private userService: UserService
  ) {
    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
      this.iMessages = channel.messages;
    });

    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList;
      userList.forEach((user) => {
        this.channelMembers.push(user.name);
      });
    });

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  getUserImage(user: string): string {
    let foundUser = this.userList.find(userElem => userElem.name == user);
    return foundUser ? foundUser.picture : "";
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  addMessage(newMessage: string) {
    let newMessageToAdd: IMessage = {
      writer: this.currentUser.name,
      message: newMessage,
      time: this.styleTime(),
      emojis: [],
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
    this.profileToOpen = this.getUserFromName(member);
    this.closeMembers();
    this.profileOpen = true;
  }

  getUserFromName(name: string): IUser {
    return this.userList.find((user) => user.name === name) || this.userList[0];
  }

  closeProfile() {
    this.profileOpen = false;
    this.openMembers();
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

  addToMembersAdded(newMember?: string) {
    if (newMember) {
      this.membersAdded.push(newMember);
    } else {
      this.membersAdded.push(this.memberToAdd);
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
    let filteredMembers = this.channelMembers;
    filteredMembers = filteredMembers.filter(
      (member) =>
        member.toLowerCase().includes(this.memberToAdd.toLowerCase()) &&
        !this.membersAdded.includes(member) &&
        !this.members.includes(member)
    );
    return filteredMembers;
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

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
