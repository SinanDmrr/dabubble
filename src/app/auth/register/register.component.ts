import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';

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

  isChecked: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  navigateToAvatar() {
    this.router.navigateByUrl('/(login-router:avatar)');
  }

  navigateToLegalNotice() {
    this.router.navigateByUrl('/(login-router:legal)');
  }

  register(form: NgForm) {
    if (!form.valid) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }
    this.userService.setUserToRegister(this.registerData.fullname, this.registerData.email, this.registerData.password);
    this.router.navigateByUrl('/(login-router:avatar)');
  }
}