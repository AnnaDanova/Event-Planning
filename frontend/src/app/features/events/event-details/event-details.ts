import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventDetailsResponse } from '../../../core/models/event.model';
import { TicketCategoryService } from '../../../core/services/ticket-category.service';
import { TicketCategoryResponse } from '../../../core/models/ticket-category.model';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetailsComponent implements OnInit {

  eventId!: number;

  event = signal<EventDetailsResponse | null>(null);
  ticketCategories = signal<TicketCategoryResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private ticketCategoryService: TicketCategoryService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));

    if (!this.eventId) {
      this.errorMessage.set('Невалидно събитие.');
      this.isLoading.set(false);
      return;
    }

    this.loadEvent();
    this.loadTicketCategories();
  }

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Грешка при зареждане на събитието.');
        this.isLoading.set(false);
      }
    });
  }

  loadTicketCategories(): void {
    this.ticketCategoryService.getEventCategories(this.eventId).subscribe({
      next: (categories) => {
        this.ticketCategories.set(categories);
      },
      error: () => {
        console.error('Грешка при зареждане на категориите.');
      }
    });
  }

  buyTicket(categoryId: number): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    // TODO: replace with AuthService
    const loggedUser = localStorage.getItem('loggedUser');

    if (!loggedUser) {
      this.errorMessage.set('Трябва да сте влезли в профила си.');
      return;
    }

    const user = JSON.parse(loggedUser);

    const request = {
      userId: user.id,
      ticketCategoryId: categoryId
    };

    this.ticketService.buyTicket(this.eventId, request).subscribe({
      next: () => {
        this.successMessage.set('Билетът беше закупен успешно!');
        this.loadTicketCategories();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Грешка при закупуване на билет.');
      }
    });
  }
}
