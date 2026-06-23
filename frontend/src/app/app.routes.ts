import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { NotAuthorized } from './features/errors/not-authorized/not-authorized';
import { Home } from './features/home/home';
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
  { path: 'profile', component: UserProfile, canActivate: [authGuard]},
  { path: 'profile/edit', component: EditProfile, canActivate: [authGuard]},
  { path: 'events/:eventId/sessions', component: SessionList, canActivate: [authGuard]},
  { path: 'events/:eventId/sessions/create', component: SessionCreate, canActivate: [authGuard]},
  { path: 'events/:eventId/sessions/:sessionId/edit', component: SessionEdit, canActivate: [authGuard]},
  { path: 'notifications', component: NotificationList, canActivate: [authGuard]},
  { path: 'events/:eventId/notification-templates/create', component: TemplateCreate,canActivate: [authGuard]},
  { path: 'events/:eventId/notification-templates', component: TemplateList,canActivate: [authGuard]},
  { path: 'not-authorized', component: NotAuthorized },
  { path: '', component: Home }
];
