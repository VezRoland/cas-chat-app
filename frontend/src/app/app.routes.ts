import { Routes } from '@angular/router';
import { guestGuard } from '../features/auth/guest.guard';
import { authGuard } from '../features/auth/auth.guard';
import { SignInComponent } from '../features/auth/signin/signin.component';
import { ChatComponent } from '../features/chat/chat.component';
import { ChatAreaComponent } from '../features/chat/chat-area/chat-area.component';
import { SignUpComponent } from '../features/auth/signup/signup.component';

export const routes: Routes = [
  {
    title: 'Sign In | Chat App',
    path: 'signin',
    component: SignInComponent,
    canActivate: [guestGuard],
  },
  {
    title: 'Sign Up | Chat App',
    path: 'signup',
    component: SignUpComponent,
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
