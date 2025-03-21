import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddChannelComponent } from './add-channel/add-channel.component';

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

  // Beispiel-Array für Channels
  channels: { id: number; name: string; description?: string }[] = [
    { id: 1, name: 'general', description: '' },
    { id: 2, name: 'development', description: '' },
    { id: 3, name: 'design', description: '' },
  ];

  // Beispiel-Array für Direktnachrichten
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

  onChannelCreated(channelData: { name: string; description?: string }) {
    const nextId =
      this.channels.length > 0
        ? Math.max(...this.channels.map((c) => c.id)) + 1
        : 1;

    this.channels.push({
      id: nextId,
      name: channelData.name,
      description: channelData.description,
    });
    console.log(this.channels);

    this.closeAddChannel();
  }
}
