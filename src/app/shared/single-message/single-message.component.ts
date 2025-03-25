import { Component, Input } from '@angular/core';
import { IChannels, IEmojis, IMessage } from '../../interfaces/ichannels';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { ChannelsService } from '../../services/channels.service';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  @Input() message!: IMessage;
  currentUser!: IUser;
  currentChannel!: IChannels;

  reactions: string[] = ['😂', '❤️', '👍', '🚀'];

  constructor(private userService: UserService, private channelService: ChannelsService){
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
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

  pushToFirestore(){
    //hier muss der Channel komplett geupdatet werden (this.channelService.update()) um die Reaktionen auf die Messages zu pushen
  }

  getTwoDigitNumber(number: number){
    return number < 10 ? '0' + number : number
  }
}
