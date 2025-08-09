import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../appServices/auth.service';

@Injectable()
export class LogInGuard implements CanActivate {
  constructor(private _authSerivice: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this._authSerivice.getIsAuth();

    if (isAuth) {
      return this.router.createUrlTree(['/app-dashboard']);
    }
    return true;
  }
}
