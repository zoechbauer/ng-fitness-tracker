import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

import { Observable } from 'rxjs/Observable'; 
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit { 
  maxDate: Date;
  minDate: Date;
  isLoading = false;

  isLoading$: Observable<boolean>;
 
 
  constructor( 
    private authService: AuthService, 
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);

    this.spinnerFunction();
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password, 
    });
  }

  spinnerFunction() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //  this.isLoading = isLoading;
    // });
   }

 
}
