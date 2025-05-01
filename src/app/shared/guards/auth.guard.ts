import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if(user){
        return true;
      }
      console.log("Nincs bejelentkezve");
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if(!user){
        return true;
      }

      console.log("Be van lenentkezve, nem szükséges megint.");
      router.navigate(['/home']);
      return false;
    })
  );
};
