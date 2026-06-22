import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UserUpdateRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
  userId: number | null = null;

  updateData = signal<UserUpdateRequest> ({
    lastName: '',
    bio: '',
    email: '',
    address: '',
    profilePhoto: ''
  });

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getLoggedUser();
    if (!loggedUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = loggedUser.id;
    this.userService.getUserById(loggedUser.id).subscribe({
      next: (user) => {
        this.updateData.set({
          lastName: loggedUser.lastName,
          bio: loggedUser.bio ?? '',
          email: user.email,
          address: user.address || '',
          profilePhoto: user.profilePhoto || ''
        });
      },
      error: () => {
        this.errorMessage = 'Could not load profile data.';
      }
    });
  }

  updateProfile(): void {
    if (!this.userId) {
      return;
    }

    this.userService.updateUser(this.userId, this.updateData()).subscribe({
      next: (updatedUser) => {
        this.authService.saveLoggedUser(updatedUser);
        this.successMessage = 'Profile updated successfully.';
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.errorMessage = 'Could not update profile.';
      }
    });
  }
}
