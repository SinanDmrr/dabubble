import { Component } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { ThreadService } from '../../services/thread.service';
import { IMessage } from '../../interfaces/ichannels';

@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [WriteMessageComponent],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss'
})
export class ThreadChatComponent {
  showThread: boolean = false;
  threadMessage: IMessage | null = null;

  constructor(private threadService: ThreadService){
    this.threadService.getShowThreadStatus().subscribe((status) => {
      this.showThread = status;
    });

    this.threadService.getThreadMessage().subscribe((message) => {
      this.threadMessage = message;
    });
  }
}
