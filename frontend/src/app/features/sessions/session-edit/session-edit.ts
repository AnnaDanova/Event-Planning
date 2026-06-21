import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SessionService } from '../../../core/services/session.service';
import { SessionCreateRequest } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './session-edit.html',
  styleUrl: './session-edit.css'
})
export class SessionEdit implements OnInit {

  eventId!: number;
  sessionId!: number;

  sessionData = signal<SessionCreateRequest>({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));

    this.loadSession();
  }

  loadSession(): void {
    this.sessionService.getSessionById(this.eventId, this.sessionId).subscribe({
      next: (session) => {
        this.sessionData.set({
          title: session.title,
          description: session.description,
          startTime: this.formatDateForInput(session.startTime),
          endTime: this.formatDateForInput(session.endTime)
        });
      },
      error: (err) => {
        console.log('LOAD SESSION ERROR:', err);
        this.errorMessage = 'Could not load session.';
      }
    });
  }

  updateSession(): void {
    this.sessionService.updateSession(this.eventId, this.sessionId, this.sessionData()).subscribe({
      next: () => {
        this.router.navigate(['/events', this.eventId, 'sessions']);
      },
      error: (err) => {
        console.log('UPDATE SESSION ERROR:', err);
        this.errorMessage = 'Could not update session.';
      }
    });
  }

  updateField(field: keyof SessionCreateRequest, value: string): void {
    this.sessionData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  private formatDateForInput(dateValue: string): string {
    if (!dateValue) {
      return '';
    }

    return dateValue.slice(0, 16);
  }
}
