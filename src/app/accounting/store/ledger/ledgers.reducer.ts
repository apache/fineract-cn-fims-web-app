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
import { createSelector } from 'reselect';
import {Ledger} from '../../../../services/accounting/domain/ledger.model';
import {ResourceState} from '../../../../common/store/resource.reducer';
import {resourcesToHash} from '../../../../common/store/reducer.helper';

export interface State {
  ids: string[];
  topLevelIds: string[];
  entities: { [id: string]: Ledger };
  loadedAt: { [id: string]: number };
  selectedLedgerId: string | null;
}

export const initialState: State = {
  ids: [],
  topLevelIds: [],
  entities: {},
  loadedAt: {},
  selectedLedgerId: null,
};

export function reducer(state = initialState, action: ledger.Actions): State {
  switch (action.type) {

    case ledger.LOAD_ALL_TOP_LEVEL_COMPLETE: {
      const ledgers: Ledger[] = action.payload;

      const newLedgers: Ledger[] = ledgers.filter(ledger => !state.entities[ledger.identifier]);

      const newLedgerIds: string[] = newLedgers.map(ledger => ledger.identifier);

      const newLedgerEntities = resourcesToHash(newLedgers);

      const newLoadedAt = newLedgers.reduce((entities: { [id: string]: any }, ledger: Ledger) => {
        return Object.assign(entities, {
          [ledger.identifier]: Date.now()
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newLedgerIds ],
        topLevelIds: [ ...state.topLevelIds, ...newLedgerIds],
        entities: Object.assign({}, state.entities, newLedgerEntities),
        loadedAt: Object.assign({}, state.loadedAt, newLoadedAt),
        selectedLedgerId: state.selectedLedgerId
      };
    }

    case ledger.LOAD: {
      const ledger: Ledger = action.payload;

      const newIds = state.ids.filter(id => id !== ledger.identifier);

      return {
        ids: [ ...newIds, ledger.identifier ],
        topLevelIds: state.topLevelIds,
        entities: Object.assign({}, state.entities, {
          [ledger.identifier]: ledger
        }),
        loadedAt: Object.assign({}, state.entities, {
          [ledger.identifier]: Date.now()
        }),
        selectedLedgerId: state.selectedLedgerId
      };
    }

    case ledger.SELECT: {
      return Object.assign({}, state, {
        selectedLedgerId: action.payload
      });
    }

    case ledger.CREATE_SUCCESS: {
      const ledger: Ledger = action.payload.ledger;

      return {
        ids: [ ...state.ids, ledger.identifier ],
        topLevelIds: [ ...state.topLevelIds, ledger.identifier ],
        entities: Object.assign({}, state.entities, {
          [ledger.identifier]: ledger
        }),
        selectedLedgerId: state.selectedLedgerId,
        loadedAt: state.loadedAt
      }
    }

    case ledger.UPDATE_SUCCESS: {
      const ledger: Ledger = action.payload.ledger;

      return {
        ids: [ ...state.ids ],
        topLevelIds: [ ...state.topLevelIds ],
        entities: Object.assign({}, state.entities, {
          [ledger.identifier]: ledger
        }),
        selectedLedgerId: state.selectedLedgerId,
        loadedAt: state.loadedAt
      }
    }

    case ledger.CREATE_SUB_LEDGER_SUCCESS: {
      const subLedger: Ledger = action.payload.ledger;
      const parentLedgerId = action.payload.parentLedgerId;
      const parentLedger: Ledger = Object.assign({}, state.entities[parentLedgerId]);
      subLedger.parentLedgerIdentifier = parentLedgerId;
      parentLedger.subLedgers.push(subLedger);

      return {
        ids: [ ...state.ids, subLedger.identifier ],
        topLevelIds: [ ...state.topLevelIds ],
        entities: Object.assign({}, state.entities, {
          [subLedger.identifier]: subLedger,
          [parentLedger.identifier]: parentLedger
        }),
        selectedLedgerId: state.selectedLedgerId,
        loadedAt: state.loadedAt
      }
    }

    case ledger.DELETE_SUCCESS: {
      const deletedLedger: Ledger = action.payload.ledger;

      const newIds: string[] = state.ids.filter(id => id !== deletedLedger.identifier);
      const newTopLevelIds: string[] = state.topLevelIds.filter(id => id !== deletedLedger.identifier);

      const newEntities = newIds.reduce((entities: { [id: string]: Ledger }, id: string) => {
        let ledger = state.entities[id];

        // Remove sub ledger from parent ledger
        if(ledger.identifier === deletedLedger.parentLedgerIdentifier) {
          ledger = Object.assign({}, ledger, {
            subLedgers: ledger.subLedgers.filter(ledger => ledger.identifier !== deletedLedger.identifier)
          })
        }

        return Object.assign(entities, {
          [ledger.identifier]: ledger
        });
      }, {});

      const newLoadedAt = newIds.reduce((entities: { [id: string]: any }, id: string) => {
        const loadedAt = state.loadedAt[id];
        return Object.assign(entities, {
          [id]: loadedAt
        });
      }, {});

      return {
        ids: [...newIds],
        topLevelIds: [...newTopLevelIds],
        entities: newEntities,
        loadedAt: newLoadedAt,
        selectedLedgerId: state.selectedLedgerId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getLoadedAt = (state: State) => state.loadedAt;

export const getIds = (state: State) => state.ids;

export const getTopLevelIds = (state: State) => state.topLevelIds;

export const getSelectedId = (state: State) => state.selectedLedgerId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
