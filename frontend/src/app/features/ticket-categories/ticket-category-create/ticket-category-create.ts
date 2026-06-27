import { Component, OnInit } from '@angular/core';
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
    quantity: 0,
    price: 0
  };

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketCategoryService: TicketCategoryService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(
      this.route.snapshot.paramMap.get('eventId')
    );
  }

  createCategory(): void {
    this.ticketCategoryService
      .createCategory(this.eventId, this.category)
      .subscribe({
        next: () => {
          this.router.navigate(['/events', this.eventId]);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Грешка при създаване на категория билети.';
        }
      });
  }
}
