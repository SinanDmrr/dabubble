import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/iuser";
import { Subscription } from "rxjs";
import { WriteMessageComponent } from "../../shared/write-message/write-message.component";
import { ProfileComponent } from "../../shared/profile/profile.component";
import { IDirectMessage } from "../../interfaces/idirect-message";
import { IMessage } from "../../interfaces/idirect-message";
import { IEmojis } from "../../interfaces/idirect-message";

@Component({
  selector: "app-direct-chat",
  standalone: true,
  imports: [WriteMessageComponent, ProfileComponent],
  templateUrl: "./direct-chat.component.html",
  styleUrl: "./direct-chat.component.scss",
})
export class DirectChatComponent implements OnInit {
  clickedDirectChatUser: IUser | undefined;
  currentUser: IUser | undefined;
  emptChatHistory: boolean = true;
  showProfileCard: boolean = false;

  private subscriptionCurrentUser: Subscription | undefined;
  private subscriptionClickedUser: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscriptionCurrentUser = this.userService
      .getCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
      });

    this.subscriptionClickedUser = this.userService
      .getClickedDirectChatUser()
      .subscribe((user) => {
        this.clickedDirectChatUser = user;
      });
  }

  ngOnDestroy() {
    if (this.subscriptionCurrentUser && this.subscriptionClickedUser) {
      this.subscriptionCurrentUser.unsubscribe();
      this.subscriptionClickedUser.unsubscribe();
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

  addMessage(newMessage: string) {
    console.log(newMessage);

    // let newMessageToAdd: IMessage = {
    //   writer: this.currentUser!.name,
    //   message: newMessage,
    //   time: this.styleTime(),
    //   emojis: [],
    // };
    // //TODO Hier anstatt currentChannel Message was eigenes mit den Direct Messages überlegen
    // this.currentChannel.messages.push(newMessageToAdd);
    // this.channelService.updateChannel(
    //   this.currentChannel.id!,
    //   this.currentChannel,
    // );
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
}
