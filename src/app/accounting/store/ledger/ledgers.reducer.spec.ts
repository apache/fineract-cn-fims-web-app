/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {reducer, State} from './ledgers.reducer';
import {
  CreateLedgerSuccessAction,
  CreateSubLedgerPayload,
  CreateSubLedgerSuccessAction,
  DeleteLedgerSuccessAction,
  LedgerRoutePayload,
  LoadAllTopLevelComplete,
  UpdateLedgerSuccessAction
} from './ledger.actions';
import {Ledger} from '../../../services/accounting/domain/ledger.model';

describe('Ledgers Reducer', () => {

  function createLedger(value: string): Ledger {
    return { identifier: value, name: value, type: 'ASSET', showAccountsInChart: true, subLedgers: []};
  }

  describe('LOAD_ALL_TOP_LEVEL_COMPLETE', () => {

    it('should add all ledgers if not in store', () => {
      spyOn(Date, 'now').and.returnValue(1000);

      const ledgerOne = createLedger('test1');
      const ledgerTwo = createLedger('test2');

      const payload: Ledger[] = [
        ledgerOne,
        ledgerTwo
      ];

      const expectedResult: State = {
        ids: [ledgerOne.identifier, ledgerTwo.identifier],
        topLevelIds: [ledgerOne.identifier, ledgerTwo.identifier],
        entities: {
          'test1': ledgerOne,
          'test2': ledgerTwo
        },
        loadedAt: {
          'test1': 1000,
          'test2': 1000
        },
        selectedLedgerId: null,
      };

      const result = reducer(undefined, new LoadAllTopLevelComplete(payload));

      expect(result).toEqual(expectedResult);
    });
  });

  describe('CREATE_SUCCESS', () => {
    it('should add ledger to top level ids if not in store', () => {
      const ledgerOne = createLedger('test1');

      const payload: LedgerRoutePayload = {
        ledger: ledgerOne,
        activatedRoute: null
      };

      const expectedResult: State = {
        ids: [ledgerOne.identifier],
        topLevelIds: [ledgerOne.identifier],
        entities: {
          'test1': ledgerOne
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      const result = reducer(undefined, new CreateLedgerSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    });
  });

  describe('CREATE_SUB_LEDGER_SUCCESS', () => {
    it('should add ledger not to top level ids', () => {
      const parentLedger = createLedger('parent');
      const ledgerOne = createLedger('test1');

      const initialState: State = {
        ids: [parentLedger.identifier],
        topLevelIds: [parentLedger.identifier],
        entities: {
          'parent': parentLedger
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      const payload: CreateSubLedgerPayload = {
        parentLedgerId: parentLedger.identifier,
        ledger: ledgerOne,
        activatedRoute: null
      };

      const expectedResult: State = {
        ids: [parentLedger.identifier, ledgerOne.identifier],
        topLevelIds: [parentLedger.identifier],
        entities: {
          'test1': ledgerOne,
          'parent': Object.assign({}, parentLedger, {
            subLedgers: [ledgerOne]
          })
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      const result = reducer(initialState, new CreateSubLedgerSuccessAction(payload));

      expect(result).toEqual(expectedResult);
      expect(result.entities['test1'].parentLedgerIdentifier).toEqual(parentLedger.identifier);
    });
  });

  describe('UPDATE_SUCCESS', () => {
    it('should update the new ledger in entities', () => {
      const ledgerOne = createLedger('test1');

      const updatedLedger = Object.assign({}, ledgerOne, {
        name: 'newName'
      });

      const payload: LedgerRoutePayload = {
        ledger: updatedLedger,
        activatedRoute: null
      };

      const initialState: State = {
        ids: [ledgerOne.identifier],
        topLevelIds: [],
        entities: {
          'test1': ledgerOne
        },
        loadedAt: {
          'test1': 1000
        },
        selectedLedgerId: null,
      };

      const expectedResult: State = {
        ids: [ledgerOne.identifier],
        topLevelIds: [],
        entities: {
          'test1': updatedLedger
        },
        loadedAt: {
          'test1': 1000
        },
        selectedLedgerId: null,
      };

      const result = reducer(initialState, new UpdateLedgerSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    });
  });

  describe('DELETE_SUCCESS', () => {

    it('should delete sub ledger from parent ledger', () => {
      const parentLedgerWithoutSub = createLedger('test1');
      const subLedger = createLedger('test2');
      subLedger.parentLedgerIdentifier = parentLedgerWithoutSub.identifier;

      const parentLedgerWithSub = Object.assign({}, parentLedgerWithoutSub, {
        subLedgers: [subLedger]
      });

      const initialState: State = {
        ids: [parentLedgerWithSub.identifier, subLedger.identifier],
        topLevelIds: ['test1'],
        entities: {
          'test1': parentLedgerWithSub,
          'test2': subLedger
        },
        loadedAt: {
          'test1': 1000,
          'test2': 2000
        },
        selectedLedgerId: null,
      };

      const result: State = reducer(initialState, new DeleteLedgerSuccessAction({
        ledger: subLedger,
        activatedRoute: null
      }));

      const expectedResult: State = {
        ids: [parentLedgerWithoutSub.identifier],
        topLevelIds: ['test1'],
        entities: {
          'test1': parentLedgerWithoutSub
        },
        loadedAt: {
          'test1': 1000
        },
        selectedLedgerId: null
      };

      expect(result).toEqual(expectedResult);
      expect(result.entities['test1'].subLedgers.length === 0).toBeTruthy();
    });
  });

});
