import { Component, Input } from '@angular/core';
import { IMessage } from '../../interfaces/ichannels';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  @Input() message!: IMessage;

  reactions: string[] = ['😂', '❤️', '👍', '🚀'];
  reactionsGot = [
    {
      reaction: '😂',
      number: 1,
    },
    {
      reaction: '❤️',
      number: 3,
    }
  ];

  reactToMessage(reaction: string) {
    let found = false;
    this.reactionsGot.forEach(element => {
      if(element.reaction == reaction){
        element.number++
        found = true;
      }
    });
    
    if(!found){
      this.reactionsGot.push({reaction: reaction, number: 1});
    }
  }

  reactWithGivenReaction(reaction: string){
    this.reactionsGot.forEach(element => {
      if(element.reaction == reaction){
        element.number++
      }
    });
  }
}
