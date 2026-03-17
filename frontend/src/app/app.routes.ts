import { Routes } from '@angular/router';
import { guestGuard } from '../features/auth/guest.guard';
import { authGuard } from '../features/auth/auth.guard';
import { SignInComponent } from '../features/auth/signin/signin.component';
import { ChatComponent } from '../features/chat/chat.component';
import { ChatAreaComponent } from '../features/chat/chat-area/chat-area.component';

export const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard],
    children: [{ path: ':id', component: ChatAreaComponent }],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chat',
  },
];
