import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
    imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public authService: AuthService) {}

}
