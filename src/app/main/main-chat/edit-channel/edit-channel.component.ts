import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IChannels } from '../../../interfaces/ichannels';
import { ChannelsService } from '../../../services/channels.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces/iuser';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  @Output() close = new EventEmitter<void>();
  @Output() openAProfile = new EventEmitter<string>();
  @Output() addAMember = new EventEmitter<void>();

  @Input() channel!: IChannels;

  titleEdit: boolean = false;
  descriptionEdit: boolean = false;
  channelTitle = "";
  channelDescription = "";
  userList: IUser[] = [];
  currentUser!: IUser;
  channelsList: IChannels[] = [];
  showErr: boolean = false;

  constructor(private channelService: ChannelsService, private userService: UserService,){
    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList;
      
    });

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.channelService.getChannels().subscribe((channelList) => {
      this.channelsList = channelList;
    })

  }

  closeEdit() {
    this.close.emit();
  }

  editTitle() {
    this.titleEdit = true;
    this.channelTitle = this.channel.name
  }

  saveTitle() {
    if(this.channelsList.some((channel: IChannels) => channel.name.toLowerCase() == this.channelTitle.toLowerCase())){
      this.showErr = true;
      this.titleEdit = true;
    } else {
      this.channel.name = this.channelTitle;
      this.channelService.updateChannel(this.channel.id!, this.channel);
      this.titleEdit = false;
    }
    
  }

  editDescription() {
    this.descriptionEdit = true;
    this.channelDescription = this.channel.description 
  }

  saveDescription() {
    this.channel.description = this.channelDescription;
    this.channelService.updateChannel(this.channel.id!, this.channel);
    this.descriptionEdit = false; 
  }

  getUsernameFromMail(email: string): string {
    return this.userList.find((user) => user.email == email)!.name || this.userList[0].name;
  }

  getUserImage(email: string): string {
    let foundUser = this.userList.find(userElem => userElem.email == email);
    return foundUser ? foundUser.picture : "";
  }

  openProfile(member: string) {
    this.openAProfile.emit(member);
    this.closeEdit();
  }

  addMember(){
    this.addAMember.emit();
    this.closeEdit();
  }

  leaveChannel(){
    this.channel.users = this.channel.users.filter((user) => user!=this.currentUser.email);
    this.channelService.updateChannel(this.channel.id!, this.channel);
    this.closeEdit();
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
