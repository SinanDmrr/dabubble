import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  errorMessage: string | null = null;
  imagePaths: Record<string, string> = {
    mail: '../../../assets/icons/mail_inactive.png',
    send: '../../../assets/icons/send-white.png',
  }
  
  constructor(private router: Router, private authService: AuthService) { }
  
  goToLogin() {
    this.router.navigate([{ outlets: { 'login-router': ['login'] } }]);
    // this.authService.registerUserWithEmailAndPassword("Sascha", "sascha@keinelust.de", "keinelust", "assets/avatars/avatar_1.png")
  }

  async sendMail() {
    if (!this.mailData.email) return;
  
    try {
      await this.authService.sendPasswordReset(this.mailData.email);
      this.showConfirmation = true;
  
      setTimeout(() => {
        this.showConfirmation = false;
      }, 2000);
    } catch (error) {
      this.errorMessage = "E-Mail konnte nicht gesendet werden. Bitte überprüfe deine Adresse.";
      console.error("Fehler beim Senden der Mail:", error);
      // Du kannst hier z. B. eine Fehlermeldung anzeigen lassen
    }
  }

  changeIcon(icon: string) {
    this.imagePaths[icon] = this.imagePaths[icon] === `../../../assets/icons/${icon}_inactive.png` ? `../../../assets/icons/${icon}.png` : `../../../assets/icons/${icon}_inactive.png`;
  }
}
