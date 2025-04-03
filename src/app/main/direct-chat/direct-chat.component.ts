import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/iuser";
import { Subscription } from "rxjs";
import { WriteMessageComponent } from "../../shared/write-message/write-message.component";
import { ProfileComponent } from "../../shared/profile/profile.component";
import { SingleMessageComponent } from "../../shared/single-message/single-message.component";
import { IDirectMessage } from "../../interfaces/idirect-message";
import { IMessage } from "../../interfaces/idirect-message";
import { IEmojis } from "../../interfaces/idirect-message";
import { DirectsMessageService } from "../../services/directs-message.service";

@Component({
  selector: "app-direct-chat",
  standalone: true,
  imports: [WriteMessageComponent, ProfileComponent, SingleMessageComponent],
  templateUrl: "./direct-chat.component.html",
  styleUrl: "./direct-chat.component.scss",
})
export class DirectChatComponent implements OnInit {
  clickedDirectChatUser: IUser | undefined;
  currentUser: IUser | undefined;
  emptChatHistory: boolean = true;
  showProfileCard: boolean = false;
  directMessages: IDirectMessage[] = [];
  iMessages: IMessage[] = [];
  conversation: IDirectMessage | undefined;

  private subscriptionCurrentUser: Subscription | undefined;
  private subscriptionClickedUser: Subscription | undefined;
  private subscriptionDirectMessages: Subscription | undefined;

  constructor(
    private userService: UserService,
    private directMessageService: DirectsMessageService,
  ) {}

  ngOnInit() {
    this.subscriptionCurrentUser = this.userService
      .getCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
        this.updateConversation();
      });

    this.subscriptionClickedUser = this.userService
      .getClickedDirectChatUser()
      .subscribe((user) => {
        this.clickedDirectChatUser = user;
        this.updateConversation();
      });

    this.subscriptionDirectMessages =
      this.directMessageService.dMBetweenTwo$.subscribe((messages) => {
        this.directMessages = messages;
        this.updateConversation();
      });
  }

  ngOnDestroy() {
    if (this.subscriptionCurrentUser && this.subscriptionClickedUser) {
      this.subscriptionCurrentUser.unsubscribe();
      this.subscriptionClickedUser.unsubscribe();
      this.subscriptionDirectMessages?.unsubscribe();
    }
  }

  showProfile(username: string | undefined) {
    if (username && this.clickedDirectChatUser) {
      this.showProfileCard = true;
    }
  }

  closeProfile() {
    this.showProfileCard = false;
  }

  updateConversation() {
    if (this.currentUser && this.clickedDirectChatUser) {
      this.conversation = this.directMessages.find(
        (dm) =>
          (dm.sender === this.currentUser!.id &&
            dm.receiver === this.clickedDirectChatUser!.id) ||
          (dm.sender === this.clickedDirectChatUser!.id &&
            dm.receiver === this.currentUser!.id),
      );
      if (!this.conversation) {
        // Falls keine Unterhaltung existiert, erstelle eine leere
        this.conversation = {
          sender: this.currentUser.id,
          receiver: this.clickedDirectChatUser.id,
          messages: [],
        };
      }
    }
  }

  addMessage(newMessage: string) {
    if (!this.currentUser || !this.clickedDirectChatUser) {
      console.error("Current user or clicked user is not defined!");
      return;
    }
    let newMessageToAdd: IMessage = {
      writer: this.currentUser!.name,
      message: newMessage,
      time: this.styleTime(),
      emojis: [],
    };

    //   // Finde die Unterhaltung zwischen currentUser und clickedDirectChatUser
    //   let conversation = this.directMessages.find(
    //     (dm) =>
    //       (dm.sender === this.currentUser!.id &&
    //         dm.receiver === this.clickedDirectChatUser!.id) ||
    //       (dm.sender === this.clickedDirectChatUser!.id &&
    //         dm.receiver === this.currentUser!.id),
    //   );

    //   if (conversation) {
    //     // Wenn die Unterhaltung existiert, füge die Nachricht hinzu
    //     conversation.messages.push(newMessageToAdd);
    //   } else {
    //     // Wenn keine Unterhaltung existiert, erstelle eine neue
    //     const newConversation: IDirectMessage = {
    //       sender: this.currentUser.id,
    //       receiver: this.clickedDirectChatUser.id,
    //       messages: [newMessageToAdd],
    //     };
    //     this.directMessages.push(newConversation);
    //   }

    //   // Optional: Aktualisiere den Service, falls nötig
    //   this.directMessageService.setDirectMessageBetweenTwo(this.directMessages);
    // }
    if (this.conversation) {
      this.conversation.messages.push(newMessageToAdd);
      // Falls die Unterhaltung noch nicht in directMessages ist, füge sie hinzu
      this.iMessages = this.conversation.messages;
      if (!this.directMessages.includes(this.conversation)) {
        this.directMessages.push(this.conversation);
      }
      this.directMessageService.setDirectMessageBetweenTwo(this.directMessages);
    }
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

  newDay(index: number): boolean {
    if (index > 0) {
      if (this.iMessages[index].time.day > this.iMessages[index - 1].time.day) {
        return true;
      }
    }
    return false;
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
