import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { ToggleVisibilityService } from '../../services/toggle-visibility.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerData = {
    fullname: "",
    email: "",
    password: ""
  }

  imagePaths: Record<string, string> = {
    person: 'assets/icons/person_inactive.png',
    mail: 'assets/icons/mail_inactive.png',
    lock: 'assets/icons/lock_inactive.png',
  }

  isChecked: boolean = false;
  isVisible: boolean = false;

  constructor(private router: Router, private userService: UserService, private toggleVisibility: ToggleVisibilityService) { }

  // navigateToAvatar() {
  //   this.router.navigateByUrl('/(login-router:avatar)');
  // }
  ngOnInit() {
    this.toggleVisibility.toggle$.subscribe(value => {
      this.isVisible = value;
    });
  }

  toggleContentVisibility(): void {
    this.toggleVisibility.setToggle(!this.isVisible);
    console.log(this.isVisible);
    
  }

  navigateToLegalNotice() {
    this.router.navigateByUrl('/(login-router:legal)');
  }

  goToLogin() {
    this.router.navigate([{ outlets: { 'login-router': ['login'] } }]);
    this.toggleContentVisibility()
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }
    this.userService.setUserToRegister(this.registerData.fullname, this.registerData.email, this.registerData.password);
    this.router.navigateByUrl('/(login-router:avatar)');
  }

  changeIcon(icon: string) {
    this.imagePaths[icon] = this.imagePaths[icon] === `assets/icons/${icon}_inactive.png` ? `assets/icons/${icon}.png` : `assets/icons/${icon}_inactive.png`;
  }
}