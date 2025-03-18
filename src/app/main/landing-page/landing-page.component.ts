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
  dummyVar: IChannels = {
      creator: 'Hendrik',
      description: 'Tets',
      messages: [],
      name: 'qwdqwdqwdqwd',
      users: [],
  }
  dummyVarZwei!: IChannels[];
    constructor(private firebaseService: FirebaseService) {

  }

  ngOnInit() {
    this.addDummyData();
    this.firebaseService.channelList$.subscribe((channels) => {
      if (channels.length > 0) {
        this.dummyVarZwei = channels;
        // console.log(channels);
        // console.log(channels[0].creator);
      }
    });
    // console.log();
    this.updateData();
  }

  addDummyData(){
    this.firebaseService.addToDatabase('channels', this.dummyVar)
  }

  updateData(){
    this.dummyVarZwei[0].creator = 'Sinan';
    this.firebaseService.updateDocument('channels', this.dummyVarZwei[0].id!, this.dummyVarZwei[0]);
    
  }
}
