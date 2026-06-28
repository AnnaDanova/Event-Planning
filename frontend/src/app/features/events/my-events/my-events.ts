import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventShortResponse } from '../../../core/models/event.model';
import { getErrorMessage } from '../../../core/utils/error-message.util';

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

  constructor(private eventService: EventService) {}

  // ngOnInit(): void {
  //
  //   const userId = Number(localStorage.getItem('userId')) || 1; // TODO replace with authservice with userID from localstorage
  //
  //   this.eventService.getEventsByOrganizer(userId).subscribe({
  //     next: (events) => {
  //       this.events.set(events);
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.errorMessage.set('Грешка при зареждане на твоите събития.');
  //       this.isLoading.set(false);
  //     }
  //   });

  // TODO replace with authservice
  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');

    if (!loggedUser) {
      this.errorMessage.set('Няма логнат потребител.');
      this.isLoading.set(false);
      return;
    }

    const user = JSON.parse(loggedUser);

    this.eventService.getEventsByOrganizer(user.id).subscribe({
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
