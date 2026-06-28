import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventDetailsResponse, SessionResponse } from '../../../core/models/event.model';
import { TicketCategoryService } from '../../../core/services/ticket-category.service';
import { TicketCategoryResponse } from '../../../core/models/ticket-category.model';
import { TicketService } from '../../../core/services/ticket.service';
import { getErrorMessage } from '../../../core/utils/error-message.util';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetailsComponent implements OnInit {

  eventId!: number;
  from = '';

  event = signal<EventDetailsResponse | null>(null);
  ticketCategories = signal<TicketCategoryResponse[]>([]);
  sessions = signal<SessionResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private ticketCategoryService: TicketCategoryService,
    private ticketService: TicketService,
    private sessionService: SessionService,
    private authService: AuthService
  ) {}

  isOrganizer(): boolean {
    const loggedUser = this.authService.loggedUser();
    const event = this.event();
    if (!loggedUser || !event) {
      return false;
    }
    return loggedUser.email === this.event()!.organizerEmail;
  }

  ngOnInit(): void {
    this.from = this.route.snapshot.queryParamMap.get('from') ?? '';
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));

    if (!this.eventId) {
      this.errorMessage.set('Невалидно събитие.');
      this.isLoading.set(false);
      return;
    }

    this.loadEvent();
    this.loadTicketCategories();
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getSessionsByEventId(this.eventId).subscribe({
      next: (sessions) => {
        this.sessions.set(sessions);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err));
        this.isLoading.set(false);
      }
    });
  }

  loadTicketCategories(): void {
    this.ticketCategoryService.getEventCategories(this.eventId).subscribe({
      next: (categories) => {
        this.ticketCategories.set(categories);
      },
      error: (err) => {
          console.error(err);
          this.errorMessage.set(getErrorMessage(err));
        }
    });
  }

  buyTicket(categoryId: number): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const loggedUser = this.authService.loggedUser();
    if (!loggedUser) {
      this.errorMessage.set('Трябва да сте влезли в профила си.');
      return;
    }
    const request = {userId: loggedUser.id, ticketCategoryId: categoryId};

    this.ticketService.buyTicket(this.eventId, request).subscribe({
      next: () => {
        this.successMessage.set('Билетът беше закупен успешно!');
        this.loadTicketCategories();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }
}
