import { Routes } from '@angular/router';

import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { UserProfile} from './features/users/user-profile/user-profile';
import { EditProfile } from './features/users/edit-profile/edit-profile';
import { SessionList } from './features/sessions/session-list/session-list';
import { SessionCreate } from './features/sessions/session-create/session-create';
import { SessionEdit } from './features/sessions/session-edit/session-edit';
import { NotificationList} from './features/notifications/notification-list/notification-list';
import { TemplateList} from './features/notification-templates/template-list/template-list';
import { TemplateCreate } from './features/notification-templates/template-create/template-create';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'profile', component: UserProfile },
  { path: 'profile/edit', component: EditProfile},
  { path: 'events/:eventId/sessions', component: SessionList},
  { path: 'events/:eventId/sessions/create', component: SessionCreate},
  { path: 'events/:eventId/sessions/:sessionId/edit', component: SessionEdit},
  { path: 'notifications', component: NotificationList},
  { path: 'events/:eventId/notification-templates/create', component: TemplateCreate},
  { path: 'events/:eventId/notification-templates', component: TemplateList},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
