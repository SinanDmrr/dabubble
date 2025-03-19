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

  loginGoogle() {
    this.authService.loginWithGoogleAccount();
  }
}
