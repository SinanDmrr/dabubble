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
        this.conversation = {
          sender: this.currentUser.id,
          receiver: this.clickedDirectChatUser.id,
          messages: [],
        };
      }
    }
  }

  async addMessage(event: { message: string; taggedStrings: string[]} ) {
    if (!this.currentUser || !this.clickedDirectChatUser) {
      console.error("Current user or clicked user is not defined!");
      return;
    }

    const newMessageToAdd: IMessage = {
      writer: this.currentUser!.name,
      message: event.message,
      time: this.styleTime(),
      emojis: [],
    };

    if (this.conversation) {
      if (this.conversation.id) {
        try {
          await this.directMessageService.addMessageToConversation(
            this.conversation.id,
            newMessageToAdd,
          );
        } catch (error) {
          console.error(
            "Fehler beim Hinzufügen der Nachricht in Firestore:",
            error,
          );
        }
      } else {
        const newConversation: IDirectMessage = {
          sender: this.currentUser.id,
          receiver: this.clickedDirectChatUser.id,
          messages: [newMessageToAdd],
        };
        try {
          await this.directMessageService.addDirectMessages(newConversation);
        } catch (error) {
          console.error(
            "Fehler beim Erstellen der Unterhaltung in Firestore:",
            error,
          );
        }
      }

      setTimeout(() => {
        const chatContainer = document.getElementById("chatcontainer");
        if (chatContainer) {
          chatContainer.scrollTop = 0;
        }
      }, 0);
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
    if (!this.conversation || !this.conversation.messages || index <= 0) {
      return false;
    }
    const currentMessage = this.conversation.messages[index];
    const previousMessage = this.conversation.messages[index - 1];
    if (
      currentMessage &&
      previousMessage &&
      currentMessage.time &&
      previousMessage.time
    ) {
      return currentMessage.time.day > previousMessage.time.day;
    }
    return false;
  }
  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
