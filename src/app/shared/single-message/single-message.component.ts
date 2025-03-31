import { Component, Input } from '@angular/core';
import { IChannels, IEmojis, IMessage } from '../../interfaces/ichannels';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { ChannelsService } from '../../services/channels.service';
import { CommonModule } from '@angular/common';
import { ThreadService } from '../../services/thread.service';


@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  @Input() message!: IMessage;
  currentUser!: IUser;
  currentChannel!: IChannels;

  reactions: string[] = ['😂', '❤️', '👍', '🚀'];

  constructor(private userService: UserService, private channelService: ChannelsService, private threadService: ThreadService){
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
      console.log(this.currentUser)
    });
   
  }

  isOwnMessage(): boolean{
    if(this.message.writer == this.currentUser.name){
      return true
    } else {
      return false;
    }
  }

  reactToMessage(newEmoji: string) {
    let found = false;
    this.message.emojis.forEach(emoji => {
      if(emoji.unicode == newEmoji){
        emoji.count++
        found = true;
      }
    });
    
    if(!found){
      this.message.emojis.push({unicode: newEmoji, count: 1, username: this.currentUser.name});
    }
  }

  reactWithGivenReaction(newEmoji: string){
    this.message.emojis.forEach(emoji => {
      if(emoji.unicode == newEmoji){
        emoji.count++
      }
    });
  }

  answerToMessage(){
    this.threadService.setThreadMessage(this.message);
    this.threadService.showThreadComponent()
  }

  pushToFirestore(){
    //hier muss der Channel komplett geupdatet werden (this.channelService.update()) um die Reaktionen auf die Messages zu pushen
  }

  getTwoDigitNumber(number: number){
    return number < 10 ? '0' + number : number
  }
}
