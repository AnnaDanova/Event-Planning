import {Component, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { getErrorMessage } from '../../../core/utils/error-message.util';
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

  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage.set('');
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        this.authService.saveLoggedUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        const message = getErrorMessage(err);
        console.log('MESSAGE:', message);
        this.errorMessage.set(message);
      }
    });
  }
}
