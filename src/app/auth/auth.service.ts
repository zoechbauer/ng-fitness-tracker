import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';


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
    private uIService: UIService
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
    this.uIService.loadingStateChanged.next(true); // mundesojme spinerin kur duhet hapur, mbyllur
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        this.uIService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uIService.loadingStateChanged.next(false);
        this.uIService.showSnackbar(error.message, null, 3000);
      });
  }

  login(user: AuthData) {
    this.uIService.loadingStateChanged.next(true);
    this.afAuth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        this.uIService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uIService.loadingStateChanged.next(false);
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
