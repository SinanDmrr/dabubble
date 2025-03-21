import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IChannels } from '../../../interfaces/ichannels';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  @Output() close = new EventEmitter<void>();

  @Input() channel!: IChannels;

  titleEdit: boolean = false;
  descriptionEdit: boolean = false;

  closeEdit() {
    this.close.emit();
  }

  editTitle() {
    this.titleEdit = true;
  }

  saveTitle() {
    this.titleEdit = false;
  }

  editDescription() {
    this.descriptionEdit = true;
  }

  saveDescription() {
    this.descriptionEdit = false;
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
