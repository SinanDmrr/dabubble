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
  membersOpen: boolean = false;
  exampleMembers: string [] = ["Frederik Beck (Du)", "Sofia Müller", "Noah Braun", "Elise Roth", "Elias Neumann", "Steffen Hoffmann"]
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

  openMembers(){
    this.membersOpen = true;
  }

  closeMembers(){
    this.membersOpen = false;
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
