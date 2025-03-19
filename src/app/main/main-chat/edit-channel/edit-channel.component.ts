import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  @Output() close = new EventEmitter<void>();

  closeEdit(){
    this.close.emit();
  }
}
