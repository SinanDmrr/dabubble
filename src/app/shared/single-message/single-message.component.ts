import { Component, Input } from '@angular/core';
import { IChannels, IEmojis, IMessage } from '../../interfaces/ichannels';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { ChannelsService } from '../../services/channels.service';
import { CommonModule } from '@angular/common';
import { ThreadService } from '../../services/thread.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  @Input() message!: IMessage;
  currentUser!: IUser;
  currentChannel!: IChannels;

  messageEditable: boolean = false;
  textareaMessage: string = "";

  reactions: string[] = ['😂', '❤️', '👍', '🚀'];
  reacted: boolean = false;
  reactedTo: string = "";

  constructor(private userService: UserService, private channelService: ChannelsService, private threadService: ThreadService) {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
    });

    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
    })
  }

  ngOnInit() {
    this.textareaMessage = this.message.message;
    this.checkIfAlreadyReacted();
  }

  checkIfAlreadyReacted() {
    this.message.emojis.forEach(emoji => {
      if (emoji.username == this.currentUser.name) {
        this.reactedTo = emoji.unicode;
        this.reacted = true;
      }
    });
  }

  checkIfReacted(emoji: string): boolean {
    if (this.reactedTo == emoji) {
      return true
    } else {
      return false;
    }
  }

  isOwnMessage(): boolean {
    if (this.message.writer == this.currentUser.name) {
      return true
    } else {
      return false;
    }
  }

  handleReaction(newEmoji: string) {
    if (this.reactedTo == newEmoji) {
      this.unclickReaction(newEmoji);
    } else {
      if(this.reacted){
        this.unclickReaction(this.reactedTo);
        this.react(newEmoji)
      } else {
        this.react(newEmoji)
      }
    }
    
    this.pushToFirestore()
  }

  unclickReaction(emojiToUnclick: string) {
    this.message.emojis.forEach(emoji => {
      if (emoji.unicode == emojiToUnclick) {
        this.deleteReaction(emojiToUnclick);
      }
    });
  }

  deleteReaction(emojiToDelete: string) {
    let index = this.message.emojis.findIndex(emoji => emoji.unicode == emojiToDelete && emoji.username == this.currentUser.name);
    if (index !== -1) {
      this.message.emojis.splice(index, 1);
    }
    this.reacted = false;
    this.reactedTo = "";
  }

  react(newEmoji: string) {
    this.message.emojis.push({ unicode: newEmoji, count: 1, username: this.currentUser.name });
    this.reactedTo = newEmoji;
    this.reacted = true;
  }

  getNumberOfSpecificEmoji(emoji: IEmojis): number{
    let count = 0;
    this.message.emojis.forEach(emojiElement => {
      if(emojiElement.unicode == emoji.unicode){
        count++
      }
    });
    return count;
  }

  getUniqueEmojiArr(emojiArr: IEmojis[]){
    let uniqueEmojis = emojiArr.filter((obj, index, array) =>
      array.findIndex(item => item.unicode === obj.unicode) === index
    ); 
    
    return uniqueEmojis
  }

  answerToMessage() {
    this.threadService.setThreadMessage(this.message);
    this.threadService.showThreadComponent()
  }

  pushToFirestore() {
    //hier muss der Channel komplett geupdatet werden (this.channelService.update()) um die Reaktionen auf die Messages zu pushen
    this.channelService.updateChannel(this.currentChannel.id!, this.currentChannel);
  }

  getTwoDigitNumber(number: number) {
    return number < 10 ? '0' + number : number
  }

  editMessage() {
    this.messageEditable = true;
  }

  saveEdits() {
    this.message.message = this.textareaMessage;
    this.pushToFirestore();
    this.closeEditMessage();
  }

  closeEditMessage() {
    this.messageEditable = false;
  }
}
