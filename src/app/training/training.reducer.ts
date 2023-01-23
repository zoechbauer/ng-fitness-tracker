// kjo faqe na ndimon te ruj te gjitha te dhenat qe jan asinkrone, te castit

import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

import {
  TrainingActions,
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING
} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}
 
export interface State extends fromRoot.State { // kjo ketu nuk e kuptoj se per cfare duhet ???????
  training: TrainingState;
}

const initialState: TrainingState = { 
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
};

// funksjonit te me poshtem i japim jet nga " StoreModule.forFeature('training', trainingReducer)  " ne training.module.ts
export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        // objektin qe marim, nga servisi ose komponenti e bashkangjisim brenda array " availableExercises: [] "
        availableExercises: action.payload 
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
         // objektin qe marim, nga servisi ose komponenti e bashkangjisim brenda array " finishedExercises: [] "
        finishedExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        // ne baz te vleres STRING qe marim: " public payload: string " e cila eshte nje ID STRING: " OD7y3GMyVuFovAlP5WdM "
        // ne kerkojme ID STRING TE ARRAY " availableExercises " TE == ME ID QE KODI LEXON " action.payload "
        // dhe pasi gjejme objektin nga ARRAY " availableExercises ", e bashkagjisim ate objekt ne antribjutin: " activeTraining "
        activeTraining: { ...state.availableExercises.find(ex => ex.id === action.payload) }
      };
    case STOP_TRAINING:
      return {
        ...state,
        // objektin qe kemi regjistuar ne antribjutin " activeTraining ", kur kodi mer sinjalin nga:
        //  this.store.dispatch(new StopTraining()); , fshim objektin brenda antribjutin " activeTraining ", 
        // qe gjetem me ID STRING: " OD7y3GMyVuFovAlP5WdM " nga ARRAY " availableExercises: [] ".
        activeTraining: null
      };
    default: {
      return state;
    }
  }
}

// 1. nga ketu marim te gjith array TrainingState, qe permban brenda 2 array dhe nje objekt
export const getTrainingState = createFeatureSelector<TrainingState>('training'); // kjo quhet ndryshe " Lazy Loaded State "

// 2. kurse ketu marim ARRAYS " availableExercises: [] | finishedExercises: [] | DHE OBJEKTIN - activeTraining" nga " state = initialState " , i cili eshte brenda ARRAY PRINDE " TrainingState ". 
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null); // pse ketu not null " != null "
