import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user.model';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  private user: User;
  authChange = new Subject<boolean>();

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(user: AuthData) {
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch((err) => {
        console.log(err);
      });

    // this.user = {
    //   email: user.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
  }

  login(user: AuthData) {
    this.afAuth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch((err) => {
        console.log(err);
      });

    // this.user = {
    //   email: user.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }
}
