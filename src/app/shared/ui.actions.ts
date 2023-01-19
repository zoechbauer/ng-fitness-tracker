
// 2. marim sinjalin nga auth.sercice.ts dhe mbushim vleren e isLoading: boolean; 
// me true ose false ne ui.reducer.ts

import { Action } from '@ngrx/store';

export const START_LOADING = '[UI] Start Loading';
export const STOP_LOADING = '[UI] Stop Loading';

export class StartLoading implements Action { 
  readonly type = START_LOADING; 
}

export class StopLoading implements Action { 
  readonly type = STOP_LOADING;
} 

export type UIActions = StartLoading | StopLoading;