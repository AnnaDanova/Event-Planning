import { Routes } from '@angular/router';

import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { UserProfile} from './features/users/user-profile/user-profile';
import { EditProfile } from './features/users/edit-profile/edit-profile';
import { NotificationList} from './features/notifications/notification-list/notification-list';
import { TemplateList} from './features/notification-templates/template-list/template-list';
import { TemplateCreate } from './features/notification-templates/template-create/template-create';
import { EventListComponent } from './features/events/event-list/event-list.component';

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
];
