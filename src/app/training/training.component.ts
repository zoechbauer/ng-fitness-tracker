import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  exerciseSub: Subscription;
  ongoingTraining = false;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSub = this.trainingService.exerciseChanged.subscribe(
      (selectedExercise) => {
        if (selectedExercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      } 
    );
  }
 
  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }
}
