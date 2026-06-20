import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationResponse } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css'
})
export class NotificationList implements OnInit {

  notifications = signal<NotificationResponse[]>([]);
  errorMessage = '';
  showAll = false;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUnreadNotifications();
  }

  hasUnreadNotifications(): boolean {
    return this.notifications().some(notification => notification.status !== 'READ');
  }

  loadUnreadNotifications(): void {
    const loggedUser = this.authService.getLoggedUser();

    if (!loggedUser) {
      this.errorMessage = 'You must be logged in to view notifications.';
      return;
    }

    this.notificationService.getUnreadNotificationsByUserId(loggedUser.id).subscribe({
      next: (response) => {
        this.notifications.set(response);
        this.showAll = false;
      },
      error: (err) => {
        console.log('UNREAD NOTIFICATIONS ERROR:', err);
        this.errorMessage = 'Could not load unread notifications.';
      }
    });
  }

  loadAllNotifications(): void {
    const loggedUser = this.authService.getLoggedUser();

    if (!loggedUser) {
      this.errorMessage = 'You must be logged in to view notifications.';
      return;
    }

    this.notificationService.getNotificationsByUserId(loggedUser.id).subscribe({
      next: (response) => {
        this.notifications.set(response);
        this.showAll = true;
      },
      error: (err) => {
        console.log('ALL NOTIFICATIONS ERROR:', err);
        this.errorMessage = 'Could not load notifications.';
      }
    });
  }

  toggleNotificationsView(): void {
    if (this.showAll) {
      this.loadUnreadNotifications();
    } else {
      this.loadAllNotifications();
    }
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        if (this.showAll) {
          this.notifications.update(notifications =>
            notifications.map(notification =>
              notification.id === notificationId
                ? { ...notification, status: 'READ' }
                : notification
            )
          );
        } else {
          this.notifications.update(notifications =>
            notifications.filter(notification => notification.id !== notificationId)
          );
        }
      },
      error: (err) => {
        console.log('MARK AS READ ERROR:', err);
      }
    });
  }

  markAllAsRead(): void {
    const loggedUser = this.authService.getLoggedUser();

    if (!loggedUser) {
      return;
    }

    this.notificationService.markAllNotificationsAsRead(loggedUser.id).subscribe({
      next: () => {
        if (this.showAll) {
          this.notifications.update(notifications =>
            notifications.map(notification => ({
              ...notification,
              status: 'READ'
            }))
          );
        } else {
          this.notifications.set([]);
        }
      },
      error: (err) => {
        console.log('MARK ALL AS READ ERROR:', err);
      }
    });
  }
}
