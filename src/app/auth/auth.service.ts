import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromApp from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
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
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((err) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(err, null, 3);
      });
  }

  login(user: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((err) => {
        this.store.dispatch(new UI.StopLoading());
        this.snackbar.open(err, null, { duration: 3000 });
        this.uiService.showSnackbar(err, null, 3);
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
