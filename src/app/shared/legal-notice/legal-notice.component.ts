import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

  constructor(private router: Router) {}
  
    backToLogin() {
      this.router.navigate([{ outlets: { 'login-router': ['login'] } }]);
    }
}
