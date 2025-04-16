import { Component, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToggleVisibilityService } from '../../services/toggle-visibility.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  
  isVisible: boolean = true;

  constructor(private router: Router, private toggleVisibility: ToggleVisibilityService) {}
  ngOnInit() {
    this.router.navigate([{ outlets: { 'login-router': ['login'] } }]);
    this.toggleVisibility.toggle$.subscribe(value => {
      this.isVisible = value;
    });
  }

  toggleContentVisibility(): void {
    this.toggleVisibility.setToggle(!this.isVisible);
  }

}
