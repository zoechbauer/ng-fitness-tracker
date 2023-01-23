import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css'], 
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<Exercise>();
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( 
    private trainingService: TrainingService, 
    private store: Store<fromTraining.State> 
  ) {}

  ngOnInit(): void {
    // nga " fromTraining.getFinishedExercises ", therasim funksjonin " export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises); " ,
    // duke mar ARRAY "   finishedExercises: Exercise[] " me objekte brenda
    this.store.select(fromTraining.getFinishedExercises).subscribe(
      (exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      } 
    );
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() { 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLowerCase();
  }
}
