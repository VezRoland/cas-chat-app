import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    router.navigate(['/chat']);
    return false;
  }

  return authService.getUser().pipe(
    map(() => {
      router.navigate(['/chat']);
      return false;
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
