import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  currentPassword: string = '';
  newPassword: string = '';
  error: string = '';

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
  }

  register() {
    this.authService.registerUserWithEmailAndPassword("Sascha", "sascha@keinelust.de", "keinelust", "assets/avatars/avatar_1.png")
  }

  login() {
    this.authService.loginWithEmailAndPassword("sascha@keinelust.de", "keinelust");
  }

  guestLogin() {
    this.authService.forceLogin();
  }

  loginGoogle() {
    this.authService.loginWithGoogleAccount();
  }

  async onPasswordchangeSubmit() {
    try {
      await this.authService.changePassword(this.currentPassword, this.newPassword);
      alert('Passwort erfolgreich geändert!');
      this.currentPassword = '';
      this.newPassword = '';
    } catch (error: any) {
      // error message to display in HTML
      this.error = error.message || 'Fehler beim Ändern des Passworts';
    }
  }
}
