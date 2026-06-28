import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UserResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {

  user = signal<UserResponse | null>(null);
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getLoggedUser();
    console.log('loggedUser:', loggedUser);
    if (!loggedUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUserById(loggedUser.id).subscribe({
      next: (response) => {
        console.log('PROFILE RESPONSE:', response);
        this.user.set(response);
      },
      error: (err) => {
        console.log('PROFILE ERROR:', err);
        this.errorMessage = 'Could not load user profile.';
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteProfile(): void {
    const currentUser = this.user();
    if (!currentUser) {
      return;
    }
    this.userService.deleteUser(currentUser.id).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/register']);
      },
      error: (err) => {
        console.log('DELETE ERROR:', err);
        this.errorMessage = 'Could not delete profile.';
      }
    });
  }
}
