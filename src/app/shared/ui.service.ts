import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message: string, action: string, durationSec: number) {
    this.snackbar.open(message, action, { duration: durationSec * 1000 });
  }
}
