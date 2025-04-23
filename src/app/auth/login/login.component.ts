import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  currentPassword: string = '';
  newPassword: string = '';
  error: string = '';
  submitError: boolean = true;
  submitAttempted: boolean = false;
  showErrorPopup: boolean = false;
  loginFailed$ = this.authService.getLoginFailed();

  loginData = {
    email: "",
    password: ""
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  }

  goToRegister() {
    this.router.navigate([{ outlets: { 'login-router': ['register'] } }]);
  }

  goToChangePassword() {
    this.router.navigateByUrl('/(login-router:password)');
  }

  login(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      this.submitError = false;
      this.authService.loginWithEmailAndPassword(this.loginData.email, this.loginData.password);
      this.authService.getLoginFailed().subscribe(failed => {
        if (failed) {
          this.showErrorPopup = true;
        }
      });
      if (this.submitAttempted && this.submitError) {
        console.log(this.loginFailed$);
        this.showErrorPopup = true;
      }
    }
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
