import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromRoot from '../app.reducer';

// some differences to max's version because of cli creation
@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromRoot.State>
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(next: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
