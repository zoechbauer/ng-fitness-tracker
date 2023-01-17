import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>(); 
  fbSubs: Subscription[] = [];

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise; 

  constructor( 
    private db: AngularFirestore,
    private uiService: UIService 
  ) {}
 
  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
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
            this.uiService.loadingStateChanged.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]); 
          }, (error) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
            this.exercisesChanged.next(null);
          }));
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            
            this.finishedExercisesChanged.next(exercises);
          },
          (err) => {
            console.log(err);
          }
        )
    );
  }

  cancelSubscriptions() {
    console.log(" this.fbSubs",  this.fbSubs);
    this.fbSubs.forEach((sub: Subscription) => { 
      sub.unsubscribe();
      console.log("subsub", sub); 
    });
  }

  startExercise(selectedId: string) {// ketu marim id e ushtrimit qe zgjedhim i cili eshte nje string barcode
    // example how we can update fields, new fields are automatically created
    this.db
     // availableExercises/ + id string ku ne jemi duke selektur vetem nje objekt brenda array " availableExercises "
      .doc('availableExercises/' + selectedId)
      .update({ lastSelected: new Date() }); // **** ketu me von do bej ca prova per set() dhe delete(), te tabela qe shfaq te dhenat 

    this.runningExercise = this.availableExercises.find(
      (exercise) => exercise.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise }); // regjistrojme vetem nje objekt observable
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addToDatabase({
      ...this.runningExercise,
      date: new Date(), 
      state: 'cancelled',
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  // ** ketu do kontrolloj, marim array apo object data nga  completeExercise dhe cancelExercise
  addToDatabase(exercise: Exercise) { 
    this.db
      .collection('finishedExercises')
      .add(exercise) // krijojme nje array me emer finishedExercises duke i shtuar nje objet brenda tij ne menyr atomatike
      .then((_) => // then tregon objektin e tedhenave qe regjistrohen sukseshem ne firibase
        console.log(`Exercise ${exercise.name} stored successfully in Firebase`)
      )
      .catch((err) =>
        console.log(`Firebase Error on saving exercise ${exercise.name}`, err)
      );
  } 

}
