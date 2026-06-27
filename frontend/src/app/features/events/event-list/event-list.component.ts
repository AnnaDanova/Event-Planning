import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventShortResponse } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events = signal<EventShortResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  category = signal<string | null>(null);
  location = signal<string | null>(null);
  keyword = signal<string | null>(null);

  constructor(
      private eventService: EventService,
      private route: ActivatedRoute,
      private router: Router
  ) {}


  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.category.set(params.get('category'));
      this.location.set(params.get('location'));
      this.keyword.set(params.get('keyword'));

      this.loadEvents({
        category: this.category() ?? undefined,
        location: this.location() ?? undefined,
        keyword: this.keyword() ?? undefined
      });
    });
  }


  loadEvents(filters?: {
    category?: string;
    location?: string;
    keyword?: string;
  }): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.eventService.getEvents(filters).subscribe({
      next: (data) => {
        this.events.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Грешка при зареждане на събитията:', err);
        this.errorMessage.set('Неуспешно зареждане на събитията.');
        this.isLoading.set(false);
      }
    });
  }

  hasFilters(): boolean {
    return !!this.category() || !!this.location() || !!this.keyword();
  }
  clearFilters(): void {
    this.router.navigate(['/']);
  }
}

