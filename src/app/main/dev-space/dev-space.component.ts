import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { IChannels } from '../../interfaces/ichannels';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { DirectsMessageService } from '../../services/directs-message.service';
import { IDirectMessage } from '../../interfaces/idirect-message';
import { user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dev-space',
  standalone: true,
  imports: [RouterModule, AddChannelComponent, CommonModule],
  templateUrl: './dev-space.component.html',
  styleUrl: './dev-space.component.scss',
})
export class DevSpaceComponent {
  isChannelsExpanded = true;
  isMessagesExpanded = true;
  showAddChannelPopup = false;
  activeLiId: string | undefined;

  currentUser!: IUser;
  channels: IChannels[] = [];
  allUsers: IUser[] = [];
  allDirectMessages: IDirectMessage[] = [];
  currentDirectMessages: IDirectMessage[] = [];
  userOfDirectMessages: IUser[] = [];

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private directMessagesService: DirectsMessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.channelsService.getChannels().subscribe((channels) => {
      this.channels = channels;
    });

    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
    });

    this.userService.getUserList().subscribe((users) => {
      this.allUsers = users;
    });

    this.directMessagesService.getDirectMessages().subscribe((dM) => {
      this.allDirectMessages = dM;
      this.filterCurrentDirectMessages();
    });
  }

  filterCurrentDirectMessages() {
    this.currentDirectMessages = this.allDirectMessages.filter(
      (dm) => dm.receiver === this.currentUser.id,
    );
    this.filterUserDirectMessages();
  }

  filterUserDirectMessages() {
    const senderIds = this.currentDirectMessages.map((dm) => dm.sender);
    this.userOfDirectMessages = this.allUsers.filter(
      (user) => user.id !== undefined && senderIds.includes(user.id),
    );
  }

  changeChannelToDisplay(channel: IChannels) {
    this.channelsService.setCurrentChannel(channel);
    this.activeLiId = channel.id;
    this.router.navigate(['/main']);
  }

  changeDirectMessageToDisplay(user: IUser) {
    this.activeLiId = user.id;
    this.userService.setClickedDirectChatUser(user);
    this.router.navigate(['/direct']);
  }

  toggleChannels() {
    this.isChannelsExpanded = !this.isChannelsExpanded;
  }

  toggleMessages() {
    this.isMessagesExpanded = !this.isMessagesExpanded;
  }

  openAddChannel() {
    this.showAddChannelPopup = true;
  }

  closeAddChannel() {
    this.showAddChannelPopup = false;
  }

  onChannelCreated(channelData: {
    name: string;
    description?: string;
    members?: string[];
  }) {
    if (!this.currentUser) {
      console.error('Current user is not loaded yet!');
      return;
    }

    const usersToAdd =
      channelData.members || this.allUsers.map((user) => user.name);

    const newChannel: IChannels = {
      creator: this.currentUser.name,
      name: channelData.name,
      description: channelData.description || '',
      messages: [],
      users: usersToAdd,
    };
    this.channelsService
      .addChannel(newChannel)
      .then(() => {
        this.closeAddChannel();
      })
      .catch((error) => {
        console.error('Error adding channel to Firebase:', error);
      });
  }
}
