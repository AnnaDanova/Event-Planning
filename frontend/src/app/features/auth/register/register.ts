import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  registerData: UserRegisterRequest = {
    username: '',
    email: '',
    password: '',
    address: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.authService.register(this.registerData).subscribe({
      next: (user) => {
        this.authService.saveLoggedUser(user);
        this.successMessage = 'Registration successful!';
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Registration failed!';
      }
    });
  }
}
