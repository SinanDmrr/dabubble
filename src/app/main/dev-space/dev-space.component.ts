import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dev-space',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dev-space.component.html',
  styleUrl: './dev-space.component.scss',
})
export class DevSpaceComponent {
  isChannelsExpanded = true;
  isMessagesExpanded = true;

  // Beispiel-Array für Channels
  channels = [
    { id: 1, name: 'general' },
    { id: 2, name: 'development' },
    { id: 3, name: 'design' },
    { id: 4, name: 'off-topic' },
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
}
