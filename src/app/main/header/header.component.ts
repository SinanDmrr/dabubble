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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.dummyUser = user;
    });
  }
  
  test(){
    console.log(this.dummyUser);
  }

}
