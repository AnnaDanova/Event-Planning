import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import {UserResponse, UserUpdateRequest} from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
  userId: number | null = null;
  selectedFile: File | null = null;

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
        if (this.selectedFile) {
          this.uploadPhotoAndFinish();
        } else {
          this.finishUpdate(updatedUser);
        }
      },
      error: () => {
        this.errorMessage = 'Could not update profile.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedFile = input.files[0];
  }

  uploadProfilePhoto(): void {
    if (!this.selectedFile || !this.userId) {
      this.errorMessage = 'Please select a file first.';
      return;
    }
    this.userService.uploadProfilePhoto(this.userId, this.selectedFile).subscribe({
      next: (updatedUser) => {
        this.authService.saveLoggedUser(updatedUser);
        this.updateData().profilePhoto = updatedUser.profilePhoto ?? '';
        this.successMessage = 'Profile photo uploaded successfully.';
        this.selectedFile = null;
      },
      error: (err) => {
        console.log('UPLOAD PROFILE PHOTO ERROR:', err);
        this.errorMessage = 'Could not upload profile photo.';
      }
    });
  }

  private uploadPhotoAndFinish(): void {
    if (!this.selectedFile || !this.userId) {
      return;
    }
    this.userService.uploadProfilePhoto(this.userId, this.selectedFile).subscribe({
      next: (updatedUser) => {
        this.finishUpdate(updatedUser);
      },
      error: (err) => {
        console.log('UPLOAD PROFILE PHOTO ERROR:', err);
        this.errorMessage = 'Profile was updated, but photo could not be uploaded.';
      }
    });
  }
  private finishUpdate(updatedUser: UserResponse): void {
    this.authService.saveLoggedUser(updatedUser);
    this.successMessage = 'Profile updated successfully.';
    this.selectedFile = null;
    this.router.navigate(['/profile']);
  }
}
