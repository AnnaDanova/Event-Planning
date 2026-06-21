import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SessionService } from '../../../core/services/session.service';
import { SessionCreateRequest } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './session-create.html',
  styleUrl: './session-create.css'
})
export class SessionCreate {

  eventId: number;

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
    private sessionService: SessionService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  }

  createSession(): void {
    this.sessionService.createSession(this.eventId, this.sessionData).subscribe({
      next: () => {
        this.router.navigate(['/events', this.eventId, 'sessions']);
      },
      error: (err) => {
        console.log('CREATE SESSION ERROR:', err);
        this.errorMessage = 'Could not create session.';
      }
    });
  }
}
