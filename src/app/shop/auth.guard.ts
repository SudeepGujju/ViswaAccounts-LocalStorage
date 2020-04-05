import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authSrvc: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.validateRoute(next, state);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.validateRoute(next, state);
  }

  validateRoute(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // console.log(state.url, this.authSrvc.user);

    if (state.url.endsWith('login') || state.url.endsWith('register')) {
      this.authSrvc.logout();
      return true;
    } else if (!this.authSrvc.user) {

      this.router.navigate(['shop/login']);
      return false;
    }

    return true;
  }

}
