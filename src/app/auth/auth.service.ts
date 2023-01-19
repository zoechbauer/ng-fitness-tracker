import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';


@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  loadingStateChanged = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router, 
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private uIService: UIService,
    private store: Store<fromRoot.State> // export interface State at app.reducer.ts
  ) {}

  initAuthListener() { 
    
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false; 
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(user: AuthData) {
    // this.uIService.loadingStateChanged.next(true); // mundesojme spinerin kur duhet hapur, mbyllur
    this.store.dispatch(new UI.StartLoading()); // 1. mbushim vleren me " isLoading: true " ne ui.actions.ts
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        // this.uIService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading()); // mbushim vleren me " isLoading: false " ne ui.actions.ts
      })
      .catch((error) => {
        // this.uIService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading()); // mbushim vleren me " isLoading: false " ne ui.actions.ts
        this.uIService.showSnackbar(error.message, null, 3000);
      });
  }

  login(user: AuthData) {
    // this.uIService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading()); // 1. mbushim vleren me " isLoading: true " ne ui.actions.ts 
    this.afAuth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        // this.uIService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading()); // mbushim vleren me " isLoading: false " ne ui.actions.ts
      })
      .catch((error) => {
        // this.uIService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading()); // mbushim vleren me " isLoading: false " ne ui.actions.ts
        this.uIService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
