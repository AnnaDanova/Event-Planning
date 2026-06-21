import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventShortResponse } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // За @for цикъл и линкове за навигация
  templateUrl: './event-list.component.html', // или директно в същия файл според конфигурацията ви
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: EventShortResponse[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Грешка при зареждане на събитията:', err);
        this.errorMessage = 'Неуспешно свързване с бекенда. Проверете дали Spring Boot работи.';
        this.isLoading = false;
      }
    });
  }
}
