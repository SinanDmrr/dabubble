import { Component } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { ChannelsService } from '../../services/channels.service';
import { Observable } from 'rxjs';
import { IChannels } from '../../interfaces/ichannels';
import { EditChannelComponent } from './edit-channel/edit-channel.component';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [WriteMessageComponent, EditChannelComponent],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss'
})
export class MainChatComponent {
  messages: string[] = [];
  editOpen: boolean = false;
  constructor(private channelService: ChannelsService){
    
  }

  addMessage(newMessage: string){
    this.messages.push(newMessage);
  }

  openEdit(){
    this.editOpen = true;
  }

  closeEdit(){
    this.editOpen = false;
  }
}
