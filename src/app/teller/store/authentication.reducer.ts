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

import * as teller from './teller.actions';
import {Teller} from '../../../services/teller/domain/teller.model';

export interface State {
  teller: Teller;
  authenticated: boolean;
  loading: boolean;
  error: Error;
}

const initialState: State = {
  teller: null,
  authenticated: false,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: teller.Actions): State {
  switch(action.type){

    case teller.UNLOCK_DRAWER: {
      return Object.assign({}, state, {
        loading: true,
        authenticated: false
      });
    }

    case teller.UNLOCK_DRAWER_SUCCESS: {
      const teller: Teller = action.payload;
      return Object.assign({}, state, {
        loading: false,
        teller,
        authenticated: true
      });
    }

    case teller.UNLOCK_DRAWER_FAIL: {
      let error = action.payload;
      return Object.assign({}, state, {
        loading: false,
        error
      });
    }

    case teller.LOCK_DRAWER_SUCCESS: {
      return initialState;
    }

    default:
      return state;
  }
}

export const getAuthenticated = (state: State) => state.authenticated;

export const getTeller = (state: State) => state.teller;

export const getError = (state: State) => state.error;

export const getLoading = (state: State) => state.loading;
