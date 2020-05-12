import { Component } from '@angular/core';

@Component({
  template: `
    <h1 mat-dialog-title>Cancel Workout</h1>
    <p mat-dialog-content>Are you sure?</p>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">
        Yes
      </button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions>
  `,
})
export class StopTrainingComponent {}
