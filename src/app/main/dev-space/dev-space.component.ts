import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { IChannels } from '../../interfaces/ichannels';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';

@Component({
  selector: 'app-dev-space',
  standalone: true,
  imports: [RouterModule, AddChannelComponent],
  templateUrl: './dev-space.component.html',
  styleUrl: './dev-space.component.scss',
})
export class DevSpaceComponent {
  isChannelsExpanded = true;
  isMessagesExpanded = true;
  showAddChannelPopup = false;

  currentUser!: IUser;
  channels: IChannels[] = [];
  allUsers: IUser[] = [];

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
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
  }

  directMessages = [
    {
      id: 1,
      name: 'Anna Müller',
      onlineStatus: true,
      imgPath: '/assets/avatars/avatar_1_round.png',
    },
    {
      id: 2,
      name: 'Ben Schmidt',
      online: false,
      imgPath: '/assets/avatars/avatar_2_round.png',
    },
    {
      id: 3,
      name: 'Clara Weber',
      online: true,
      imgPath: '/assets/avatars/avatar_6_round.png',
    },
    {
      id: 4,
      name: 'David Koch',
      online: false,
      imgPath: '/assets/avatars/avatar_5_round.png',
    },
  ];

  changeChannelToDisplay(channel: IChannels) {
    this.channelsService.setCurrentChannel(channel);
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
