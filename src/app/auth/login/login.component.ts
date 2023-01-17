import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription; 

  constructor( 
    private authService: AuthService, 
    private uiService: UIService
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
   this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
    this.isLoading = isLoading;
   });
  }


  ngOnDestroy(): void {
    // pasi kemi theritur datat, mbyllim subscribe, ose e serojme ate 
    // nese nuk eshtojme kete funksjone, objektit subscribe do i shtohen vlerat nga:
    // this.loadingStateChanged.next(false); 
    this.loadingSubs.unsubscribe();
  }
}
