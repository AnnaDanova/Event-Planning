import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { SessionCreateRequest } from '../../../core/models/session.model';
import { UserResponse } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage } from '../../../core/utils/error-message.util';

@Component({
  selector: 'app-session-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './session-create.html',
  styleUrl: './session-create.css'
})
export class SessionCreate {

  eventId: number;
  returnTo = 'details';

  speakerSearch = '';
  speakerResults = signal<UserResponse[]>([]);
  selectedSpeakers = signal<UserResponse[]>([]);

  sessionData: SessionCreateRequest = {
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  };

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.returnTo = this.route.snapshot.queryParamMap.get('returnTo') ?? 'details';
  }

  createSession(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const user = this.authService.getLoggedUser();

    if (!user) {
      this.errorMessage.set('Трябва да сте вписани.');
      return;
    }

    this.sessionService.createSession(this.eventId, user.id, this.sessionData).subscribe({
      next: (createdSession) => {
        this.addSpeakers(createdSession.id);
      },
      error: (err) => {
        console.log('CREATE SESSION ERROR:', err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  private addSpeakers(sessionId: number): void {
    const user = this.authService.getLoggedUser();

    if (!user) {
      this.errorMessage.set('Трябва да сте вписани.');
      return;
    }

    const speakers = this.selectedSpeakers();

    if (speakers.length === 0) {
      this.afterSessionCreated();
      return;
    }

    let completed = 0;

    speakers.forEach(speaker => {
      this.sessionService.addSpeakerToSession(this.eventId, sessionId, speaker.id, user.id).subscribe({
        next: () => {
          completed++;

          if (completed === speakers.length) {
            this.afterSessionCreated();
          }
        },
        error: (err) => {
          console.log('ADD SPEAKER ERROR:', err);
          this.errorMessage.set(getErrorMessage(err));
        }
      });
    });
  }

  private afterSessionCreated(): void {
    this.successMessage.set('Сесията е добавена успешно.');

    this.sessionData = {
      title: '',
      description: '',
      startTime: '',
      endTime: ''
    };

    this.selectedSpeakers.set([]);
    this.speakerSearch = '';
    this.speakerResults.set([]);
  }

  finish(): void {
    if (this.returnTo === 'edit') {
      this.router.navigate(['/events', this.eventId, 'edit']);
    } else {
      this.router.navigate(['/events', this.eventId], { queryParams:{from: 'create'} });
    }
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
        this.errorMessage.set(getErrorMessage(err));
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
