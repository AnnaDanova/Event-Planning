import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { UserLoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData: UserLoginRequest = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        this.authService.saveLoggedUser(user);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password!';
      }
    });
  }
}
