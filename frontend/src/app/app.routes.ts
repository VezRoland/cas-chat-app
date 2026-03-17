import { Routes } from '@angular/router';
import { guestGuard } from '../features/auth/guest.guard';
import { SignInComponent } from '../features/auth/signin/signin.component';

export const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [guestGuard],
  },
];
