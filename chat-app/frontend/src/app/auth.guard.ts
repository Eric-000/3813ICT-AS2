import { CanActivateFn, UrlTree } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  // const currentUser = localStorage.getItem('currentUser');
  // // if user is logged in, it should not be able to access login page
  // if (state.url === '/login' && currentUser) {
  //   return false;
  // }

  // if (state.url === '/chat') {
  //   if (!currentUser) {
  //     return false;
  //   }
  // }

  return true;
};
