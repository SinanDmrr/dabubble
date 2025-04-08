import { Component } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [ WriteMessageComponent],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {

}
