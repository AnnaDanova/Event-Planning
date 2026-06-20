import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationTemplateService } from '../../../core/services/notification-template.service';
import { NotificationTemplateResponse } from '../../../core/models/notification-template.model';

@Component({
  selector: 'app-template-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './template-list.html',
  styleUrl: './template-list.css'
})
export class TemplateList implements OnInit {

  templates = signal<NotificationTemplateResponse[]>([]);
  eventId!: number;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private templateService: NotificationTemplateService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));

    this.templateService.getTemplatesByEventId(this.eventId).subscribe({
      next: (response) => {
        this.templates.set(response);
      },
      error: (err) => {
        console.log('TEMPLATE LIST ERROR:', err);
        this.errorMessage = 'Could not load notification templates.';
      }
    });
  }
}
