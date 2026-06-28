import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { TicketCategoryService } from '../../../core/services/ticket-category.service';
import { TicketCategoryResponse } from '../../../core/models/ticket-category.model';
import { getErrorMessage } from '../../../core/utils/error-message.util';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-edit.html',
  styleUrls: ['./event-edit.css']
})
export class EventEditComponent implements OnInit {

  eventId!: number;

  event = {
    title: '',
    description: '',
    venue: '',
    category: '',
    capacity: 0,
    startTime: '',
    endTime: '',
    status: 'CONFIRMED',
    organizerId: 1 // TODO: replace with AuthService
  };

  ticketCategories = signal<TicketCategoryResponse[]>([]);

  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketCategoryService: TicketCategoryService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));

    this.loadEvent();
    this.loadTicketCategories();
  }

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = {
          title: event.title,
          description: event.description,
          venue: event.venue,
          category: event.category,
          capacity: event.capacity,
          startTime: event.startTime.slice(0, 16),
          endTime: event.endTime.slice(0, 16),
          status: event.status,
          organizerId: 1 // TODO: replace with AuthService
        };

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
        this.isLoading.set(false);
      }
    });
  }

  updateEvent(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.eventService.updateEvent(this.eventId, this.event).subscribe({
      next: () => {
        this.successMessage.set('Събитието е обновено успешно.');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
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

  deleteCategory(categoryId: number): void {
    if (!confirm('Сигурен ли си, че искаш да изтриеш тази категория?')) {
      return;
    }
    this.ticketCategoryService.deleteCategory(this.eventId, categoryId).subscribe({
      next: () => {
        this.successMessage.set('Категорията е изтрита успешно.');
        this.loadTicketCategories();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }
}
