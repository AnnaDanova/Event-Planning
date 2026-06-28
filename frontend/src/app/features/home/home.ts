import { Component } from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  keyword = '';
  location = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  searchEvents(): void {
    this.router.navigate(['/events'], {
      queryParams: {
        keyword: this.keyword || null,
        location: this.location || null
      }
    });
  }
}
