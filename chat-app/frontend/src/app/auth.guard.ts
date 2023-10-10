import { CanActivateFn, UrlTree } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
