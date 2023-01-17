import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: any;
  exercise: Exercise;

  constructor(
    private dialog: MatDialog,  
    private trainingService: TrainingService 
  ) {}

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.exercise = this.trainingService.getRunningExercise();
    const step = (this.exercise.duration / 100) * 1000;
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress >= 100) { 
        clearInterval(this.timer);
        this.trainingService.completeExercise();
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress },
    });

    dialogRef.afterClosed().subscribe((cancelWorkout) => {
      // console.log(cancelWorkout);
      if (cancelWorkout) {
        this.trainingService.cancelExercise(this.progress); // ketu marim sasin e perqindjes
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
