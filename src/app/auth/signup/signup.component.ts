import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy { 
  maxDate: Date;
  minDate: Date;
  isLoading = false;
  private loadingSubs: Subscription; 

  constructor( 
    private authService: AuthService, 
    private uiService: UIService
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
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
     this.isLoading = isLoading;
    });
   }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }
}
