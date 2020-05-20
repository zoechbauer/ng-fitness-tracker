import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import * as UI from '../shared/ui.actions';
@Injectable({ providedIn: 'root' })
export class TrainingService {
  // TODO delete not used variables
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  fbSubs: Subscription[] = [];

  // private availableExercises: Exercise[] = [];
  // private runningExercise: Exercise;

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            // throw new Error();
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data()['name'],
                duration: doc.payload.doc.data()['duration'],
                calories: doc.payload.doc.data()['calories'],
              };
            });
          })
          // tap((docArr) => console.log('service docArr', docArr))
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            this.store.dispatch(new UI.StopLoading());
          },
          (err) => {
            console.log(err);
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try later.',
              null,
              3
            );
            this.store.dispatch(new UI.StopLoading());
          }
        )
    );
  }

  startExercise(selectedId: string) {
    // example how we can update fields, new fields are automatically created
    this.db
      .doc('availableExercises/' + selectedId)
      .update({ lastSelected: new Date() });

    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed',
        });
      });
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addToDatabase({
          ...ex,
          date: new Date(),
          state: 'cancelled',
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
        });
      });
    this.store.dispatch(new Training.StopTraining());
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            // firebase returns date in seconds and nanoseconds
            // => convert value into milliseconds on pipe in template
            // console.log('fetchCompletedOrCancelledExercises', exercises);
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
          },
          (err) => {
            console.log(err);
          }
        )
    );
  }

  addToDatabase(exercise: Exercise) {
    this.db
      .collection('finishedExercises')
      .add(exercise)
      .then((_) =>
        console.log(`Exercise ${exercise.name} stored successfully in Firebase`)
      )
      .catch((err) =>
        console.log(`Firebase Error on saving exercise ${exercise.name}`, err)
      );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
