import { Routes } from '@angular/router';

import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { UserProfile} from './features/users/user-profile/user-profile';
import { EditProfile } from './features/users/edit-profile/edit-profile';
import { NotificationList} from './features/notifications/notification-list/notification-list';
import { TemplateList} from './features/notification-templates/template-list/template-list';
import { TemplateCreate } from './features/notification-templates/template-create/template-create';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventCreateComponent } from './features/events/event-create/event-create';
import { EventDetailsComponent } from './features/events/event-details/event-details';
import { TicketCategoryCreateComponent } from './features/ticket-categories/ticket-category-create/ticket-category-create';
import { MyEventsComponent } from './features/events/my-events/my-events';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'profile', component: UserProfile },
  { path: 'profile/edit', component: EditProfile},
  { path: 'notifications', component: NotificationList},
  { path: 'events/:eventId/notification-templates/create', component: TemplateCreate},
  { path: 'events/:eventId/notification-templates', component: TemplateList},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'events', component: EventListComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/:eventId', component: EventDetailsComponent },
  { path: 'events/:eventId/ticket-categories/create', component: TicketCategoryCreateComponent },
  { path: 'my-events', component: MyEventsComponent },
];
