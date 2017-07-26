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

import * as accounts from './account.actions';
import {SearchState} from '../../../common/store/search.reducer';

export function reducer(state, action: accounts.Actions): SearchState {

  switch(action.type) {

    case accounts.SEARCH_BY_LEDGER: {
      return Object.assign({}, state, {
        loading: true,
        entities: []
      });
    }

    default:
      return state;
  }
}
