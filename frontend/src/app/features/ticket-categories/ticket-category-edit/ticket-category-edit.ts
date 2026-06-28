import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketCategoryService } from '../../../core/services/ticket-category.service';
import { getErrorMessage } from '../../../core/utils/error-message.util';

@Component({
  selector: 'app-ticket-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-category-edit.html',
  styleUrl: './ticket-category-edit.css'
})
export class TicketCategoryEditComponent implements OnInit {

  eventId!: number;
  categoryId!: number;

  category = {
    name: '',
    quantity: 0,
    price: 0
  };

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketCategoryService: TicketCategoryService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    this.loadCategory();
  }

  loadCategory(): void {
    this.ticketCategoryService.getCategory(this.eventId, this.categoryId).subscribe({
      next: (category) => {
        this.category = {
          name: category.name,
          quantity: category.quantity,
          price: category.price
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

  updateCategory(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.ticketCategoryService.updateCategory(
      this.eventId,
      this.categoryId,
      this.category
    ).subscribe({
      next: () => {
        this.successMessage.set('Категорията е обновена успешно.');
        this.router.navigate(['/events', this.eventId, 'edit']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/events', this.eventId, 'edit']);
  }
}
