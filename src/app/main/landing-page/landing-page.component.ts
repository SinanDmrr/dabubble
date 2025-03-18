import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { DevSpaceComponent } from '../dev-space/dev-space.component';
import { ThreadChatComponent } from '../thread-chat/thread-chat.component';
import { FirebaseService } from '../../services/firebase.service';
import { IChannels } from '../../interfaces/ichannels';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, DevSpaceComponent, ThreadChatComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  
}
