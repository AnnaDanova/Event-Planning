import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../../core/services/auth.service';
import { SessionResponse } from '../../../core/models/session.model';

@Component({
  selector: 'app-speaker-sessions',
  imports:  [RouterLink, DatePipe],
  templateUrl: './speaker-sessions.html',
  styleUrl: './speaker-sessions.css',
})
export class SpeakerSessions implements OnInit {
  sessions = signal<SessionResponse[]>([]);
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private sessionService: SessionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getLoggedUser();
    if (!loggedUser) {
      this.errorMessage.set('Трябва да влезете в профила си.');
      return;
    }
    this.isLoading.set(true);
    this.sessionService.getSpeakerSessions(loggedUser.id).subscribe({
      next: (sessions) => {
        this.sessions.set(sessions);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Неуспешно зареждане на сесиите.');
        this.isLoading.set(false);
      }
    });
  }
}
