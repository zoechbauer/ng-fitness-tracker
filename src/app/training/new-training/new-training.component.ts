import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable'; 

import { Store } from '@ngrx/store';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html', 
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit{

  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;
 
  constructor( 
    private trainingService: TrainingService, 
    // private store: Store<fromRoot.State>
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {

    this.exersicesFunction();
    this.spinnerFunction();

  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  exersicesFunction() {
    // nga " fromTraining.getAvailableExercises " therasim funksjonin " export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises); ",
    // i cili theret ARRAY "  availableExercises: Exercise[]; " me te gjitha vlerat brenda, ku ne me pas i bejme: " *ngFor="let exercise of exercises$ | async" "
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.trainingService.fetchAvailableExercises(); 
  }
 
  spinnerFunction() {

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    // this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
    //   isLoading => {
    //     this.isLoading = isLoading;
    //   }
    // );
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

} 
