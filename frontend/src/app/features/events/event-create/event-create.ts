import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { getErrorMessage } from '../../../core/utils/error-message.util';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css']
})

export class EventCreateComponent {
  event = {
    title: '',
    description: '',
    venue: '',
    category: '',
    capacity: 0,
    startTime: '',
    endTime: '',
    status: 'CONFIRMED',
    organizerId: 0
  };

  errorMessage = signal('');

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  createEvent(): void {
    this.errorMessage.set('');
    const loggedUser = this.authService.loggedUser();
    if (!loggedUser) {
      this.errorMessage.set('Трябва да сте вписани.');
      return;
    }
    this.event.organizerId = loggedUser.id;
    this.eventService.createEvent(this.event).subscribe({
      next: (createdEvent) => {
        this.router.navigate(
          ['/events', createdEvent.id, 'ticket-categories', 'create'],
          {
            queryParams: { returnTo: 'session-create' }
          }
        );
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));      }
    });
  }
}
