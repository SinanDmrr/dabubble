import { Component, EventEmitter, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AddChannelComponent } from "./add-channel/add-channel.component";
import { IChannels } from "../../interfaces/ichannels";
import { ChannelsService } from "../../services/channels.service";
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/iuser";
import { DirectsMessageService } from "../../services/directs-message.service";
import { IDirectMessage } from "../../interfaces/idirect-message";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ActiveService } from "../../services/active.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dev-space",
  standalone: true,
  imports: [RouterModule, AddChannelComponent, CommonModule],
  templateUrl: "./dev-space.component.html",
  styleUrl: "./dev-space.component.scss",
})
export class DevSpaceComponent {
  isChannelsExpanded = true;
  isMessagesExpanded = true;
  showAddChannelPopup = false;
  showDeleteDialog = false;
  channelToDelete: IChannels | null = null;
  activeLiId: string | undefined;
  isDevSpaceVisible = true;

  currentUser!: IUser;
  channels: IChannels[] = [];
  allUsers: IUser[] = [];
  allDirectMessages: IDirectMessage[] = [];
  directMessagesWithCurrentUser: IDirectMessage[] = [];
  directMessagesBetweenCurrentAndSinglePerson: IDirectMessage[] = [];
  userOfDirectMessages: IUser[] = [];
  filteredChannels: IChannels[] = [];

  private subscriptionChannels: Subscription | undefined;
  private subscriptionCurrentUser: Subscription | undefined;
  private subscriptionUserList: Subscription | undefined;
  private subscriptionDirectMessages: Subscription | undefined;
  private subscriptionActiveLi: Subscription | undefined;

  @Output() viewSwitch = new EventEmitter<boolean>();

  constructor(
    private channelsService: ChannelsService,
    private userService: UserService,
    private directMessagesService: DirectsMessageService,
    private router: Router,
    private activeService: ActiveService,
  ) {}

  emitViewSwitchIfMobile() {
    if (window.innerWidth < 800) {
      this.channelsService.setIsDevSpaceVisible(false);
      this.channelsService.getIsDevSpaceVisible().subscribe((isVisible) => {
        this.isDevSpaceVisible = isVisible;
        this.viewSwitch.emit(isVisible);
      });
    }
  }

  toggleDevSpaceVisibility() {
    this.isDevSpaceVisible = !this.isDevSpaceVisible;
    this.viewSwitch.emit(this.isDevSpaceVisible);
  }

