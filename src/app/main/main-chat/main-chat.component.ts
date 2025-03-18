import { Component } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [WriteMessageComponent],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss'
})
export class MainChatComponent {
  messages: string[] = [];

  addMessage(newMessage: string){
    this.messages.push(newMessage);
  }
}
