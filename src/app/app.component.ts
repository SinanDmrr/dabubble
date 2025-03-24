import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './main/landing-page/landing-page.component';
import { AuthService } from './services/auth.service';
import { LoginPageComponent } from './auth/login-page/login-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LandingPageComponent, LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authStatus: boolean = true;
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.auth$.subscribe(auth => {
      this.authStatus = auth;
      
    })
  }
}