  ngOnInit() {
    this.channelsService.getChannels().subscribe((channels) => {
      this.channels = channels;
      this.filterChannels();
    });

    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
      this.filterChannels();
    });

    this.userService.getUserList().subscribe((users) => {
      this.allUsers = users;
    });

    this.directMessagesService.getDirectMessages().subscribe((dM) => {
      this.allDirectMessages = dM;
      this.filterCurrentDirectMessages();
    });

    this.activeService.getActiveLi().subscribe((activeLiId) => {
      this.activeLiId = activeLiId;
    });
  }

  ngOnDestroy() {
    this.subscriptionChannels?.unsubscribe();
    this.subscriptionCurrentUser?.unsubscribe();
    this.subscriptionUserList?.unsubscribe();
    this.subscriptionDirectMessages?.unsubscribe();
    this.subscriptionActiveLi?.unsubscribe();
  }

  filterChannels() {
    if (!this.currentUser || !this.channels) {
      this.filteredChannels = [];
      return;
    }

    this.filteredChannels = this.channels.filter(
      (channel) =>
        channel.creator === this.currentUser.email ||
        (channel.users && channel.users.includes(this.currentUser.email)),
    );
  }

  filterCurrentDirectMessages() {
    this.directMessagesWithCurrentUser = this.allDirectMessages.filter(
      (dm) =>
        dm.receiver === this.currentUser.id ||
        dm.sender === this.currentUser.id,
    );
    this.filterChatpartnerNamesOfCurrentUser();
  }

  filterChatpartnerNamesOfCurrentUser() {
    if (!this.currentUser) {
      this.userOfDirectMessages = [];
      return;
    }
    this.userOfDirectMessages = this.allUsers.filter(
      (user) =>
        user.id !== this.currentUser.id &&
        this.directMessagesWithCurrentUser.some(
          (dm) =>
            (dm.sender === user.id && dm.receiver === this.currentUser.id) ||
            (dm.sender === this.currentUser.id && dm.receiver === user.id),
        ),
    );
  }

  filterDirectMessagesBetweenCurrentAndSinglePerson(user: IUser) {
    if (this.currentUser?.id && user?.id) {
      this.directMessagesService.setDirectMessageBetweenTwo(
        this.currentUser.id,
        user.id,
      );
    } else {
      console.warn("Current user ID oder user ID ist nicht definiert.");
    }
  }

  changeChannelToDisplay(channel: IChannels) {
    this.channelsService.setCurrentChannel(channel);
    this.activeService.setActiveLi(channel.id);
    this.router.navigate(["/main"]);
    this.emitViewSwitchIfMobile();
  }

  changeDirectMessageToDisplay(user: IUser) {
    this.filterCurrentDirectMessages();
    this.activeService.setActiveLi(user.id);
    this.userService.setClickedDirectChatUser(user);
    this.filterDirectMessagesBetweenCurrentAndSinglePerson(user);
    this.router.navigate(["/direct"]);
    this.emitViewSwitchIfMobile();
  }

  toggleChannels() {
    this.isChannelsExpanded = !this.isChannelsExpanded;
  }

  toggleMessages() {
    this.isMessagesExpanded = !this.isMessagesExpanded;
  }

  openAddChannel() {
    this.showAddChannelPopup = true;
  }

  closeAddChannel() {
    this.showAddChannelPopup = false;
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

    const usersToAdd =
      channelData.members || this.allUsers.map((user) => user.email);

    const newChannel: IChannels = {
      creator: this.currentUser.email,
      name: channelData.name,
      description: channelData.description || "",
      messages: [],
      users: usersToAdd,
    };

    this.channelsService
      .addChannel(newChannel)
      .then(() => {
        this.closeAddChannel();
      })
      .catch((error) => {
        console.error("Error adding channel to Firebase:", error);
      });
  }

  deleteChannel(channel: IChannels, event: Event) {
    event.stopPropagation();
    if (
      channel.id &&
      confirm(`Möchtest du den Channel #${channel.name} wirklich löschen?`)
    ) {
      this.channelsService
        .deleteChannel(channel.id)
        .then(() => {
          this.channels = this.channels.filter((c) => c.id !== channel.id);
          this.filterChannels();

          this.channelsService
            .getCurrentChannel()
            .subscribe((currentChannel) => {
              if (currentChannel && currentChannel.id === channel.id) {
                if (this.filteredChannels.length > 0) {
                  const newChannel = this.filteredChannels[0];
                  this.channelsService.setCurrentChannel(newChannel);
                  this.activeService.setActiveLi(newChannel.id);
                  this.router.navigate(["/main"]);
                } else {
                  this.channelsService.setCurrentChannel({
                    creator: "",
                    description: "",
                    messages: [],
                    name: "",
                    users: [],
                  });
                  this.activeService.setActiveLi(undefined);
                  this.router.navigate(["/main"]);
                }
              }
            });
        })
        .catch((error) => {
          console.error("Error deleting channel from Firebase:", error);
        });
    }
  }
  openDeleteDialog(channel: IChannels, event: Event) {
    event.stopPropagation();
    this.channelToDelete = channel;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.channelToDelete = null;
  }

  confirmDelete() {
    if (this.channelToDelete && this.channelToDelete.id) {
      this.channelsService
        .deleteChannel(this.channelToDelete.id)
        .then(() => {
          this.channels = this.channels.filter(
            (c) => c.id !== this.channelToDelete!.id,
          );
          this.filterChannels();

          this.channelsService
            .getCurrentChannel()
            .subscribe((currentChannel) => {
              if (
                currentChannel &&
                currentChannel.id === this.channelToDelete!.id
              ) {
                if (this.filteredChannels.length > 0) {
                  const newChannel = this.filteredChannels[0];
                  this.channelsService.setCurrentChannel(newChannel);
                  this.activeService.setActiveLi(newChannel.id);
                  this.router.navigate(["/main"]);
                } else {
                  this.channelsService.setCurrentChannel({
                    creator: "",
                    description: "",
                    messages: [],
                    name: "",
                    users: [],
                  });
                  this.activeService.setActiveLi(undefined);
                  this.router.navigate(["/main"]);
                }
              }
            });

          this.closeDeleteDialog();
        })
        .catch((error) => {
          console.error("Error deleting channel from Firebase:", error);
          this.closeDeleteDialog();
        });
    }
  }
}
