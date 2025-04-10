import { Component, Input } from "@angular/core";
import { IChannels, IEmojis, IMessage } from "../../interfaces/ichannels";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/iuser";
import { ChannelsService } from "../../services/channels.service";
import { CommonModule } from "@angular/common";
import { ThreadService } from "../../services/thread.service";
import { FormsModule } from "@angular/forms";
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: "app-single-message",
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileComponent],
  templateUrl: "./single-message.component.html",
  styleUrl: "./single-message.component.scss",
})
export class SingleMessageComponent {
  @Input() message!: IMessage;
  currentUser!: IUser;
  currentChannel!: IChannels;

  messageEditable: boolean = false;
  textareaMessage: string = "";

  reactions: string[] = ["😂", "❤️", "👍", "🚀"];
  reacted: boolean = false;
  reactedTo: string = "";

  @Input() isInThread?: boolean;

  profileOpen: boolean = false;
  profileToOpen!: IUser;
  userList!: IUser [];

  deleteMsg: boolean = false;

  constructor(
    private userService: UserService,
    private channelService: ChannelsService,
    private threadService: ThreadService
  ) {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
    });

    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList!;
    });

    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });
  }

  ngOnInit() {
    this.textareaMessage = this.message.message;
    this.checkIfAlreadyReacted();
    this.profileToOpen = this.getUserFromName(this.message.writer);
  }

  getUserFromName(userName: string) {
    let userObj = this.userList.find(user => user.name == userName);
    return userObj? userObj : this.currentUser;
  }

  formatMessage(message: string, taggedStrings?: string[]): string {
    if (!message){
      return '';
    }
    let regex;
    if(taggedStrings){
      regex = new RegExp(`@(${taggedStrings?.join('|')})`, 'g');
    } else {
      regex = /@(\w+)/g;
    }
    
    return message.replace(regex, '<b>@$1</b>');
  }

  checkIfAlreadyReacted() {
    this.message.emojis.forEach((emoji) => {
      if (emoji.username == this.currentUser.name) {
        this.reactedTo = emoji.unicode;
        this.reacted = true;
      }
    });
  }

  checkIfReacted(emoji: string): boolean {
    if (this.reactedTo == emoji) {
      return true;
    } else {
      return false;
    }
  }

  isOwnMessage(): boolean {
    if (this.message.writer == this.currentUser.name) {
      return true;
    } else {
      return false;
    }
  }

  handleReaction(newEmoji: string) {
    if (this.reactedTo == newEmoji) {
      this.unclickReaction(newEmoji);
    } else {
      if (this.reacted) {
        this.unclickReaction(this.reactedTo);
        this.react(newEmoji);
      } else {
        this.react(newEmoji);
      }
    }

    this.pushToFirestore();
  }

  unclickReaction(emojiToUnclick: string) {
    this.message.emojis.forEach((emoji) => {
      if (emoji.unicode == emojiToUnclick) {
        this.deleteReaction(emojiToUnclick);
      }
    });
  }

  deleteReaction(emojiToDelete: string) {
    let index = this.message.emojis.findIndex(
      (emoji) =>
        emoji.unicode == emojiToDelete &&
        emoji.username == this.currentUser.name
    );
    if (index !== -1) {
      this.message.emojis.splice(index, 1);
    }
    this.reacted = false;
    this.reactedTo = "";
  }

  react(newEmoji: string) {
    this.message.emojis.push({
      unicode: newEmoji,
      count: 1,
      username: this.currentUser.name,
    });
    this.reactedTo = newEmoji;
    this.reacted = true;
  }

  getNumberOfSpecificEmoji(emoji: IEmojis): number {
    let count = 0;
    this.message.emojis.forEach((emojiElement) => {
      if (emojiElement.unicode == emoji.unicode) {
        count++;
      }
    });
    return count;
  }

  getReactionUsernamesOfSpecificEmoji(emoji: IEmojis): string{
    let usernames: string[] = [];
    this.message.emojis.forEach((emojiElement) => {
      if (emojiElement.unicode == emoji.unicode) {
        usernames.push(emojiElement.username)
      }
    });
    return this.formatUsernameList(usernames);
  }

  formatUsernameList(arr: string[]): string {
    if (arr.length == 0){
      return '';
    } else if (arr.length == 1){
      return arr[0];
    } else if (arr.length == 2) {
      return arr.join(' und ');
    }
  
    let allExceptLastTwo = arr.slice(0, -2).join(', ');
    let secondLast = arr[arr.length - 2];
    let last = arr[arr.length - 1];
    return `${allExceptLastTwo}, ${secondLast} und ${last}`;
  }

  getUniqueEmojiArr(emojiArr: IEmojis[]) {
    let uniqueEmojis = emojiArr.filter(
      (obj, index, array) =>
        array.findIndex((item) => item.unicode === obj.unicode) === index
    );

    return uniqueEmojis;
  }

  answerToMessage() {
    this.threadService.setThreadMessage(this.message);
    this.threadService.showThreadComponent();
  }

  pushToFirestore() {
    this.channelService.updateChannel(
      this.currentChannel.id!,
      this.currentChannel
    );
  }

  styleLastAnswer(time: any): string{
    let today = new Date();
    let str = "";
    if(time.day < today.getDate() || time.month < today.getMonth() || time.getFullYear < today.getFullYear()){
      str = "Letzte Antwort am " +  this.getTwoDigitNumber(time.day) + "." + this.getTwoDigitNumber((time.month + 1)) + "." + time.year + " um " + this.getTwoDigitNumber(time.hour) + ":" + this.getTwoDigitNumber(time.minute);
    } else {
      str = "Letzte Antwort heute um " + this.getTwoDigitNumber(time.hour) + ":" + this.getTwoDigitNumber(time.minute);
    }
    return str
  }

  getTwoDigitNumber(number: number) {
    return number < 10 ? "0" + number : number;
  }

  editMessage() {
    this.messageEditable = true;
  }

  openDeleteDialog(){
    this.deleteMsg = true;
  }

  closeDeleteDialog(){
    this.deleteMsg = false;
  }

  deleteMessage(){
    if(this.isInThread){
      this.currentChannel.messages.forEach(messageElem => {
        messageElem.answer = messageElem.answer?.filter(answer => answer !== this.message);
      });
    } else {
      this.currentChannel.messages = this.currentChannel.messages.filter(messageElem => messageElem !== this.message);
    }
    this.channelService.updateChannel(this.currentChannel.id!, this.currentChannel);
    this.channelService.setCurrentChannel(this.currentChannel);
  }

  saveEdits() {
    this.message.message = this.textareaMessage;
    this.pushToFirestore();
    this.closeEditMessage();
  }

  closeEditMessage() {
    this.messageEditable = false;
  }

  openProfile(){
    this.profileOpen = true;
  }

  closeProfile(){
    this.profileOpen = false;
  }
}
