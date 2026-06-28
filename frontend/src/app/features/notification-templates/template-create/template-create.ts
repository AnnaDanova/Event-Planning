import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationTemplateService } from '../../../core/services/notification-template.service';
import { NotificationTemplateRequest } from '../../../core/models/notification-template.model';
import { getErrorMessage } from '../../../core/utils/error-message.util';

@Component({
  selector: 'app-template-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './template-create.html',
  styleUrl: './template-create.css'
})
export class TemplateCreate {

  eventId: number;

  templateData: NotificationTemplateRequest = {
    eventId: 0,
    message: '',
    scheduledAt: '',
    type: 'EVENT_REMINDER'
  };

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: NotificationTemplateService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.templateData.eventId = this.eventId;
  }

  createTemplate(): void {
    this.templateService.createTemplate(this.eventId, this.templateData).subscribe({
      next: () => {
        this.router.navigate(['/events', this.eventId, 'notification-templates']);
      },
      error: (err) => {
        console.log('CREATE TEMPLATE ERROR:', err);
        this.errorMessage.set(getErrorMessage(err));
      }
    });
  }
}
