import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserLoginRequest, UserRegisterRequest, UserResponse} from '../models/user.model';

@Injectable({providedIn: 'root'})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  register(request: UserRegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: UserLoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, request);
  }

  saveLoggedUser(user: UserResponse): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getLoggedUser(): UserResponse | null {
    const user = localStorage.getItem('loggedUser');
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
  }

  isLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  }
}
