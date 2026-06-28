import { Component, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRegisterRequest } from '../../../core/models/user.model';
import { getErrorMessage } from '../../../core/utils/error-message.util';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  registerData: UserRegisterRequest = {
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    password: '',
    address: ''
  };

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.registerData).subscribe({
      next: (user) => {
        this.authService.saveLoggedUser(user);
        this.successMessage.set('Регистрацията е успешна!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }
}
