import { Component } from '@angular/core';
import { IChannels } from '../../interfaces/ichannels';
import { FirebaseService } from '../../services/firebase.service';
import { ChannelsServiceService } from '../../services/channels-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  dummyVar: IChannels = {
    creator: 'Hendrik',
    description: 'Tets',
    messages: [],
    name: 'qwdqwdqwdqwd',
    users: [],
  }
  dummyVarZwei!: IChannels[];
  constructor(private channelService: ChannelsServiceService) {
    
  }

  ngOnInit() {
    this.channelService.getChannels().subscribe((channels) => {
        this.dummyVarZwei = channels;
    });
  }

  addDummyData() {
    this.channelService.addChannel(this.dummyVar);
  }

  changeData() {
    this.dummyVarZwei[0].creator = 'Sinan';
    this.channelService.updateChannel(this.dummyVarZwei[0].id!, this.dummyVarZwei[0])

  }

  deleteData() {
    this.channelService.deleteChannel(this.dummyVarZwei[0].id!);
  }

}
