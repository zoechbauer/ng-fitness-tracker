import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from 'src/app/shared/ui.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable'; 
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html', 
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  isLoading = true;
  private exerciseSubscription: Subscription;
  isLoading$: Observable<boolean>;
 
  constructor( 
    private trainingService: TrainingService, 
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {

    this.exersicesFunction();
    this.spinnerFunction();

  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  exersicesFunction() {
    this.trainingService.fetchAvailableExercises(); 
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        console.log("exercises", exercises);
        this.exercises = exercises;
      } 
    );
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

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
} 
