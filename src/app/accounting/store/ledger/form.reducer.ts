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

import * as ledger from './ledger.actions';
import {Error} from '../../../../services/domain/error.model';
import {FormState} from '../../../../common/store/form.reducer';

export const initialState: FormState = {};

export function reducer(state = initialState, action: ledger.Actions): FormState {
  switch (action.type) {

    case ledger.CREATE_SUB_LEDGER_FAIL:
      return {
        error: action.payload
      };

    case ledger.CREATE_SUB_LEDGER_SUCCESS:
      return initialState;

    default:
      return state;

  }
}
