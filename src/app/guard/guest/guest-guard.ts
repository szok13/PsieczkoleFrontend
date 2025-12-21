import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';
import { filter, map, switchMap, take } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoaded$.pipe(
    filter(loaded => loaded === true),
    switchMap(() => authService.user$),
    take(1),
    map(user => {
      if (user) {
        return router.createUrlTree(['/home']);
      }
      return true;
    })
  );
};