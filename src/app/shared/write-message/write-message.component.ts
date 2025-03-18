import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-write-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './write-message.component.html',
  styleUrl: './write-message.component.scss'
})
export class WriteMessageComponent {
  exampleUsers = ["Frederik Beck (Du)", "Sofia Müler", "Noah Braun", "Elise Roth", "Elias Neumann", "Steffen Hoffmann"];
  showUserList = false;
  message: string = "";

  toggleUserList() {
    this.showUserList = !this.showUserList;
  }

  closeUserList() {
    this.showUserList = false;
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }

  tagUser(userToTag: string) {
    this.message = this.message + userToTag;
  }
}
