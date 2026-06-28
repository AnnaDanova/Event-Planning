import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventShortResponse } from '../../../core/models/event.model';
import { getErrorMessage } from '../../../core/utils/error-message.util';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-events.html',
  styleUrl: './my-events.css'
})
export class MyEventsComponent implements OnInit {

  events = signal<EventShortResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    const loggedUser = this.authService.loggedUser();

    if (!loggedUser) {
      this.errorMessage.set('Няма логнат потребител.');
      this.isLoading.set(false);
      return;
    }
    this.eventService.getEventsByOrganizer(loggedUser.id).subscribe({
      next: (events) => {
        this.events.set(events);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
        this.isLoading.set(false);
      }
    });
  }
}
