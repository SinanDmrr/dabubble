import { Component, ElementRef, HostBinding, ViewChild } from "@angular/core";
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
  channels: IChannels[] = [];
  currentUser: IUser | null = null;
  currentChannel!: IChannels;
  isMainVisible = false;

  @ViewChild("chatcontainer") chatContainer!: ElementRef<HTMLDivElement>;

  @HostBinding("class.hidden") get isHidden() {
    return !this.showThread;
  }
  constructor(
    private threadService: ThreadService,
    private userService: UserService,
    private channelService: ChannelsService
  ) {
    this.threadService.getShowThreadStatus().subscribe((status) => {
      this.showThread = status;
      if (this.showThread) {
        this.scrollToBottom();
      }
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

  addMessage(event: { message: string; taggedStrings: string[] }) {
    if (!this.currentUser || !this.threadMessage) {
      return;
    }

    let newMessageToAdd: IMessage = {
      writer: this.currentUser.name,
      message: event.message,
      time: this.styleTime(),
      emojis: [],
      taggedStrings: event.taggedStrings,
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

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer.nativeElement) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 0);
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

  closeThread() {
    this.threadService.hideThreadComponent();
  }

  onChannelCreated(channelData: {
    name: string;
    description?: string;
    members?: string[];
  }) {
    if (!this.currentUser) {
      console.error("Current user is not loaded yet!");
      return;
    }
  }

  getDate(message: IMessage) {
    let date = "";
    let today = new Date();
    if (message.time.fullDate == today.toDateString()) {
      date = "Heute";
    } else {
      date =
        message.time.dayName +
        ", " +
        message.time.day +
        ". " +
        this.getMonthName(message.time.month) +
        " " +
        message.time.year;
    }
    return date;
  }

  getMonthName(month: number) {
    let months = [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ];
    return months[month];
  }
}
