import { Routes } from '@angular/router';

import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import {UserProfile} from './features/users/user-profile/user-profile';
import { EditProfile } from './features/users/edit-profile/edit-profile';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'profile', component: UserProfile },
  { path: 'profile/edit', component: EditProfile},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
