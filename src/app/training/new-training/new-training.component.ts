import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exercisesSub: Subscription;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromApp.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromApp.getIsLoading);
    this.exercisesSub = this.trainingService.exercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }
}
