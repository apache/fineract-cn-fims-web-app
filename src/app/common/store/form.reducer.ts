/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Action, ActionReducer} from '@ngrx/store';
import {Error} from '../../services/domain/error.model';

export interface FormState {
  error?: Error;
}

export const initialState: FormState = {};

export const createFormReducer = (resource: string, reducer?: ActionReducer<FormState>) => {

  return function(state: FormState = initialState, action: Action): FormState {

    switch (action.type) {

      case `[${resource}] Create Fail`:
      case `[${resource}] Update Fail`: {
        return Object.assign({}, state, {
          error: action.payload
        });
      }

      case `[${resource}] Reset Form`:
      case `[${resource}] Create Success`:
      case `[${resource}] Update Success`: {
        return initialState;
      }

      default: {
        // delegate to wrapped reducer
        if(reducer) {
          return reducer(state, action);
        }
        return state;
      }

    }
  }
};

export const getFormError = (formState: FormState) => formState.error;

