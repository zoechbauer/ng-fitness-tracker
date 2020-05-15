import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user.model';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(user: AuthData) {
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        // console.log(result);
        this.authSuccessfully();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  login(user: AuthData) {
    this.afAuth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        // console.log(result);
        this.authSuccessfully();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
