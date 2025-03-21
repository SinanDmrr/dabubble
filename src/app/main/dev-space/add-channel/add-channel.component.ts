import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent {
  addChannelFirstWindow: boolean = true;
  addAllMembersSelection: boolean = true;
  showError: boolean = false;

  channelName: string = '';
  description: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() channelCreated = new EventEmitter<{
    name: string;
    description?: string;
  }>();

  onCancel() {
    this.close.emit();
  }

  switchPopupWindow() {
    if (this.channelName) {
      this.addChannelFirstWindow = false;
      this.showError = false;
    } else {
      this.showError = true;
      console.log(this.showError);
    }
  }

  createChannel() {
    const channelData = {
      name: this.channelName,
      description: this.description || undefined,
    };
    if (this.addAllMembersSelection) {
      this.channelCreated.emit(channelData);
      console.log('add all members');
    } else {
      console.log('add specific members');
    }
    this.onCancel();
  }
}
