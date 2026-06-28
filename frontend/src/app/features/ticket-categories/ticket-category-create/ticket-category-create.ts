import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketCategoryService } from '../../../core/services/ticket-category.service';

@Component({
  selector: 'app-ticket-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-category-create.html',
  styleUrl: './ticket-category-create.css'
})
export class TicketCategoryCreateComponent implements OnInit {

  eventId!: number;

  category = {
    name: '',
    quantity: 1,
    price: 0
  };

  errorMessage = signal('');
  successMessage = signal('');
  returnTo = 'details';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketCategoryService: TicketCategoryService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.returnTo = this.route.snapshot.queryParamMap.get('returnTo') ?? 'details';
  }

  createCategory(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.ticketCategoryService.createCategory(this.eventId, this.category)
      .subscribe({
        next: () => {
          this.successMessage.set('Категорията е добавена успешно.');
          this.errorMessage.set('');

          this.category = {
            name: '',
            quantity: 1,
            price: 0
          };
        },
        error: (err) => {
          console.error(err);
          this.successMessage.set('');
          this.errorMessage.set('Грешка при добавяне на категория билет.');
        }
      });
  }

  finish(): void {
    if (this.returnTo === 'edit') {
      this.router.navigate(['/events', this.eventId, 'edit']);
    } else {
      this.router.navigate(['/events', this.eventId]);
    }
  }
}
