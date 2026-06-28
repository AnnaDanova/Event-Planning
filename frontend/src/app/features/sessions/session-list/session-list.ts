import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { SessionResponse } from '../../../core/models/session.model';
import { SpeakerResponse } from '../../../core/models/speaker.model';
import { UserResponse } from '../../../core/models/user.model';
import {EventDetailsResponse} from '../../../core/models/event.model';
import {EventService} from '../../../core/services/event.service';
import { getErrorMessage } from '../../../core/utils/error-message.util';

@Component({
  selector: 'app-session-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css'
})
export class SessionList implements OnInit {

  sessions = signal<SessionResponse[]>([]);
  sessionSpeakers = signal<Record<number, SpeakerResponse[]>>({});
  eventId!: number;
  errorMessage = signal('');
  loggedUser: UserResponse | null = null;
  event = signal<EventDetailsResponse | null>(null);

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loggedUser = this.authService.getLoggedUser();
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.loadSessions();
    this.loadEvent();
  }

  loadSessions(): void {
    this.sessionService.getSessionsByEventId(this.eventId).subscribe({
      next: (response) => {
        this.sessions.set(response);
        response.forEach(session=> {
          this.loadSpeakers(session.id);
        });
      },
      error: (err) => {
        console.log('SESSION LIST ERROR:', err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => this.event.set(event),
      error: (err) => {
        console.error('Error loading event', err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  loadSpeakers(sessionId: number): void {
    this.sessionService.getSpeakersBySessionId(this.eventId, sessionId).subscribe({
      next: (speakers) => {
        this.sessionSpeakers.update(current => ({
          ...current,
          [sessionId]: speakers
        }));
      },
      error: (err) => {
        console.log('LOAD SPEAKERS ERROR:', err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  deleteSession(sessionId: number): void {
    const user = this.authService.getLoggedUser();

    if (!user) {
      this.errorMessage.set('Трябва да сте вписани.');
      return;
    }
    this.sessionService.deleteSession(this.eventId, sessionId, user.id).subscribe({
      next: () => {
        this.sessions.update(sessions =>
          sessions.filter(session => session.id !== sessionId)
        );
      },
      error: (err) => {
        console.log('DELETE SESSION ERROR:', err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  canEditSession(session: SessionResponse): boolean {
    if (!this.loggedUser) {
      return false;
    }
    const isOrganizer = session.organizerId === this.loggedUser.id;
    const isSpeaker = session.speakers?.some(speaker => speaker.id === this.loggedUser!.id) ?? false;
    return isOrganizer || isSpeaker;
  }

  canManageEvent(): boolean {
    const event = this.event();
    if (!this.loggedUser || !event) {
      return false;
    }
    return this.loggedUser.email === event.organizerEmail;
  }

  canDeleteSession(session: SessionResponse): boolean {
    return !!this.loggedUser && session.organizerId === this.loggedUser.id;
  }
}
