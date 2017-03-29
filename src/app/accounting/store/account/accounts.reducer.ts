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

import {Account} from '../../../../services/accounting/domain/account.model';
import * as account from './account.actions';
import { createSelector } from 'reselect';

export interface State {
  ids: string[];
  entities: { [id: string]: Account };
  selectedAccountId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedAccountId: null,
};

export function reducer(state = initialState, action: account.Actions): State {
  switch (action.type) {

    case account.LOAD: {
      const account = action.payload;

      const newIds = state.ids.filter(id => id !== account.identifier);

      return {
        ids: [ ...newIds, account.identifier ],
        entities: Object.assign({}, state.entities, {
          [account.identifier]: account
        }),
        selectedAccountId: state.selectedAccountId
      };
    }

    case account.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedAccountId: action.payload
      };
    }

    case account.CREATE_SUCCESS:
    case account.UPDATE_SUCCESS: {
      const account = action.payload.account;

      return {
        ids: [ ...state.ids, account.identifier ],
        entities: Object.assign({}, state.entities, {
          [account.identifier]: account
        }),
        selectedAccountId: state.selectedAccountId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedAccountId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
