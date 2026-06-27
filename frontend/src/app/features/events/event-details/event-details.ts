import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventDetailsResponse } from '../../../core/models/event.model';
import { TicketCategoryService } from '../../../core/services/ticket-category.service';
import { TicketCategoryResponse } from '../../../core/models/ticket-category.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetailsComponent implements OnInit {

  event = signal<EventDetailsResponse | null>(null);

  ticketCategories = signal<TicketCategoryResponse[]>([]);

  isLoading = signal(true);

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private ticketCategoryService: TicketCategoryService,
  ) {}

  ngOnInit(): void {
  //  const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));

    if (!eventId) {
      this.errorMessage.set('Невалидно събитие.');
      this.isLoading.set(false);
      return;
    }

    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Грешка при зареждане на събитието.');
        this.isLoading.set(false);
      }
    });

    this.ticketCategoryService.getEventCategories(eventId).subscribe({
      next: (categories) => {
        this.ticketCategories.set(categories);
      },
      error: () => {
        console.error('Грешка при зареждане на категориите.');
      }
    });
  }
}
