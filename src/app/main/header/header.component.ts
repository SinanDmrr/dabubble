import { Component } from '@angular/core';
import { IChannels } from '../../interfaces/ichannels';
import { ChannelsService } from '../../services/channels.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  dummyUser?: IUser;
  dummyUserList?: IUser[]; 

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.dummyUser = this.userService.getCurrentUser();
  }
  
  test(){
    
    console.log(this.dummyUser);
    console.log(this.dummyUserList);
  }

}
