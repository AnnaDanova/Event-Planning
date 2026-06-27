import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SessionService } from '../../../core/services/session.service';
import { SessionCreateRequest } from '../../../core/models/session.model';
import { UserResponse } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

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
    private userService: UserService,
    private authService: AuthService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  }

  createSession(): void {
    const user = this.authService.getLoggedUser();
    if (!user) {
      this.errorMessage = 'Трябва да сте вписани.';
      return;
    }
    this.sessionService.createSession(this.eventId, user.id, this.sessionData).subscribe({
      next: (createdSession) => {
        this.addSpeakers(createdSession.id);
      },
      error: (err) => {
        console.log('CREATE SESSION ERROR:', err);
        this.errorMessage = 'Само организаторът може да създава сесии.';
      }
    });
  }

  private addSpeakers(sessionId: number): void {
    const user = this.authService.getLoggedUser();
    if (!user) {
      this.errorMessage = 'Трябва да сте вписани.';
      return;
    }
    const speakers = this.selectedSpeakers();
    if (speakers.length === 0) {
      this.router.navigate(['/events', this.eventId, 'sessions']);
      return;
    }
    let completed = 0;
    speakers.forEach(speaker => {
      this.sessionService.addSpeakerToSession(this.eventId, sessionId, speaker.id, user.id).subscribe({
        next: () => {
          completed++;
          if (completed === speakers.length) {
            this.router.navigate(['/events', this.eventId, 'sessions']);
          }
        },
        error: (err) => {
          console.log('ADD SPEAKER ERROR:', err);
          this.errorMessage = 'Сесията е създадена, но един или повече лектори не можаха да бъдат добавени.';
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
