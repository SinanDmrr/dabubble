import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { IUser } from '../../interfaces/iuser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  /*   user: IUser = {
      email: "test@test.de",
      name: "Sofia Müller",
      picture: "assets/avatars/avatar_1.png",
      onlineStatus: true,
    } */

  @Input() user!: IUser;
  @Output() close = new EventEmitter<void>();

  closeProfile() {
    this.close.emit();
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
