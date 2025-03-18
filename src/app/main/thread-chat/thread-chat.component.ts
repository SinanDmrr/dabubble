import { Component } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';

@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [WriteMessageComponent],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss'
})
export class ThreadChatComponent {

}
