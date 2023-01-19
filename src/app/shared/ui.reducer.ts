// 3. marim dy sinjalet START_LOADING dhe STOP_LOADING nga ui.actions.ts 
// dhe mbushim state me vlerat true ose false, per ti theritur keto vlera ne komponentet:
// singup.component.ts and login.component.ts

// Pra ngrx zvendeson Subject rxjs " loadingStateChanged = new Subject<boolean>(); "

import { Action } from '@ngrx/store';

import { UIActions, START_LOADING, STOP_LOADING } from './ui.actions';

export interface State {
  isLoading: boolean;
} 

const initialState: State = {
  isLoading: false
};

export function uiReducer(state = initialState, action: UIActions) {
  switch (action.type) {
    case START_LOADING:
      return {
        isLoading: true 
      }; 
    case STOP_LOADING: 
      return {
        isLoading: false
      }; 
    default: {
      return state;
    }
  }
}

// pasi i modifikojme te dhenat qe marim nga auth.sercice - ui.actions.ts i trasportojme ato 
// ne file prind app.reucer.ts, dhe nga aty i trasferojme si subscribe data ne komponete te ndryshme,
// login.component.ts, signup.component.ts
export const getIsLoading = (state: State) => state.isLoading;