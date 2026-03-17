import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) return true;

  return authService.getUser().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/signin']);
      return of(false);
    }),
  );
};
