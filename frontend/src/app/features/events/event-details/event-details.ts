import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventDetailsResponse } from '../../../core/models/event.model';


@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetailsComponent implements OnInit {

  event = signal<EventDetailsResponse | null>(null);

  isLoading = signal(true);

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {

    const eventId = Number(
      this.route.snapshot.paramMap.get('id')
    );

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
  }
}
