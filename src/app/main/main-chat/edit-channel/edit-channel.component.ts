import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  @Output() close = new EventEmitter<void>();

  titleEdit: boolean = false;
  descriptionEdit: boolean = false;

  closeEdit(){
    this.close.emit();
  }

  editTitle(){
    this.titleEdit = true;
  }

  saveTitle(){
    this.titleEdit = false;
  }

  editDescription(){
    this.descriptionEdit = true;
  }

  saveDescription(){
    this.descriptionEdit = false;
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
