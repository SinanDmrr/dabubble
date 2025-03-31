import { Component, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.navigate([{ outlets: { 'login-router': ['login'] } }]);
  }

}
