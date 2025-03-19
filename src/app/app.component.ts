import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './main/landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LandingPageComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authStatus: boolean = false;
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.auth$.subscribe(auth => {
      this.authStatus = auth;
      
    })
  }
}
