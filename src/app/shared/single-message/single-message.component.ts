import { Component, Input } from '@angular/core';
import { IEmojis, IMessage } from '../../interfaces/ichannels';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';

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

  testvar = "";

  reactions: string[] = ['😂', '❤️', '👍', '🚀'];

  constructor(private userService: UserService){
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
    });
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
}
