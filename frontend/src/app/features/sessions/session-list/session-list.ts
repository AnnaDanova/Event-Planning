import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SessionService } from '../../../core/services/session.service';
import { SessionResponse } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css'
})
export class SessionList implements OnInit {

  sessions = signal<SessionResponse[]>([]);
  eventId!: number;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getSessionsByEventId(this.eventId).subscribe({
      next: (response) => {
        this.sessions.set(response);
      },
      error: (err) => {
        console.log('SESSION LIST ERROR:', err);
        this.errorMessage = 'Could not load sessions.';
      }
    });
  }

  deleteSession(sessionId: number): void {
    this.sessionService.deleteSession(this.eventId, sessionId).subscribe({
      next: () => {
        this.sessions.update(sessions =>
          sessions.filter(session => session.id !== sessionId)
        );
      },
      error: (err) => {
        console.log('DELETE SESSION ERROR:', err);
        this.errorMessage = 'Could not delete session.';
      }
    });
  }
}
