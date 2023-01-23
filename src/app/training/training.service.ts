import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';

// import * as fromRoot from '../app.reducer';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  fbSubs: Subscription[] = [];
  
  constructor( 
    private db: AngularFirestore,
    private uiService: UIService,
    // private store: Store<fromRoot.State> // export interface State at app.reducer.ts
    private store: Store<fromTraining.State>
  ) {}
 
  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push( // ** pse e fut funkjonis brenda nje array ???
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => { // ketu po marim vlerat e nje objekti brenda nje array te cilen jemi duke i ber subscibe dhe duke e shtuan ne nje array te si Observable
            //  throw(new Error());
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
            // aktivizojme isLoading: false
            this.store.dispatch(new UI.StopLoading()); 
            // aktivizojme availableExercises: action.payload == exercises == me nje object data
            this.store.dispatch(new Training.SetAvailableTrainings(exercises)); 
          },
          error => {
            // aktivizojme isLoading: false
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again later',
              null,
              3000
            ); 
          }));
  }

  startExercise(selectedId: string) {
    // aktivizojme "  activeTraining: { ...state.availableExercises.find(ex => ex.id === action.payload) } " , ku:
    // action.payload == selectedId
    this.store.dispatch(new Training.StartTraining(selectedId)); // ketu po shtojme vetem nje string 
  }

  completeExercise() {

    // marim objectin specifik te cilen e gjeme nga " Training.StartTraining(selectedId) "
    // ku " fromTraining.getActiveTraining " == " export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining); "
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => { // take(1) => na lejoj ne te shfaqim vetem nje vler observable te cilen e bejme subscribe
      console.log("fromTraining.getActiveTraining", ex);
      // pasi regjistrojme objektin me te dhena te cilen e kemi gjetur me ID STRING me lart e bashkangjisim ne funksjonin private addDataToDatabase(exercise: Exercise)
      this.addDataToDatabase({ 
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining()); // dhe me pas objektin qe rujtem me lart e fshim "  activeTraining: null "

      // te njeta procedura ndjekim ne funksjonin "  cancelExercise(progress: number) "
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100), 
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          // ketu do kjotrollojme, dergojme nje objekt apo nje array ?????????
          this.store.dispatch(new Training.SetFinishedTrainings(exercises)); // ketu me duket se po shton nje obejek brenda array " finishedExercises: [], " nga " finishedExercises: action.payload "
        })
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}
