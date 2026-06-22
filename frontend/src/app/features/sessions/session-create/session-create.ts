import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SessionService } from '../../../core/services/session.service';
import { SessionCreateRequest } from '../../../core/models/session.model';
import {UserResponse} from '../../../core/models/user.model';
import {UserService} from '../../../core/services/user.service';


@Component({
  selector: 'app-session-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './session-create.html',
  styleUrl: './session-create.css'
})
export class SessionCreate {

  eventId: number;
  speakerSearch = '';
  speakerResults = signal<UserResponse[]>([]);
  selectedSpeakers = signal<UserResponse[]>([]);

  sessionData: SessionCreateRequest = {
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  };

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  }

  createSession(): void {
    this.sessionService.createSession(this.eventId, this.sessionData).subscribe({
      next: (createdSession) => {
        this.addSpeakers(createdSession.id);
      },
      error: (err) => {
        console.log('CREATE SESSION ERROR:', err);
        this.errorMessage = 'Could not create session.';
      }
    });
  }

  private addSpeakers(sessionId: number): void {
    const speakers = this.selectedSpeakers();

    if (speakers.length === 0) {
      this.router.navigate(['/events', this.eventId, 'sessions']);
      return;
    }

    let completed = 0;

    speakers.forEach(speaker => {
      this.sessionService.addSpeakerToSession(
        this.eventId,
        sessionId,
        speaker.id
      ).subscribe({
        next: () => {
          completed++;

          if (completed === speakers.length) {
            this.router.navigate(['/events', this.eventId, 'sessions']);
          }
        },
        error: (err) => {
          console.log('ADD SPEAKER ERROR:', err);
          this.errorMessage = 'Session was created, but one or more speakers could not be added.';
        }
      });
    });
  }

  searchSpeakers(): void {
    const query = this.speakerSearch.trim();

    if (query.length < 2) {
      this.speakerResults.set([]);
      return;
    }

    this.userService.searchUsers(query).subscribe({
      next: (users) => {
        this.speakerResults.set(users);
      },
      error: (err) => {
        console.log('SEARCH SPEAKERS ERROR:', err);
      }
    });
  }

  selectSpeaker(user: UserResponse): void {
    const alreadySelected = this.selectedSpeakers()
      .some(speaker => speaker.id === user.id);

    if (!alreadySelected) {
      this.selectedSpeakers.update(speakers => [...speakers, user]);
    }

    this.speakerSearch = '';
    this.speakerResults.set([]);
  }

  removeSelectedSpeaker(userId: number): void {
    this.selectedSpeakers.update(speakers =>
      speakers.filter(speaker => speaker.id !== userId)
    );
  }
}
