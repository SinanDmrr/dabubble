import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  mailData = {
    email: ""
  }

  showConfirmation: boolean = false;
  
  imagePaths: Record<string, string> = {
    mail: '../../../assets/icons/mail_inactive.png',
    send: '../../../assets/icons/send-white.png',
  }
  
  constructor(private router: Router) { }
  
  goToLogin() {
    this.router.navigate([{ outlets: { 'login-router': ['login'] } }]);
    // this.authService.registerUserWithEmailAndPassword("Sascha", "sascha@keinelust.de", "keinelust", "assets/avatars/avatar_1.png")
  }

  sendMail() {
    this.showConfirmation = true;
    setTimeout(() => {
      this.showConfirmation = false;
    }, 2000);
  }

  changeIcon(icon: string) {
    this.imagePaths[icon] = this.imagePaths[icon] === `../../../assets/icons/${icon}_inactive.png` ? `../../../assets/icons/${icon}.png` : `../../../assets/icons/${icon}_inactive.png`;
  }
}
