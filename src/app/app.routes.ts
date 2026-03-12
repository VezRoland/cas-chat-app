import { Routes } from '@angular/router';
import { SignUpPage } from './routes/sign-up/sign-up-page';
import { SignInPage } from './routes/sign-in/sign-in-page';
import { RoomsPage } from './routes/rooms/rooms-page';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignUpPage,
    title: 'Sign Up',
  },
  {
    path: 'signin',
    component: SignInPage,
    title: 'Sign In',
  },
  {
    path: 'rooms',
    component: RoomsPage,
    title: 'Chat Rooms',
  },
];
