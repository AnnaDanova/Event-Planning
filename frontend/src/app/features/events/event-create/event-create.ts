import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

const userId = Number(localStorage.getItem('userId'));

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
    organizerId: 1 // TODO: remove organizerId - used for testing or with authservice
  };

  errorMessage = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  createEvent(): void {
    this.errorMessage = '';

    this.eventService.createEvent(this.event).subscribe({
      next: (createdEvent) => {
        this.router.navigate([
          '/events',
          createdEvent.id,
          'ticket-categories',
          'create'
        ]);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Грешка при създаване на събитие.';
      }
    });
  }
}
