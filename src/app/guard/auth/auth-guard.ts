import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We look at the user$ stream in the AuthService
  return authService.user$.pipe(
    take(1), // We only need the current value
    map(user => {
      if (user) {
        return true; // User is logged in, allow access
      } else {
        // Not logged in, redirect to login page
        return router.createUrlTree(['/login']);
      }
    })
  );
};