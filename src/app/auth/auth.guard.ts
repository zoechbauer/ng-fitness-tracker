import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';

import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as fromRoot from '../app.reducer';

// some differences to max's version because of cli creation
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> 
    | boolean
    | UrlTree {
    // if (this.authService.isAuth()) {
    //   return true; 
    // } else {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    return this.store.select(fromRoot.getIsAuth).pipe(take(1)); // ketu marim  isAuthenticated: boolean; kur eshte true ose false
  }

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1)); 
  }
}
