import { Component, HostBinding } from "@angular/core";
import { WriteMessageComponent } from "../../shared/write-message/write-message.component";
import { ThreadService } from "../../services/thread.service";
import { IMessage, IChannels } from "../../interfaces/ichannels";
import { SingleMessageComponent } from "../../shared/single-message/single-message.component";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/iuser";
import { ChannelsService } from "../../services/channels.service";

@Component({
  selector: "app-thread-chat",
  standalone: true,
  imports: [WriteMessageComponent, SingleMessageComponent],
  templateUrl: "./thread-chat.component.html",
  styleUrl: "./thread-chat.component.scss",
})
export class ThreadChatComponent {
  showThread: boolean = false;
  threadMessage: IMessage | null = null;
  currentUser: IUser | null = null;
  currentChannel!: IChannels;
  isMainVisible = false;

  constructor(
    private threadService: ThreadService,
    private userService: UserService,
    private channelService: ChannelsService
  ) {
    this.threadService.getShowThreadStatus().subscribe((status) => {
      this.showThread = status;
    });

    this.threadService.getThreadMessage().subscribe((message) => {
      this.threadMessage = message;
    });

    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
    });

    this.channelService.getCurrentChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });
  }

  addMessage(event: { message: string; taggedStrings: string[]} ) {
    if (!this.currentUser || !this.threadMessage) {
      return;
    }

    let newMessageToAdd: IMessage = {
      writer: this.currentUser.name,
      message: event.message,
      time: this.styleTime(),
      emojis: [],
      taggedStrings: event.taggedStrings
    };

    if (!this.threadMessage.answer) {
      this.threadMessage.answer = [];
    }
    this.threadMessage.answer.push(newMessageToAdd);
    this.channelService.updateChannel(
      this.currentChannel.id!,
      this.currentChannel
    );
  }

  styleTime() {
    let time = new Date();
    return {
      hour: time.getHours(),
      minute: time.getMinutes(),
      day: time.getDate(),
      month: time.getMonth(),
      year: time.getFullYear(),
      dayName: time.toLocaleDateString("de-DE", { weekday: "long" }),
      fullDate: time.toDateString(),
    };
  }

  toggleMainVisibility() {
    this.isMainVisible = !this.isMainVisible;
  }

  @HostBinding('class.hidden') get isHidden() {
    return !this.showThread; // Fügt "hidden" hinzu, wenn showThread false ist
  }
}
