import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

import { Observable } from 'rxjs/Observable'; 
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>; // ?? pse e ben Observable kete 

  constructor( 
    private authService: AuthService, 
    private store: Store<fromRoot.State> // export interface State  ne app.reducer.ts
    ) {}
 
  ngOnInit() {
    this.formFunction(); 
    this.spinnerFunction();
  }

  formFunction() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    // console.log(this.loginForm);
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }

  spinnerFunction() {

     // 5. marim strukturen STATE nga ui.reucer.ts me ndimen e nderfaqes app.reducer.ts
     this.isLoading$ = this.store.select(fromRoot.getIsLoading);

         // ketu do bejme nje prove this.store.subscribe(data => console.log(data)); i i marim te dhenat ne kohe reale

  //  this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
  //   this.isLoading = isLoading;
  //  });

  }


}
