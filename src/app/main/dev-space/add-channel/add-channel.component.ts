import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IUser } from "../../../interfaces/iuser";
import { Subscription } from "rxjs";
import { UserService } from "../../../services/user.service";
import { ChannelsService } from "../../../services/channels.service";
import { IChannels } from "../../../interfaces/ichannels";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-channel",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./add-channel.component.html",
  styleUrl: "./add-channel.component.scss",
})
export class AddChannelComponent {
  addChannelFirstWindow: boolean = true;
  addAllMembersSelection: boolean = true;
  showError: boolean = false;
  channelNameError: string = "";

  channelName: string = "";
  description: string = "";

  selectedMembers: string[] = [];
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  showUserList: boolean = false;
  private userSubscription!: Subscription;

  @ViewChild("userList", { static: false })
  userListRef!: ElementRef<HTMLUListElement>;
  @ViewChild("searchInput", { static: false })
  searchInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private channelsService: ChannelsService,
  ) {}

  @Output() close = new EventEmitter<void>();
  @Output() channelCreated = new EventEmitter<{
    name: string;
    description?: string;
    members?: string[];
  }>();

  ngOnInit(): void {
    this.userSubscription = this.userService
      .getUserList()
      .subscribe((userList) => {
        this.users = userList;
        this.filteredUsers = userList;
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onInputFocus() {
    this.showUserList = true;
    this.filteredUsers = this.users;
  }

  onInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().startsWith(inputValue),
    );
    this.showUserList = true;
  }

  selectUser(user: IUser) {
    if (!this.selectedMembers.includes(user.email)) {
      this.selectedMembers.push(user.email);
    }
    this.showUserList = false;
    if (this.searchInputRef?.nativeElement) {
      this.searchInputRef.nativeElement.value = "";
    }
    this.filteredUsers = this.users;
  }

  onCancel() {
    this.showUserList = false;
    this.close.emit();
  }

  private async checkChannelNameExists(name: string): Promise<boolean> {
    const channels = await firstValueFrom(this.channelsService.getChannels());
    return channels.some(
      (channel: IChannels) => channel.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async switchPopupWindow() {
    if (!this.channelName) {
      this.showError = true;
      this.channelNameError = "Channel-Name ist erforderlich.";
      return;
    }

    if (await this.checkChannelNameExists(this.channelName)) {
      this.showError = true;
      this.channelNameError = "Ein Channel mit diesem Namen existiert bereits.";
      return;
    }

    this.addChannelFirstWindow = false;
    this.showError = false;
    this.channelNameError = "";
  }

  removeMember(member: string) {
    this.selectedMembers = this.selectedMembers.filter((m) => m !== member);
    this.filteredUsers = this.users;
  }

  onInputBlur() {
    setTimeout(() => {
      this.showUserList = false;
      if (this.searchInputRef?.nativeElement) {
        this.searchInputRef.nativeElement.value = "";
      }
    }, 200);
  }

  async createChannel() {
    if (await this.checkChannelNameExists(this.channelName)) {
      this.showError = true;
      this.channelNameError = "Ein Channel mit diesem Namen existiert bereits.";
      this.addChannelFirstWindow = true;
      return;
    }

    const channelData = {
      name: this.channelName,
      description: this.description || undefined,
      members: this.addAllMembersSelection ? undefined : this.selectedMembers,
    };
    this.channelCreated.emit(channelData);
    this.onCancel();
  }
}
