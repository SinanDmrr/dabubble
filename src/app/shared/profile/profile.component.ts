import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { IUser } from '../../interfaces/iuser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ActiveService } from '../../services/active.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Input() user!: IUser;
  @Output() close = new EventEmitter<void>();

  constructor(private userService: UserService, private router: Router, private activeService: ActiveService) {

  }

  closeProfile() {
    this.close.emit();
  }

  goToDirectMessage() {
    this.userService.setClickedDirectChatUser(this.user);
    this.router.navigate(["/direct"]);
    this.activeService.setActiveLi(this.user.id);
    this.closeProfile()
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
