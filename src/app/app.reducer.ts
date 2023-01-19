

import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';

export interface State {
  ui: fromUi.State; // export interface State at ui.reducer.ts
}

export const reducers: ActionReducerMap<State> = { // e lidhim ne app.module.ts "  StoreModule.forRoot(reducers)  "
  ui: fromUi.uiReducer, // export function uiReducer(state = initialState, action: UIActions)
};

// 1. marim komplet files te ui.reducer.ts " 4. "
export const getUiState = createFeatureSelector<fromUi.State>('ui'); // export interface State
// 1. marim vetem vleren  isLoading: boolean; e cila mund te jet ose true ose false, nga:
// export const getIsLoading = (state: State) => state.isLoading; , ku:
// perfaqeson isLoading: true dhe isLoading: false 
// te cilat i dergojme ne componentin login.component.ts, signup.component.ts si subscribe data:
// " this.isLoading$ = this.store.select(fromRoot.getIsLoading); "
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading); // export const getIsLoading = (state: State) => state.isLoading;



    