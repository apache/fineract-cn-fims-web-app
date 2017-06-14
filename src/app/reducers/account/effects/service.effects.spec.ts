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

import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {EffectsRunner, EffectsTestingModule} from '@ngrx/effects/testing';
import {AccountSearchApiEffects} from './service.effects';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {AccountPage} from '../../../../services/accounting/domain/account-page.model';
import {SearchAction, SearchByLedgerAction, SearchCompleteAction} from '../account.actions';
import {Observable} from 'rxjs';
import {emptySearchResult} from '../../../../common/store/search.reducer';

describe('Account Search Api Effects', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        AccountSearchApiEffects,
        {
          provide: AccountingService,
          useValue: jasmine.createSpyObj('accountingService', ['fetchAccounts', 'fetchAccountsOfLedger'])
        }
      ]
    })

  });

  describe('searchAccounts$', () => {

    function setup(params?: {searchAccountsReturnValue: any}) {
      const accountingService = TestBed.get(AccountingService);
      if (params) {
        accountingService.fetchAccounts.and.returnValue(params.searchAccountsReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        accountEffects: TestBed.get(AccountSearchApiEffects)
      };
    }

    it('should return a new SearchCompleteAction with AccountPage', fakeAsync(() => {
      const accountPage: AccountPage = {
        accounts: [
          { identifier: 'test', name: 'test', ledger: '' }
        ],
        totalElements: 1,
        totalPages: 1
      };

      const { runner, accountEffects } = setup({ searchAccountsReturnValue: Observable.of(accountPage) });

      const expectedResult = new SearchCompleteAction({
        elements: accountPage.accounts,
        totalPages: accountPage.totalPages,
        totalElements: accountPage.totalElements
      });

      runner.queue(new SearchAction({}));

      let result = null;
      accountEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new SearchCompleteAction, with an empty array, if accounting service throws', fakeAsync(() => {
      const {runner, accountEffects} = setup({searchAccountsReturnValue: Observable.throw(new Error())});

      const expectedResult = new SearchCompleteAction(emptySearchResult());

      runner.queue(new SearchAction({}));

      let result = null;
      accountEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));
  });

  describe('searchByLedger$', () => {

    function setup(params?: {searchAccountsOfLedgerReturnValue: any}) {
      const accountingService = TestBed.get(AccountingService);
      if (params) {
        accountingService.fetchAccountsOfLedger.and.returnValue(params.searchAccountsOfLedgerReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        accountEffects: TestBed.get(AccountSearchApiEffects)
      };
    }

    it('should return a new SearchCompleteAction with AccountPage', fakeAsync(() => {
      const accountPage: AccountPage = {
        accounts: [
          { identifier: 'test', name: 'test', ledger: '' }
        ],
        totalElements: 1,
        totalPages: 1
      };

      const { runner, accountEffects } = setup({ searchAccountsOfLedgerReturnValue: Observable.of(accountPage) });

      const expectedResult = new SearchCompleteAction({
        elements: accountPage.accounts,
        totalPages: accountPage.totalPages,
        totalElements: accountPage.totalElements
      });

      runner.queue(new SearchByLedgerAction({
        ledgerId: 'abc',
        fetchRequest: {}
      }));

      let result = null;
      accountEffects.searchByLedger$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new SearchCompleteAction, with an empty array, if accounting service throws', fakeAsync(() => {
      const {runner, accountEffects} = setup({searchAccountsOfLedgerReturnValue: Observable.throw(new Error())});

      const expectedResult = new SearchCompleteAction({
        elements: [],
        totalElements: 0,
        totalPages: 0
      });

      runner.queue(new SearchByLedgerAction({
        ledgerId: 'abc',
        fetchRequest: {}
      }));

      let result = null;
      accountEffects.searchByLedger$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));
  });
});
